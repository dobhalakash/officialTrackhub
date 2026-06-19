import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AddressService } from '../../core/services/address.service';
import { OrderService } from '../../core/services/order.service';
import { CouponService } from '../../core/services/coupon.service';
import { Address, AddressRequest } from '../../core/models/address.model';
import { AppliedCoupon } from '../../core/models/coupon.model';
import { CheckoutRequest, PaymentMethod } from '../../core/models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  readonly addresses = signal<Address[]>([]);
  readonly selectedAddressId = signal<number | null>(null);
  readonly showAddressForm = signal(false);
  readonly placing = signal(false);
  readonly error = signal('');

  readonly couponCode = signal('');
  readonly appliedCoupon = signal<AppliedCoupon | null>(null);
  readonly couponError = signal('');

  paymentMethod: PaymentMethod = 'COD';

  newAddress: AddressRequest = {
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    addressType: 'HOME',
    isDefault: false
  };

  constructor(
    public cartService: CartService,
    private addressService: AddressService,
    private orderService: OrderService,
    private couponService: CouponService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    if (this.cartService.cart().items.filter(i => !i.savedForLater).length === 0) {
      this.router.navigate(['/cart']);
      return;
    }
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.addressService.getAddresses().subscribe(res => {
      this.addresses.set(res.data);
      const defaultAddress = res.data.find(a => a.default) || res.data[0];
      if (defaultAddress) {
        this.selectedAddressId.set(defaultAddress.id);
      } else {
        this.showAddressForm.set(true);
      }
    });
  }

  selectAddress(id: number): void {
    this.selectedAddressId.set(id);
    this.showAddressForm.set(false);
  }

  saveNewAddress(): void {
    this.addressService.createAddress(this.newAddress).subscribe({
      next: res => {
        this.addresses.set([...this.addresses(), res.data]);
        this.selectedAddressId.set(res.data.id);
        this.showAddressForm.set(false);
        this.newAddress = {
          fullName: '', phone: '', addressLine1: '', addressLine2: '',
          city: '', state: '', pincode: '', country: 'India', addressType: 'HOME', isDefault: false
        };
      },
      error: err => this.error.set(err?.error?.message || 'Could not save address.')
    });
  }

  applyCoupon(): void {
    const code = this.couponCode().trim();
    if (!code) {
      return;
    }
    this.couponError.set('');
    this.couponService.applyCoupon(code).subscribe({
      next: res => this.appliedCoupon.set(res.data),
      error: err => {
        this.appliedCoupon.set(null);
        this.couponError.set(err?.error?.message || 'Invalid coupon code.');
      }
    });
  }

  removeCoupon(): void {
    this.appliedCoupon.set(null);
    this.couponCode.set('');
    this.couponError.set('');
  }

  get estimatedDiscount(): number {
    return this.appliedCoupon()?.discount ?? 0;
  }

  get taxableAmount(): number {
    return Math.max(0, this.cartService.cart().subtotal - this.estimatedDiscount);
  }

  get estimatedTax(): number {
    return Math.round(this.taxableAmount * 0.05 * 100) / 100;
  }

  get estimatedShipping(): number {
    return this.cartService.cart().subtotal >= 999 ? 0 : 50;
  }

  get estimatedTotal(): number {
    return Math.round((this.taxableAmount + this.estimatedTax + this.estimatedShipping) * 100) / 100;
  }

  placeOrder(): void {
    const addressId = this.selectedAddressId();
    if (!addressId) {
      this.error.set('Please select or add a shipping address.');
      return;
    }

    this.placing.set(true);
    this.error.set('');

    const request: CheckoutRequest = {
      addressId,
      paymentMethod: this.paymentMethod,
      couponCode: this.appliedCoupon()?.code
    };

    this.orderService.checkout(request).subscribe({
      next: res => {
        this.cartService.refresh();
        this.placing.set(false);
        if (this.paymentMethod === 'UPI') {
          this.router.navigate(['/orders', res.data.id, 'pay']);
        } else {
          this.router.navigate(['/orders', res.data.id]);
        }
      },
      error: err => {
        this.placing.set(false);
        this.error.set(err?.error?.message || 'Unable to place order. Please try again.');
      }
    });
  }
}
