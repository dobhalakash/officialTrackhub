import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PageResponse } from '../models/api-response.model';
import { Product, ProductRequest, ProductSearchParams, ProductSummary } from '../models/product.model';

/**
 * Provides access to the product catalog and business-scoped product management.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {

  private readonly baseUrl = `${environment.apiUrl}/products`;
  private readonly businessUrl = `${environment.apiUrl}/business/products`;

  constructor(private http: HttpClient) {
  }

  search(params: ProductSearchParams): Observable<ApiResponse<PageResponse<ProductSummary>>> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, value);
      }
    });
    return this.http.get<ApiResponse<PageResponse<ProductSummary>>>(this.baseUrl, { params: httpParams });
  }

  getTrending(): Observable<ApiResponse<ProductSummary[]>> {
    return this.http.get<ApiResponse<ProductSummary[]>>(`${this.baseUrl}/trending`);
  }

  getById(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.baseUrl}/${id}`);
  }

  // ---- Business admin ----

  getMyProducts(page = 0, size = 10): Observable<ApiResponse<PageResponse<Product>>> {
    return this.http.get<ApiResponse<PageResponse<Product>>>(this.businessUrl, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }

  createProduct(request: ProductRequest): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.businessUrl, request);
  }

  updateProduct(id: number, request: ProductRequest): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.businessUrl}/${id}`, request);
  }

  deleteProduct(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.businessUrl}/${id}`);
  }
}
