import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Plan {
  name: string;
  benefits: string[];
  description: string;
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private apiUrl = 'http://localhost:8080/v1/plans';

  constructor(private http: HttpClient) {}

  getPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.apiUrl);
  }

  getPlanByName(name: string): Observable<Plan> {
    return this.http.get<Plan>(`${this.apiUrl}/${name}`);
  }
}
