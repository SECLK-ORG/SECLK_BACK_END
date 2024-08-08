import mongoose, { Document } from 'mongoose';
import Status from '../enums/status';
import Roles from '../enums/roles';
export interface Expense {
    date: Date;
    amount: number;
    description?: string;
    vendor?: string;
    invoiceNumber?: string;
  }
  export interface Income {
    date: Date;
    amount: number;
    description?: string;
    source?: string;
  }
export interface Employee {
  employeeID: mongoose.Types.ObjectId;
  employeeName: string;
  email: string;
  projectStartDate: Date;
}

export interface Project extends Document {
  projectName: string;
  startDate: Date;
  endDate?: Date;
  category: string;
  status: Status;
  clientContactNumber?: string;
  clientEmail?: string;
  totalIncome: number;
  totalExpenses: number;
  employees: Employee[];
  createdBy: mongoose.Types.ObjectId;
  incomeDetails: Income[];
  expenseDetails: Expense[];
}

export interface Payment {
  projectId: mongoose.Types.ObjectId;
  category: string;
  amount: number;
  description?: string;
  invoiceNumber?: string;
  date: Date;
}

export interface User extends Document {
  name: string;
  email: string;
  status:string;
  password: string;
  contactNumber:string;
  workLocation?:string;
  role: Roles;
  startDate:Date;
  position?: string;
  pwResetToken?: string;
  assignedProjects: mongoose.Types.ObjectId[];
  paymentHistory: Payment[];
}

export interface Category extends Document {
  category: string;
}
export interface Positions extends Document {

positions: string;
}