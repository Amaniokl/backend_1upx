import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import z from 'zod'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
console.log(process.env.PORT);
console.log(process.env.MONGODB_URL);
// Middleware
app.use(cors());
app.use(express.json());

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
}, {timestamps: true});

const SignUp = mongoose.model('SignUp', signUpSchema);

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  linkedin: z.string().url('Invalid LinkedIn URL').optional,
});

// Routes
app.post('/api/signup', async (req, res) => {
  try {
    const formData = signupSchema.parse(req.body);
    
    const newEntry = new SignUp(formData);
    await newEntry.save();

    res.status(200).json({ message: 'Form submitted and saved successfully' });
  } catch (err) {
    console.error('Error saving form data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', async(req, res)=>{
  // try{
    res.status(200).json({message:"Server is up"})
  
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
