import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService, Transaction } from '../../service/transactionservice.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-expense',
  imports: [CommonModule,FormsModule],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.css'
})
export class AddExpenseComponent implements OnInit {
  transactions: Transaction[] = [];
  selectedFile: File | null = null;
  
  // Predefined categories
  categories: { [key: string]: string[] } = {
    FOOD: ['SWIGGY', 'ZOMATO', 'RESTAURANT', 'HOTEL'],
    TRANSPORT: ['UBER', 'OLA', 'METRO', 'FUEL', 'PETROL'],
    SHOPPING: ['AMAZON', 'FLIPKART', 'MYNTRA', 'RETAIL'],
    UTILITIES: ['ELECTRICITY', 'WATER', 'GAS', 'MOBILE', 'INTERNET'],
    ENTERTAINMENT: ['NETFLIX', 'PRIME', 'HOTSTAR', 'MOVIE'],
    TRANSFER: ['UPI', 'NEFT', 'IMPS', 'TRANSFER'],
  };

  // Default transaction values
  newTransaction: Partial<Transaction> = {
    Date: new Date().toISOString().split('T')[0], // Default to today’s date
    Description: '',
    Category: 'FOOD',
    Amount: 0,
    Type: 'DR',
    Balance: 0,
  };
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.apiService.getTransactions().subscribe((data) => (this.transactions = data));
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadPDF(): void {
    if (!this.selectedFile) {
      alert('Please select a PDF file.');
      return;
    }

    this.apiService.uploadPDF(this.selectedFile).subscribe({
      next: () => {
        alert('PDF uploaded successfully!');
        this.selectedFile = null;
        this.loadTransactions(); // Refresh transactions after upload
      },
      error: (err) => console.error('Error uploading PDF:', err)
    });
  }

  addTransaction(): void {
    const previousBalance = this.transactions.length
      ? this.transactions[this.transactions.length - 1].Balance
      : 0; // Default balance if no transactions exist
  
    const newBalance =
      this.newTransaction.Type === 'CR'
        ? previousBalance + Number(this.newTransaction.Amount)
        : previousBalance - Number(this.newTransaction.Amount);
  
    const transactionToAdd = {
      Date: new Date(this.newTransaction.Date ?? new Date()).toISOString().split('T')[0], // ✅ Fix applied
      Description: this.newTransaction.Description ?? '',
      Category: this.newTransaction.Category,
      Amount: Number(this.newTransaction.Amount) || 0, // Ensure number type
      Type: this.newTransaction.Type ?? 'DR',
      Balance: newBalance,
    };
  
    this.apiService.addTransaction(transactionToAdd as Omit<Transaction, '_id'>).subscribe({
      next: () => {
        this.loadTransactions();
        this.resetForm();
      },
      error: (err) => console.error('Error adding transaction:', err),
    });
  }
  

  deleteTransaction(id: string): void {
    this.apiService.deleteTransaction(id).subscribe(() => this.loadTransactions());
  }

  resetForm(): void {
    this.newTransaction = {
      Date: new Date().toISOString().split('T')[0],
      Description: '',
      Category: 'FOOD',
      Amount: 0,
      Type: 'DR',
      Balance: 0,
    };
  }

  getCategoryFromDescription(description: string): string {
    description = description.toUpperCase();
    for (const category in this.categories) {
      if (this.categories[category].some((keyword) => description.includes(keyword))) {
        return category;
      }
    }
    return 'OTHERS'; // Default category if no match found
  }
  getCategoryKeys(): string[] {
    return Object.keys(this.categories);
  }
  
}