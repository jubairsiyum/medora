import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate, requireRole } from '@/lib/auth/middleware';
import { Role } from '@prisma/client';

// GET /api/admin/stats - Dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request);
    requireRole(user, [Role.ADMIN, Role.PHARMACIST]);

    const [
      totalOrders,
      totalRevenue,
      totalUsers,
      totalMedicines,
      pendingPrescriptions,
      lowStockMedicines,
      recentOrders,
      topMedicines,
    ] = await Promise.all([
      // Total orders count
      prisma.order.count(),
      
      // Total revenue
      prisma.order.aggregate({
        where: { paymentStatus: 'COMPLETED' },
        _sum: { total: true },
      }),
      
      // Total users
      prisma.user.count(),
      
      // Total medicines
      prisma.medicine.count({ where: { active: true } }),
      
      // Pending prescriptions
      prisma.prescription.count({ where: { status: 'PENDING' } }),
      
      // Low stock medicines (stock < 10)
      prisma.medicine.count({ where: { stock: { lt: 10 }, active: true } }),
      
      // Recent orders
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true }
          },
        },
      }),
      
      // Top selling medicines
      prisma.medicine.findMany({
        take: 10,
        where: { active: true },
        include: {
          _count: {
            select: { orderItems: true }
          },
          category: {
            select: { name: true }
          },
        },
        orderBy: {
          orderItems: {
            _count: 'desc'
          }
        },
      }),
    ]);

    return NextResponse.json({
      overview: {
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        totalUsers,
        totalMedicines,
        pendingPrescriptions,
        lowStockMedicines,
      },
      recentOrders,
      topMedicines,
    });
  } catch (error: any) {
    console.error('Admin stats GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch statistics' },
      { status: error.status || 500 }
    );
  }
}
