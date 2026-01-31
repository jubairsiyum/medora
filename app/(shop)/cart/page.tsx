'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cart';
import { toast } from 'sonner';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    updateQuantity(id, quantity);
  };

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id);
    toast.success(`${name} removed from cart`);
  };

  const subtotal = getTotalPrice();
  const deliveryCharge = subtotal >= 1000 ? 0 : 60;
  const total = subtotal + deliveryCharge;

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 dark:bg-slate-950">
          <div className="container py-16">
            <Card className="max-w-md mx-auto text-center border-slate-200 dark:border-slate-800">
              <CardContent className="p-12">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-50">
                  Your cart is empty
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Add some medicines to get started
                </p>
                <Button asChild className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200">
                  <Link href="/medicines">Browse Medicines</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-slate-50 dark:bg-slate-950">
        <div className="container py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              Shopping Cart
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="border-slate-200 dark:border-slate-800">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="flex-shrink-0 w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden">
                        <Image
                          src={item.image || '/placeholder-medicine.jpg'}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="object-contain p-2"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
                          ৳{item.price}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="h-8 w-8 p-0 border-slate-300 dark:border-slate-700"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium text-slate-900 dark:text-slate-50">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0 border-slate-300 dark:border-slate-700"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveItem(item.id, item.name)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
                          ৳{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Clear Cart */}
              <Button
                variant="outline"
                onClick={() => {
                  clearCart();
                  toast.success('Cart cleared');
                }}
                className="border-slate-300 dark:border-slate-700 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-slate-200 dark:border-slate-800">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                    Order Summary
                  </h2>

                  <div className="space-y-3 text-sm">
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
                    {subtotal < 1000 && deliveryCharge > 0 && (
                      <p className="text-xs text-slate-500">
                        Add ৳{1000 - subtotal} more for free delivery
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-baseline mb-4">
                      <span className="font-semibold text-slate-900 dark:text-slate-50">Total</span>
                      <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                        ৳{total}
                      </span>
                    </div>

                    <Button
                      asChild
                      size="lg"
                      className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200"
                    >
                      <Link href="/checkout">
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>

                  {/* Continue Shopping */}
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-slate-300 dark:border-slate-700"
                  >
                    <Link href="/medicines">Continue Shopping</Link>
                  </Button>

                  {/* Trust Badges */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span>100% Genuine Medicines</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span>Fast Delivery</span>
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
