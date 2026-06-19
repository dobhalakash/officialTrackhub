import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RegisterBusinessRequest } from '../../core/models/user.model';

@Component({
  selector: 'app-register-business',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register-business.component.html',
  styleUrl: './register-business.component.css'
})
export class RegisterBusinessComponent {

  form: RegisterBusinessRequest = {
    businessName: '',
    ownerName: '',
    gstNumber: '',
    email: '',
    mobile: '',
    password: ''
  };

  confirmPassword = '';
  readonly loading = signal(false);
  readonly error = signal('');
  readonly success = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  submit(): void {
    if (this.form.password !== this.confirmPassword) {
      this.error.set('Passwords do not match.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.registerBusiness(this.form).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        setTimeout(() => this.router.navigate(['/business/dashboard']), 2000);
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Registration failed. Please try again.');
      }
    });
  }
}
