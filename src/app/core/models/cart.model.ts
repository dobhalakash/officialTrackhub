import { MattressSize } from './product.model';

export interface CartItem {
  id: number;
  productId: number | null;
  productName: string;
  productImageUrl: string | null;
  size: MattressSize | null;
  quantity: number;
  priceAtAdd: number;
  lineTotal: number;
  savedForLater: boolean;
  availableStock: number | null;
}

export interface Cart {
  id: number;
  items: CartItem[];
  subtotal: number;
  totalItems: number;
}

export interface AddCartItemRequest {
  productId?: number;
  size?: MattressSize;
  quantity?: number;
}

export interface UpdateCartItemRequest {
  quantity?: number;
  savedForLater?: boolean;
}

export interface MergeCartRequest {
  items: AddCartItemRequest[];
}
