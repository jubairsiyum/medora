import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate, requireRole } from '@/lib/auth/middleware';
import { Role } from '@prisma/client';

// GET /api/admin/users/[id] - Get single user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN]);

    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        emailVerified: true,
        phoneVerified: true,
        image: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        createdAt: true,
        updatedAt: true,
        orders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            total: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        prescriptions: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            medicine: {
              select: { id: true, name: true }
            },
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(targetUser);
  } catch (error: any) {
    console.error('Admin user GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user' },
      { status: error.status || 500 }
    );
  }
}

// PUT /api/admin/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN]);

    const body = await request.json();

    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.role && { role: body.role as Role }),
        ...(body.emailVerified !== undefined && { emailVerified: body.emailVerified }),
        ...(body.phoneVerified !== undefined && { phoneVerified: body.phoneVerified }),
        ...(body.address !== undefined && { address: body.address || null }),
        ...(body.city !== undefined && { city: body.city || null }),
        ...(body.state !== undefined && { state: body.state || null }),
        ...(body.zipCode !== undefined && { zipCode: body.zipCode || null }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        emailVerified: true,
        phoneVerified: true,
        image: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error('Admin user PUT error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: error.status || 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN]);

    // Prevent admin from deleting themselves
    if (user?.userId === params.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Don't allow deletion if user has orders
    if (targetUser._count.orders > 0) {
      return NextResponse.json(
        { error: 'Cannot delete user with existing orders' },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Admin user DELETE error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: error.status || 500 }
    );
  }
}
