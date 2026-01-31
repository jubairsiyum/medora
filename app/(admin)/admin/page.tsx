'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { 
  ShoppingBag, 
  DollarSign, 
  Users, 
  Pill, 
  FileText, 
  AlertTriangle,
  TrendingUp,
  Package,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';

interface Stats {
  overview: {
    totalOrders: number;
    totalRevenue: number;
    totalUsers: number;
    totalMedicines: number;
    pendingPrescriptions: number;
    lowStockMedicines: number;
  };
  recentOrders: any[];
  topMedicines: any[];
}

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!user || (user.role !== 'ADMIN' && user.role !== 'PHARMACIST')) {
      router.push('/');
      return;
    }

    fetchStats();
  }, [user, router]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch stats');

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600">Failed to load dashboard</div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.overview.totalOrders,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/admin/orders',
    },
    {
      title: 'Total Revenue',
      value: `৳${stats.overview.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/admin/orders',
    },
    {
      title: 'Total Users',
      value: stats.overview.totalUsers,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/admin/users',
    },
    {
      title: 'Active Medicines',
      value: stats.overview.totalMedicines,
      icon: Pill,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      href: '/admin/medicines',
    },
    {
      title: 'Pending Prescriptions',
      value: stats.overview.pendingPrescriptions,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      href: '/admin/prescriptions',
      badge: stats.overview.pendingPrescriptions > 0,
    },
    {
      title: 'Low Stock Items',
      value: stats.overview.lowStockMedicines,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      href: '/admin/medicines',
      badge: stats.overview.lowStockMedicines > 0,
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              {stat.badge && (
                <Badge variant="destructive" className="mt-4">
                  Needs Attention
                </Badge>
              )}
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Orders & Top Medicines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-[#1E9972] hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentOrders.slice(0, 5).map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-gray-600">{order.user.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">৳{order.total.toFixed(2)}</p>
                  <Badge variant={order.status === 'DELIVERED' ? 'default' : 'secondary'} className="text-xs">
                    {order.status}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Top Medicines */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Top Selling Medicines</h2>
            <Link href="/admin/medicines" className="text-sm text-[#1E9972] hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {stats.topMedicines.slice(0, 5).map((medicine) => (
              <Link
                key={medicine.id}
                href={`/admin/medicines/${medicine.id}`}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium text-sm">{medicine.name}</p>
                    <p className="text-xs text-gray-600">{medicine.category.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">৳{medicine.price.toFixed(2)}</p>
                  <p className="text-xs text-gray-600">Stock: {medicine.stock}</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
