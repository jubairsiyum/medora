# Medora - Online Pharmacy Platform

A production-ready, scalable medicine e-commerce platform built with modern web technologies. Medora provides a complete solution for online pharmacy operations with features for customers, pharmacists, and administrators.

## 🚀 Features

### Customer Features
- 🔍 **Advanced Medicine Search** - Search by name, generic name, or disease
- 🛒 **Shopping Cart** - Add medicines to cart with quantity management
- 📋 **Prescription Upload** - Upload and track prescription verification
- 👤 **User Dashboard** - Manage orders, prescriptions, and profile
- ❤️ **Wishlist** - Save favorite medicines for later
- ⭐ **Reviews & Ratings** - Read and write medicine reviews
- 📱 **Responsive Design** - Fully optimized for mobile, tablet, and desktop
- 🔔 **Order Tracking** - Real-time order status updates

### Admin Features
- 📊 **Admin Dashboard** - Comprehensive analytics and insights
- 💊 **Medicine Management** - CRUD operations for medicines
- 📁 **Category & Brand Management** - Organize products efficiently
- 🧾 **Order Management** - Process and track all orders
- ✅ **Prescription Approval** - Review and approve customer prescriptions
- 👥 **User Management** - Manage customer and staff accounts
- 💬 **Review Moderation** - Monitor and manage product reviews

### Technical Features
- 🔐 **Secure Authentication** - JWT with refresh token mechanism
- 🎭 **Role-Based Access Control** - Customer, Pharmacist, Admin roles
- 📱 **PWA Support** - Installable, offline-capable progressive web app
- 🎨 **Modern UI/UX** - Healthcare-themed design with Shadcn UI
- 🚀 **SEO Optimized** - Server-side rendering with Next.js
- 🔒 **Security Best Practices** - Password hashing, input validation
- 📧 **Email Ready** - Email notification architecture
- 💳 **Payment Ready** - Structured for payment gateway integration

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - High-quality component library
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **PostgreSQL** - Relational database
- **Prisma ORM** - Type-safe database client
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd medora.com.bd
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your database credentials and secrets:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/medora_db"
   JWT_SECRET="your-secret-key-here"
   JWT_REFRESH_SECRET="your-refresh-secret-key-here"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**
   
   Push the database schema:
   ```bash
   npm run db:push
   ```

   Seed the database with sample data:
   ```bash
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 🔑 Default Credentials

After seeding the database, you can log in with these credentials:

**Admin Account:**
- Email: `admin@medora.com`
- Password: `Admin@123`

**Test Customer:**
- Email: `customer@test.com`
- Password: `Test@123`

## 📁 Project Structure

```
medora.com.bd/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   ├── (dashboard)/              # User dashboard pages
│   ├── (shop)/                   # Shopping pages
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── medicines/            # Medicine endpoints
│   │   ├── orders/               # Order endpoints
│   │   └── ...
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── layout/                   # Header, Footer
│   ├── ui/                       # Shadcn UI components
│   └── ...
├── lib/                          # Utilities
│   ├── auth/                     # Authentication
│   ├── db/                       # Database
│   └── validations/              # Zod schemas
├── store/                        # Zustand stores
├── types/                        # TypeScript types
├── config/                       # Configuration
├── prisma/                       # Database schema
└── public/                       # Static assets
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Access tokens (15 min) + Refresh tokens (7 days)
- **Input Validation**: Zod schemas for all inputs
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **Role-Based Access Control**: Admin, Pharmacist, Customer roles

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Recommended Platforms
- **Vercel** (Recommended for Next.js)
- **Railway** (With PostgreSQL)
- **Render**
- **DigitalOcean**

## 🔮 Future Enhancements

- [ ] Payment Gateway Integration
- [ ] Email Notifications
- [ ] SMS Notifications
- [ ] Advanced Analytics
- [ ] Telemedicine Integration
- [ ] Medicine Reminder System
- [ ] Mobile Apps

---

Built with ❤️ for better healthcare access
