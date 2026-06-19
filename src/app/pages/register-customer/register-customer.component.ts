import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { RegisterCustomerRequest } from '../../core/models/user.model';

@Component({
  selector: 'app-register-customer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register-customer.component.html',
  styleUrl: './register-customer.component.css'
})
export class RegisterCustomerComponent {

  form: RegisterCustomerRequest = {
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: ''
  };

  readonly loading = signal(false);
  readonly error = signal('');

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
  }

  submit(): void {
    if (this.form.password !== this.form.confirmPassword) {
      this.error.set('Passwords do not match.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.registerCustomer(this.form).subscribe({
      next: () => {
        this.cartService.mergeGuestCart().subscribe(() => {
          this.loading.set(false);
          this.router.navigate(['/']);
        });
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Registration failed. Please try again.');
      }
    });
  }
}
