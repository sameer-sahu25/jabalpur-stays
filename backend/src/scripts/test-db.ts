import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const connectionString = process.env.DATABASE_URL!;

async function testConnection() {
  console.log('Testing connection to Neon PostgreSQL...');
  console.log('Connection String:', connectionString.replace(/:[^@:]*@/, ':****@')); // Hide password

  try {
    const sql = neon(connectionString);
    const result = await sql`SELECT NOW() as current_time, current_database() as database_name`;
    console.log('Connection successful!');
    console.log('Current database time:', result[0].current_time);
    console.log('Connected to database:', result[0].database_name);
    process.exit(0);
  } catch (error) {
    console.error('Connection failed:');
    console.error(error);
    process.exit(1);
  }
}

testConnection();
