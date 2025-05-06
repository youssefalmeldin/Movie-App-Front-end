import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Movie, Rating } from '../../shared/models/movie';
import { UserMovieService } from '../user-movie.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="movie-detail-container">
      <div class="header">
        <h1 *ngIf="movie">{{ movie.title }} ({{ movie.year }})</h1>
        <button class="logout-button" (click)="logout()">Logout</button>
      </div>

      <div *ngIf="movie; else loading">
        <!-- Poster and Info -->
        <div class="movie-header">
          <img
            *ngIf="movie.poster"
            [src]="movie.poster"
            [alt]="movie.title"
            class="movie-poster"
          />
          <div class="movie-title">
            <p *ngIf="movie.rated" class="rated">{{ movie.rated }}</p>
            <p *ngIf="movie.runtime" class="runtime">{{ movie.runtime }}</p>
            <p *ngIf="movie.genre" class="genre">{{ movie.genre }}</p>
          </div>
        </div>

        <!-- Plot -->
        <section class="movie-plot" *ngIf="movie.plot">
          <h2>Plot</h2>
          <p>{{ movie.plot }}</p>
        </section>

        <!-- Details -->
        <section class="movie-details">
          <h2>Details</h2>
          <ul>
            <li *ngIf="movie.director"><strong>Director:</strong> {{ movie.director }}</li>
            <li *ngIf="movie.writer"><strong>Writer:</strong> {{ movie.writer }}</li>
            <li *ngIf="movie.actors"><strong>Actors:</strong> {{ movie.actors }}</li>
            <li *ngIf="movie.language"><strong>Language:</strong> {{ movie.language }}</li>
            <li *ngIf="movie.country"><strong>Country:</strong> {{ movie.country }}</li>
            <li *ngIf="movie.released"><strong>Released:</strong> {{ movie.released }}</li>
            <li *ngIf="movie.awards"><strong>Awards:</strong> {{ movie.awards }}</li>
            <li *ngIf="movie.production"><strong>Production:</strong> {{ movie.production }}</li>
            <li *ngIf="movie.boxOffice"><strong>Box Office:</strong> {{ movie.boxOffice }}</li>
            <li *ngIf="movie.website">
              <strong>Website:</strong>
              <a [href]="movie.website" target="_blank">{{ movie.website }}</a>
            </li>
          </ul>
        </section>

        <!-- Ratings -->
        <section class="movie-ratings" *ngIf="movie.ratings && movie.ratings.length > 0">
          <h2>Ratings</h2>
          <ul>
            <li *ngFor="let rating of movie.ratings">
              <strong>{{ rating.source }}:</strong> {{ rating.value }}
            </li>
          </ul>
        </section>

        <!-- Scores -->
        <section class="movie-scores" *ngIf="movie.imdbRating || movie.metascore">
          <h2>Scores</h2>
          <p *ngIf="movie.imdbRating">
            <strong>IMDb Rating:</strong> {{ movie.imdbRating }} ({{ movie.imdbVotes }} votes)
          </p>
          <p *ngIf="movie.metascore"><strong>Metascore:</strong> {{ movie.metascore }}</p>
        </section>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="error-message">
        {{ errorMessage }}
        <button (click)="retry()">Retry</button>
      </div>

      <!-- Loading State -->
      <ng-template #loading>
        <div *ngIf="!errorMessage" class="loading">
          <div class="spinner"></div>
          <span>Loading movie details...</span>
        </div>
      </ng-template>

      <!-- Back Button -->
      <div class="back-button">
        <button (click)="goBack()">Back to Dashboard</button>
      </div>
    </div>
  `
})
export class MovieDetailComponent implements OnInit {
  movieId: string | null = null;
  movie: Movie | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: UserMovieService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('id');
    if (!this.movieId) {
      this.errorMessage = 'Invalid movie ID';
      this.router.navigate(['/user']);
      return;
    }
    this.loadMovieDetails(this.movieId);
  }

  loadMovieDetails(id: string) {
    this.movieService.getMovie(id).subscribe({
      next: (data) => {
        this.movie = data;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Error fetching movie:', err);
        this.errorMessage = 'Failed to load movie details';
        if (err.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  retry() {
    if (this.movieId) {
      this.errorMessage = null;
      this.loadMovieDetails(this.movieId);
    }
  }

  goBack() {
    this.router.navigate(['/user']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}