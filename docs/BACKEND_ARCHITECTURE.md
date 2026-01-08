# Backend Architecture Overview

## 🏗️ System Architecture

E-Summit 2026 backend is built with Node.js/Express, PostgreSQL, and Prisma ORM. It handles user authentication, pass booking, QR code generation, admin operations, and real-time check-ins.

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT tokens + Clerk
- **Payments**: KonfHub integration
- **QR Codes**: AES-256 encrypted
- **Validation**: Zod schemas

## 📊 Database Schema

### Core Tables
- `users` - User accounts and profiles
- `passes` - Pass purchases with QR codes
- `transactions` - Payment records
- `events` - Event listings
- `event_registrations` - User registrations
- `check_ins` - QR scan records
- `admin_users` - Admin accounts

## 🔐 Security Features

- JWT authentication with refresh tokens
- Password hashing (bcrypt)
- Rate limiting (100 req/15min)
- Input validation and sanitization
- SQL injection prevention
- Encrypted QR codes

## 🚀 Key Features

- **Pass Booking**: Multiple types with payment verification
- **QR System**: Encrypted codes for secure check-ins
- **Admin Panel**: Real-time analytics and participant management
- **Event Management**: CRUD operations for events
- **Check-in System**: Camera/manual scanning with audit trails

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/     # Route handlers
│   ├── services/        # Business logic
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── validators/      # Zod schemas
│   └── utils/           # Helper functions
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/      # DB migrations
└── scripts/             # Utility scripts
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh tokens

### Passes
- `POST /api/v1/passes/create-order` - Create payment order
- `POST /api/v1/passes/verify-payment` - Verify and create pass
- `GET /api/v1/passes/:id` - Get pass details

### Events
- `GET /api/v1/events` - List events
- `POST /api/v1/events/:id/register` - Register for event

### Admin
- `POST /api/v1/admin/check-in` - QR code check-in
- `GET /api/v1/admin/dashboard/stats` - Dashboard analytics
- `GET /api/v1/admin/participants` - Participant management

## 📋 Environment Variables

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/esummit2026
JWT_SECRET=your_jwt_secret
KONFHUB_API_KEY=your_api_key
QR_SECRET_KEY=64_char_hex_key
```

## 🚀 Deployment

- **Frontend**: Vercel
- **Backend**: DigitalOcean/AWS
- **Database**: Managed PostgreSQL
- **CDN**: For static assets

---

*For detailed implementation, see the source code.*
