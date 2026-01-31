import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate, requireRole } from '@/lib/auth/middleware';
import { Role, PrescriptionStatus } from '@prisma/client';

// GET /api/admin/prescriptions/[id] - Get single prescription
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN, Role.PHARMACIST]);

    const prescription = await prisma.prescription.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
          }
        },
        order: {
          include: {
            items: {
              include: {
                medicine: {
                  select: { id: true, name: true, images: true }
                }
              }
            }
          }
        },
      },
    });

    if (!prescription) {
      return NextResponse.json(
        { error: 'Prescription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(prescription);
  } catch (error: any) {
    console.error('Admin prescription GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch prescription' },
      { status: error.status || 500 }
    );
  }
}

// PUT /api/admin/prescriptions/[id] - Update prescription status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN, Role.PHARMACIST]);

    const body = await request.json();

    const prescription = await prisma.prescription.findUnique({
      where: { id: params.id },
    });

    if (!prescription) {
      return NextResponse.json(
        { error: 'Prescription not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};

    if (body.status) {
      updateData.status = body.status as PrescriptionStatus;
      
      if (body.status === PrescriptionStatus.APPROVED) {
        updateData.approvedBy = user?.userId;
        updateData.approvedAt = new Date();
      }
    }

    if (body.adminNotes !== undefined) {
      updateData.adminNotes = body.adminNotes;
    }

    const updatedPrescription = await prisma.prescription.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true }
        },
      },
    });

    return NextResponse.json(updatedPrescription);
  } catch (error: any) {
    console.error('Admin prescription PUT error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update prescription' },
      { status: error.status || 500 }
    );
  }
}
