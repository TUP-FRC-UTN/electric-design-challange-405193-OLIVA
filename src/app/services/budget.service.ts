import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private readonly http = inject(HttpClient);
  private apiUrl = "http://localhost:3000/budgets/";
}
