// src/config/database.js
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { createUserDetailsTable } from '../models/userDetails.js';
import { createFieldsTable } from '../models/fieldsModel.js';
import { createUserFieldsTable } from '../models/userFields.js';
dotenv.config();

// Create a new Pool instance
const pool = new Pool({
  connectionString: process.env.POSTGRES_DB_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const connectToDatabase = async () => {
  try {
    // Test the connection
    const client = await pool.connect();
    console.log('✅ PostgreSQL connected');
    client.release(); // Release the client back to the pool
    
    // Initialize tables
    await createUserDetailsTable();
    await createFieldsTable()
    await createUserFieldsTable()
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err);
    process.exit(1);
  }
};

// Export the pool to be used in other parts of the application
export const db = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};
