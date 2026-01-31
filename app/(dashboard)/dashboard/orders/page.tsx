'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Eye, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  itemCount: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">My Orders</h1>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse border-slate-200 dark:border-slate-800">
            <CardContent className="p-6">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">My Orders</h1>
        <p className="text-slate-600 dark:text-slate-400">{orders.length} orders</p>
      </div>

      {orders.length === 0 ? (
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-50">
              No orders yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Start shopping to see your orders here
            </p>
            <Button asChild className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200">
              <Link href="/medicines">Browse Medicines</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-50">
                        Order #{order.orderNumber}
                      </h3>
                      <Badge variant="secondary" className={getStatusColor(order.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <p>Placed on {new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                      <p>{order.itemCount} items</p>
                      <p className="font-medium text-slate-900 dark:text-slate-50">
                        Total: ৳{order.totalAmount}
                      </p>
                    </div>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="border-slate-300 dark:border-slate-700 w-full md:w-auto"
                  >
                    <Link href={`/dashboard/orders/${order.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
