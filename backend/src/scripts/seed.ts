import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { Transaction } from '../models/Transaction';
import { User } from '../models/User';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const seedDatabase = async (force: boolean = false): Promise<void> => {
  try {
    const rawData = fs.readFileSync(path.resolve(__dirname, '../data/transactions.json'), 'utf-8');
    const transactionsData = JSON.parse(rawData);

    // 1. Seed Demo User
    const existingUser = await User.findOne({ email: 'admin@crackit.com' });
    if (!existingUser) {
      await User.create({
        name: 'Financial Analyst',
        email: 'admin@crackit.com',
        password: 'password123',
        role: 'Senior Financial Analyst',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      });
      console.log('[Seed] Default user created: admin@crackit.com / password123');
    } else {
      console.log('[Seed] Default user already exists: admin@crackit.com');
    }

    // 2. Seed Transactions
    const count = await Transaction.countDocuments();
    if (count === 0 || force) {
      if (force) {
        await Transaction.deleteMany({});
        console.log('[Seed] Existing transactions cleared');
      }

      const formatted = transactionsData.map((item: any) => ({
        id: item.id,
        date: new Date(item.date),
        amount: Number(item.amount),
        category: item.category,
        status: item.status,
        user_id: item.user_id,
        user_profile: item.user_profile
      }));

      await Transaction.insertMany(formatted);
      console.log(`[Seed] Successfully seeded ${formatted.length} transactions into MongoDB!`);
    } else {
      console.log(`[Seed] Database already contains ${count} transactions. Skipping transaction seed.`);
    }
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    throw error;
  }
};

// If run directly from CLI
if (require.main === module) {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/financial_analytics_db';
  mongoose
    .connect(uri)
    .then(async () => {
      console.log('[Seed CLI] Connected to MongoDB');
      await seedDatabase(true);
      await mongoose.disconnect();
      console.log('[Seed CLI] Seeding completed, disconnected.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed CLI] Failed:', err);
      process.exit(1);
    });
}
