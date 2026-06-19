import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  readonly menuOpen = signal(false);
  readonly scrolled = signal(false);

  navLinks = [
    { path: '/products', params: null, label: 'Jerseys' },
    { path: '/products', params: { category: 'sports' }, label: 'Sports Jerseys' },
    { path: '/products', params: { category: 'custom' }, label: 'Custom Jerseys' },
    { path: '/products', params: { category: 'school' }, label: 'School & College' },
    { path: '/products', params: { category: 'corporate' }, label: 'Corporate Wear' },
    { path: '/news', params: null, label: 'New Arrivals' },
    { path: '/register/business', params: null, label: 'Brands' },
  ];

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    public notificationService: NotificationService,
    private router: Router
  ) {
    if (this.authService.isLoggedIn()) {
      this.notificationService.refreshUnreadCount();
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void { this.scrolled.set(window.scrollY > 8); }

  toggleMenu(): void { this.menuOpen.set(!this.menuOpen()); }
  closeMenu(): void { this.menuOpen.set(false); }

  onSearch(event: Event): void {
    const input = (event.target as HTMLInputElement).value.trim();
    if (input) this.router.navigate(['/products'], { queryParams: { search: input } });
  }

  logout(): void {
    this.authService.logout();
    this.cartService.refresh();
    this.closeMenu();
    this.router.navigate(['/']);
  }

  get dashboardLink(): string {
    const role = this.authService.currentRole();
    if (role === 'SUPER_ADMIN') return '/admin/dashboard';
    if (role === 'BUSINESS_ADMIN') return '/business/dashboard';
    return '/profile';
  }
}
