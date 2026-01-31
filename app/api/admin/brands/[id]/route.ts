import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate, requireRole } from '@/lib/auth/middleware';
import { Role } from '@prisma/client';

// PUT /api/admin/brands/[id] - Update brand
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN]);

    const body = await request.json();

    const existingBrand = await prisma.brand.findUnique({
      where: { id: params.id },
    });

    if (!existingBrand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    let slug = existingBrand.slug;
    if (body.name && body.name !== existingBrand.name) {
      slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const brand = await prisma.brand.update({
      where: { id: params.id },
      data: {
        ...(body.name && { name: body.name, slug }),
        ...(body.description !== undefined && { description: body.description || null }),
        ...(body.logo !== undefined && { logo: body.logo || null }),
      },
    });

    return NextResponse.json(brand);
  } catch (error: any) {
    console.error('Admin brand PUT error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update brand' },
      { status: error.status || 500 }
    );
  }
}

// DELETE /api/admin/brands/[id] - Delete brand
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN]);

    const brand = await prisma.brand.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { medicines: true }
        }
      }
    });

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    if (brand._count.medicines > 0) {
      return NextResponse.json(
        { error: 'Cannot delete brand with medicines' },
        { status: 400 }
      );
    }

    await prisma.brand.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Brand deleted successfully' });
  } catch (error: any) {
    console.error('Admin brand DELETE error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete brand' },
      { status: error.status || 500 }
    );
  }
}
