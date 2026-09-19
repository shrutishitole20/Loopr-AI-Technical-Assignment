import { Schema, model, Document } from 'mongoose';

export interface ITransaction extends Document {
  id: number;
  date: Date;
  amount: number;
  category: string;
  status: string;
  user_id: string;
  user_profile: string;
}

const transactionSchema = new Schema<ITransaction>(
  {
    id: { type: Number, required: true, unique: true },
    date: { type: Date, required: true, index: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true, index: true },
    status: { type: String, required: true, index: true },
    user_id: { type: String, required: true, index: true },
    user_profile: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

// Compound indexes for optimized filtering, sorting & aggregation queries
transactionSchema.index({ category: 1, status: 1, date: -1 });
transactionSchema.index({ date: -1, amount: 1 });
transactionSchema.index({ user_id: 1, date: -1 });

export const Transaction = model<ITransaction>('Transaction', transactionSchema);

