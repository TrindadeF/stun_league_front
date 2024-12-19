import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private apiUrl = '/api';

  constructor(private http: HttpClient, private cookie: CookieService) { }

  private getHeaders(): HttpHeaders {
    const token = this.cookie.get('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }


  post<T>(endpoint: string, body: any): Observable<T> {
    const headers = this.getHeaders();
    return this.http.post<T>(this.apiUrl + endpoint, body, { headers });
  }

  get<T>(endpoint: string): Observable<T> {
    const headers = this.getHeaders();
    return this.http.get<T>(this.apiUrl + endpoint, { headers });
  }
}