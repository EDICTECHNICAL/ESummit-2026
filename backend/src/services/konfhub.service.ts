import logger from '../utils/logger.util';

/**
 * KonfHub API Integration Service
 * Provides end-to-end pass and ticketing solutions
 * API Documentation: https://api.konfhub.com/docs
 */

const KONFHUB_API_KEY = process.env.KONFHUB_API_KEY || '';
const KONFHUB_API_BASE_URL = process.env.KONFHUB_API_URL || 'https://api.konfhub.com';

export interface KonfHubTicketType {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  quantity?: number;
  availableQuantity?: number;
}

export interface KonfHubOrderRequest {
  eventId?: string;
  ticketTypeId?: string;
  quantity: number;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  metadata?: Record<string, any>;
}

export interface KonfHubOrderResponse {
  orderId: string;
  ticketId?: string;
  paymentId?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  tickets?: Array<{
    id: string;
    ticketNumber: string;
    qrCode?: string;
  }>;
  paymentUrl?: string;
  checkoutUrl?: string;
}

export interface KonfHubWebhookPayload {
  event: 'order.completed' | 'order.cancelled' | 'ticket.issued';
  orderId: string;
  ticketId?: string;
  paymentId?: string;
  status: string;
  data: Record<string, any>;
}

class KonfHubService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = KONFHUB_API_KEY;
    this.baseUrl = KONFHUB_API_BASE_URL;

    if (!this.apiKey) {
      logger.warn('KonfHub API key not configured');
    }
  }

  /**
   * Create a new order/ticket purchase
   */
  async createOrder(orderData: KonfHubOrderRequest): Promise<KonfHubOrderResponse> {
    try {
      logger.info('Creating KonfHub order', { 
        email: orderData.customerInfo.email,
        quantity: orderData.quantity 
      });

      const response = await fetch(`${this.baseUrl}/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Version': '1.0',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json() as any;
        throw new Error(error.message || 'Failed to create KonfHub order');
      }

      const data = await response.json() as any;
      logger.info('KonfHub order created successfully', { orderId: data.orderId });

      return {
        orderId: data.id || data.orderId,
        ticketId: data.ticketId,
        paymentId: data.paymentId,
        status: data.status || 'pending',
        amount: data.amount || orderData.quantity * (data.price || 0),
        currency: data.currency || 'INR',
        tickets: data.tickets,
        paymentUrl: data.paymentUrl,
        checkoutUrl: data.checkoutUrl || data.paymentUrl,
      };
    } catch (error) {
      logger.error('KonfHub create order error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to create order with KonfHub');
    }
  }

  /**
   * Get order details by order ID
   */
  async getOrder(orderId: string): Promise<KonfHubOrderResponse> {
    try {
      logger.info('Fetching KonfHub order', { orderId });

      const response = await fetch(`${this.baseUrl}/v1/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Version': '1.0',
        },
      });

      if (!response.ok) {
        const error = await response.json() as any;
        throw new Error(error.message || 'Failed to fetch KonfHub order');
      }

      const data = await response.json() as any;

      return {
        orderId: data.id || data.orderId,
        ticketId: data.ticketId,
        paymentId: data.paymentId,
        status: data.status,
        amount: data.amount,
        currency: data.currency || 'INR',
        tickets: data.tickets,
      };
    } catch (error) {
      logger.error('KonfHub get order error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch order from KonfHub');
    }
  }

  /**
   * Verify webhook signature (if KonfHub provides webhook signatures)
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      // Implement webhook signature verification based on KonfHub's documentation
      // This is a placeholder - update with actual verification logic
      const crypto = require('crypto');
      const webhookSecret = process.env.KONFHUB_WEBHOOK_SECRET || '';
      
      if (!webhookSecret) {
        logger.warn('KonfHub webhook secret not configured');
        return true; // Allow in development
      }

      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      logger.error('KonfHub webhook verification error:', error);
      return false;
    }
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    try {
      logger.info('Cancelling KonfHub order', { orderId });

      const response = await fetch(`${this.baseUrl}/v1/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Version': '1.0',
        },
      });

      if (!response.ok) {
        const error = await response.json() as any;
        throw new Error(error.message || 'Failed to cancel KonfHub order');
      }

      return {
        success: true,
        message: 'Order cancelled successfully',
      };
    } catch (error) {
      logger.error('KonfHub cancel order error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to cancel order');
    }
  }

  /**
   * Get ticket details
   */
  async getTicket(ticketId: string): Promise<any> {
    try {
      logger.info('Fetching KonfHub ticket', { ticketId });

      const response = await fetch(`${this.baseUrl}/v1/tickets/${ticketId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Version': '1.0',
        },
      });

      if (!response.ok) {
        const error = await response.json() as any;
        throw new Error(error.message || 'Failed to fetch KonfHub ticket');
      }

      return await response.json() as any;
    } catch (error) {
      logger.error('KonfHub get ticket error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch ticket from KonfHub');
    }
  }
}

export const konfhubService = new KonfHubService();
