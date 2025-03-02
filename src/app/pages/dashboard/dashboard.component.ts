import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';


import Chart from 'chart.js/auto';
import { BillReminderService } from '../../service/bill-remainder.service';
import { ApiService,Transaction } from '../../service/transactionservice.service';
import { ExpenseLimitService ,ExpenseLimit} from '../../service/expense-limit.service';


interface CategoryExpense {
  category: string;
  amount: number;
  color: string;
  percentageChange: string;
}

interface SpendingAnalysis {
  category_monthly_spending: { [category: string]: { [month: string]: number } };
  category_totals: { [category: string]: number };
  largest_transactions: Transaction[];
  monthly_spending: { [month: string]: number };
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
  private limitsetterService = inject(ExpenseLimitService);

  billReminders: { title: string; date: string; amount :number}[] = [];
  transactions: Transaction[] = [];
  analysis: SpendingAnalysis | null = null;
  months: string[] = [];
  categories: string[] = [];
  suggestions:string[] =[];


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
  loadSpendingAnalysis(): void {
    this.transactionService.analyzeSpending().subscribe({
      next: (data) => {
        this.analysis = data?.analysis || null;
        console.log(this.analysis);
        this.months = Object.keys(this.analysis?.monthly_spending ?? {});
        this.categories = Object.keys(this.analysis?.category_totals ?? {});
      },
      error: (err) => console.error('Error fetching analysis:', err)
    });
    this.transactionService.getSuggestions().subscribe({
      next:(data)=>{
        console.log(data);
        this.suggestions = data;
      }
    })
  }
  
  savingsPercentage: number = 0;
  expenselimit:ExpenseLimit={
    month: '',
    limit: 0,
    current_expense: 0
  };
  // Chart periods
  activeExpensePeriod: string = 'month';
  activeCategoryPeriod: string = 'month';

  ngOnInit(): void {
    this.loadSpendingAnalysis();
    this.loadReminders();
    this.loadTransactions();
    this.loadexpenselimit();
    
  }

  loadexpenselimit():void{
   this.limitsetterService.getExpenseLimit().subscribe({
    next:(data)=>{
      this.expenselimit=data;
      this.calculateCurrentMonthExpense();
    }
   });
  }

  calculateCurrentMonthExpense(): void {
    const currentMonth = new Date().getMonth(); // Get the current month (0-based)
    const currentYear = new Date().getFullYear(); // Get the current year
  
    // Filter transactions for the current month and sum expenses
    const totalCurrentMonthExpense = this.transactions
      .filter(txn => {
        const txnDate = new Date(txn.Date);
        return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear && txn.Type === 'DR';
      })
      .reduce((sum, txn) => sum + txn.Amount, 0);
  
    // Update expenselimit with the calculated expense
    this.expenselimit.current_expense = totalCurrentMonthExpense;
  
    // Recalculate savings percentage
    this.savingsPercentage = this.expenselimit.limit > 0 
      ? (this.expenselimit.current_expense / this.expenselimit.limit) * 100
      : 0;
  }

  processTransactionData(): void {
    if (!this.analysis) return;
  
    const categoryTotals = this.analysis.category_totals ?? {};
    const categoryMonthlySpending = this.analysis.category_monthly_spending ?? {};
    const monthlySpending = this.analysis.monthly_spending ?? {};
  
    const currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM
    const prevDate = new Date();
    prevDate.setMonth(prevDate.getMonth() - 1);
    const previousMonth = prevDate.toISOString().slice(0, 7); // Previous month in YYYY-MM format
  
    this.categoryExpenses = Object.keys(categoryTotals).map(category => {
      const currentExpense = categoryMonthlySpending[category]?.[currentMonth] ?? 0;
      const prevExpense = categoryMonthlySpending[category]?.[previousMonth] ?? 0;
  
      // Calculate percentage change
      let percentageChange = prevExpense !== 0 ? ((currentExpense - prevExpense) / prevExpense) * 100 : 0;
      let color = 'neutral'; // Default
  
      if (percentageChange > 0) {
        color = 'up';
      } else if (percentageChange < 0) {
        color = 'down';
      }
  
      return {
        category,
        amount: categoryTotals[category],
        color,
        percentageChange: percentageChange.toFixed(1) + '%' // Show 1 decimal place
      };
    });
  
    // Prepare data for charts
    const expenseData: number[] = new Array(12).fill(0);
    Object.entries(monthlySpending).forEach(([month, amount]) => {
      const monthIndex = new Date(month + "-01").getMonth();
      expenseData[monthIndex] = amount;
    });
  
    this.updateExpenseChart(new Array(12).fill(0), expenseData);
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