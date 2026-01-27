import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/response.util';
import logger from '../utils/logger.util';
import { generateUniqueIdentifiers } from '../utils/identifier.util';
import { paymentLimiter } from '../middleware/rateLimit.middleware';
import { konfhubService } from '../services/konfhub.service';
import { createClerkClient } from '@clerk/backend';

const router = Router();
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

/**
 * Helper function to ensure user exists in database
 */
async function ensureUserExists(clerkUserId: string) {
  let user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    try {
      logger.info('User not found in DB, fetching from Clerk:', clerkUserId);
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      
      const userEmail = clerkUser.emailAddresses?.[0]?.emailAddress;
      
      if (!userEmail) {
        throw new Error('No email address found for Clerk user');
      }
      
      // Check if a user with this email already exists
      const existingUserByEmail = await prisma.user.findUnique({
        where: { email: userEmail },
      });
      
      if (existingUserByEmail) {
        // Update the existing user with Clerk ID
        user = await prisma.user.update({
          where: { email: userEmail },
          data: {
            clerkUserId: clerkUser.id,
            fullName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
            firstName: clerkUser.firstName || existingUserByEmail.firstName,
            lastName: clerkUser.lastName || existingUserByEmail.lastName,
            imageUrl: clerkUser.imageUrl || existingUserByEmail.imageUrl,
          },
        });
        logger.info(`User updated with new clerkUserId: ${userEmail}`);
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            clerkUserId: clerkUser.id,
            email: userEmail,
            fullName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
            firstName: clerkUser.firstName || null,
            lastName: clerkUser.lastName || null,
            imageUrl: clerkUser.imageUrl || null,
          },
        });
        logger.info(`New user synced from Clerk: ${userEmail}`);
      }
    } catch (error: any) {
      logger.error('Error ensuring user exists:', error);
      throw new Error('Failed to sync user from Clerk');
    }
  }

  return user;
}

// Apply payment rate limiter to all payment routes
router.use(paymentLimiter);

/**
 * Create KonfHub Order for Pass Purchase
 * POST /api/v1/payment/create-order
 */
router.post('/create-order', async (req: Request, res: Response) => {
  try {
    const {
      clerkUserId,
      passType,
      price,
    } = req.body;

    // Validate required fields
    if (!clerkUserId || !passType || !price) {
      sendError(res, 'clerkUserId, passType, and price are required', 400);
      return;
    }

    // Validate price is positive
    if (price <= 0) {
      sendError(res, 'Invalid price amount', 400);
      return;
    }

    // Find user by Clerk ID (ensure user exists)
    const user = await ensureUserExists(clerkUserId);

    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    // Check if user already has a pass (ONE PASS PER USER LIMIT)
    const existingPass = await prisma.pass.findFirst({
      where: { userId: user.id },
    });

    if (existingPass) {
      sendError(
        res,
        'You already have a pass. Only one pass per user is allowed.',
        400
      );
      return;
    }

    // Generate unique identifiers
    const { invoiceNumber, transactionNumber } = generateUniqueIdentifiers();

    // Create KonfHub order
    const konfhubOrder = await konfhubService.createOrder({
      quantity: 1,
      customerInfo: {
        name: user.fullName || 'Guest',
        email: user.email || '',
        phone: user.phone || undefined,
      },
      metadata: {
        clerkUserId,
        passType,
        invoiceNumber,
        transactionNumber,
      },
    });

    logger.info(`KonfHub order created: ${konfhubOrder.orderId} for user: ${clerkUserId}`);
    logger.info(`Invoice: ${invoiceNumber}, Transaction: ${transactionNumber}`);

    sendSuccess(
      res,
      'Order created successfully',
      {
        orderId: konfhubOrder.orderId,
        ticketId: konfhubOrder.ticketId,
        amount: price,
        currency: konfhubOrder.currency,
        invoiceNumber,
        transactionNumber,
        checkoutUrl: konfhubOrder.checkoutUrl,
        paymentUrl: konfhubOrder.paymentUrl,
      },
      201
    );
  } catch (error: any) {
    logger.error('Create KonfHub order error:', error);
    sendError(res, error.message || 'Failed to create order', 500);
  }
});

/**
 * Verify Payment and Create Pass
 * POST /api/v1/payment/verify-and-create-pass
 */
