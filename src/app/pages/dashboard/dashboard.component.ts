import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';


import Chart from 'chart.js/auto';
import { BillReminderService } from '../../service/bill-remainder.service';
import { ApiService,Transaction } from '../../service/transactionservice.service';


interface CategoryExpense {
  category: string;
  amount: number;
  color: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  
  private billService = inject(BillReminderService);
  private transactionService = inject(ApiService);

  billReminders: { title: string; date: string; amount :number}[] = [];
  transactions: Transaction[] = [];


  categoryExpenses: CategoryExpense[] =[];

  loadReminders() {
    this.billService.getBillReminders().subscribe((data) => {
      this.billReminders = data;
    });
  }

  // Fetch transactions using ApiService
  loadTransactions(): void {
    this.transactionService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
  
        // Process data for charts
        this.processTransactionData();
      },
      error: (err) => console.error('Error fetching transactions:', err)
    });
  }
  
  

  // Savings goal
  savingsGoal: number = 10000;
  currentSavings: number = 6500;
  savingsPercentage: number = 0;

  // Chart periods
  activeExpensePeriod: string = 'month';
  activeCategoryPeriod: string = 'month';

  ngOnInit(): void {
    this.loadReminders();
    this.loadTransactions();
    this.savingsPercentage = (this.currentSavings / this.savingsGoal) * 100;
    
  }

  processTransactionData(): void {
    const monthlyIncome: number[] = new Array(12).fill(0);
    const monthlyExpenses: number[] = new Array(12).fill(0);
  
    const categoryTotals: { [key: string]: number } = {};
  
    this.transactions.forEach(txn => {
      const date = new Date(txn.Date);
      const monthIndex = date.getMonth(); 
  
      if (txn.Type === 'CR') {
        monthlyIncome[monthIndex] += txn.Amount;
      } else if (txn.Type === 'DR') {
        monthlyExpenses[monthIndex] += txn.Amount;
  
        // Categorize expenses
        if (!categoryTotals[txn.Category]) {
          categoryTotals[txn.Category] = 0;
        }
        categoryTotals[txn.Category] += txn.Amount;
      }
    });
  
    // Update categoryExpenses array
    this.categoryExpenses = Object.keys(categoryTotals).map(category => ({
      category,
      amount: categoryTotals[category],
      color: 'down', // Expenses are outflows
      icon: 'trending-down'
    }));
  
    // Update charts
    this.updateExpenseChart(monthlyIncome, monthlyExpenses);
    this.updateCategoryChart();
  }
  
  // Change chart period
  setExpensePeriod(period: string): void {
    this.activeExpensePeriod = period;
    // In a real app, you would fetch new data and update the chart
  }

  setCategoryPeriod(period: string): void {
    this.activeCategoryPeriod = period;
    // In a real app, you would fetch new data and update the chart
  }

  updateExpenseChart(incomeData: number[], expenseData: number[]): void {
    const expenseCtx = document.getElementById('expenseOverview') as HTMLCanvasElement;
    if (!expenseCtx) return;
  
    new Chart(expenseCtx.getContext('2d')!, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Expenses',
            data: expenseData,
            borderColor: '#f44336',
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
  
  updateCategoryChart(): void {
    const categoryCtx = document.getElementById('categoryExpenses') as HTMLCanvasElement;
    if (!categoryCtx) return;
  
    new Chart(categoryCtx.getContext('2d')!, {
      type: 'bar',
      data: {
        labels: this.categoryExpenses.map(exp => exp.category),
        datasets: [{
          label: 'Expenses by Category',
          data: this.categoryExpenses.map(exp => exp.amount),
          backgroundColor: [
            '#1e88e5', '#00c853', '#ffa000', '#e91e63', '#9c27b0', '#673ab7', '#607d8b'
          ],
          borderWidth: 0,
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
  
}