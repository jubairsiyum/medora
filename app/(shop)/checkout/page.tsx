'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cart';
import { toast } from 'sonner';
import { ArrowLeft, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Dhaka',
    state: 'Dhaka',
    zipCode: '',
    notes: '',
    paymentMethod: 'cash',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        ...formData,
        items,
        totalAmount: total,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        clearCart();
        toast.success('Order placed successfully!');
        router.push(`/dashboard/orders/${data.orderId}`);
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getTotalPrice();
  const deliveryCharge = subtotal >= 1000 ? 0 : 60;
  const total = subtotal + deliveryCharge;

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-slate-50 dark:bg-slate-950">
        <div className="container py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              asChild
              className="mb-4 -ml-4 text-slate-600 dark:text-slate-400"
            >
              <Link href="/cart">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Cart
              </Link>
            </Button>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">Checkout</h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} id="checkout-form">
                {/* Delivery Information */}
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Truck className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                        Delivery Information
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                            className="mt-1.5 border-slate-300 dark:border-slate-700"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="01XXXXXXXXX"
                            required
                            className="mt-1.5 border-slate-300 dark:border-slate-700"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email (Optional)</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          className="mt-1.5 border-slate-300 dark:border-slate-700"
                        />
                      </div>

                      <div>
                        <Label htmlFor="address">Delivery Address *</Label>
                        <Textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="House/Flat no., Street, Area"
                          required
                          className="mt-1.5 border-slate-300 dark:border-slate-700"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <select
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm mt-1.5"
                            required
                          >
                            <option value="Dhaka">Dhaka</option>
                            <option value="Chittagong">Chittagong</option>
                            <option value="Sylhet">Sylhet</option>
                            <option value="Rajshahi">Rajshahi</option>
                            <option value="Khulna">Khulna</option>
                            <option value="Barisal">Barisal</option>
                            <option value="Rangpur">Rangpur</option>
                            <option value="Mymensingh">Mymensingh</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="state">Division *</Label>
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                            className="mt-1.5 border-slate-300 dark:border-slate-700"
                          />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">Postal Code *</Label>
                          <Input
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            placeholder="1200"
                            required
                            className="mt-1.5 border-slate-300 dark:border-slate-700"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="notes">Order Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Any special instructions for delivery..."
                          className="mt-1.5 border-slate-300 dark:border-slate-700"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <CreditCard className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                        Payment Method
                      </h2>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-start gap-3 p-4 border-2 border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={formData.paymentMethod === 'cash'}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-slate-50">
                            Cash on Delivery
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Pay when you receive your medicines
                          </p>
                          <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            Recommended
                          </Badge>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-4 border-2 border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors opacity-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="online"
                          disabled
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-slate-50">
                            Online Payment
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            bKash, Nagad, Rocket (Coming Soon)
                          </p>
                        </div>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-slate-200 dark:border-slate-800">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                    Order Summary
                  </h2>

                  {/* Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3 text-sm">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded flex-shrink-0 overflow-hidden">
                          <Image
                            src={item.image || '/placeholder-medicine.jpg'}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 dark:text-slate-50 truncate">
                            {item.name}
                          </p>
                          <p className="text-slate-600 dark:text-slate-400">
                            {item.quantity} × ৳{item.price}
                          </p>
                        </div>
                        <p className="font-medium text-slate-900 dark:text-slate-50">
                          ৳{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                      <span className="font-medium text-slate-900 dark:text-slate-50">
                        ৳{subtotal}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Delivery</span>
                      <span className="font-medium text-slate-900 dark:text-slate-50">
                        {deliveryCharge === 0 ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            FREE
                          </Badge>
                        ) : (
                          `৳${deliveryCharge}`
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-baseline mb-6">
                      <span className="font-semibold text-slate-900 dark:text-slate-50">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                        ৳{total}
                      </span>
                    </div>

                    <Button
                      type="submit"
                      form="checkout-form"
                      size="lg"
                      className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200"
                      disabled={loading}
                    >
                      {loading ? 'Placing Order...' : 'Place Order'}
                    </Button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
                      <ShieldCheck className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <p>
                        Your personal information is secure and will only be used for order
                        processing
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
