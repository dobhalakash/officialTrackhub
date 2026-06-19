import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-business-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="th-admin-nav">
      <a routerLink="/business/dashboard" routerLinkActive="active"><i class="fa-solid fa-gauge"></i> Dashboard</a>
      <a routerLink="/business/products" routerLinkActive="active"><i class="fa-solid fa-shirt"></i> Products</a>
      <a routerLink="/business/orders" routerLinkActive="active"><i class="fa-solid fa-box"></i> Orders</a>
      <a routerLink="/business/news" routerLinkActive="active"><i class="fa-regular fa-newspaper"></i> News</a>
      <a routerLink="/business/coupons" routerLinkActive="active"><i class="fa-solid fa-tag"></i> Coupons</a>
    </nav>
  `
})
export class BusinessNavComponent {
}
