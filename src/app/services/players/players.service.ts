import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private apiUrl = 'http://localhost:8080/v1/players/top10';

  constructor(private http: HttpClient) {}

  getTop10Players(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
