import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PageResponse } from '../models/api-response.model';
import { CheckoutRequest, Order, UpdateOrderStatusRequest, UpiPaymentInfo } from '../models/order.model';

/**
 * Manages order placement and history.
 */
@Injectable({ providedIn: 'root' })
export class OrderService {

  private readonly baseUrl = `${environment.apiUrl}/orders`;
  private readonly businessUrl = `${environment.apiUrl}/business/orders`;
  private readonly adminUrl = `${environment.apiUrl}/admin/orders`;

  constructor(private http: HttpClient) {
  }

  checkout(request: CheckoutRequest): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(`${this.baseUrl}/checkout`, request);
  }

  getMyOrders(page = 0, size = 10): Observable<ApiResponse<PageResponse<Order>>> {
    return this.http.get<ApiResponse<PageResponse<Order>>>(this.baseUrl, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }

  getOrder(id: number): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.baseUrl}/${id}`);
  }

  getUpiPaymentInfo(id: number): Observable<ApiResponse<UpiPaymentInfo>> {
    return this.http.get<ApiResponse<UpiPaymentInfo>>(`${this.baseUrl}/${id}/upi-payment`);
  }

  confirmPayment(id: number): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(`${this.baseUrl}/${id}/confirm-payment`, {});
  }

  // ---- Business admin ----

  getBusinessOrders(page = 0, size = 10): Observable<ApiResponse<PageResponse<Order>>> {
    return this.http.get<ApiResponse<PageResponse<Order>>>(this.businessUrl, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }

  updateOrderStatusAsBusiness(id: number, request: UpdateOrderStatusRequest): Observable<ApiResponse<Order>> {
    return this.http.put<ApiResponse<Order>>(`${this.businessUrl}/${id}/status`, request);
  }

  // ---- Super admin ----

  getAllOrders(page = 0, size = 10): Observable<ApiResponse<PageResponse<Order>>> {
    return this.http.get<ApiResponse<PageResponse<Order>>>(this.adminUrl, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }

  updateOrderStatusAsAdmin(id: number, request: UpdateOrderStatusRequest): Observable<ApiResponse<Order>> {
    return this.http.put<ApiResponse<Order>>(`${this.adminUrl}/${id}/status`, request);
  }
}
