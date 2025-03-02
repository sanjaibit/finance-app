import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ExpenseLimit {
  month: string;
  limit: number;
  current_expense: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseLimitService {
  private apiUrl = 'https://finance-service-api.onrender.com';

  constructor(private http: HttpClient) {}

  // Set or update the monthly expense limit
  setExpenseLimit(limit: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/set_expense_limit`, { limit });
  }

  // Get the expense limit for the current month
  getExpenseLimit(): Observable<ExpenseLimit> {
    return this.http.get<ExpenseLimit>(`${this.apiUrl}/get_expense_limit`);
  }

  // Update the current month's expenses
  updateExpense(amount: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/update_expense`, { amount });
  }
}
