import express from 'express';

const router = express.Router();

// ✅ Sample GET route
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is up' });
});

// Protected routes example
router.get('/protected', (req, res) => {
  res.status(200).json({ message: 'This is a protected route' });
});

export default router;
