import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { BusinessNavComponent } from '../../../shared/business-nav/business-nav.component';

@Component({
  selector: 'app-business-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, BusinessNavComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class BusinessOrdersComponent implements OnInit {

  readonly orders = signal<Order[]>([]);
  readonly loading = signal(true);
  readonly page = signal(0);
  readonly totalPages = signal(0);

  readonly statuses: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

  constructor(private orderService: OrderService) {
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.orderService.getBusinessOrders(this.page(), 10).subscribe({
      next: res => {
        this.orders.set(res.data.content);
        this.totalPages.set(res.data.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages()) {
      return;
    }
    this.page.set(page);
    this.load();
  }

  updateStatus(order: Order, status: OrderStatus): void {
    this.orderService.updateOrderStatusAsBusiness(order.id, { status }).subscribe(res => {
      this.orders.set(this.orders().map(o => o.id === order.id ? res.data : o));
    });
  }

  statusClass(status: string): string {
    switch (status) {
      case 'DELIVERED': return 'th-status-delivered';
      case 'CANCELLED': return 'th-status-cancelled';
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY': return 'th-status-shipped';
      default: return 'th-status-pending';
    }
  }
}
