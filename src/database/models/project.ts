import Status from "../../enums/status";
import { Income, Expense, Project } from "../../models/common";
import mongoose, { Schema, Document } from 'mongoose';
import userSchema from './user';
import logger from "../../utils/logger";

const incomeSchema = new Schema<Income>({
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    invoiceNumber: { type: String ,required: true ,unique:true},
    receivedBy: { type: String },
    description: { type: String },
});

const employeeSchema = new Schema({
    employeeID: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        name: { type: String, required: false },
        email: {type: String, required: false },
    },
    employeeName: { type: String, required: true },
    email: { type: String, required: true },
    position: { type: String, required: false },
    projectStartedDate: { type: Date, default: Date.now ,required: true },
});

const expenseSchema = new Schema<Expense>({
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    description: { type: String },
    vendor: { type: String },
    category: { type: String, required: true },
    invoiceNumber: { type: String,required: true ,unique:true },
    employeeID: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
        name: { type: String, required: false },
        email: { type: String, required: false },
    },
});


const projectSchema = new Schema<Project>({
    projectName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    category: { type: String, required: true },
    status: { type: String, enum: Object.values(Status), required: true },
    totalIncome: { type: Number, default: 0 },
    clientContactNumber: { type: String, required: false },
    clientEmail: { type: String, required: false },
    totalExpenses: { type: Number, default: 0 },
    employees: [employeeSchema],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    incomeDetails: [incomeSchema],
    expenseDetails: [expenseSchema],
});

projectSchema.pre('save', function (next) {
    const project = this as any;

    project.totalIncome = project.incomeDetails.reduce((sum: number, income: Income) => sum + income.amount, 0);

    project.totalExpenses = project.expenseDetails.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
    logger.info('Project total income and expenses calculated');
    next();
});

projectSchema.pre('findOneAndUpdate', async function (next) {
  const project = this as any;
  const updatedProject = await project.model.findOne(this.getQuery()).exec();

  updatedProject.totalIncome = updatedProject.incomeDetails.reduce((sum: number, income: Income) => sum + income.amount, 0);
  updatedProject.totalExpenses = updatedProject.expenseDetails.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);

  await updatedProject.save();
  next();
});

projectSchema.post('save', async function (doc: Document & { employees: any[] }) {
    const userIds = doc.employees.map((emp: { employeeID: { _id: any; }; }) => emp.employeeID._id);
    await userSchema.updateMany(
        { _id: { $in: userIds } },
        { $addToSet: { assignedProjects: doc._id } }
    );
});

export default mongoose.model<Project>('Project', projectSchema);
