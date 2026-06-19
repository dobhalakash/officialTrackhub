import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import {
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
  RegisterBusinessRequest,
  RegisterCustomerRequest,
  UpdateProfileRequest,
  User
} from '../models/user.model';

const ACCESS_TOKEN_KEY = 'th_access_token';
const REFRESH_TOKEN_KEY = 'th_refresh_token';
const USER_KEY = 'th_user';

/**
 * Manages authentication state: login, registration, token storage,
 * and the currently authenticated user.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly baseUrl = `${environment.apiUrl}/auth`;
  private readonly usersUrl = `${environment.apiUrl}/users`;

  /** The currently authenticated user, or null if logged out. */
  readonly currentUser = signal<User | null>(this.readStoredUser());

  /** True if a user is currently authenticated. */
  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  /** Convenience accessor for the current user's role. */
  readonly currentRole = computed(() => this.currentUser()?.role ?? null);

  constructor(private http: HttpClient) {
  }

  registerCustomer(request: RegisterCustomerRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/register/customer`, request)
      .pipe(tap(res => this.handleAuthSuccess(res.data)));
  }

  registerBusiness(request: RegisterBusinessRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/register/business`, request)
      .pipe(tap(res => this.handleAuthSuccess(res.data)));
  }

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/login`, request)
      .pipe(tap(res => this.handleAuthSuccess(res.data)));
  }

  refreshToken(): Observable<ApiResponse<AuthResponse>> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/refresh`, { refreshToken })
      .pipe(tap(res => this.handleAuthSuccess(res.data)));
  }

  updateProfile(request: UpdateProfileRequest): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.usersUrl}/me`, request)
      .pipe(tap(res => this.setCurrentUser(res.data)));
  }

  changePassword(request: ChangePasswordRequest): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.usersUrl}/me/password`, request);
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  private handleAuthSuccess(auth: AuthResponse): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
    this.setCurrentUser(auth.user);
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private readStoredUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
