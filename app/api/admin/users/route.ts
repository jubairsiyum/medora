import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate, requireRole } from '@/lib/auth/middleware';
import { Role } from '@prisma/client';

// GET /api/admin/users - List all users
export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN]);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const role = searchParams.get('role');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const where: any = {};

    if (role) {
      where.role = role as Role;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          emailVerified: true,
          phoneVerified: true,
          image: true,
          address: true,
          city: true,
          state: true,
          zipCode: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
              prescriptions: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Admin users GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: error.status || 500 }
    );
  }
}
