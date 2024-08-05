import Status from "../../enums/status";
import { Income, Expense, Project } from "../../models/common";

import mongoose, { Schema, Document } from 'mongoose';

const incomeSchema = new Schema<Income>({
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    description: { type: String },
    source: { type: String }
  });
  
  const expenseSchema = new Schema<Expense>({
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    description: { type: String },
    vendor: { type: String },
    invoiceNumber: { type: String }
  });
  
  const projectSchema = new Schema<Project>({
    projectName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    category: { type: String, required: true },
    status: { type: String, enum: Object.values(Status), required: true },
    totalIncome: { type: Number, default: 0 },
    clientContactNumber:{ type: String, required: false },
    clientEmail:{ type: String, required: false },
    totalExpenses: { type: Number, default: 0 },
    employees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    incomeDetails: [incomeSchema],
    expenseDetails: [expenseSchema]
  });
  // Middleware to calculate totalIncome and totalExpenses before saving
projectSchema.pre('save', function (next) {
  const project = this;

  // Calculate totalIncome
  project.totalIncome = project.incomeDetails.reduce((sum, income) => sum + income.amount, 0);

  // Calculate totalExpenses
  project.totalExpenses = project.expenseDetails.reduce((sum, expense) => sum + expense.amount, 0);

  next();
});


  export default mongoose.model<Project>('Project', projectSchema);