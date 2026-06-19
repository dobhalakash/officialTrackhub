import { MattressSize } from './product.model';
import { Address } from './address.model';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'RAZORPAY' | 'UPI' | 'CARD' | 'NET_BANKING' | 'COD';

export interface OrderItem {
  id: number;
  productId: number | null;
  productName: string;
  productImageUrl: string | null;
  size: MattressSize | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  items: OrderItem[];
  address: Address;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  grandTotal: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

export interface CheckoutRequest {
  addressId: number;
  paymentMethod: PaymentMethod;
  couponCode?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface UpiPaymentInfo {
  orderId: number;
  orderNumber: string;
  amount: number;
  payeeUpiId: string;
  payeeName: string;
  transactionNote: string;
  upiUri: string;
  paymentStatus: string;
}
