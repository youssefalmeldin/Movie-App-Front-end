import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="header">
        <h2>Login</h2>
      </div>

      <form class="form-group" (ngSubmit)="login()">
        <input
          [(ngModel)]="username"
          name="username"
          placeholder="Username"
          type="text"
          required
        />
        <input
          [(ngModel)]="password"
          name="password"
          placeholder="Password"
          type="password"
          required
        />
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <div class="button-group">
          <button type="submit">Login</button>
          <button type="button" (click)="register()">Register</button>
        </div>
      </form>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.errorMessage = null;
    this.authService.login(this.username, this.password).subscribe({
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
        console.error('Login error:', err);
        this.errorMessage = err.error?.message || 'Failed to login. Please check your credentials.';
      }
    });
  }

  register() {
    this.router.navigate(['/register-user']);
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