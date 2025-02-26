import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


interface Expense {
  name: string;
  amount: number;
  category: string;
}


@Component({
  selector: 'app-add-expense',
  imports: [CommonModule],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.css'
})
export class AddExpenseComponent {
  expenses: Expense[] = [
    { name: 'Groceries', amount: 100, category: 'Food' },
    { name: 'Electric Bill', amount: 50, category: 'Bills' },
  ];

  addExpense(name: string, amount: string, category: string) {
    if (name && amount && category) {
      this.expenses.push({ name, amount: parseFloat(amount), category });
    }
  }

  processBankStatement() {
    alert('Bank statement processing is not implemented yet.');
  }
}
