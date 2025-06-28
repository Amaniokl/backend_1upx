import { db } from '../config/database.js';

// Function to create the table if it doesn't exist
export const createUserFieldsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS "UserFields" (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      field_id INTEGER NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES "UserDetails" (user_id) ON DELETE CASCADE,
      FOREIGN KEY (field_id) REFERENCES "Fields" (id) ON DELETE CASCADE,
      UNIQUE (user_id, field_id)
    );
  `;
  
  try {
    await db.query(createTableQuery);
    console.log('✅ UserFields table created or already exists');
  } catch (error) {
    console.error('❌ Error creating UserFields table:', error);
    throw error;
  }
};

export const UserField = {
  // Create a new user field association
  create: async (userId, fieldId) => {
    const query = `
      INSERT INTO "UserFields" (user_id, field_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    
    try {
      const result = await db.query(query, [userId, fieldId]);
      return result.rows[0];
    } catch (error) {
      // If error is duplicate key, just return the existing record
      if (error.code === '23505') { // Unique violation
        const existingQuery = `
          SELECT * FROM "UserFields" 
          WHERE user_id = $1 AND field_id = $2;
        `;
        const existing = await db.query(existingQuery, [userId, fieldId]);
        return existing.rows[0];
      }
      console.error('❌ Error creating user field association:', error);
      throw error;
    }
  },
  
  // Create multiple user field associations at once
  // Update the createMany method in userFields.js
createMany: async (userId, fieldIds) => {
    // Start a transaction
    const client = await db.getClient(); // Use getClient instead of connect
    
    try {
      await client.query('BEGIN');
      
      const results = [];
      
      for (const fieldId of fieldIds) {
        const query = `
          INSERT INTO "UserFields" (user_id, field_id)
          VALUES ($1, $2)
          ON CONFLICT (user_id, field_id) DO NOTHING
          RETURNING *;
        `;
        
        const result = await client.query(query, [userId, fieldId]);
        if (result.rows[0]) {
          results.push(result.rows[0]);
        }
      }
      
      await client.query('COMMIT');
      return results;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error creating multiple user field associations:', error);
      throw error;
    } finally {
      client.release();
    }
  },
  
  // Get all fields for a user
  findByUserId: async (userId) => {
    const query = `
      SELECT f.* 
      FROM "Fields" f
      JOIN "UserFields" uf ON f.id = uf.field_id
      WHERE uf.user_id = $1
      ORDER BY f.display_order, f.name;
    `;
    
    try {
      const result = await db.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('❌ Error finding fields for user:', error);
      throw error;
    }
  },
  
  // Get all users for a field
  findByFieldId: async (fieldId) => {
    const query = `
      SELECT ud.* 
      FROM "UserDetails" ud
      JOIN "UserFields" uf ON ud.user_id = uf.user_id
      WHERE uf.field_id = $1;
    `;
    
    try {
      const result = await db.query(query, [fieldId]);
      return result.rows;
    } catch (error) {
      console.error('❌ Error finding users for field:', error);
      throw error;
    }
  },
  
  // Delete a user field association
  delete: async (userId, fieldId) => {
    const query = `
      DELETE FROM "UserFields" 
      WHERE user_id = $1 AND field_id = $2
      RETURNING *;
    `;
    
    try {
      const result = await db.query(query, [userId, fieldId]);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error deleting user field association:', error);
      throw error;
    }
  },
  
  // Delete all fields for a user
  deleteAllForUser: async (userId) => {
    const query = `
      DELETE FROM "UserFields" 
      WHERE user_id = $1
      RETURNING *;
    `;
    
    try {
      const result = await db.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('❌ Error deleting all fields for user:', error);
      throw error;
    }
  },
  
  // Check if a user has a specific field
  hasField: async (userId, fieldId) => {
    const query = `
      SELECT EXISTS(
        SELECT 1 FROM "UserFields" 
        WHERE user_id = $1 AND field_id = $2
      );
    `;
    
    try {
      const result = await db.query(query, [userId, fieldId]);
      return result.rows[0].exists;
    } catch (error) {
      console.error('❌ Error checking if user has field:', error);
      throw error;
    }
  },
  
  // Count how many users have a specific field
  countUsersForField: async (fieldId) => {
    const query = `
      SELECT COUNT(DISTINCT user_id) 
      FROM "UserFields" 
      WHERE field_id = $1;
    `;
    
    try {
      const result = await db.query(query, [fieldId]);
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error('❌ Error counting users for field:', error);
      throw error;
    }
  },
  
  // Count how many fields a user has
  countFieldsForUser: async (userId) => {
    const query = `
      SELECT COUNT(DISTINCT field_id) 
      FROM "UserFields" 
      WHERE user_id = $1;
    `;
    
    try {
      const result = await db.query(query, [userId]);
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error('❌ Error counting fields for user:', error);
      throw error;
    }
  }
};