router.post('/verify-and-create-pass', async (req: Request, res: Response) => {
  try {
    const {
      orderId,
      ticketId,
    } = req.body;

    // Validate required fields
    if (!orderId) {
      sendError(res, 'Order ID is required', 400);
      return;
    }

    // Verify order status with KonfHub
    const konfhubOrder = await konfhubService.getOrder(orderId);

    if (konfhubOrder.status !== 'completed') {
      logger.error('Payment not completed in KonfHub');
      sendError(res, 'Payment verification failed - payment not completed', 400);
      return;
    }

    // Get user and pass details from KonfHub order metadata
    const metadata = konfhubOrder.metadata as any;
    const clerkUserId = metadata.clerkUserId;
    const passType = metadata.passType;

    if (!clerkUserId || !passType) {
      sendError(res, 'Order metadata missing required information', 400);
      return;
    }

    // Ensure user exists
    const user = await ensureUserExists(clerkUserId);

    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    // Check if user already has a pass
    const existingPass = await prisma.pass.findFirst({
      where: { userId: user.id },
    });

    if (existingPass) {
      sendError(res, 'You already have a pass.', 400);
      return;
    }

    // Generate unique pass ID
    const { passId } = generateUniqueIdentifiers();

    // Create pass
    const pass = await prisma.pass.create({
      data: {
        userId: user.id,
        passType,
        passId,
        konfhubOrderId: orderId,
        konfhubTicketId: ticketId,
        konfhubData: konfhubOrder as any,
        price: konfhubOrder.amount,
        status: 'Active',
      },
    });

    logger.info(`✅ Payment verified and pass created: ${passId} for user: ${user.email}`);

    sendSuccess(
      res,
      'Payment verified and pass created successfully',
      {
        pass,
      },
      201
    );
  } catch (error: any) {
    logger.error('Payment verification error:', error);
    sendError(res, error.message || 'Failed to verify payment', 500);
  }
});

/**
 * Handle Payment Failure
 * POST /api/v1/payment/payment-failed
 */
router.post('/payment-failed', async (req: Request, res: Response) => {
  try {
    const { orderId, error } = req.body;

    if (!orderId) {
      sendError(res, 'Order ID is required', 400);
      return;
    }

    logger.warn(`Payment failed for order: ${orderId} - ${error || 'Payment cancelled by user'}`);

    sendSuccess(res, 'Payment failure recorded');
  } catch (error: any) {
    logger.error('Payment failure handler error:', error);
    sendError(res, error.message || 'Failed to record payment failure', 500);
  }
});

/**
 * KonfHub Webhook Handler
 * POST /api/v1/payment/webhook
 */
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-konfhub-signature'] as string;
    const payload = JSON.stringify(req.body);

    // Verify webhook signature
    const isValid = konfhubService.verifyWebhookSignature(payload, signature);

    if (!isValid) {
      logger.error('Invalid KonfHub webhook signature');
      sendError(res, 'Invalid signature', 401);
      return;
    }

    const webhookData = req.body;
    const { event, orderId, ticketId } = webhookData;

    logger.info(`KonfHub webhook received: ${event} for order: ${orderId}`);

    // Get order details from KonfHub
    const konfhubOrder = await konfhubService.getOrder(orderId);
    const metadata = konfhubOrder.metadata as any;
    const clerkUserId = metadata.clerkUserId;

    if (!clerkUserId) {
      logger.warn(`No clerkUserId in webhook metadata for order: ${orderId}`);
      sendSuccess(res, 'Webhook received but missing user information');
      return;
    }

    // Ensure user exists
    const user = await ensureUserExists(clerkUserId);

    if (!user) {
      logger.warn(`User not found for webhook: ${clerkUserId}`);
      sendSuccess(res, 'Webhook received but user not found');
      return;
    }

    // Handle different webhook events
    switch (event) {
      case 'order.completed':
        // Check if pass already exists for this order
        const existingPass = await prisma.pass.findFirst({
          where: { konfhubOrderId: orderId },
        });

        if (!existingPass) {
          // Create pass
          const passType = metadata.passType;
          const { passId } = generateUniqueIdentifiers();

          await prisma.pass.create({
            data: {
              userId: user.id,
              passType,
              passId,
              konfhubOrderId: orderId,
              konfhubTicketId: ticketId,
              konfhubData: konfhubOrder as any,
              price: konfhubOrder.amount,
              hasWorkshopAccess: metadata.hasWorkshopAccess || false,
              status: 'Active',
            },
          });

          logger.info(`✅ Pass auto-created via webhook: ${passId} for order: ${orderId}`);
        } else {
          logger.info(`Pass already exists for order: ${orderId}`);
        }
        break;

      case 'order.cancelled':
        logger.info(`Order cancelled via webhook: ${orderId}`);
        break;

      default:
        logger.warn(`Unhandled webhook event: ${event}`);
    }

    sendSuccess(res, 'Webhook processed successfully');
  } catch (error: any) {
    logger.error('Webhook processing error:', error);
    sendError(res, error.message || 'Failed to process webhook', 500);
  }
});

export default router;
