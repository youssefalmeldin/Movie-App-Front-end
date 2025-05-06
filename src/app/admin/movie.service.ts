import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie } from '../shared/models/movie';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private apiUrl = 'http://localhost:8080/admin/movie';

  constructor(private http: HttpClient) { }

  searchMovies(searchText: string, page: number = 1): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}`, { params: { searchText, page } });
  }

  addMovie(imdbID: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, null, { params: { imdbID } });
  }

  deleteMovie(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
