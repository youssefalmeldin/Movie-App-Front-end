import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Movie } from '../../shared/models/movie';
import { UserMovieService } from '../user-movie.service';
import { MovieListComponent } from '../../user/movie-list/movie-list.component';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MovieListComponent],
  template: `
    <div class="dashboard-container">
      <div class="header">
        <h2>Movies</h2>
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
        <button (click)="retry()">Retry</button>
      </div>

      <!-- Movie List -->
      <app-movie-list [movies]="movies" *ngIf="movies.length > 0; else noMovies"></app-movie-list>

      <!-- No Movies Message -->
      <ng-template #noMovies>
        <div *ngIf="!errorMessage && !isLoading" class="no-movies">
          No movies found. Try a different search!
        </div>
      </ng-template>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading">
        <div class="spinner"></div>
        <span>Loading movies...</span>
      </div>
    </div>
  `
})
export class UserDashboardComponent implements OnInit {
  movies: Movie[] = [];
  searchText = '';
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private movieService: UserMovieService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this.isLoading = true;
    this.errorMessage = null;
    this.movieService.getMovies().subscribe({
      next: (data) => {
        this.movies = data;
        this.isLoading = false;
        if (this.movies.length === 0) {
          this.errorMessage = 'No movies available';
        }
      },
      error: (err) => {
        console.error('Error fetching movies:', err);
        this.errorMessage = 'Failed to load movies';
        this.isLoading = false;
        this.movies = [];
      }
    });
  }

  searchMovies() {
    if (!this.searchText.trim()) {
      this.loadMovies(); // Reset to all movies if search is empty
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.movieService.getMovies(this.searchText.trim()).subscribe({
      next: (data) => {
        this.movies = data;
        this.isLoading = false;
        if (this.movies.length === 0) {
          this.errorMessage = 'No movies found for this search';
        }
      },
      error: (err) => {
        console.error('Error searching movies:', err);
        this.errorMessage = 'Failed to search movies';
        this.isLoading = false;
        this.movies = [];
      }
    });
  }

  retry() {
    if (this.searchText.trim()) {
      this.searchMovies();
    } else {
      this.loadMovies();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}