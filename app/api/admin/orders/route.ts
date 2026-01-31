import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate, requireRole } from '@/lib/auth/middleware';
import { Role, OrderStatus } from '@prisma/client';

// GET /api/admin/orders - List all orders
export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN, Role.PHARMACIST]);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status as OrderStatus;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { deliveryPhone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true, image: true }
          },
          items: {
            include: {
              medicine: {
                select: { id: true, name: true, images: true, genericName: true }
              }
            }
          },
          prescription: {
            select: { id: true, image: true, status: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Admin orders GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: error.status || 500 }
    );
  }
}
