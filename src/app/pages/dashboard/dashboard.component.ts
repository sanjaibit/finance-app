import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js';

interface Transaction {
  id: number;
  date: string;
  category: string;
  amount: number;
  description: string;
}

interface CategoryTotal {
  category: string;
  amount: number;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  transactions: Transaction[] = [];
  categoryTotals: CategoryTotal[] = [];
  currentMonthTotal: number = 0;
  previousMonthTotal: number = 0;
  monthlyComparison: number = 0;
  
  // Colors for categories
  colors: string[] = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
    '#9966FF', '#FF9F40', '#8AC249', '#EA86C2'
  ];

  constructor() { }

  ngOnInit(): void {
    this.loadData();
    this.calculateCategoryTotals();
    this.renderCharts();
  }

  loadData(): void {
    // Mock data - in a real app, this would come from a service
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    
    this.transactions = [
      { id: 1, date: '2025-02-15', category: 'Groceries', amount: 120.50, description: 'Weekly shopping' },
      { id: 2, date: '2025-02-18', category: 'Utilities', amount: 85.20, description: 'Electricity bill' },
      { id: 3, date: '2025-02-20', category: 'Dining', amount: 65.75, description: 'Dinner with friends' },
      { id: 4, date: '2025-02-22', category: 'Transportation', amount: 45.00, description: 'Fuel' },
      { id: 5, date: '2025-02-24', category: 'Entertainment', amount: 35.99, description: 'Movie tickets' },
      { id: 6, date: '2025-01-10', category: 'Groceries', amount: 110.25, description: 'Monthly groceries' },
      { id: 7, date: '2025-01-15', category: 'Utilities', amount: 95.50, description: 'Internet and phone' },
      { id: 8, date: '2025-01-20', category: 'Dining', amount: 78.30, description: 'Restaurant' }
    ];

    // Calculate totals
    this.currentMonthTotal = this.transactions
      .filter(t => new Date(t.date).getMonth() === currentMonth)
      .reduce((sum, t) => sum + t.amount, 0);
    
    this.previousMonthTotal = this.transactions
      .filter(t => new Date(t.date).getMonth() === previousMonth)
      .reduce((sum, t) => sum + t.amount, 0);
    
    this.monthlyComparison = this.previousMonthTotal > 0 
      ? ((this.currentMonthTotal - this.previousMonthTotal) / this.previousMonthTotal) * 100 
      : 0;
  }

  calculateCategoryTotals(): void {
    const currentMonth = new Date().getMonth();
    const categories: {[key: string]: number} = {};
    
    // Get current month transactions
    const currentMonthTransactions = this.transactions.filter(
      t => new Date(t.date).getMonth() === currentMonth
    );
    
    // Group by category and sum amounts
    currentMonthTransactions.forEach(transaction => {
      if (!categories[transaction.category]) {
        categories[transaction.category] = 0;
      }
      categories[transaction.category] += transaction.amount;
    });
    
    // Convert to array for display
    let index = 0;
    this.categoryTotals = Object.keys(categories).map(category => {
      const colorIndex = index % this.colors.length;
      index++;
      return {
        category,
        amount: categories[category],
        color: this.colors[colorIndex]
      };
    });
  }

  renderCharts(): void {
    // This would be implemented with actual Chart.js in a real component
    // For this example, we're just defining what would be rendered
    setTimeout(() => {
      this.renderCategoryChart();
      this.renderMonthlyComparisonChart();
    }, 0);
  }

  renderCategoryChart(): void {
    const canvas = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.categoryTotals.map(c => c.category),
        datasets: [{
          data: this.categoryTotals.map(c => c.amount),
          backgroundColor: this.categoryTotals.map(c => c.color)
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  renderMonthlyComparisonChart(): void {
    const canvas = document.getElementById('comparisonChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Previous Month', 'Current Month'],
        datasets: [{
          data: [this.previousMonthTotal, this.currentMonthTotal],
          backgroundColor: ['#36A2EB', '#FF6384']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}