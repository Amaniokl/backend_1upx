import { db } from '../config/database.js';

// Function to create the table if it doesn't exist
export const createFieldsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS "Fields" (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      svg_path TEXT NOT NULL,
      gradient VARCHAR(255) NOT NULL,
      bg_gradient VARCHAR(255) NOT NULL,
      shadow_color VARCHAR(255) NOT NULL,
      category VARCHAR(255),
      display_order INTEGER,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    await db.query(createTableQuery);
    console.log('✅ Fields table created or already exists');
  } catch (error) {
    console.error('❌ Error creating Fields table:', error);
    throw error;
  }
};

export const Fields = {
  // Create a new field
  create: async (fieldData) => {
    const { 
      name, 
      svgPath, 
      gradient, 
      bgGradient, 
      shadowColor,
      category,
      displayOrder 
    } = fieldData;
    
    const query = `
      INSERT INTO "Fields" (
        name,
        svg_path,
        gradient,
        bg_gradient,
        shadow_color,
        category,
        display_order
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    
    const values = [
      name,
      svgPath,
      gradient,
      bgGradient,
      shadowColor,
      category,
      displayOrder
    ];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error creating field record:', error);
      throw error;
    }
  },
  
  // Get all fields
  findAll: async () => {
    const query = 'SELECT * FROM "Fields" ORDER BY display_order, name;';
    
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('❌ Error finding fields:', error);
      throw error;
    }
  },
  
  // Find field by ID
  findById: async (id) => {
    const query = 'SELECT * FROM "Fields" WHERE id = $1;';
    
    try {
      const result = await db.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('❌ Error finding field by ID:', error);
      throw error;
    }
  },
  
  // Update field
  update: async (id, updateData) => {
    const fieldToColumnMap = {
      name: 'name',
      svgPath: 'svg_path',
      gradient: 'gradient',
      bgGradient: 'bg_gradient',
      shadowColor: 'shadow_color',
      category: 'category',
      displayOrder: 'display_order'
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
  
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);
  
    const query = `
      UPDATE "Fields"
      SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING *;
    `;
  
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error updating field record:', error);
      throw error;
    }
  },
  
  // Delete field
  delete: async (id) => {
    const query = 'DELETE FROM "Fields" WHERE id = $1 RETURNING *;';
    
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error deleting field record:', error);
      throw error;
    }
  }
};
