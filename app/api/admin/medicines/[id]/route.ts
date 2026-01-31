import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate, requireRole } from '@/lib/auth/middleware';
import { Role } from '@prisma/client';

// GET /api/admin/medicines/[id] - Get single medicine
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN, Role.PHARMACIST]);

    const medicine = await prisma.medicine.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        brand: true,
        reviews: {
          include: {
            user: {
              select: { name: true, image: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            reviews: true,
            orderItems: true,
            wishlistItems: true,
          }
        }
      },
    });

    if (!medicine) {
      return NextResponse.json(
        { error: 'Medicine not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(medicine);
  } catch (error: any) {
    console.error('Admin medicine GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch medicine' },
      { status: error.status || 500 }
    );
  }
}

// PUT /api/admin/medicines/[id] - Update medicine
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN, Role.PHARMACIST]);

    const body = await request.json();

    // Check if medicine exists
    const existingMedicine = await prisma.medicine.findUnique({
      where: { id: params.id },
    });

    if (!existingMedicine) {
      return NextResponse.json(
        { error: 'Medicine not found' },
        { status: 404 }
      );
    }

    // Generate slug if name is being changed
    let slug = existingMedicine.slug;
    if (body.name && body.name !== existingMedicine.name) {
      slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const medicine = await prisma.medicine.update({
      where: { id: params.id },
      data: {
        ...(body.name && { name: body.name, slug }),
        ...(body.genericName && { genericName: body.genericName }),
        ...(body.description && { description: body.description }),
        ...(body.dosage && { dosage: body.dosage }),
        ...(body.form && { form: body.form }),
        ...(body.strength && { strength: body.strength }),
        ...(body.packSize && { packSize: body.packSize }),
        ...(body.manufacturer && { manufacturer: body.manufacturer }),
        ...(body.price !== undefined && { price: parseFloat(body.price) }),
        ...(body.discountPrice !== undefined && { 
          discountPrice: body.discountPrice ? parseFloat(body.discountPrice) : null 
        }),
        ...(body.stock !== undefined && { stock: parseInt(body.stock) }),
        ...(body.prescriptionRequired !== undefined && { prescriptionRequired: body.prescriptionRequired }),
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.active !== undefined && { active: body.active }),
        ...(body.categoryId && { categoryId: body.categoryId }),
        ...(body.brandId !== undefined && { brandId: body.brandId || null }),
        ...(body.images && { images: body.images }),
        ...(body.uses && { uses: body.uses }),
        ...(body.sideEffects && { sideEffects: body.sideEffects }),
        ...(body.warnings && { warnings: body.warnings }),
        ...(body.interactions && { interactions: body.interactions }),
        ...(body.contraindications && { contraindications: body.contraindications }),
        ...(body.barcode !== undefined && { barcode: body.barcode || null }),
      },
      include: {
        category: true,
        brand: true,
      },
    });

    return NextResponse.json(medicine);
  } catch (error: any) {
    console.error('Admin medicine PUT error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update medicine' },
      { status: error.status || 500 }
    );
  }
}

// DELETE /api/admin/medicines/[id] - Delete medicine
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN]);

    // Check if medicine exists
    const medicine = await prisma.medicine.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { orderItems: true }
        }
      }
    });

    if (!medicine) {
      return NextResponse.json(
        { error: 'Medicine not found' },
        { status: 404 }
      );
    }

    // Don't allow deletion if medicine has orders
    if (medicine._count.orderItems > 0) {
      return NextResponse.json(
        { error: 'Cannot delete medicine with existing orders. Consider deactivating instead.' },
        { status: 400 }
      );
    }

    await prisma.medicine.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Medicine deleted successfully' });
  } catch (error: any) {
    console.error('Admin medicine DELETE error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete medicine' },
      { status: error.status || 500 }
    );
  }
}
