

import mongoose, { Schema } from 'mongoose';
import { Category } from '../../models/common';

const CategorySchema = new Schema<Category>({
    category: { type: String, required: true },
 
  });

export default mongoose.model<Category>('Category', CategorySchema);