/**
 * Vercel Web Analytics Utilities
 * 
 * This module provides utilities for tracking custom events and analytics
 * with Vercel Web Analytics. Custom events require a Pro or Enterprise plan.
 * 
 * Key Features:
 * - Event tracking for user interactions and conversions
 * - Performance metric tracking for API endpoints
 * - Analytics configuration monitoring
 * - Integration with Vercel's analytics infrastructure
 */

/**
 * Analytics event metadata structure
 */
interface AnalyticsEventMetadata {
  timestamp: number;
  environment: string;
  version: string;
}

/**
 * Track a custom event in Vercel Web Analytics
 * 
 * This function allows you to track custom user interactions and events
 * throughout your application. Events are useful for tracking conversions,
 * user engagement, and other important metrics.
 * 
 * Note: Custom events feature requires a Pro or Enterprise Vercel plan.
 * For Express backend, events are logged and would be collected via client-side tracking.
 * 
 * @param eventName - The name of the event (e.g., 'user_signup', 'purchase_complete')
 * @param eventData - Optional data to include with the event
 * 
 * @example
 * // Track user signup
 * trackEvent('user_signup', { plan: 'premium' });
 * 
 * // Track form submission
 * trackEvent('form_submit', { form_id: 'contact_form' });
 * 
 * // Track without additional data
 * trackEvent('button_click');
 */
export const trackEvent = (
  eventName: string,
  eventData?: Record<string, any>
): void => {
  try {
    // Validate event name
    if (!eventName || typeof eventName !== 'string') {
      console.warn('⚠️ [Analytics] Invalid event name provided');
      return;
    }

    // Prepare event metadata
    const metadata: AnalyticsEventMetadata = {
      timestamp: Date.now(),
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
      version: process.env.npm_package_version || '1.0.0',
    };

    // Log the event for monitoring purposes
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_ANALYTICS === 'true') {
      console.log(`📊 [Analytics] Event: "${eventName}"`, {
        data: eventData || {},
        meta: metadata,
      });
    }

    // In production, with Pro/Enterprise plan, this could send to Vercel's analytics service
    // For now, backend events are logged and frontend events are collected via @vercel/analytics
    
    // Future implementation could include:
    // - Sending to a custom analytics endpoint
    // - Storing in a database for later analysis
    // - Forwarding to third-party analytics services
  } catch (error) {
    // Silently fail analytics tracking to not disrupt application
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Analytics event tracking failed:', error);
    }
  }
};

/**
 * Track a performance metric
 * 
 * Useful for tracking API performance metrics like database query times,
 * external API response times, or other performance indicators.
 * 
 * @param metricName - Name of the metric (e.g., 'db_query_time', 'api_response_time')
 * @param value - Numeric value of the metric
 * @param unit - Unit of measurement (e.g., 'ms', 's', 'bytes')
 * 
 * @example
 * // Track database query performance
 * const startTime = Date.now();
 * const results = await database.query(sql);
 * const duration = Date.now() - startTime;
 * trackMetric('db_query_time', duration, 'ms');
 */
export const trackMetric = (
  metricName: string,
  value: number,
  unit: string = 'ms'
): void => {
  try {
    // Validate inputs
    if (!metricName || typeof metricName !== 'string') {
      console.warn('⚠️ [Analytics] Invalid metric name provided');
      return;
    }

    if (typeof value !== 'number' || isNaN(value)) {
      console.warn('⚠️ [Analytics] Invalid metric value provided');
      return;
    }

    // Log the metric for monitoring
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_ANALYTICS === 'true') {
      console.log(`⏱️ [Analytics] Metric: "${metricName}" = ${value}${unit}`);
    }

    // Track as a custom event for consistency
    trackEvent(`metric_${metricName}`, {
      value,
      unit,
      timestamp: Date.now(),
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Analytics metric tracking failed:', error);
    }
  }
};

/**
 * Get analytics configuration status
 * 
 * Returns information about the analytics setup and whether
 * Vercel Web Analytics is enabled.
 * 
 * @returns Configuration object with enabled status, environment, and feature availability
 * 
 * @example
 * const config = getAnalyticsConfig();
 * if (config.enabled) {
 *   console.log('Analytics is enabled in', config.environment);
 * }
 */
export const getAnalyticsConfig = (): {
  enabled: boolean;
  environment: string;
  customEventsAvailable: boolean;
  isProduction: boolean;
  onVercel: boolean;
} => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isOnVercel = !!process.env.VERCEL;
  const environment = process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown';

  return {
    // Analytics is enabled in production and when deployed to Vercel
    enabled: isProduction && isOnVercel,
    environment,
    // Custom events require Pro or Enterprise plan (check environment variable)
    customEventsAvailable: process.env.VERCEL_ANALYTICS_CUSTOM_EVENTS === 'true',
    isProduction,
    onVercel: isOnVercel,
  };
};

/**
 * Track API endpoint usage
 * 
 * Higher-level function to track API endpoint calls with standard metadata
 * 
 * @param endpoint - The API endpoint (e.g., '/api/v1/users')
 * @param statusCode - HTTP status code returned
 * @param responseTime - Response time in milliseconds
 */
export const trackApiEndpoint = (
  endpoint: string,
  statusCode: number,
  responseTime: number
): void => {
  trackEvent('api_endpoint_called', {
    endpoint,
    statusCode,
    responseTime,
    success: statusCode >= 200 && statusCode < 300,
  });
};

/**
 * Track user actions
 * 
 * Higher-level function to track user interactions with consistent naming
 * 
 * @param action - User action name (e.g., 'signup', 'login', 'purchase')
 * @param userId - Optional user ID
 * @param metadata - Optional additional metadata
 */
export const trackUserAction = (
  action: string,
  userId?: string,
  metadata?: Record<string, any>
): void => {
  trackEvent(`user_${action}`, {
    userId: userId || 'anonymous',
    ...metadata,
  });
};

/**
 * Export all analytics utilities
 */
export default {
  trackEvent,
  trackMetric,
  getAnalyticsConfig,
  trackApiEndpoint,
  trackUserAction,
};
