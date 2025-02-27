import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExpenseLimitService } from '../../service/expense-limit.service';

@Component({
  selector: 'app-limit-setter',
  imports: [FormsModule,CommonModule],
  templateUrl: './limit-setter.component.html',
  styleUrl: './limit-setter.component.css'
})
export class LimitSetterComponent implements OnInit {
  expenseLimit: number = 0;
  currentExpense: number = 0;
  newExpenseAmount: number = 0;

  constructor(private expenseLimitService: ExpenseLimitService) {}

  ngOnInit(): void {
    this.loadExpenseLimit();
  }

  // Load the current month's expense limit
  loadExpenseLimit(): void {
    this.expenseLimitService.getExpenseLimit().subscribe({
      next: (data) => {
        this.expenseLimit = data.limit;
        this.currentExpense = data.current_expense;
      },
      error: () => console.warn('No expense limit set for this month.')
    });
  }

  // Set a new expense limit
  setExpenseLimit(newLimit: number): void {
    this.expenseLimitService.setExpenseLimit(newLimit).subscribe({
      next: () => this.loadExpenseLimit(),
      error: (err) => console.error('Error setting limit:', err)
    });
  }

  // Update current expenses
  updateExpense(amount: number): void {
    this.expenseLimitService.updateExpense(amount).subscribe({
      next: () => this.loadExpenseLimit(),
      error: (err) => console.error('Error updating expenses:', err)
    });
  }
}
