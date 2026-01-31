import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate, requireRole } from '@/lib/auth/middleware';
import { Role } from '@prisma/client';

// GET /api/admin/brands - List all brands
export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN, Role.PHARMACIST]);

    const brands = await prisma.brand.findMany({
      include: {
        _count: {
          select: { medicines: true }
        }
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ brands });
  } catch (error: any) {
    console.error('Admin brands GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch brands' },
      { status: error.status || 500 }
    );
  }
}

// POST /api/admin/brands - Create new brand
export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN]);

    const body = await request.json();

    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const brand = await prisma.brand.create({
      data: {
        name: body.name,
        slug,
        description: body.description || null,
        logo: body.logo || null,
      },
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (error: any) {
    console.error('Admin brands POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create brand' },
      { status: error.status || 500 }
    );
  }
}
