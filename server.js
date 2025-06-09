import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import z from 'zod';
import { sendEmail } from './services/mailService.js';
import { Webhook } from 'svix';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware - CORS
app.use(cors());

// ❗ DO NOT apply express.json() before the Clerk webhook route


// ✅ Clerk Webhook Handler - MUST be before express.json()
app.post('/clerk/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const payload = req.body;
  const headers = req.headers;

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

  let evt;
  try {
    evt = wh.verify(payload, headers);
  } catch (err) {
    console.error('❌ Webhook verification failed:', err);
    return res.status(400).send('Invalid signature');
  }

  const { type, data } = evt;

  if (type === 'user.created') {
    console.log('📩 Webhook received:', type);

    const email = data.email_addresses?.[0]?.email_address;
    const name = data.first_name || '';

    const html = `
      <div style="font-family: sans-serif;">
        <h1>Hey ${name || 'there'}, welcome to 1upX 👋</h1>
        <p>We’re thrilled to have you on board.</p>
        <p>Explore, create, and elevate your game with AI ✨</p>
        <br />
        <p>– The 1upX Team</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: '🎉 Welcome to 1upX!',
      html,
    });
  }

  return res.status(200).json({ received: true });
});

// ✅ NOW apply global JSON parser (after webhook)
app.use(express.json());

// ✅ Sample GET route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is up' });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
