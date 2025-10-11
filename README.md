# E-Summit 2025 - Event Management Platform

A complete event management platform for E-Summit 2025 at Thakur College of Engineering and Technology, featuring pass booking, QR-based check-in system, event management, and admin dashboard.

## 🎯 Project Overview

This platform handles the complete lifecycle of E-Summit 2025:
- **Pass Booking**: Multiple pass types (Gold, Silver, Platinum, Group) with Razorpay payment integration
- **QR Code System**: Unique, encrypted QR codes for each booking with secure check-in
- **Event Management**: Competitions, workshops, keynote sessions, and networking events
- **Admin Dashboard**: Real-time analytics, participant management, and QR scanning
- **User Dashboard**: View passes, registered events, and event schedule

## 📁 Project Structure

```
ESummit-2025/
├── src/                          # Frontend (React + Vite + TypeScript)
│   ├── components/               # UI components
│   │   ├── homepage.tsx
│   │   ├── events-listing.tsx
│   │   ├── pass-booking.tsx
│   │   ├── admin-panel.tsx
│   │   └── ...
│   └── utils/                    # Utilities
│
├── backend/                      # Backend (to be implemented)
│   └── See BACKEND_ARCHITECTURE.md
│
├── docs/                         # Documentation
│   ├── BACKEND_ARCHITECTURE.md   # Complete backend plan
│   ├── QR_CODE_SYSTEM.md        # QR implementation guide
│   ├── QR_FLOW_DIAGRAM.md       # Visual QR flow
│   └── IMPLEMENTATION_GUIDE.md  # Step-by-step guide
│
└── README.md                     # This file
```

## 🚀 Quick Start

### Frontend (Already Built ✓)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The frontend will be available at `http://localhost:5173`

### Backend (To Be Implemented)

See the comprehensive documentation:
- **[BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)** - Complete backend architecture and database schema
- **[QR_CODE_SYSTEM.md](./QR_CODE_SYSTEM.md)** - QR code generation and scanning implementation
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Week-by-week implementation plan

## 📱 QR Code System

### How It Works

1. **After Booking**: User completes payment → Backend generates unique encrypted QR code → Sent via email
2. **At Event**: User shows QR code → Admin scans with mobile app → System validates → Entry granted

### Key Features
- ✅ **AES-256-GCM encryption** - Military-grade security
- ✅ **SHA-256 checksum** - Tamper detection
- ✅ **Time-bound validity** - Only valid during event dates
- ✅ **One-time event entry** - Prevents ticket sharing
- ✅ **Complete audit trail** - All scans logged

**Visual Guide**: See [QR_FLOW_DIAGRAM.md](./QR_FLOW_DIAGRAM.md)

## 💳 Payment Integration

- **Gateway**: Razorpay
- **Supported Methods**: UPI, Cards, Net Banking, Wallets
- **Security**: Payment signature verification, webhook handling

## 🗄️ Database Schema

Core tables:
- `users` - User accounts
- `passes` - Purchased passes with QR codes
- `transactions` - Payment records
- `events` - All events/competitions
- `event_registrations` - User event sign-ups
- `check_ins` - QR scan records
- `admin_users` - Admin accounts

**Full Schema**: See [BACKEND_ARCHITECTURE.md#database-schema](./BACKEND_ARCHITECTURE.md#database-schema)

## 🔐 Security Features

- JWT authentication (access + refresh tokens)
- Password hashing (bcrypt)
- Rate limiting (100 req/15min per IP)
- CORS configuration
- Input validation (Zod)
- SQL injection prevention (Prisma ORM)
- XSS protection
- Encrypted QR codes

## 📊 Key Features

### For Attendees
- Browse events and speakers
- Book passes (multiple types)
- Register for events
- Receive QR code via email
- View personal dashboard
- Download event schedule

### For Admins
- Real-time dashboard
- Participant management
- QR code scanner (PWA)
- Event management
- Analytics & reporting
- Export participant data
- Audit logs

## 🛠️ Tech Stack

### Frontend ✓
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- Framer Motion
- Razorpay SDK

### Backend (Planned)
- Node.js + Express
- TypeScript
- PostgreSQL + Prisma
- Redis (caching)
- AWS S3 (QR storage)
- SendGrid (emails)
- JWT authentication

## 📦 Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.487.0",
    "motion": "*",
    "class-variance-authority": "^0.7.1",
    "tailwind-merge": "*",
    "@radix-ui/react-*": "latest"
  },
  "devDependencies": {
    "@types/react": "^18.2.21",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react-swc": "^3.10.2",
    "vite": "^6.3.6"
  }
}
```

## 🎓 Event Details

- **Name**: E-Summit 2025
- **Venue**: Thakur College of Engineering and Technology, Kandivali East, Mumbai - 400101
- **Dates**: March 15-17, 2025
- **Expected Attendance**: 5,000+ participants

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) | Complete backend architecture, API endpoints, database schema |
| [QR_CODE_SYSTEM.md](./QR_CODE_SYSTEM.md) | QR code generation & scanning implementation |
| [QR_FLOW_DIAGRAM.md](./QR_FLOW_DIAGRAM.md) | Visual flow from booking to entry |
| [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) | Week-by-week development roadmap |

## 🚦 Development Roadmap

### ✅ Phase 1: Frontend (Completed)
- [x] Homepage with hero section
- [x] Events listing and schedule
- [x] Speakers showcase
- [x] Team page
- [x] Venue information
- [x] Pass booking UI
- [x] Admin panel UI
- [x] User dashboard UI

### 🔄 Phase 2: Backend (In Progress)
- [ ] Database setup (PostgreSQL + Prisma)
- [ ] Authentication system (JWT)
- [ ] Razorpay integration
- [ ] QR code generation system
- [ ] Email notifications
- [ ] Event management APIs
- [ ] Admin APIs
- [ ] Check-in system

### 📅 Phase 3: Integration (Planned)
- [ ] Connect frontend to backend
- [ ] Build QR scanner PWA
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Security audit

### 🚀 Phase 4: Deployment (Planned)
- [ ] Deploy backend (DigitalOcean/AWS)
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Configure domain & SSL
- [ ] Set up monitoring
- [ ] Load testing

## 🔧 Environment Variables

Create `.env` file in backend:

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/esummit2025

# JWT
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_key_here

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# QR Code
QR_SECRET_KEY=generate_using_crypto_64_chars

# AWS S3
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_BUCKET_NAME=esummit-qr-codes

# Email
SENDGRID_API_KEY=SG.xxxxx
FROM_EMAIL=noreply@esummit2025.com
```

## 🧪 Testing

```bash
# Frontend
npm run test        # Run unit tests
npm run test:e2e    # Run E2E tests

# Backend (when implemented)
cd backend
npm run test        # Run all tests
npm run test:watch  # Watch mode
```

## 📈 Performance

- **Frontend Build**: Optimized with Vite
- **API Response**: <200ms target
- **QR Generation**: ~200ms per code
- **Check-in Speed**: <5 seconds from scan to entry

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is part of E-Summit 2025 at Thakur College of Engineering and Technology.

## 📞 Support

- **Email**: support@esummit2025.com
- **Website**: [esummit2025.com](https://esummit2025.com)
- **College**: Thakur College of Engineering and Technology

## 🙏 Acknowledgments

- Original Figma design: [Event Management Platform](https://www.figma.com/design/4mfHusc92cCL0SmJub6qBJ/Event-Management-Platform)
- Shadcn UI components
- Radix UI primitives
- Tailwind CSS team

---

**Built with ❤️ for E-Summit 2025**

*Last Updated: January 2025*