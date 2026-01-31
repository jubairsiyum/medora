import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate, requireRole } from '@/lib/auth/middleware';
import { Role } from '@prisma/client';

// GET /api/admin/medicines - List all medicines with pagination
export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN, Role.PHARMACIST]);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const active = searchParams.get('active');

    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { genericName: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    if (active !== null && active !== undefined) {
      where.active = active === 'true';
    }

    const [medicines, total] = await Promise.all([
      prisma.medicine.findMany({
        where,
        include: {
          category: { select: { name: true, slug: true } },
          brand: { select: { name: true, slug: true } },
          _count: {
            select: { reviews: true, orderItems: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.medicine.count({ where }),
    ]);

    return NextResponse.json({
      medicines,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Admin medicines GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch medicines' },
      { status: error.status || 500 }
    );
  }
}

// POST /api/admin/medicines - Create new medicine
export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN, Role.PHARMACIST]);

    const body = await request.json();

    // Generate slug from name
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Generate SKU if not provided
    const sku = body.sku || `MED-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const medicine = await prisma.medicine.create({
      data: {
        name: body.name,
        slug,
        genericName: body.genericName,
        description: body.description,
        dosage: body.dosage,
        form: body.form,
        strength: body.strength,
        packSize: body.packSize,
        manufacturer: body.manufacturer,
        price: parseFloat(body.price),
        discountPrice: body.discountPrice ? parseFloat(body.discountPrice) : null,
        stock: parseInt(body.stock) || 0,
        prescriptionRequired: body.prescriptionRequired === true,
        featured: body.featured === true,
        active: body.active !== false,
        categoryId: body.categoryId,
        brandId: body.brandId || null,
        images: body.images || [],
        uses: body.uses || '',
        sideEffects: body.sideEffects || '',
        warnings: body.warnings || '',
        interactions: body.interactions || '',
        contraindications: body.contraindications || '',
        sku,
        barcode: body.barcode || null,
      },
      include: {
        category: true,
        brand: true,
      },
    });

    return NextResponse.json(medicine, { status: 201 });
  } catch (error: any) {
    console.error('Admin medicines POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create medicine' },
      { status: error.status || 500 }
    );
  }
}
