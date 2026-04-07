import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const connectionString = process.env.DATABASE_URL!;

async function checkTables() {
  console.log('Checking for tables in Neon PostgreSQL...');

  try {
    const sql = neon(connectionString);
    const result = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Tables found:');
    result.forEach((row: any) => console.log(`- ${row.table_name}`));
    
    if (result.length === 0) {
      console.log('No tables found in public schema.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Failed to list tables:');
    console.error(error);
    process.exit(1);
  }
}

checkTables();
