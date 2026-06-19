import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { Product, ProductRequest, ProductVariantRequest, MattressSize } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { BusinessNavComponent } from '../../../shared/business-nav/business-nav.component';

@Component({
  selector: 'app-business-products',
  standalone: true,
  imports: [CommonModule, FormsModule, BusinessNavComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class BusinessProductsComponent implements OnInit {

  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);
  readonly page = signal(0);
  readonly totalPages = signal(0);
  readonly showForm = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly error = signal('');

  readonly sizes: MattressSize[] = ['SINGLE', 'TWIN_XL', 'DOUBLE', 'QUEEN', 'KING', 'CALIFORNIA_KING', 'SUPER_KING'];

  form: ProductRequest = this.emptyForm();
  imageUrlInput = '';

  constructor(private productService: ProductService, private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.categoryService.getActiveCategories().subscribe(res => this.categories.set(res.data));
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.productService.getMyProducts(this.page(), 10).subscribe({
      next: res => {
        this.products.set(res.data.content);
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

  emptyForm(): ProductRequest {
    return {
      name: '',
      description: '',
      price: 0,
      discountPercentage: 0,
      stock: 0,
      sku: '',
      brand: '',
      trending: false,
      active: true,
      categoryId: 0,
      imageUrls: [],
      variants: []
    };
  }

  startNew(): void {
    this.editingId.set(null);
    this.form = this.emptyForm();
    this.showForm.set(true);
    this.error.set('');
  }

  edit(product: Product): void {
    this.editingId.set(product.id);
    this.form = {
      name: product.name,
      description: product.description,
      price: product.price,
      discountPercentage: product.discountPercentage,
      stock: product.stock,
      sku: product.sku,
      brand: product.brand,
      trending: product.trending,
      active: product.active,
      categoryId: product.categoryId,
      imageUrls: product.images.map(i => i.imageUrl),
      variants: product.variants.map(v => ({ size: v.size, firmness: v.firmness, stock: v.stock, skuSuffix: v.skuSuffix }))
    };
    this.showForm.set(true);
    this.error.set('');
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  addImageUrl(): void {
    const url = this.imageUrlInput.trim();
    if (url) {
      this.form.imageUrls = [...(this.form.imageUrls || []), url];
      this.imageUrlInput = '';
    }
  }

  removeImageUrl(index: number): void {
    this.form.imageUrls = (this.form.imageUrls || []).filter((_, i) => i !== index);
  }

  addVariant(): void {
    const variant: ProductVariantRequest = { size: 'QUEEN', firmness: '', stock: 0 };
    this.form.variants = [...(this.form.variants || []), variant];
  }

  removeVariant(index: number): void {
    this.form.variants = (this.form.variants || []).filter((_, i) => i !== index);
  }

  save(): void {
    this.error.set('');
    const id = this.editingId();
    const request$ = id ? this.productService.updateProduct(id, this.form) : this.productService.createProduct(this.form);

    request$.subscribe({
      next: () => {
        this.showForm.set(false);
        this.editingId.set(null);
        this.load();
      },
      error: err => this.error.set(err?.error?.message || 'Could not save product.')
    });
  }

  delete(product: Product): void {
    this.productService.deleteProduct(product.id).subscribe(() => this.load());
  }
}
