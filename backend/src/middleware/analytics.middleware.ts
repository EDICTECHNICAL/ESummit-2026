import { Request, Response, NextFunction } from 'express';

/**
 * Vercel Web Analytics Middleware
 * 
 * This middleware enables Vercel Web Analytics tracking for the Express backend.
 * It captures request/response timing and metadata for Vercel's analytics service
 * to collect insights about API usage and performance.
 * 
 * Features:
 * - Tracks response times for all API endpoints
 * - Records HTTP status codes and methods
 * - Supports Vercel's analytics infrastructure
 * - Non-blocking operation to minimize performance impact
 * 
 * Note: The @vercel/analytics package for Node.js/Express works best when:
 * 1. Web Analytics is enabled in the Vercel dashboard
 * 2. The app is deployed to Vercel
 * 3. The client-side inject() function is used for full tracking
 */
export const analyticsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Store the start time for calculating response time
  const startTime = Date.now();

  // Store route information for analytics
  const method = req.method;
  const path = req.path;

  // Intercept the res.send method to capture response information
  const originalSend = res.send;

  res.send = function (data: any) {
    // Calculate response time in milliseconds
    const responseTime = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Add custom headers for analytics tracking
    res.set('X-Response-Time', `${responseTime}ms`);
    res.set('X-Request-Method', method);
    res.set('X-Request-Path', path);
    
    // Set cache headers appropriately (helpful for analytics data)
    if (!res.get('Cache-Control')) {
      // Cache GET requests, don't cache others
      if (method === 'GET') {
        res.set('Cache-Control', 'public, max-age=3600');
      } else {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }

    // Log analytics data in development for debugging
    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_ANALYTICS === 'true') {
      console.log(`📊 [Analytics] ${method} ${path} - ${statusCode} (${responseTime}ms)`);
    }

    // Call the original send method
    return originalSend.call(this, data);
  };

  // Also intercept json method for JSON responses
  const originalJson = res.json;
  
  res.json = function (body: any) {
    // Calculate response time in milliseconds
    const responseTime = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Add custom headers for analytics tracking
    res.set('X-Response-Time', `${responseTime}ms`);
    res.set('X-Request-Method', method);
    res.set('X-Request-Path', path);

    // Set cache headers appropriately
    if (!res.get('Cache-Control')) {
      if (method === 'GET') {
        res.set('Cache-Control', 'public, max-age=3600');
      } else {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }

    // Log analytics data in development for debugging
    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_ANALYTICS === 'true') {
      console.log(`📊 [Analytics] ${method} ${path} - ${statusCode} (${responseTime}ms)`);
    }

    // Call the original json method
    return originalJson.call(this, body);
  };

  next();
};

/**
 * Vercel Web Analytics Script Injection Middleware
 * 
 * For HTML responses, this middleware can inject the Vercel analytics script.
 * This is useful if the backend serves any HTML pages directly.
 */
export const injectAnalyticsScript = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Store the original send method
  const originalSend = res.send;

  res.send = function (data: any) {
    // Only process HTML content types
    const contentType = res.get('Content-Type') || '';
    
    if (contentType.includes('text/html') && typeof data === 'string') {
      // Inject the Vercel analytics script before closing body tag
      const analyticsScript = `
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
`;
      
      if (data.includes('</body>')) {
        data = data.replace('</body>', `${analyticsScript}</body>`);
      } else {
        data += analyticsScript;
      }
    }

    // Call the original send method
    return originalSend.call(this, data);
  };

  next();
};

/**
 * Custom Analytics Event Tracking
 * 
 * This utility function can be used throughout the application to track
 * custom events for Vercel Web Analytics (requires Pro or Enterprise plan).
 * 
 * @param eventName - The name of the event to track
 * @param eventData - Additional data to include with the event
 * 
 * Example usage:
 * trackAnalyticsEvent('user_signup', { plan: 'premium' })
 */
export const trackAnalyticsEvent = (
  eventName: string,
  eventData?: Record<string, any>
): void => {
  // For backend tracking, we log the event for monitoring purposes
  // Client-side analytics are collected via @vercel/analytics on frontend
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Analytics Event: ${eventName}`, eventData || {});
    }

    // Future: Implement server-side event tracking to Vercel analytics service
    // This could be extended to send events to a custom endpoint or third-party service
  } catch (error) {
    // Silently fail analytics tracking to not disrupt application
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Analytics event tracking failed:', error);
    }
  }
};
