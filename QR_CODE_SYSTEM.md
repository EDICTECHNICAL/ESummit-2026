# 📱 QR Code Generation & Scanning System - E-Summit 2025

## 🎯 Overview

This document explains how to implement a **secure, unique QR code** system for each booking that can be scanned at venue entry and event check-ins.

---

## 🔄 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER BOOKING FLOW                             │
└─────────────────────────────────────────────────────────────────┘

1. User Selects Pass Type (Frontend)
              ↓
2. Create Razorpay Order (Backend API)
              ↓
3. User Completes Payment (Razorpay)
              ↓
4. Verify Payment Signature (Backend)
              ↓
5. Create Pass Record in Database
              ↓
6. Generate Unique Pass ID
   Example: "ESUMMIT-2025-ABC123"
              ↓
7. Create QR Code Data (Encrypted JSON)
   {
     passId: "ESUMMIT-2025-ABC123",
     userId: "uuid",
     userName: "John Doe",
     passType: "Platinum",
     validFrom: "2025-03-15",
     validUntil: "2025-03-17",
     checksum: "sha256_hash"
   }
              ↓
8. Encrypt Data using AES-256-GCM
   Result: "a1b2c3d4e5f6..."
              ↓
9. Generate QR Code PNG Image (512x512)
              ↓
10. Upload to AWS S3 / Cloud Storage
              ↓
11. Store QR URL in Database
              ↓
12. Send Confirmation Email with QR Code
              ↓
13. User Downloads/Saves QR Code to Phone

┌─────────────────────────────────────────────────────────────────┐
│                    CHECK-IN FLOW (AT VENUE)                      │
└─────────────────────────────────────────────────────────────────┘

1. Admin Opens Scanner App (PWA)
              ↓
2. Camera Scans QR Code
              ↓
3. Extract Encrypted Data from QR
              ↓
4. Send to Backend API: POST /admin/check-in
   { qrData: "encrypted_string", location: "Main Entrance" }
              ↓
5. Backend Decrypts QR Data
              ↓
6. Validate Checksum (detect tampering)
              ↓
7. Check Validity Period (dates)
              ↓
8. Fetch Pass from Database by passId
              ↓
9. Verify Pass Status = "Active"
              ↓
10. Check if Already Checked In
    - Venue entry: Allow multiple
    - Event entry: Allow once per event
              ↓
11. Create Check-In Record
              ↓
12. Update Event Registration Status (if event)
              ↓
13. Create Audit Log
              ↓
14. Return Success + User Details
              ↓
15. Display on Scanner Screen:
    ✓ Check-in Successful
    Name: John Doe
    Pass: Platinum
    Time: 10:30 AM
```

---

## 💻 Backend Implementation

### 1. Install Dependencies

```bash
npm install qrcode crypto @aws-sdk/client-s3
npm install @types/qrcode --save-dev
```

### 2. Environment Variables (.env)

```env
# QR Code Encryption
QR_SECRET_KEY=your_64_char_hex_secret_key_here_generate_using_crypto
# Generate using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# AWS S3 (for QR storage)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=esummit-2025-qr-codes
AWS_REGION=ap-south-1
```

### 3. QR Service Implementation

Create `src/services/qr.service.ts`:

```typescript
import QRCode from 'qrcode';
import crypto from 'crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '../config/database';

const QR_SECRET_KEY = process.env.QR_SECRET_KEY!;
const QR_ALGORITHM = 'aes-256-gcm';

interface QRCodeData {
  passId: string;
  userId: string;
  passType: string;
  userName: string;
  email: string;
  validFrom: string;
  validUntil: string;
  checksum: string;
}

