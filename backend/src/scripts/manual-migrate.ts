import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const connectionString = process.env.DATABASE_URL!;

async function migrate() {
  console.log('Running manual schema updates...');

  try {
    const sql = neon(connectionString);
    
    // Add discount_type enum if it doesn't exist
    await sql`
      DO $$ BEGIN
        CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    // Alter offers table
    console.log('Updating offers table...');
    await sql`ALTER TABLE offers ADD COLUMN IF NOT EXISTS discount_type discount_type DEFAULT 'percentage'`;
    await sql`ALTER TABLE offers ADD COLUMN IF NOT EXISTS discount_value DECIMAL(10, 2) NOT NULL DEFAULT 0`;
    await sql`ALTER TABLE offers ADD COLUMN IF NOT EXISTS min_stay INTEGER DEFAULT 1`;
    await sql`ALTER TABLE offers ADD COLUMN IF NOT EXISTS applicable_room_types JSONB DEFAULT '[]'`;
    await sql`ALTER TABLE offers ADD COLUMN IF NOT EXISTS max_uses INTEGER`;
    await sql`ALTER TABLE offers ADD COLUMN IF NOT EXISTS current_uses INTEGER DEFAULT 0`;
    
    // Drop old discount_percentage if it exists
    await sql`ALTER TABLE offers DROP COLUMN IF EXISTS discount_percentage`;

    // Alter bookings table
    console.log('Updating bookings table...');
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0`;
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS applied_offers JSONB DEFAULT '[]'`;

    console.log('Manual schema updates completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Failed to run schema updates:');
    console.error(error);
    process.exit(1);
  }
}

migrate();
