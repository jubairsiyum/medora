import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate, requireRole } from '@/lib/auth/middleware';
import { Role } from '@prisma/client';

// PUT /api/admin/categories/[id] - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN]);

    const body = await request.json();

    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    let slug = existingCategory.slug;
    if (body.name && body.name !== existingCategory.name) {
      slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        ...(body.name && { name: body.name, slug }),
        ...(body.description !== undefined && { description: body.description || null }),
        ...(body.image !== undefined && { image: body.image || null }),
        ...(body.parentId !== undefined && { parentId: body.parentId || null }),
      },
      include: {
        parent: true,
        children: true,
      },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    console.error('Admin category PUT error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update category' },
      { status: error.status || 500 }
    );
  }
}

// DELETE /api/admin/categories/[id] - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN]);

    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { medicines: true, children: true }
        }
      }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    if (category._count.medicines > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with medicines' },
        { status: 400 }
      );
    }

    if (category._count.children > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with subcategories' },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Admin category DELETE error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete category' },
      { status: error.status || 500 }
    );
  }
}
