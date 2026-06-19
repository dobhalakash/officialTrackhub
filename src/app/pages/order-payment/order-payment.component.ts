import { Component, ElementRef, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import * as QRCode from 'qrcode';
import { OrderService } from '../../core/services/order.service';
import { UpiPaymentInfo } from '../../core/models/order.model';

@Component({
  selector: 'app-order-payment',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-payment.component.html',
  styleUrl: './order-payment.component.css'
})
export class OrderPaymentComponent implements OnInit {

  @ViewChild('qrCanvas') qrCanvas?: ElementRef<HTMLCanvasElement>;

  readonly info = signal<UpiPaymentInfo | null>(null);
  readonly loading = signal(true);
  readonly confirming = signal(false);
  readonly error = signal('');
  readonly paid = signal(false);

  orderId = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {
  }

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.params['id']);
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');

    this.orderService.getUpiPaymentInfo(this.orderId).subscribe({
      next: res => {
        this.info.set(res.data);
        this.paid.set(res.data.paymentStatus === 'SUCCESS');
        this.loading.set(false);
        if (!this.paid()) {
          setTimeout(() => this.renderQrCode(), 0);
        }
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'This order does not have a UPI payment to complete.');
      }
    });
  }

  private renderQrCode(): void {
    const canvas = this.qrCanvas?.nativeElement;
    const upiUri = this.info()?.upiUri;
    if (!canvas || !upiUri) {
      return;
    }
    QRCode.toCanvas(canvas, upiUri, { width: 240, margin: 1 }, err => {
      if (err) {
        console.error('Failed to render UPI QR code', err);
      }
    });
  }

  confirmPayment(): void {
    this.confirming.set(true);
    this.error.set('');

    this.orderService.confirmPayment(this.orderId).subscribe({
      next: () => {
        this.confirming.set(false);
        this.paid.set(true);
      },
      error: err => {
        this.confirming.set(false);
        this.error.set(err?.error?.message || 'Could not confirm payment. Please try again.');
      }
    });
  }

  goToOrder(): void {
    this.router.navigate(['/orders', this.orderId]);
  }
}
