import { Router, Request, Response } from 'express';
import { Webhook } from 'svix';
import { prisma } from '../config/database';

const router = Router();

/**
 * Clerk Webhook Handler
 * 
 * SETUP INSTRUCTIONS:
 * 1. Install svix: npm install svix
 * 2. Add CLERK_WEBHOOK_SECRET to backend/.env
 * 3. Configure webhook in Clerk Dashboard: http://localhost:5000/api/v1/webhooks/clerk
 */

router.post('/clerk', async (req: Request, res: Response) => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      return res.status(500).json({ error: 'CLERK_WEBHOOK_SECRET is not set' });
    }

    // Get headers
    const svix_id = req.headers['svix-id'] as string;
    const svix_timestamp = req.headers['svix-timestamp'] as string;
    const svix_signature = req.headers['svix-signature'] as string;

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({ error: 'Missing svix headers' });
    }

    // Verify webhook signature
    const wh = new Webhook(WEBHOOK_SECRET);
    let event: any;

    try {
      event = wh.verify(JSON.stringify(req.body), {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      console.error('Webhook verification failed:', err);
      return res.status(400).json({ error: 'Webhook verification failed' });
    }

    const eventData = event.data as any;

    // Handle user.created event
    if (event.type === 'user.created') {
      console.log('Creating user from Clerk webhook:', eventData.id);

      const fullName = `${eventData.first_name || ''} ${eventData.last_name || ''}`.trim();

      await prisma.user.create({
        data: {
          clerkUserId: eventData.id,
          email: eventData.email_addresses?.[0]?.email_address || '',
          ...(fullName && { fullName }),
          ...(eventData.first_name && { firstName: eventData.first_name }),
          ...(eventData.last_name && { lastName: eventData.last_name }),
          ...(eventData.image_url && { imageUrl: eventData.image_url }),
        },
      });

      console.log('User created successfully:', eventData.id);
    }

    // Handle user.updated event
    if (event.type === 'user.updated') {
      console.log('Updating user from Clerk webhook:', eventData.id);

      const fullName = `${eventData.first_name || ''} ${eventData.last_name || ''}`.trim();

      await prisma.user.updateMany({
        where: { 
          clerkUserId: eventData.id 
        } as any,
        data: {
          email: eventData.email_addresses?.[0]?.email_address || '',
          ...(fullName && { fullName }),
          ...(eventData.first_name && { firstName: eventData.first_name }),
          ...(eventData.last_name && { lastName: eventData.last_name }),
          ...(eventData.image_url && { imageUrl: eventData.image_url }),
        },
      });

      console.log('User updated successfully:', eventData.id);
    }

    // Handle user.deleted event
    if (event.type === 'user.deleted') {
      console.log('Deleting user from Clerk webhook:', eventData.id);

      await prisma.user.deleteMany({
        where: { 
          clerkUserId: eventData.id 
        } as any,
      });

      console.log('User deleted successfully:', eventData.id);
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
