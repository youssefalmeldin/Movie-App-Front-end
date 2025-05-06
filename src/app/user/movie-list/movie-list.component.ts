import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Movie } from '../../shared/models/movie';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="movie-list-container">
      <div class="header">
        <h2>Movies</h2>
      </div>
      <ul class="movie-list">
        <li *ngFor="let movie of movies" class="movie-item" (click)="goToDetails(movie.id)">
          <img
            *ngIf="movie.poster"
            [src]="movie.poster"
            [alt]="movie.title"
            class="movie-poster"
          />
          <div class="movie-info">
            <h3>{{ movie.title }} ({{ movie.year }})</h3>
          </div>
        </li>
      </ul>
    </div>
  `,
})
export class MovieListComponent {
  @Input() movies: Movie[] = [];

  constructor(
    private router: Router
  ) {}

  goToDetails(movieId?: string) {
    if (movieId) {
      this.router.navigate(['/user/movie', movieId]);
    }
  }
}