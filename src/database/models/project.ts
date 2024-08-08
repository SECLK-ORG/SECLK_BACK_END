import Status from "../../enums/status";
import { Income, Expense, Project } from "../../models/common";

import mongoose, { Schema, Document } from 'mongoose';
import userSchema from './user';
const incomeSchema = new Schema<Income>({
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    description: { type: String },
    source: { type: String }
  });
  const employeeSchema = new Schema({
    employeeID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    employeeName: { type: String, required: true },
    email: { type: String, required: true },
    projectStartDate: { type: Date, required: true }
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
    employees: [employeeSchema],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    incomeDetails: [incomeSchema],
    expenseDetails: [expenseSchema]
  });

  
projectSchema.pre('save', function (next) {
  const project = this;

  project.totalIncome = project.incomeDetails.reduce((sum, income) => sum + income.amount, 0);

  project.totalExpenses = project.expenseDetails.reduce((sum, expense) => sum + expense.amount, 0);

  next();
});

projectSchema.post('save', async function (doc) {
  const userIds = doc.employees.map(emp => emp.employeeID);

  await userSchema.updateMany(
    { _id: { $in: userIds } },
    { $addToSet: { assignedProjects: doc._id} }
  );
});


  export default mongoose.model<Project>('Project', projectSchema);