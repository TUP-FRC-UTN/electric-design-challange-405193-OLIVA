import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Budget } from '../models/budget';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private readonly http = inject(HttpClient);
  private apiUrl = "http://localhost:3000/budgets/";

  postBudget(budget: Budget): Observable<Budget> {
    return this.http.post<Budget>(this.apiUrl, budget);
  }

  getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.apiUrl);
  }
}
