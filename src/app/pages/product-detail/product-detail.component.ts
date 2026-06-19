import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { ReviewService } from '../../core/services/review.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { AuthService } from '../../core/services/auth.service';
import { Product, ProductImage, MattressSize } from '../../core/models/product.model';
import { Review, ReviewRequest } from '../../core/models/review.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {

  readonly product = signal<Product | null>(null);
  readonly reviews = signal<Review[]>([]);
  readonly selectedImage = signal<ProductImage | null>(null);
  readonly selectedSize = signal<MattressSize | null>(null);
  readonly quantity = signal(1);
  readonly loading = signal(true);
  readonly addedMessage = signal(false);

  reviewForm: ReviewRequest = { rating: 5, comment: '' };
  reviewSubmitting = false;
  reviewError = '';
  reviewSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private reviewService: ReviewService,
    public cartService: CartService,
    public wishlistService: WishlistService,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      this.loadProduct(id);
      this.loadReviews(id);
    });

    if (this.authService.isLoggedIn()) {
      this.wishlistService.getWishlist().subscribe();
    }
  }

  loadProduct(id: number): void {
    this.loading.set(true);
    this.productService.getById(id).subscribe({
      next: res => {
        this.product.set(res.data);
        const images = res.data.images || [];
        this.selectedImage.set(images.find(i => i.primary) || images[0] || null);
        if (res.data.variants && res.data.variants.length > 0) {
          this.selectedSize.set(res.data.variants[0].size);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadReviews(id: number): void {
    this.reviewService.getReviews(id, 0, 20).subscribe(res => this.reviews.set(res.data.content));
  }

  selectImage(image: ProductImage): void {
    this.selectedImage.set(image);
  }

  selectSize(size: MattressSize): void {
    this.selectedSize.set(size);
  }

  changeQuantity(delta: number): void {
    const next = this.quantity() + delta;
    if (next >= 1) {
      this.quantity.set(next);
    }
  }

  variantStock(size: MattressSize): number | null {
    const product = this.product();
    if (!product?.variants?.length) {
      return null;
    }
    const variant = product.variants.find(v => v.size === size);
    return variant ? variant.stock : 0;
  }

  addToCart(): void {
    const product = this.product();
    if (!product) {
      return;
    }
    this.cartService.addToCart({
      product,
      size: this.selectedSize() ?? undefined,
      quantity: this.quantity()
    }).subscribe(() => {
      this.addedMessage.set(true);
      setTimeout(() => this.addedMessage.set(false), 2500);
    });
  }

  toggleWishlist(): void {
    const product = this.product();
    if (!product) {
      return;
    }
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.wishlistService.wishlistProductIds().has(product.id)) {
      this.wishlistService.removeFromWishlist(product.id).subscribe();
    } else {
      this.wishlistService.addToWishlist(product.id).subscribe();
    }
  }

  submitReview(): void {
    const product = this.product();
    if (!product) {
      return;
    }
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.reviewSubmitting = true;
    this.reviewError = '';
    this.reviewService.createReview(product.id, this.reviewForm).subscribe({
      next: () => {
        this.reviewSubmitting = false;
        this.reviewSuccess = true;
        this.reviewForm = { rating: 5, comment: '' };
        this.loadReviews(product.id);
        this.loadProduct(product.id);
      },
      error: err => {
        this.reviewSubmitting = false;
        this.reviewError = err?.error?.message || 'Unable to submit review.';
      }
    });
  }

  get averageRatingStars(): number[] {
    return [1, 2, 3, 4, 5];
  }
}
