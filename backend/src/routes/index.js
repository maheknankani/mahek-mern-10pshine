import express from 'express';
import authRoutes from './auth.js';
import noteRoutes from './notes.js';

const router = express.Router();


router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});


router.use('/auth', authRoutes);
router.use('/notes', noteRoutes);

export default router;

