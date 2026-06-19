import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { ProductSummary } from '../../core/models/product.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {

  readonly products = signal<ProductSummary[]>([]);
  readonly loading = signal(true);

  constructor(public wishlistService: WishlistService, public cartService: CartService) {
  }

  ngOnInit(): void {
    this.wishlistService.getWishlist().subscribe({
      next: res => {
        this.products.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  remove(product: ProductSummary): void {
    this.wishlistService.removeFromWishlist(product.id).subscribe(() => {
      this.products.set(this.products().filter(p => p.id !== product.id));
    });
  }

  addToCart(product: ProductSummary): void {
    this.cartService.addToCart({ product, quantity: 1 }).subscribe();
  }
}
