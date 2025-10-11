import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'E-Summit 2025 API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

// TODO: Add more routes
// router.use('/passes', passRoutes);
// router.use('/events', eventRoutes);
// router.use('/admin', adminRoutes);

export default router;
