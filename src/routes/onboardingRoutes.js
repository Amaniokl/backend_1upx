// src/routes/userDetailsRoutes.js
import express from 'express';
import {
  createOrUpdateUserDetails,
  getUserDetails,
//   deleteUserDetails,
//   getAllUserDetails
} from '../controllers/userDetailsController.js';

const router = express.Router();

// Get user details by ID
router.get('/:user_id', getUserDetails);

// Create or update user details
router.post('/', createOrUpdateUserDetails);

// // Delete user details
// router.delete('/:userId', deleteUserDetails);

// // Get all user details
// router.get('/', getAllUserDetails);

export default router;
