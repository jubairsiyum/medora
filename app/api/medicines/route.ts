import { NextRequest, NextResponse } from 'next/server';
import { authenticate, requireRole } from '@/lib/auth/middleware';
import { medicineSchema, medicineSearchSchema } from '@/lib/validations/medicine';
import prisma from '@/lib/db/prisma';
import { Role } from '@prisma/client';

// GET /api/medicines - List medicines with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const queryParams = {
      query: searchParams.get('query') || undefined,
      category: searchParams.get('category') || undefined,
      brand: searchParams.get('brand') || undefined,
      prescriptionRequired: searchParams.get('prescriptionRequired') === 'true' ? true : undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      sortBy: searchParams.get('sortBy') as any || undefined,
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc',
    };

    const validated = medicineSearchSchema.parse(queryParams);

    // Build where clause
    const where: any = {
      active: true,
    };

    if (validated.query) {
      where.OR = [
        { name: { contains: validated.query, mode: 'insensitive' } },
        { genericName: { contains: validated.query, mode: 'insensitive' } },
        { description: { contains: validated.query, mode: 'insensitive' } },
      ];
    }

    if (validated.category) {
      where.category = { slug: validated.category };
    }

    if (validated.brand) {
      where.brand = { slug: validated.brand };
    }

    if (validated.prescriptionRequired !== undefined) {
      where.prescriptionRequired = validated.prescriptionRequired;
    }

    if (validated.featured !== undefined) {
      where.featured = validated.featured;
    }

    if (validated.minPrice !== undefined || validated.maxPrice !== undefined) {
      where.price = {};
      if (validated.minPrice !== undefined) {
        where.price.gte = validated.minPrice;
      }
      if (validated.maxPrice !== undefined) {
        where.price.lte = validated.maxPrice;
      }
    }

    // Build orderBy clause
    const orderBy: any = {};
    if (validated.sortBy) {
      orderBy[validated.sortBy] = validated.sortOrder;
    } else {
      orderBy.createdAt = 'desc';
    }

    // Get total count
    const total = await prisma.medicine.count({ where });

    // Get medicines
    const medicines = await prisma.medicine.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy,
      skip: (validated.page - 1) * validated.limit,
      take: validated.limit,
    });

    // Calculate average rating for each medicine
    const medicinesWithRating = await Promise.all(
      medicines.map(async (medicine) => {
        const avgRating = await prisma.review.aggregate({
          where: { medicineId: medicine.id },
          _avg: { rating: true },
        });

        return {
          ...medicine,
          averageRating: avgRating._avg.rating || 0,
          reviewCount: medicine._count.reviews,
        };
      })
    );

    return NextResponse.json({
      medicines: medicinesWithRating,
      pagination: {
        page: validated.page,
        limit: validated.limit,
        total,
        totalPages: Math.ceil(total / validated.limit),
      },
    });

  } catch (error: any) {
    console.error('Get medicines error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/medicines - Create medicine (Admin/Pharmacist only)
export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN, Role.PHARMACIST]);

    const body = await request.json();
    const validated = medicineSchema.parse(body);

    // Check if slug already exists
    const existing = await prisma.medicine.findUnique({
      where: { slug: validated.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Medicine with this slug already exists' },
        { status: 400 }
      );
    }

    // Create medicine
    const medicine = await prisma.medicine.create({
      data: validated,
      include: {
        category: true,
        brand: true,
      },
    });

    return NextResponse.json(medicine, { status: 201 });

  } catch (error: any) {
    console.error('Create medicine error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    if (error.status) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
