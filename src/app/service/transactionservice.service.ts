import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Transaction {
  _id: string;
  Date: string;
  Description: string;
  Category: string;
  Amount: number;
  Type: 'DR' | 'CR';
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {}

  // Fetch transactions
  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/get_transactions`).pipe(
      catchError(this.handleError)
    );
  }

  // Add a new transaction (POST)
  addTransaction(transaction: Omit<Transaction, '_id'>): Observable<Transaction> {
    return this.http
      .post<Transaction>(`${this.apiUrl}/add_transaction`, transaction, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(catchError(this.handleError));
  }

  // Delete a transaction by ID (DELETE)
  deleteTransaction(transactionId: string): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/delete_transaction/${transactionId}`)
      .pipe(catchError(this.handleError));
  }

  // Error handling function
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => new Error('Something went wrong! Please try again.'));
  }
}
