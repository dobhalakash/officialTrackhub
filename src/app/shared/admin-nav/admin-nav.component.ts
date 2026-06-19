import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="th-admin-nav">
      <a routerLink="/admin/dashboard" routerLinkActive="active"><i class="fa-solid fa-gauge"></i> Dashboard</a>
      <a routerLink="/admin/businesses" routerLinkActive="active"><i class="fa-solid fa-store"></i> Businesses</a>
      <a routerLink="/admin/users" routerLinkActive="active"><i class="fa-solid fa-users"></i> Users</a>
      <a routerLink="/admin/categories" routerLinkActive="active"><i class="fa-solid fa-tags"></i> Categories</a>
      <a routerLink="/admin/news" routerLinkActive="active"><i class="fa-regular fa-newspaper"></i> News</a>
      <a routerLink="/admin/coupons" routerLinkActive="active"><i class="fa-solid fa-percent"></i> Coupons</a>
    </nav>
  `
})
export class AdminNavComponent {
}
