import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import z from 'zod'
import { sendEmail } from './services/mailService.js';
import { Webhook } from 'svix';
import bodyParser from 'body-parser';
// import SibApiV3Sdk from 'sib-api-v3-sdk';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
console.log(process.env.PORT);
console.log(process.env.MONGODB_URL);
// Middleware
app.use(cors());
// app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Mongoose Schema & Model
const signUpSchema = new mongoose.Schema({
  name: String,
  email: String,
  expertise: String,
  experience: String,
  linkedin: String,
  excitement: String,
}, { timestamps: true });

const SignUp = mongoose.model('SignUp', signUpSchema);

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  linkedin: z.string().url('Invalid LinkedIn URL').optional,
});

// Routes
// app.post('/api/signup', async (req, res) => {
//   try {
//     const formData = req.body;

//     const newEntry = new SignUp(formData);
//     await newEntry.save();

//     const emailHtml = `
//       <h2>Welcome, ${formData.name} 👋</h2>
//       <p>Thanks for signing up for 1upX!</p>
//       <p>We're excited to have you join us on this journey 🚀</p>
//     `;
//     // console.log(formData.email);
//     // console.log("sdfsdfsadfafas");

//     const emailResult = await sendEmail({
//       to: formData.email,
//       subject: 'Welcome to 1upX!',
//       html: emailHtml
//     });

//     if (!emailResult.success) {
//       return res.status(500).json({ error: 'User saved, but email sending failed.' });
//     }

//     res.status(200).json({ message: 'Signup successful and email sent.' });
//   } catch (err) {
//     console.error('Signup error:', err.errors || err.message);
//     if (err instanceof z.ZodError) {
//       return res.status(400).json({ error: err.errors });
//     }
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

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

app.get('/', async (req, res) => {
  // try{
  res.status(200).json({ message: "Server is up" })
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
