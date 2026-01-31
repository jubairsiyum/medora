import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate, requireRole } from '@/lib/auth/middleware';
import { Role, OrderStatus, PaymentStatus } from '@prisma/client';

// GET /api/admin/orders/[id] - Get single order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN, Role.PHARMACIST]);

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            address: true,
            city: true,
            state: true,
            zipCode: true,
          }
        },
        items: {
          include: {
            medicine: {
              select: {
                id: true,
                name: true,
                genericName: true,
                images: true,
                sku: true,
                stock: true,
              }
            }
          }
        },
        prescription: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Admin order GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch order' },
      { status: error.status || 500 }
    );
  }
}

// PUT /api/admin/orders/[id] - Update order status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN, Role.PHARMACIST]);

    const body = await request.json();

    const order = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};

    if (body.status) {
      updateData.status = body.status as OrderStatus;
      
      // Auto-update deliveredAt when status is DELIVERED
      if (body.status === OrderStatus.DELIVERED) {
        updateData.deliveredAt = new Date();
      }
    }

    if (body.paymentStatus) {
      updateData.paymentStatus = body.paymentStatus as PaymentStatus;
    }

    if (body.trackingNumber !== undefined) {
      updateData.trackingNumber = body.trackingNumber || null;
    }

    if (body.estimatedDelivery) {
      updateData.estimatedDelivery = new Date(body.estimatedDelivery);
    }

    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true }
        },
        items: {
          include: {
            medicine: {
              select: { id: true, name: true, images: true }
            }
          }
        },
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error('Admin order PUT error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update order' },
      { status: error.status || 500 }
    );
  }
}
