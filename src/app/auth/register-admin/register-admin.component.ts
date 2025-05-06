import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role: string;
}

interface User {
  email?: string;
  username?: string;
  password?: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <h2>Register Admin</h2>
      <form class="form-group" (ngSubmit)="registerAdmin()">
        <input
          [(ngModel)]="user.email"
          name="email"
          placeholder="Email"
          type="email"
          required
        />
        <input
          [(ngModel)]="user.username"
          name="username"
          placeholder="Username"
          type="text"
          required
        />
        <input
          [(ngModel)]="user.password"
          name="password"
          placeholder="Password"
          type="password"
          required
        />
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <div class="button-group">
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  `
})
export class RegisterAdminComponent {
  user: User = {};
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  registerAdmin() {
    if (!this.user.email?.trim() || !this.user.username?.trim() || !this.user.password?.trim()) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.errorMessage = null;
    this.authService.registerAdmin(this.user).subscribe({
      next: (response) => {
        const decoded = this.decodeToken(response.token);
        if (!decoded) {
          this.errorMessage = 'Invalid token';
          return;
        }
        const role = decoded.role.toUpperCase();

        localStorage.setItem('token', `${response.token}`);
        localStorage.setItem('role', role);
        if (role === 'USER') {
          this.router.navigate(['/user']);
        } else if (role === 'ADMIN') {
          this.router.navigate(['/admin']);
        }
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.errorMessage = err.error?.message || 'Failed to register. Please try again.';
      }
    });
  }

  decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}