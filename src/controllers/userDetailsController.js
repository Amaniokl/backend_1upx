// src/controllers/userDetailsController.js
import { UserDetails } from '../models/userDetails.js';

/**
 * Create a new user details record or update if exists
 */
export const createOrUpdateUserDetails = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    
    // Check if body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Request body is empty' });
    }
    
    const { 
      user_id, 
      isCompany, 
      companyName, 
      linkedIn, 
      website, 
      twitter, 
      name, 
      portfolio 
    } = req.body;
    
    // Validate required fields
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }
    
    console.log('Looking for existing user details with ID:', user_id);
    
    // Check if user details already exist
    const existingDetails = await UserDetails.findByUserId(user_id);
    
    console.log('Existing details:', existingDetails);
    
    let result;
    
    if (existingDetails) {
      // Update existing record
      console.log('Updating existing record');
      result = await UserDetails.update(user_id, {
        isCompany,
        companyName,
        linkedIn,
        website,
        twitter,
        name,
        portfolio
      });
      
      res.status(200).json({ 
        message: 'User details updated successfully', 
        data: result 
      });
    } else {
      // Create new record
      console.log('Creating new record');
      result = await UserDetails.create({
        user_id,
        isCompany,
        companyName,
        linkedIn,
        website,
        twitter,
        name,
        portfolio
      });
      
      res.status(201).json({ 
        message: 'User details created successfully', 
        data: result 
      });
    }
  } catch (error) {
    console.error('Error in createOrUpdateUserDetails:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

// Rest of the controller remains the same...
// javascript


/**
 * Get user details by user_id
 */
export const getUserDetails = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }
    
    console.log('Fetching user details for ID:', user_id);
    
    const userDetails = await UserDetails.findByUserId(user_id);
    
    if (!userDetails) {
      return res.status(404).json({ error: 'User details not found' });
    }
    
    res.status(200).json({ 
      message: 'User details retrieved successfully', 
      data: userDetails 
    });
    
  } catch (error) {
    console.error('Error in getUserDetails:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};