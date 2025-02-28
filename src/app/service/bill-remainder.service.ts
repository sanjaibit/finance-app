import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BillReminderService {
  private apiUrl = 'https://finance-service-api.onrender.com'; 

  private http = inject(HttpClient);

  constructor() {}

  getBillReminders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get_bill_reminders`);
  }

  addBillReminder(bill: { title: string; date: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add_bill_reminder`, bill);
  }
}
