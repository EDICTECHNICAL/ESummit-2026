import { Router } from 'express';
import passRoutes from './pass.routes';
import passClaimRoutes from './pass-claim.routes';
import eventRoutes from './event.routes';
import webhookRoutes from './webhook.routes';
import tcetRoutes from './tcet.routes';
import adminRoutes from './admin.routes';
import userRoutes from './user.routes';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'E-Summit 2026 API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/passes', passRoutes);
router.use('/pass-claims', passClaimRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/events', eventRoutes);
router.use('/tcet', tcetRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);

export default router;
