import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
  providedIn: 'root' // Makes the service available throughout the app
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:5000'; 

  constructor(private http: HttpClient) {}

  // Fetch transactions from Flask API
  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/get_transactions`).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling function
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => new Error('Something went wrong! Please try again.'));
  }
}
