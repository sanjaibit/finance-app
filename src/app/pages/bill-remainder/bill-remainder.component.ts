import { Component, inject, OnInit } from '@angular/core';
import { BillReminderService } from '../../service/bill-remainder.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bill-remainder',
  imports: [CommonModule,FormsModule],
  templateUrl: './bill-remainder.component.html',
  styleUrl: './bill-remainder.component.css'
})
export class BillRemainderComponent implements OnInit {
  private billService = inject(BillReminderService);

  billTitle: string = '';
  billDate: string = '';
  billReminders: { title: string; date: string }[] = [];

  ngOnInit() {
    this.loadReminders();
  }

  loadReminders() {
    this.billService.getBillReminders().subscribe((data) => {
      this.billReminders = data;
    });
  }

  addReminder() {
    if (!this.billTitle || !this.billDate) return;

    const newBill = { title: this.billTitle, date: this.billDate };
    this.billService.addBillReminder(newBill).subscribe(() => {
      this.billReminders.push(newBill);
      this.billTitle = '';
      this.billDate = '';
    });
  }
}
