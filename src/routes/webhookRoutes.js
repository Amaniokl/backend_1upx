import express from 'express';
import bodyParser from 'body-parser';
import { handleClerkWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// ✅ Clerk Webhook Handler - using raw body parser
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), handleClerkWebhook);

export default router;
