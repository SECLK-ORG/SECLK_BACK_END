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


export interface Project extends Document {
  projectName: string;
  startDate: Date;
  endDate?: Date;
  category: string;
  status: Status;
  totalIncome: number;
  totalExpenses: number;
  employees: mongoose.Types.ObjectId[];
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
  username: string;
  email: string;
  password: string;
  role: Roles;
  position?: string;
  assignedProjects: mongoose.Types.ObjectId[];
  paymentHistory: Payment[];
}