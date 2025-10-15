import type { VercelRequest, VercelResponse } from '@vercel/node';

// Handler that returns a simple response first to test
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    // Handle preflight
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Simple health check for root and health endpoints
    if (req.url === '/' || req.url === '/api/v1/health') {
      return res.status(200).json({
        success: true,
        message: '🚀 E-Summit 2026 API is running on Vercel',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      });
    }

    // Import and use the Express app for other routes
    const app = (await import('../src/app')).default;
    
    // Call the Express app
    return app(req, res);
    
  } catch (error: any) {
    console.error('Serverless function error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message || 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
    });
  }
}
