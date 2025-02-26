import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  categoryExpenses = [
    { category: 'Food', amount: 120 },
    { category: 'Transport', amount: 180 },
    { category: 'Entertainment', amount: 90 },
    { category: 'Shopping', amount: 200 },
  ];

  transactions = [
    { date: '2024-02-15', description: 'Grocery Shopping', amount: 50 },
    { date: '2024-02-14', description: 'Movie Tickets', amount: 30 },
    { date: '2024-02-13', description: 'Gas Refill', amount: 40 },
  ];

   // Savings Goal
   savingsGoal: number = 0;
   currentSavings: number = 0;
 
   // Bill Reminders
   billReminders = [
     { name: 'Electricity Bill', dueDate: '2025-03-10', amount: 75 },
     { name: 'Internet Bill', dueDate: '2025-03-15', amount: 50 },
   ];
 
   // Set savings goal
   setSavingsGoal(goal: string, current: string) {
     if (goal && current) {
       this.savingsGoal = parseFloat(goal);
       this.currentSavings = parseFloat(current);
     }
   }
}