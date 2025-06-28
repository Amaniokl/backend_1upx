// src/routes/userFieldRoutes.js
import express from 'express';
import { saveUserFields, getUserFields, deleteUserField } from '../controllers/userFieldsController.js';

const router = express.Router();

router.post('/', saveUserFields);
router.get('/:user_id', getUserFields);
router.delete('/:user_id/:field_id', deleteUserField);

export default router;
