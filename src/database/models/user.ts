import mongoose, { Schema, Document } from 'mongoose';
import Roles from '../../enums/roles';
import { Payment, User } from '../../models/common';

const paymentSchema = new Schema<Payment>({
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    invoiceNumber: { type: String },
    date: { type: Date, default: Date.now }
  });
  
  const userSchema = new Schema<User>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(Roles), required: true },
    position: { type: String },
    assignedProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    paymentHistory: [paymentSchema]
  });
  
  export default mongoose.model<User>('User', userSchema);
