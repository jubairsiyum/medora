import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate, requireRole } from '@/lib/auth/middleware';
import { Role, PrescriptionStatus } from '@prisma/client';

// GET /api/admin/prescriptions - List all prescriptions
export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN, Role.PHARMACIST]);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status as PrescriptionStatus;
    }

    const [prescriptions, total] = await Promise.all([
      prisma.prescription.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true, image: true }
          },
          order: {
            select: { id: true, orderNumber: true, status: true, total: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.prescription.count({ where }),
    ]);

    return NextResponse.json({
      prescriptions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Admin prescriptions GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch prescriptions' },
      { status: error.status || 500 }
    );
  }
}
