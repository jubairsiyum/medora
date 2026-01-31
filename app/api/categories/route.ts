import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const parentId = searchParams.get('parentId');
    const includeChildren = searchParams.get('includeChildren') === 'true';
    const includeMedicineCount = searchParams.get('includeMedicineCount') === 'true';

    const where: any = {};
    
    if (parentId !== null) {
      where.parentId = parentId === 'null' ? null : parentId;
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        children: includeChildren,
        _count: includeMedicineCount ? {
          select: { medicines: true }
        } : false,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Transform the response to include medicineCount if requested
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      parentId: category.parentId,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      children: includeChildren ? category.children : undefined,
      medicineCount: includeMedicineCount ? (category as any)._count?.medicines : undefined,
    }));

    return NextResponse.json(transformedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, image, parentId } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if category with same name or slug already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name },
          { slug },
        ],
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name or slug already exists' },
        { status: 409 }
      );
    }

    // Create the category
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
        parentId,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
