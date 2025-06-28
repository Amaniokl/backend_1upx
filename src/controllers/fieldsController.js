import { Fields } from '../models/fieldsModel.js';

/**
 * Get all fields
 */
export const getAllFields = async (req, res) => {
  try {
    const fields = await Fields.findAll();
    
    res.status(200).json({ 
      message: 'Fields retrieved successfully', 
      data: fields 
    });
  } catch (error) {
    console.error('Error in getAllFields:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

/**
 * Create a new field
 */
export const createField = async (req, res) => {
  try {
    const { 
      name, 
      svgPath, 
      gradient, 
      bgGradient, 
      shadowColor,
      category,
      displayOrder 
    } = req.body;
    
    // Validate required fields
    if (!name || !svgPath || !gradient || !bgGradient || !shadowColor) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'svgPath', 'gradient', 'bgGradient', 'shadowColor']
      });
    }
    
    const result = await Fields.create({
      name,
      svgPath,
      gradient,
      bgGradient,
      shadowColor,
      category,
      displayOrder
    });
    
    res.status(201).json({ 
      message: 'Field created successfully', 
      data: result 
    });
  } catch (error) {
    console.error('Error in createField:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

/**
 * Update a field
 */
export const updateField = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Field ID is required' });
    }
    
    const field = await Fields.findById(id);
    
    if (!field) {
      return res.status(404).json({ error: 'Field not found' });
    }
    
    const result = await Fields.update(id, req.body);
    
    res.status(200).json({ 
      message: 'Field updated successfully', 
      data: result 
    });
  } catch (error) {
    console.error('Error in updateField:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

/**
 * Delete a field
 */
export const deleteField = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Field ID is required' });
    }
    
    const field = await Fields.findById(id);
    
    if (!field) {
      return res.status(404).json({ error: 'Field not found' });
    }
    
    const result = await Fields.delete(id);
    
    res.status(200).json({ 
      message: 'Field deleted successfully', 
      data: result 
    });
  } catch (error) {
    console.error('Error in deleteField:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};
