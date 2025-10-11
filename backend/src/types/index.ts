// Extended Express Request type with user
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

// Pass types
export type PassType = 'Gold' | 'Silver' | 'Platinum' | 'Group';

export type PassStatus = 'Active' | 'Cancelled' | 'Refunded';

// Transaction types
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet';

// Event types
export type EventCategory = 'competitions' | 'workshops' | 'speakers' | 'hackathon' | 'networking';

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export type EventRegistrationStatus = 'registered' | 'attended' | 'cancelled';

// Check-in types
export type CheckInType = 'venue_entry' | 'event_entry';

// Admin types
export type AdminRole = 'Super Admin' | 'Event Manager' | 'Scanner Operator' | 'Analytics Viewer';

export interface AdminPermissions {
  participants?: boolean;
  scanner?: boolean;
  events?: boolean;
  analytics?: boolean;
  settings?: boolean;
}

// Audit log types
export type AuditAction = 'check_in' | 'refund' | 'edit_pass' | 'create_event' | 'update_event' | 'delete_event';

export type EntityType = 'pass' | 'user' | 'event' | 'transaction' | 'admin';

// Sponsor types
export type SponsorTier = 'title' | 'platinum' | 'gold' | 'silver' | 'bronze';
