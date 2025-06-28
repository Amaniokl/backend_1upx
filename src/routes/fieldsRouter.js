import express from 'express';
import { getAllFields, createField, updateField, deleteField } from '../controllers/fieldsController.js';

const router = express.Router();

router.get('/', getAllFields);
router.post('/', createField);
router.put('/:id', updateField);
router.delete('/:id', deleteField);

export default router;
