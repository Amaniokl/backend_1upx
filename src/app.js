// src/app.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectToDatabase } from './config/database.js';
import indexRoutes from './routes/index.js';
import webhookRoutes from './routes/webhookRoutes.js';
import userDetailsRoutes from './routes/onboardingRoutes.js';
import fields from './routes/fieldsRouter.js'
import userFieldRoutes from './routes/userFieldsRouter.js';
// Initialize express app
const app = express();

// Connect to database
connectToDatabase();

// ✅ Middleware - CORS
app.use(cors());

// Routes that need raw body (webhooks)
// app.use('/clerk/webhook', bodyParser.raw({ type: 'application/json' }));

// ✅ Apply JSON parser for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Regular routes
app.use('/ping', indexRoutes);
app.use('/api/user-details', userDetailsRoutes);
app.use('/api/fields', fields)
app.use('/api/user-fields', userFieldRoutes);
// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
