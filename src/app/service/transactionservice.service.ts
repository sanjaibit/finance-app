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
  Balance: number;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) { }

  // Fetch transactions
  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/get_transactions`).pipe(
      catchError(this.handleError)
    );
  }
  uploadPDF(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/upload_pdf`, formData).pipe(
      catchError(this.handleError)
    );
  }
  // 🟢 Analyze Spending Patterns
  analyzeSpending(): Observable<any> {
    return this.http.get(`${this.apiUrl}/analyze_spending`).pipe(
      catchError(this.handleError)
    );
  }

  // 🟢 Generate Financial Suggestions
  getSuggestions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/generate_suggestions`).pipe(
      catchError(this.handleError)
    );
  }

  // Add a new transaction (POST)
  addTransaction(transaction: Omit<Transaction, '_id'>): Observable<Transaction> {
    return this.http
      .post<Transaction>(`${this.apiUrl}/manual_entry`, transaction, {
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
