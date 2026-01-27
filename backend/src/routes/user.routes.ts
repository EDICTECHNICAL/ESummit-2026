import { Router } from 'express';
import { Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/response.util';
import logger from '../utils/logger.util';
import { createClerkClient } from '@clerk/backend';

const router = Router();

// Initialize Clerk client
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
        logger.info('Updated existing user with Clerk data:', clerkUserId);
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
        logger.info('User created from Clerk data:', clerkUserId);
      }
    } catch (clerkError) {
      logger.error('Failed to fetch/create user from Clerk:', clerkError);
      throw new Error('User not found and could not be created');
    }
  }

  return user;
}

/**
 * Sync/create user from Clerk (fallback if webhook didn't fire)
 * POST /api/v1/users/sync
 */
router.post('/sync', async (req: Request, res: Response) => {
  try {
    const {
      clerkUserId,
      email,
      fullName,
      firstName,
      lastName,
      imageUrl,
    } = req.body;

    // Validate required fields
    if (!clerkUserId || !email) {
      sendError(res, 'clerkUserId and email are required', 400);
      return;
    }

    // Check if user already exists by clerkUserId
    let user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (user) {
      logger.info(`User already exists: ${email}`);
      sendSuccess(res, 'User already exists', { user }, 200);
      return;
    }

    // Check if user exists by email (in case clerk_user_id was updated)
    user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // User exists with different clerkUserId - update it
      user = await prisma.user.update({
        where: { email },
        data: {
          clerkUserId,
          fullName: fullName || user.fullName,
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          imageUrl: imageUrl || user.imageUrl,
        },
      });
      logger.info(`User updated with new clerkUserId: ${email}`);
      sendSuccess(res, 'User updated successfully', { user }, 200);
      return;
    }

    // Create new user
    user = await prisma.user.create({
      data: {
        clerkUserId,
        email,
        fullName: fullName || null,
        firstName: firstName || null,
        lastName: lastName || null,
        imageUrl: imageUrl || null,
      },
    });

    logger.info(`New user synced from Clerk: ${email}`);
    sendSuccess(res, 'User created successfully', { user }, 201);
  } catch (error: any) {
    // Handle race condition - user might have been created between our checks
    if (error.code === 'P2002') {
      // Unique constraint violation - try to fetch the user one more time
      const existingUser = await prisma.user.findUnique({
        where: { email: req.body.email },
      });
      
      if (existingUser) {
        logger.info(`User found after race condition: ${req.body.email}`);
        sendSuccess(res, 'User already exists', { user: existingUser }, 200);
        return;
      }
    }
    
    logger.error('User sync error:', error);
    sendError(res, error.message || 'Failed to sync user', 500);
  }
});

/**
 * Complete user profile after Clerk signup
 * POST /api/v1/users/complete-profile
 */
router.post('/complete-profile', async (req: Request, res: Response) => {
  try {
    const {
      clerkUserId,
      email,
      fullName,
      firstName,
      lastName,
      imageUrl,
      phone,
      college,
      yearOfStudy,
      rollNumber,
      branch,
    } = req.body;

    // Validate required fields
    if (!clerkUserId || !email) {
      sendError(res, 'clerkUserId and email are required', 400);
      return;
    }

    if (!phone || !college || !yearOfStudy) {
      sendError(res, 'phone, college, and yearOfStudy are required', 400);
      return;
    }

    // For TCET students, branch and rollNumber are also required
    if (college === 'Thakur College of Engineering and Technology' && (!branch || !rollNumber)) {
      sendError(res, 'branch and rollNumber are required for TCET students', 400);
      return;
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { clerkUserId },
        data: {
          phone,
          college,
          yearOfStudy,
          rollNumber: rollNumber || null,
          branch: branch || null,
          // Also update other fields in case they changed
          email,
          fullName: fullName || null,
          firstName: firstName || null,
          lastName: lastName || null,
          imageUrl: imageUrl || null,
        },
      });

      logger.info(`Profile completed for existing user: ${email}`);
    } else {
      // Create new user with complete profile
      user = await prisma.user.create({
        data: {
          clerkUserId,
          email,
          fullName: fullName || null,
          firstName: firstName || null,
          lastName: lastName || null,
          imageUrl: imageUrl || null,
          phone,
          college,
          yearOfStudy,
          rollNumber: rollNumber || null,
          branch: branch || null,
        },
      });

      logger.info(`New user created with complete profile: ${email}`);
    }

    sendSuccess(res, 'Profile completed successfully', { user }, 200);
  } catch (error: any) {
    logger.error('Complete profile error:', error);
    sendError(res, error.message || 'Failed to complete profile', 500);
  }
});

/**
 * Get user profile by Clerk ID
 * GET /api/v1/users/profile/:clerkUserId
 */
router.get('/profile/:clerkUserId', async (req: Request, res: Response) => {
  try {
    const { clerkUserId } = req.params;
    const clerkUserIdStr = Array.isArray(clerkUserId) ? clerkUserId[0] : clerkUserId;

    const user = await ensureUserExists(clerkUserIdStr);

    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    // Select only the fields we want to return
    const userProfile = {
      id: user.id,
      clerkUserId: user.clerkUserId,
      email: user.email,
      fullName: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      phone: user.phone,
      college: user.college,
      yearOfStudy: user.yearOfStudy,
      rollNumber: user.rollNumber,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    sendSuccess(res, 'User profile fetched successfully', { user: userProfile });
  } catch (error: any) {
    logger.error('Get user profile error:', error);
    sendError(res, error.message || 'Failed to fetch user profile', 500);
  }
});

/**
 * Check if user profile is complete
 * GET /api/v1/users/check-profile/:clerkUserId
 */
router.get('/check-profile/:clerkUserId', async (req: Request, res: Response) => {
  try {
    const { clerkUserId } = req.params;
    const clerkUserIdStr = Array.isArray(clerkUserId) ? clerkUserId[0] : clerkUserId;

    const user = await ensureUserExists(clerkUserIdStr);

    if (!user) {
      sendSuccess(res, 'User not found', { isComplete: false, exists: false });
      return;
    }

    // Check if all required fields are filled
    let isComplete = !!(user.phone && user.college && user.yearOfStudy);

    // For Thakur students, also check branch and rollNumber
    if (user.college === 'Thakur College of Engineering and Technology') {
      isComplete = isComplete && !!(user.branch && user.rollNumber);
    }

    sendSuccess(res, 'Profile check completed', { isComplete, exists: true });
  } catch (error: any) {
    logger.error('Check profile error:', error);
    sendError(res, error.message || 'Failed to check profile', 500);
  }
});


export default router;
