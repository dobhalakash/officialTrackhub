import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },

  // ---- Catalog ----
  { path: 'products', loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent) },
  { path: 'products/:id', loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'news', loadComponent: () => import('./pages/news/news.component').then(m => m.NewsComponent) },
  { path: 'news/:id', loadComponent: () => import('./pages/news-detail/news-detail.component').then(m => m.NewsDetailComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },

  // ---- Cart / Wishlist / Checkout / Orders ----
  { path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent) },
  { path: 'wishlist', canActivate: [authGuard], loadComponent: () => import('./pages/wishlist/wishlist.component').then(m => m.WishlistComponent) },
  { path: 'checkout', canActivate: [authGuard], loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: 'orders', canActivate: [authGuard], loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent) },
  { path: 'orders/:id', canActivate: [authGuard], loadComponent: () => import('./pages/order-detail/order-detail.component').then(m => m.OrderDetailComponent) },
  { path: 'orders/:id/pay', canActivate: [authGuard], loadComponent: () => import('./pages/order-payment/order-payment.component').then(m => m.OrderPaymentComponent) },

  // ---- Auth ----
  { path: 'login', canActivate: [guestGuard], loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', canActivate: [guestGuard], loadComponent: () => import('./pages/register-customer/register-customer.component').then(m => m.RegisterCustomerComponent) },
  { path: 'register/business', canActivate: [guestGuard], loadComponent: () => import('./pages/register-business/register-business.component').then(m => m.RegisterBusinessComponent) },

  // ---- Customer profile ----
  { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },

  // ---- Business admin ----
  {
    path: 'business',
    canActivate: [roleGuard],
    data: { roles: ['BUSINESS_ADMIN', 'SUPER_ADMIN'] },
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/business/dashboard/dashboard.component').then(m => m.BusinessDashboardComponent) },
      { path: 'products', loadComponent: () => import('./pages/business/products/products.component').then(m => m.BusinessProductsComponent) },
      { path: 'orders', loadComponent: () => import('./pages/business/orders/orders.component').then(m => m.BusinessOrdersComponent) },
      { path: 'news', loadComponent: () => import('./pages/business/news/news.component').then(m => m.BusinessNewsComponent) },
      { path: 'coupons', loadComponent: () => import('./pages/business/coupons/coupons.component').then(m => m.BusinessCouponsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ---- Super admin ----
  {
    path: 'admin',
    canActivate: [roleGuard],
    data: { roles: ['SUPER_ADMIN'] },
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'businesses', loadComponent: () => import('./pages/admin/businesses/businesses.component').then(m => m.AdminBusinessesComponent) },
      { path: 'users', loadComponent: () => import('./pages/admin/users/users.component').then(m => m.AdminUsersComponent) },
      { path: 'categories', loadComponent: () => import('./pages/admin/categories/categories.component').then(m => m.AdminCategoriesComponent) },
      { path: 'news', loadComponent: () => import('./pages/admin/news/news.component').then(m => m.AdminNewsComponent) },
      { path: 'coupons', loadComponent: () => import('./pages/admin/coupons/coupons.component').then(m => m.AdminCouponsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '' }
];
