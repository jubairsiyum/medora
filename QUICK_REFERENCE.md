# Quick Reference - Medora Platform

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup database (if using Prisma Postgres)
npx prisma dev

# OR setup with your PostgreSQL
# Update DATABASE_URL in .env then:
npm run db:push

# Seed database
npm run db:seed

# Start development
npm run dev
```

Visit: http://localhost:3000

## 🔑 Demo Credentials

**Admin**: admin@medora.com / Admin@123  
**Customer**: customer@test.com / Test@123

## 📂 Key Files

### Configuration
- `.env` - Environment variables
- `prisma/schema.prisma` - Database schema
- `config/site.ts` - Site configuration
- `app/globals.css` - Theme colors

### Core Components
- `components/layout/header.tsx` - Navigation
- `components/layout/footer.tsx` - Footer
- `components/medicine/medicine-card.tsx` - Product card

### API Routes
- `app/api/auth/login/route.ts` - Login
- `app/api/auth/register/route.ts` - Register
- `app/api/medicines/route.ts` - List medicines

### State Management
- `store/auth.ts` - Authentication state
- `store/cart.ts` - Shopping cart state

### Utilities
- `lib/auth/jwt.ts` - Token generation/verification
- `lib/auth/password.ts` - Password hashing
- `lib/db/prisma.ts` - Database client

## 🎨 Customization

### Change Brand Colors
```css
/* app/globals.css */
--primary: 142 76% 36%;  /* Green - change to your brand color */
```

### Update Site Info
```typescript
// config/site.ts
export const siteConfig = {
  name: 'Your Name',
  description: 'Your description',
  // ... other config
}
```

### Add Logo
Replace in components:
```tsx
<Pill className="h-6 w-6" /> // Replace with your logo
```

## 🔧 Common Tasks

### Add New API Route
```typescript
// app/api/your-route/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello' });
}
```

### Add Protected Route
```typescript
import { authenticate, requireRole } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
  const user = await authenticate(request);
  requireRole(user, ['ADMIN']); // Throws if not admin
  
  // Your protected logic
}
```

### Create New Component
```tsx
// components/your-component.tsx
'use client';

import { Button } from '@/components/ui/button';

export function YourComponent() {
  return <Button>Click me</Button>;
}
```

### Add to Cart
```typescript
import { useCartStore } from '@/store/cart';

const { addItem } = useCartStore();

addItem({
  id: 'item-id',
  medicineId: 'medicine-id',
  name: 'Medicine Name',
  price: 10.00,
  quantity: 1,
  image: '/image.jpg',
  prescriptionRequired: false,
});
```

## 📊 Database Commands

```bash
# Open Prisma Studio (visual editor)
npm run db:studio

# Push schema changes
npm run db:push

# Seed database
npm run db:seed

# Generate Prisma Client
npx prisma generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## 🐛 Troubleshooting

### Port 3000 in use
```bash
PORT=3001 npm run dev
```

### Database connection error
1. Check PostgreSQL is running
2. Verify DATABASE_URL in .env
3. Test connection: `psql -U postgres`

### Prisma Client not found
```bash
npx prisma generate
```

### Environment variables not loading
1. Restart dev server
2. Check .env file exists
3. No quotes around values in .env

## 📦 Add New Dependencies

```bash
# Install package
npm install package-name

# Install dev dependency
npm install -D package-name

# Install types
npm install -D @types/package-name
```

## 🔐 Security Checklist

- [x] Passwords hashed with bcrypt
- [x] JWT tokens with expiration
- [x] Input validation with Zod
- [x] SQL injection prevention with Prisma
- [x] Environment variables for secrets
- [ ] Rate limiting (add in production)
- [ ] HTTPS (add in production)
- [ ] CORS configuration (add in production)

## 📱 PWA Setup

Manifest is ready at `/public/manifest.json`

To complete PWA:
1. Add service worker
2. Generate app icons (192x192, 384x384, 512x512)
3. Test with Lighthouse

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Environment Variables for Production
```
DATABASE_URL=your-production-db
JWT_SECRET=strong-secret-here
JWT_REFRESH_SECRET=strong-refresh-secret
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 🧪 Testing

### Test API with curl
```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Test@123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrPhone":"admin@medora.com","password":"Admin@123"}'

# Get medicines
curl http://localhost:3000/api/medicines
```

## 📝 Code Snippets

### Toast Notification
```typescript
import { toast } from 'sonner';

toast.success('Success!');
toast.error('Error occurred');
toast.info('Information');
```

### Form with Validation
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
});

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema),
});
```

### Fetch with Auth
```typescript
const { accessToken } = useAuthStore();

const response = await fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
});
```

## 🔗 Useful Links

- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://prisma.io/docs
- Shadcn UI: https://ui.shadcn.com
- Tailwind CSS: https://tailwindcss.com
- TypeScript: https://typescriptlang.org

## 📞 Need Help?

1. Check documentation (README.md, SETUP.md)
2. Review code comments
3. Check TypeScript types
4. Search Next.js/Prisma docs
5. Check error messages in console

---

**Quick Tip**: Use `Ctrl+P` (VS Code) to quickly find files!
