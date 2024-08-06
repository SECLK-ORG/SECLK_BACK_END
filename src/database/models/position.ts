

import mongoose, { Schema, Document } from 'mongoose';
import { Positions } from '../../models/common';

const positionsSchema = new Schema<Positions>({
    positions: { type: String, required: true },
 
  });

export default mongoose.model<Positions>('Positions', positionsSchema);