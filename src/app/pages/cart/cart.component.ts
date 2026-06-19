import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { CartItem } from '../../core/models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  readonly activeItems = computed(() => this.cartService.cart().items.filter(i => !i.savedForLater));
  readonly savedItems = computed(() => this.cartService.cart().items.filter(i => i.savedForLater));

  constructor(
    public cartService: CartService,
    public authService: AuthService,
    private router: Router
  ) {
  }

  increment(item: CartItem): void {
    this.cartService.updateItem(item.id, { quantity: item.quantity + 1 }).subscribe();
  }

  decrement(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateItem(item.id, { quantity: item.quantity - 1 }).subscribe();
    }
  }

  removeItem(item: CartItem): void {
    this.cartService.removeItem(item.id).subscribe();
  }

  saveForLater(item: CartItem): void {
    this.cartService.updateItem(item.id, { savedForLater: true }).subscribe();
  }

  moveToCart(item: CartItem): void {
    this.cartService.updateItem(item.id, { savedForLater: false }).subscribe();
  }

  proceedToCheckout(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }
    this.router.navigate(['/checkout']);
  }
}
