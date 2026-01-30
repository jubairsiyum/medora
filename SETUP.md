# Setup Guide - Medora Online Pharmacy

This guide will help you set up the Medora platform from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/downloads)

## Database Setup Options

You have three options for setting up the database:

### Option 1: Local PostgreSQL Installation (Recommended for Development)

1. **Install PostgreSQL**
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Start PostgreSQL Service**
   ```bash
   # Windows (run as administrator)
   net start postgresql-x64-14
   
   # Mac
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   ```

3. **Create Database**
   ```bash
   # Access PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE medora_db;
   
   # Exit
   \q
   ```

4. **Update .env file**
   ```env
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/medora_db"
   ```

### Option 2: Use Prisma Postgres (Quick Start)

1. **Start Prisma Postgres**
   ```bash
   npx prisma dev
   ```
   
   This will start a local PostgreSQL instance automatically.

2. The DATABASE_URL in your .env is already configured for Prisma Postgres.

### Option 3: Cloud Database (Production)

Use a cloud PostgreSQL provider:

- **Supabase** (Free tier available) - [supabase.com](https://supabase.com)
- **Railway** (Free tier available) - [railway.app](https://railway.app)
- **Neon** (Serverless Postgres) - [neon.tech](https://neon.tech)
- **AWS RDS**
- **DigitalOcean Managed Database**

Update your .env with the provided connection string.

## Complete Setup Steps

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd medora.com.bd

# Install dependencies
npm install
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings
# Update DATABASE_URL with your PostgreSQL connection string
```

**Required Environment Variables:**
```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# JWT Secrets (Generate strong secrets for production)
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters"
JWT_REFRESH_SECRET="your-super-secret-refresh-token-key-at-least-32-characters"

# App URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

**Generate Secure Secrets:**
```bash
# Generate random secret (Linux/Mac)
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Initialize Database

```bash
# Push database schema
npm run db:push

# Seed database with sample data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Default Login Credentials

After seeding, use these credentials:

**Admin Account:**
- Email: `admin@medora.com`
- Password: `Admin@123`

**Test Customer:**
- Email: `customer@test.com`
- Password: `Test@123`

## Verify Installation

1. **Check Home Page** - Should see healthcare-themed landing page
2. **Test Login** - Login with admin credentials
3. **Check API** - Visit `/api/medicines` (should return JSON)
4. **View Database** - Run `npm run db:studio` to open Prisma Studio

## Troubleshooting

### Database Connection Error

**Error:** `Can't reach database server`

**Solutions:**
1. Ensure PostgreSQL is running
2. Check DATABASE_URL format
3. Verify database exists
4. Check firewall settings
5. Verify credentials

```bash
# Test PostgreSQL connection
psql -U postgres -h localhost -p 5432
```

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Use different port
PORT=3001 npm run dev

# Or kill process using port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Prisma Client Not Generated

**Error:** `Cannot find module '@prisma/client'`

**Solution:**
```bash
npx prisma generate
```

### Environment Variables Not Loading

**Solution:**
1. Ensure .env file exists in project root
2. Restart development server
3. Check for typos in variable names

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment Checklist

- [ ] Set strong JWT secrets
- [ ] Configure production DATABASE_URL
- [ ] Set NEXT_PUBLIC_APP_URL to production domain
- [ ] Enable HTTPS
- [ ] Configure CORS if needed
- [ ] Set up proper logging
- [ ] Configure email service
- [ ] Set up payment gateway
- [ ] Configure file upload service (AWS S3, Cloudinary)
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure CDN for static assets
- [ ] Set up automated backups
- [ ] Configure rate limiting
- [ ] Review security headers

## Next Steps

1. **Customize Branding**
   - Update colors in `app/globals.css`
   - Update site config in `config/site.ts`
   - Add your logo and favicon

2. **Configure Email**
   - Set up SMTP credentials
   - Implement email templates
   - Test notification system

3. **Payment Integration**
   - Choose payment gateway (SSLCommerz, bKash, Stripe)
   - Implement payment flow
   - Test transactions

4. **Content Management**
   - Add more categories
   - Add medicines
   - Configure shipping zones
   - Set delivery fees

5. **Testing**
   - Test all user flows
   - Test on mobile devices
   - Test payment process
   - Test prescription upload

## Support

For issues or questions:
- Check documentation in README.md
- Review code comments
- Contact: support@medora.com

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:push         # Push schema changes
npm run db:seed         # Seed database
npm run db:studio       # Open Prisma Studio
npx prisma migrate dev  # Create migration

# Code Quality
npm run lint            # Run ESLint

# Package Management
npm install <package>   # Install package
npm update             # Update packages
npm audit fix          # Fix security issues
```

---

🎉 **Congratulations!** Your Medora pharmacy platform is now ready for development!
