import { clerkMiddleware, requireAuth } from '@clerk/express';

/**
 * Clerk middleware - adds auth to req object
 * Use this to make Clerk available on all routes
 */
export const clerkAuth = clerkMiddleware();

/**
 * Protected route middleware
 * Requires user to be authenticated
 */
export const requireClerkAuth = requireAuth();

/**
 * Extract user ID from Clerk auth
 */
export function getClerkUserId(req: any): string | null {
  return req.auth?.userId || null;
}

/**
 * Get full user info from Clerk
 */
export async function getClerkUser(req: any) {
  const userId = getClerkUserId(req);
  if (!userId) return null;
  
  // The user data is available in req.auth
  return req.auth;
}
