import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../movie.service';
import { Movie } from '../../shared/models/movie';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-container">
      <div class="header">
        <h2>Admin Dashboard</h2>
        <button class="logout-button" (click)="logout()">Logout</button>
      </div>

      <!-- Search Bar -->
      <div class="search-bar">
        <input
          type="text"
          [(ngModel)]="searchText"
          placeholder="Search Movies..."
          (keyup.enter)="searchMovies()"
        />
        <button (click)="searchMovies()">Search</button>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="error-message">
        {{ errorMessage }}
        <button *ngIf="canRetry" (click)="searchMovies()">Retry</button>
      </div>

      <!-- Movie List -->
      <ul class="movie-list" *ngIf="movies.length > 0; else noMovies">
        <li *ngFor="let movie of movies">
          <img
            *ngIf="movie.poster"
            [src]="movie.poster"
            [alt]="movie.title"
            class="movie-poster"
          />
          <span class="movie-title">{{ movie.title }} ({{ movie.year }})</span>
          <div class="movie-actions">
            <button class="movie-add" *ngIf="!movie.id" (click)="addMovie(movie.imdbID)">Add</button>
            <button class="movie-delete" *ngIf="movie.id" (click)="deleteMovie(movie.id)">Delete</button>
          </div>
        </li>
      </ul>

      <!-- No Movies Message -->
      <ng-template #noMovies>
        <div class="no-movies" *ngIf="!errorMessage">
          No movies found. Try searching!
        </div>
      </ng-template>

      <!-- Pagination -->
      <div class="pagination" *ngIf="movies.length > 0">
        <button [disabled]="page === 1" (click)="previousPage()">Previous</button>
        <span>Page {{ page }}</span>
        <button (click)="nextPage()">Next</button>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  searchText = '';
  movies: Movie[] = [];
  page = 1;
  errorMessage: string | null = null;
  canRetry: boolean = false;

  constructor(
    private movieService: MovieService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.errorMessage = 'Please enter a search term to find movies';
  }

  searchMovies() {
    if (!this.searchText.trim()) {
      this.errorMessage = 'Please enter a search term';
      this.movies = [];
      this.canRetry = false;
      return;
    }

    this.errorMessage = null;
    this.canRetry = true;
    this.movieService.searchMovies(this.searchText.trim(), this.page).subscribe({
      next: (data) => {
        this.movies = Array.isArray(data) ? data : data['results'] || [];
        if (this.movies.length === 0) {
          this.errorMessage = 'No movies found for this search';
          this.canRetry = true;
        }
      },
      error: (err) => {
        console.error('Error searching movies:', err);
        if (err.status === 400) {
          this.errorMessage = err.error?.searchText || 'Invalid search term';
        } else if (err.status === 403) {
          this.errorMessage = 'Unauthorized access. Please log in.';
          this.canRetry = false;
        } else {
          this.errorMessage = 'Failed to load movies';
          this.canRetry = true;
        }
        this.movies = [];
      }
    });
  }

  addMovie(imdbID: string) {
    if (!imdbID) {
      this.errorMessage = 'Invalid movie ID';
      this.canRetry = false;
      return;
    }
    this.movieService.addMovie(imdbID).subscribe({
      next: () => {
        this.searchMovies();
      },
      error: (err) => {
        console.error('Error adding movie:', err);
        this.errorMessage = 'Failed to add movie';
        this.canRetry = false;
      }
    });
  }

  deleteMovie(id: string | undefined) {
    if (!id) {
      this.errorMessage = 'Invalid movie ID';
      this.canRetry = false;
      return;
    }
    this.movieService.deleteMovie(id).subscribe({
      next: () => {
        this.searchMovies();
      },
      error: (err) => {
        console.error('Error deleting movie:', err);
        this.errorMessage = 'Failed to delete movie';
        this.canRetry = false;
      }
    });
  }

  nextPage() {
    this.page++;
    this.searchMovies();
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.searchMovies();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}