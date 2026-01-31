import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate, requireRole } from '@/lib/auth/middleware';
import { Role } from '@prisma/client';

// GET /api/admin/categories - List all categories
export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN, Role.PHARMACIST]);

    const categories = await prisma.category.findMany({
      include: {
        parent: {
          select: { id: true, name: true, slug: true }
        },
        children: {
          select: { id: true, name: true, slug: true }
        },
        _count: {
          select: { medicines: true }
        }
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error('Admin categories GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch categories' },
      { status: error.status || 500 }
    );
  }
}

// POST /api/admin/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN]);

    const body = await request.json();

    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug,
        description: body.description || null,
        image: body.image || null,
        parentId: body.parentId || null,
      },
      include: {
        parent: true,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('Admin categories POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create category' },
      { status: error.status || 500 }
    );
  }
}
