// src/models/userDetails.js
import { db } from '../config/database.js';

// Function to create the table if it doesn't exist
export const createUserDetailsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS "UserDetails" (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL UNIQUE,
      is_company BOOLEAN,
      company_name VARCHAR(255),
      linkedin VARCHAR(255),
      website VARCHAR(255),
      twitter VARCHAR(255),
      name VARCHAR(255),
      portfolio VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    await db.query(createTableQuery);
    console.log('✅ UserDetails table created or already exists');
  } catch (error) {
    console.error('❌ Error creating UserDetails table:', error);
    throw error;
  }
};

// Update all queries to use the correct table name with quotes
export const UserDetails = {
  // Create a new user details record
  create: async (userData) => {
    const { 
      user_id, 
      isCompany, 
      companyName, 
      linkedIn, 
      website, 
      twitter, 
      name, 
      portfolio 
    } = userData;
    
    const query = `
      INSERT INTO "UserDetails" (
        user_id, 
        is_company, 
        company_name, 
        linkedin, 
        website, 
        twitter, 
        name, 
        portfolio
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    
    const values = [
      user_id, 
      isCompany, 
      companyName, 
      linkedIn, 
      website, 
      twitter, 
      name, 
      portfolio
    ];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error creating user details record:', error);
      throw error;
    }
  },
  
  // Find user details record by user_id
  findByUserId: async (userId) => {
    const query = 'SELECT * FROM "UserDetails" WHERE user_id = $1;';
    
    try {
      const result = await db.query(query, [userId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('❌ Error finding user details record:', error);
      throw error;
    }
  },
  
  // Update user details record
  update: async (userId, updateData) => {
    // Mapping from JS field names to DB column names
    const fieldToColumnMap = {
      isCompany: 'is_company',
      companyName: 'company_name',
      linkedIn: 'linkedin', // <-- This is the fix!
      website: 'website',
      twitter: 'twitter',
      name: 'name',
      portfolio: 'portfolio'
    };
  
    const updates = [];
    const values = [];
    let paramCounter = 1;
  
    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        const columnName = fieldToColumnMap[key] || key;
        updates.push(`${columnName} = $${paramCounter}`);
        values.push(value);
        paramCounter++;
      }
    }
  
    // Always update the updated_at timestamp
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
  
    // Add the user_id as the last parameter
    values.push(userId);
  
    const query = `
      UPDATE "UserDetails"
      SET ${updates.join(', ')}
      WHERE user_id = $${paramCounter}
      RETURNING *;
    `;
  
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error updating user details record:', error);
      throw error;
    }
  },
  
  // Delete user details record
  delete: async (userId) => {
    const query = 'DELETE FROM "UserDetails" WHERE user_id = $1 RETURNING *;';
    
    try {
      const result = await db.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error deleting user details record:', error);
      throw error;
    }
  },
  
  // List all user details records
  findAll: async () => {
    const query = 'SELECT * FROM "UserDetails" ORDER BY created_at DESC;';
    
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('❌ Error listing user details records:', error);
      throw error;
    }
  }
};
