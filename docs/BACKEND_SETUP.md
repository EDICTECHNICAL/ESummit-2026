# Backend Setup Guide

## Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git

## Quick Setup

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and API keys
   ```

4. **Setup database:**
   ```bash
   # Create database
   createdb esummit2026

   # Run migrations
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

API will be available at `http://localhost:5000`

## Environment Variables

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/esummit2026
JWT_SECRET=your_jwt_secret
KONFHUB_API_KEY=your_api_key
QR_SECRET_KEY=64_char_hex_key
```

## Database Setup Options

### Local PostgreSQL
```bash
psql -U postgres
CREATE DATABASE esummit2026;
\q
```

### Docker
```bash
docker run --name esummit-postgres \
  -e POSTGRES_DB=esummit2026 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 -d postgres:14
```

## Troubleshooting

- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Run `npm run prisma:studio` to view database
