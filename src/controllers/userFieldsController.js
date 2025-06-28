// src/controllers/userFieldController.js
import { UserField } from '../models/userFields.js';
import { Fields } from '../models/fieldsModel.js';
import { db } from '../config/database.js';
/**
 * Save selected fields for a user
 */
export const saveUserFields = async (req, res) => {
  try {
    const { user_id, fieldNames } = req.body;
    
    if (!user_id || !fieldNames || !Array.isArray(fieldNames)) {
      return res.status(400).json({ 
        error: 'Invalid request body',
        required: { user_id: 'string', fieldNames: 'array of strings' }
      });
    }
    
    // First, delete any existing field associations for this user
    await UserField.deleteAllForUser(user_id);
    
    // Get field IDs from field names
    const fieldPromises = fieldNames.map(async (name) => {
      const query = 'SELECT id FROM "Fields" WHERE name = $1;';
      const result = await db.query(query, [name]);
      return result.rows[0]?.id;
    });
    
    const fieldIds = (await Promise.all(fieldPromises)).filter(id => id);
    
    if (fieldIds.length === 0) {
      return res.status(404).json({ error: 'No valid fields found' });
    }
    
    // Create new associations
    const results = await UserField.createMany(user_id, fieldIds);
    
    res.status(201).json({ 
      message: 'User fields saved successfully', 
      data: {
        user_id,
        fieldCount: results.length,
        fields: fieldNames
      }
    });
  } catch (error) {
    console.error('Error in saveUserFields:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

/**
 * Get fields for a user
 */
export const getUserFields = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }
    
    const fields = await UserField.findByUserId(user_id);
    
    res.status(200).json({ 
      message: 'User fields retrieved successfully', 
      data: fields
    });
  } catch (error) {
    console.error('Error in getUserFields:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

/**
 * Delete a field for a user
 */
export const deleteUserField = async (req, res) => {
  try {
    const { user_id, field_id } = req.params;
    
    if (!user_id || !field_id) {
      return res.status(400).json({ error: 'user_id and field_id are required' });
    }
    
    const result = await UserField.delete(user_id, parseInt(field_id));
    
    if (!result) {
      return res.status(404).json({ error: 'User field association not found' });
    }
    
    res.status(200).json({ 
      message: 'User field deleted successfully', 
      data: result
    });
  } catch (error) {
    console.error('Error in deleteUserField:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};
