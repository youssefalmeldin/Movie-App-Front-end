import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../shared/models/movie';

@Injectable({ providedIn: 'root' })
export class UserMovieService {
  private apiUrl = 'http://localhost:8080/users/movie';

  constructor(private http: HttpClient) {}

  getMovies(title?: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}`, { params: title ? { title } : {} });
  }

  getMovie(id: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`);
  }
}
