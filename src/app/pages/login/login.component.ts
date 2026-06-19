import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { LoginRequest } from '../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  form: LoginRequest = { email: '', password: '' };
  readonly loading = signal(false);
  readonly error = signal('');

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  submit(): void {
    this.loading.set(true);
    this.error.set('');

    this.authService.login(this.form).subscribe({
      next: () => {
        this.cartService.mergeGuestCart().subscribe(() => {
          this.loading.set(false);
          this.redirectAfterLogin();
        });
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Invalid email or password.');
      }
    });
  }

  private redirectAfterLogin(): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
      return;
    }

    const role = this.authService.currentRole();
    if (role === 'SUPER_ADMIN') {
      this.router.navigate(['/admin/dashboard']);
    } else if (role === 'BUSINESS_ADMIN') {
      this.router.navigate(['/business/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