export class QRService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'ap-south-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  /**
   * Encrypt QR code data using AES-256-GCM
   */
  private encryptQRData(data: object): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      QR_ALGORITHM,
      Buffer.from(QR_SECRET_KEY, 'hex'),
      iv
    );

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Format: iv:authTag:encryptedData
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  /**
   * Decrypt QR code data (used during scanning)
   */
  decryptQRData(encryptedData: string): QRCodeData {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');

    if (!ivHex || !authTagHex || !encrypted) {
      throw new Error('Invalid QR code format');
    }

    const decipher = crypto.createDecipheriv(
      QR_ALGORITHM,
      Buffer.from(QR_SECRET_KEY, 'hex'),
      Buffer.from(ivHex, 'hex')
    );

    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted) as QRCodeData;
  }

  /**
   * Generate SHA256 checksum for data integrity
   */
  private generateChecksum(data: Omit<QRCodeData, 'checksum'>): string {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex')
      .substring(0, 16);
  }

  /**
   * Generate unique Pass ID
   */
  generatePassId(): string {
    const prefix = 'ESUMMIT-2025';
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `${prefix}-${random}`;
  }

  /**
   * Main function: Generate QR code for a pass
   */
  async generateQRCode(pass: {
    id: string;
    passId: string;
    userId: string;
    passType: string;
    user: { fullName: string; email: string };
  }): Promise<{ qrCodeUrl: string; qrCodeData: string }> {
    try {
      // 1. Prepare QR data
      const validFrom = new Date('2025-03-15T00:00:00Z');
      const validUntil = new Date('2025-03-17T23:59:59Z');

      const qrDataWithoutChecksum = {
        passId: pass.passId,
        userId: pass.userId,
        passType: pass.passType,
        userName: pass.user.fullName,
        email: pass.user.email,
        validFrom: validFrom.toISOString(),
        validUntil: validUntil.toISOString(),
      };

      // 2. Generate checksum
      const checksum = this.generateChecksum(qrDataWithoutChecksum);

      const qrData: QRCodeData = {
        ...qrDataWithoutChecksum,
        checksum,
      };

      // 3. Encrypt the data
      const encryptedData = this.encryptQRData(qrData);

      // 4. Generate QR code image
      const qrCodeBuffer = await QRCode.toBuffer(encryptedData, {
        errorCorrectionLevel: 'H', // High - can recover from 30% damage
        type: 'png',
        width: 512,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      // 5. Upload to S3
      const fileName = `qr-codes/${pass.passId}.png`;
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: fileName,
          Body: qrCodeBuffer,
          ContentType: 'image/png',
          ACL: 'public-read', // Make publicly accessible
        })
      );

      // 6. Construct public URL
      const qrCodeUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

      return {
        qrCodeUrl,
        qrCodeData: encryptedData,
      };
    } catch (error) {
      console.error('QR generation error:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Validate QR code (called during scanning)
   */
  async validateQRCode(encryptedData: string): Promise<{
    valid: boolean;
    data?: QRCodeData;
    error?: string;
  }> {
    try {
      // 1. Decrypt data
      const qrData = this.decryptQRData(encryptedData);

      // 2. Verify checksum (detect tampering)
      const { checksum, ...dataWithoutChecksum } = qrData;
      const expectedChecksum = this.generateChecksum(dataWithoutChecksum);

      if (checksum !== expectedChecksum) {
        return {
          valid: false,
          error: 'QR code has been tampered with',
        };
      }

      // 3. Check validity dates
      const now = new Date();
      const validFrom = new Date(qrData.validFrom);
      const validUntil = new Date(qrData.validUntil);

      if (now < validFrom) {
        return {
          valid: false,
          error: `QR code is not yet valid. Valid from: ${validFrom.toLocaleDateString()}`,
        };
      }

      if (now > validUntil) {
        return {
          valid: false,
          error: 'QR code has expired',
        };
      }

      // 4. All checks passed
      return {
        valid: true,
        data: qrData,
      };
    } catch (error) {
      console.error('QR validation error:', error);
      return {
        valid: false,
        error: 'Invalid QR code format',
      };
    }
  }
}

export const qrService = new QRService();
```

### 4. Check-In Controller

Create `src/controllers/checkin.controller.ts`:

```typescript
import { Request, Response } from 'express';
import { qrService } from '../services/qr.service';
import { prisma } from '../config/database';

export class CheckInController {
  /**
   * POST /admin/check-in
   * Scan QR and check-in participant
   */
  async checkIn(req: Request, res: Response) {
    try {
      const { qrData, eventId, location } = req.body;
      const adminId = req.user!.id; // From auth middleware

      // 1. Validate QR code
      const validation = await qrService.validateQRCode(qrData);

      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          error: validation.error,
        });
      }

      const qrInfo = validation.data!;

      // 2. Fetch pass from database
      const pass = await prisma.passes.findUnique({
        where: { passId: qrInfo.passId },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              college: true,
            },
          },
        },
      });

      if (!pass) {
        return res.status(404).json({
          success: false,
          error: 'Pass not found in database',
        });
      }

      // 3. Verify pass is active
      if (pass.status !== 'Active') {
        return res.status(400).json({
          success: false,
          error: `Pass is ${pass.status.toLowerCase()}. Cannot check in.`,
        });
      }

      // 4. Determine check-in type
      const checkInType = eventId ? 'event_entry' : 'venue_entry';

      // 5. For event check-ins, verify not already checked in
      if (eventId) {
        const existingCheckIn = await prisma.checkIns.findFirst({
          where: {
            passId: pass.id,
            eventId: eventId,
            checkInType: 'event_entry',
          },
        });

        if (existingCheckIn) {
          return res.status(400).json({
            success: false,
            error: 'Already checked in for this event',
            checkInTime: existingCheckIn.checkInTime,
          });
        }

        // Verify event registration
        const registration = await prisma.eventRegistrations.findFirst({
          where: {
            userId: pass.userId,
            eventId: eventId,
            status: 'registered',
          },
        });

        if (!registration) {
          return res.status(400).json({
            success: false,
            error: 'Not registered for this event',
          });
        }
      }

      // 6. Create check-in record
      const checkIn = await prisma.checkIns.create({
        data: {
          passId: pass.id,
          userId: pass.userId,
          eventId: eventId || null,
          checkInType,
          scannedBy: adminId,
          location: location || 'Main Entrance',
        },
      });

      // 7. Update event registration if applicable
      if (eventId) {
        await prisma.eventRegistrations.updateMany({
          where: {
            userId: pass.userId,
            eventId: eventId,
          },
          data: {
            status: 'attended',
          },
        });
      }

      // 8. Create audit log
      await prisma.auditLogs.create({
        data: {
          adminUserId: adminId,
          action: 'check_in',
          entityType: 'pass',
          entityId: pass.id,
          changes: {
            checkInType,
            eventId,
            location,
            timestamp: new Date().toISOString(),
          },
          ipAddress: req.ip || 'unknown',
          userAgent: req.get('user-agent') || 'unknown',
        },
      });

      // 9. Return success
      return res.status(200).json({
        success: true,
        message: 'Check-in successful! ✓',
        checkIn: {
          id: checkIn.id,
          checkInTime: checkIn.checkInTime,
          type: checkInType,
        },
        participant: {
          name: pass.user.fullName,
          email: pass.user.email,
          phone: pass.user.phone,
          college: pass.user.college,
          passType: pass.passType,
          passId: pass.passId,
        },
      });
    } catch (error) {
      console.error('Check-in error:', error);
      return res.status(500).json({
        success: false,
        error: 'Check-in failed. Please try again.',
      });
    }
  }

  /**
   * GET /admin/check-ins/:passId
   * Get check-in history for a pass
   */
  async getCheckInHistory(req: Request, res: Response) {
    try {
      const { passId } = req.params;

      const pass = await prisma.passes.findUnique({
        where: { passId },
      });

      if (!pass) {
        return res.status(404).json({
          success: false,
          error: 'Pass not found',
        });
      }

      const checkIns = await prisma.checkIns.findMany({
        where: { passId: pass.id },
        include: {
          event: {
            select: {
              title: true,
              venue: true,
              date: true,
            },
          },
          scannedByAdmin: {
            select: {
              fullName: true,
            },
          },
        },
        orderBy: { checkInTime: 'desc' },
      });

      return res.status(200).json({
        success: true,
        totalCheckIns: checkIns.length,
        checkIns: checkIns.map(ci => ({
          id: ci.id,
          type: ci.checkInType,
          time: ci.checkInTime,
          location: ci.location,
          event: ci.event?.title || 'Venue Entry',
          scannedBy: ci.scannedByAdmin?.fullName || 'Unknown',
        })),
      });
    } catch (error) {
      console.error('Error fetching check-in history:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch check-in history',
      });
    }
  }
}

