'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, User, MapPin, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user || (user.role !== 'ADMIN' && user.role !== 'PHARMACIST')) {
      router.push('/');
      return;
    }
    fetchOrder();
  }, [user, router, params.id]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/admin/orders/${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch order');

      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (status: string) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/admin/orders/${params.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update order');

      const data = await response.json();
      setOrder(data);
      toast.success('Order status updated');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600">Order not found</div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PROCESSING: 'bg-purple-100 text-purple-800',
    SHIPPED: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  return (
    <div className="p-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orders
      </Button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-600 mt-1">Order #{order.orderNumber}</p>
        </div>
        <Badge className={statusColors[order.status]}>
          {order.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                  <div className="flex items-center gap-4">
                    <Package className="h-10 w-10 text-gray-400" />
                    <div>
                      <p className="font-medium">{item.medicine.name}</p>
                      <p className="text-sm text-gray-600">{item.medicine.genericName}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">৳{item.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">৳{item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>৳{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span>৳{order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span>৳{order.tax.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-৳{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>৳{order.total.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Update Status</h2>
            <Select
              value={order.status}
              onValueChange={updateOrderStatus}
              disabled={updating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </h2>
            <div className="space-y-2">
              <p className="font-medium">{order.user.name}</p>
              <p className="text-sm text-gray-600">{order.user.email}</p>
              <p className="text-sm text-gray-600">{order.user.phone}</p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Delivery Address
            </h2>
            <div className="space-y-1">
              <p className="text-sm">{order.deliveryAddress}</p>
              <p className="text-sm">{order.deliveryCity}, {order.deliveryState}</p>
              <p className="text-sm">{order.deliveryZipCode}</p>
              <p className="text-sm font-medium mt-2">{order.deliveryPhone}</p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-600">Ordered</p>
                <p className="font-medium">{format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}</p>
              </div>
              {order.deliveredAt && (
                <div>
                  <p className="text-gray-600">Delivered</p>
                  <p className="font-medium">{format(new Date(order.deliveredAt), 'MMM dd, yyyy HH:mm')}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
