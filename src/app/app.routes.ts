import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AddExpenseComponent } from './pages/add-expense/add-expense.component';
import { BillRemainderComponent } from './pages/bill-remainder/bill-remainder.component';
import { LimitSetterComponent } from './pages/limit-setter/limit-setter.component';

export const routes: Routes = [
    {path:'',redirectTo:'dashboard',pathMatch:'full'},
    {path:'dashboard',component:DashboardComponent},
    {path:'transactions',component:AddExpenseComponent},
    {path:'bill',component:BillRemainderComponent},
    {path:'expense_limit', component:LimitSetterComponent}
];