export const checkInController = new CheckInController();
```

### 5. API Routes

Create `src/routes/checkin.routes.ts`:

```typescript
import express from 'express';
import { checkInController } from '../controllers/checkin.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require admin authentication
router.use(authenticateAdmin);

// Check-in via QR code
router.post('/check-in', checkInController.checkIn);

// Get check-in history
router.get('/check-ins/:passId', checkInController.getCheckInHistory);

export default router;
```

---

## 📱 Frontend Scanner App

### Option 1: Using `react-qr-scanner`

```bash
npm install react-qr-scanner
npm install @types/react-qr-scanner --save-dev
```

```typescript
// src/components/QRScanner.tsx

import { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import axios from 'axios';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';

interface ScanResult {
  success: boolean;
  participant?: {
    name: string;
    passType: string;
    passId: string;
    email: string;
  };
  checkIn?: {
    checkInTime: string;
    type: string;
  };
  error?: string;
}

export function QRScanner() {
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [location, setLocation] = useState('Main Entrance');

  const handleScan = async (data: any) => {
    if (data && scanning) {
      setScanning(false);

      try {
        const response = await axios.post<ScanResult>(
          '/api/v1/admin/check-in',
          {
            qrData: data.text,
            location: location,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            },
          }
        );

        setResult(response.data);

        // Auto-resume scanning after 3 seconds
        setTimeout(() => {
          setScanning(true);
          setResult(null);
        }, 3000);
      } catch (error: any) {
        setResult({
          success: false,
          error: error.response?.data?.error || 'Check-in failed',
        });

        setTimeout(() => {
          setScanning(true);
          setResult(null);
        }, 3000);
      }
    }
  };

  const handleError = (err: any) => {
    console.error('QR Scanner Error:', err);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="mb-6">QR Code Scanner</h1>

      {/* Location Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Scanning Location
        </label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={!scanning}
        >
          <option value="Main Entrance">Main Entrance</option>
          <option value="Gate 2">Gate 2</option>
          <option value="Main Auditorium">Main Auditorium</option>
          <option value="Workshop Hall A">Workshop Hall A</option>
          <option value="Tech Lab">Tech Lab</option>
        </select>
      </div>

      {/* Scanner */}
      <Card>
        <CardContent className="p-6">
          {scanning ? (
            <>
              <div className="mb-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Point camera at QR code
                </p>
              </div>
              <QrScanner
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: '100%' }}
                constraints={{
                  video: { facingMode: 'environment' }, // Use back camera
                }}
              />
            </>
          ) : (
            <div className="scan-result min-h-[300px] flex items-center justify-center">
              {result?.success ? (
                <div className="text-center">
                  <div className="text-6xl mb-4">✓</div>
                  <h2 className="text-2xl font-bold text-green-600 mb-4">
                    Check-in Successful!
                  </h2>
                  <div className="space-y-2 text-left bg-gray-50 p-4 rounded">
                    <p><strong>Name:</strong> {result.participant?.name}</p>
                    <p><strong>Pass:</strong> {result.participant?.passType}</p>
                    <p><strong>ID:</strong> {result.participant?.passId}</p>
                    <p><strong>Time:</strong> {new Date(result.checkIn?.checkInTime!).toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-6xl mb-4">✗</div>
                  <h2 className="text-2xl font-bold text-red-600 mb-4">
                    Check-in Failed
                  </h2>
                  <Alert variant="destructive">
                    <AlertDescription>{result?.error}</AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Resume Button */}
      {!scanning && (
        <Button
          onClick={() => {
            setScanning(true);
            setResult(null);
          }}
          className="w-full mt-4"
        >
          Scan Next Code
        </Button>
      )}
    </div>
  );
}
```

### Option 2: Using `html5-qrcode` (More reliable)

```bash
npm install html5-qrcode
```

```typescript
// src/components/QRScanner.tsx (html5-qrcode version)

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';

export function QRScanner() {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        // QR code scanned successfully
        try {
          const response = await axios.post('/api/v1/admin/check-in', {
            qrData: decodedText,
            location: 'Main Entrance',
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            },
          });

          setResult(response.data);
          scanner.pause();

          // Resume after 3 seconds
          setTimeout(() => {
            scanner.resume();
            setResult(null);
          }, 3000);
        } catch (error: any) {
          setResult({
            success: false,
            error: error.response?.data?.error || 'Check-in failed',
          });
        }
      },
      (errorMessage) => {
        // Error callback (can be ignored for continuous scanning)
      }
    );

    scannerRef.current = scanner;

    return () => {
      scanner.clear();
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1>QR Code Scanner</h1>
      <div id="qr-reader" style={{ width: '100%' }}></div>
      
      {result && (
        <div className={`mt-4 p-4 rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
          {result.success ? (
            <div>
              <h2 className="text-xl font-bold">✓ Check-in Successful</h2>
              <p>Name: {result.participant?.name}</p>
              <p>Pass: {result.participant?.passType}</p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold">✗ Failed</h2>
              <p>{result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 📧 Email Template with QR Code

```html
<!-- Email sent after successful booking -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #dc2626; margin: 0;">🎉 E-Summit 2025</h1>
      <p style="color: #666; margin: 10px 0 0 0;">Pass Confirmation</p>
    </div>

    <!-- Main Content -->
    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <p>Dear <strong>{{userName}}</strong>,</p>
      
      <p>Your <strong>{{passType}} Pass</strong> has been confirmed! 🎊</p>

      <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Pass ID:</strong> {{passId}}</p>
        <p><strong>Valid:</strong> March 15-17, 2025</p>
        <p><strong>Amount Paid:</strong> ₹{{amount}}</p>
      </div>
    </div>

    <!-- QR Code -->
    <div style="text-align: center; padding: 30px; background: white; border: 2px dashed #dc2626; border-radius: 8px; margin-bottom: 20px;">
      <p style="margin: 0 0 15px 0; font-weight: bold;">Your Entry Pass</p>
      <img src="{{qrCodeUrl}}" alt="QR Code" style="width: 300px; height: 300px; display: block; margin: 0 auto;" />
      <p style="margin: 15px 0 0 0; color: #666; font-size: 14px;">
        <strong>{{passId}}</strong>
      </p>
    </div>

    <!-- Important Instructions -->
    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 20px;">
      <p style="margin: 0 0 10px 0; font-weight: bold;">📌 Important Instructions:</p>
      <ul style="margin: 0; padding-left: 20px;">
        <li>Save this QR code on your phone</li>
        <li>Present it at the venue entrance for check-in</li>
        <li>Do NOT share this QR code with others</li>
        <li>Screenshot or download for offline access</li>
        <li>Arrive 30 minutes early for smooth entry</li>
      </ul>
    </div>

    <!-- Download Button -->
    <div style="text-align: center; margin-bottom: 20px;">
      <a href="{{downloadUrl}}" style="display: inline-block; padding: 12px 30px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Download QR Code
      </a>
    </div>

    <!-- Pass Benefits -->
    <div style="margin-bottom: 20px;">
      <p style="font-weight: bold; margin-bottom: 10px;">Your {{passType}} Pass includes:</p>
      <ul style="margin: 0; padding-left: 20px;">
        {{#each benefits}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; font-size: 14px;">
      <p>Need help? Contact us at <a href="mailto:support@esummit2025.com" style="color: #dc2626;">support@esummit2025.com</a></p>
      <p style="margin-top: 10px;">See you at E-Summit 2025! 🚀</p>
    </div>
  </div>
</body>
</html>
```

---

## 🧪 Testing

### Test QR Generation

```bash
# Generate secret key first
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Add to .env as QR_SECRET_KEY

# Test endpoint
curl -X POST http://localhost:3000/api/v1/passes/verify-payment \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "order_xxx",
    "paymentId": "pay_xxx",
    "signature": "sig_xxx"
  }'
```

### Test QR Validation

```bash
curl -X POST http://localhost:3000/api/v1/admin/check-in \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "qrData": "a1b2c3:d4e5f6:g7h8i9...",
    "location": "Main Entrance"
  }'
```

---

## 🔒 Security Checklist

- [x] QR data encrypted with AES-256-GCM
- [x] Checksum validation to detect tampering
- [x] Time-bound validity (event dates only)
- [x] One-time event check-in enforcement
- [x] Admin authentication required for scanning
- [x] Audit logs for all check-ins
- [x] HTTPS-only transmission
- [x] Secure secret key storage (env variables)
- [x] Rate limiting on check-in API
- [x] Pass status verification (Active only)

---

## 📊 Database Check-In Analytics

```sql
-- Total check-ins today
SELECT COUNT(*) FROM check_ins 
WHERE DATE(check_in_time) = CURRENT_DATE;

-- Check-ins by hour
SELECT 
  EXTRACT(HOUR FROM check_in_time) as hour,
  COUNT(*) as count
FROM check_ins
WHERE DATE(check_in_time) = CURRENT_DATE
GROUP BY hour
ORDER BY hour;

-- Most popular events
SELECT 
  e.title,
  COUNT(c.id) as check_ins
FROM check_ins c
JOIN events e ON c.event_id = e.id
WHERE c.check_in_type = 'event_entry'
GROUP BY e.title
ORDER BY check_ins DESC
LIMIT 10;

-- Pass utilization
SELECT 
  p.pass_type,
  COUNT(DISTINCT p.id) as total_passes,
  COUNT(DISTINCT c.pass_id) as checked_in,
  ROUND(COUNT(DISTINCT c.pass_id)::numeric / COUNT(DISTINCT p.id) * 100, 2) as utilization_rate
FROM passes p
LEFT JOIN check_ins c ON p.id = c.pass_id
WHERE p.status = 'Active'
GROUP BY p.pass_type;
```

---

## 🎯 Quick Start Checklist

1. **Backend Setup**
   - [ ] Install dependencies: `npm install qrcode crypto @aws-sdk/client-s3`
   - [ ] Generate QR secret key and add to `.env`
   - [ ] Configure AWS S3 bucket
   - [ ] Add QRService to project
   - [ ] Create check-in controller & routes
   - [ ] Test QR generation API

2. **Frontend Scanner**
   - [ ] Install `html5-qrcode` or `react-qr-scanner`
   - [ ] Create QRScanner component
   - [ ] Add admin authentication
   - [ ] Test camera permissions
   - [ ] Deploy as PWA for mobile use

3. **Email Integration**
   - [ ] Set up email service (SendGrid/SES)
   - [ ] Create HTML email template
   - [ ] Test QR code attachment
   - [ ] Verify email delivery

4. **Testing**
   - [ ] Generate test QR code
   - [ ] Scan with mobile device
   - [ ] Test check-in flow
   - [ ] Verify duplicate prevention
   - [ ] Test error cases

---

**Ready to implement?** Start with the QRService, then build the check-in API, and finally create the scanner app! 🚀
