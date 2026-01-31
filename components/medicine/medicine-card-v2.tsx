'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { toast } from 'sonner';

interface MedicineCardProps {
  medicine: {
    id: string;
    name: string;
    slug: string;
    genericName: string;
    manufacturer?: string;
    price: number;
    discountPrice?: number;
    stock: number;
    prescriptionRequired: boolean;
    images: string[];
    category: { name: string; slug: string };
    brand?: { name: string; slug: string };
  };
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: medicine.id,
      name: medicine.name,
      price: medicine.discountPrice || medicine.price,
      image: medicine.images[0] || '/placeholder-medicine.jpg',
      quantity: 1,
      medicineId: medicine.id,
      discountPrice: medicine.discountPrice,
      prescriptionRequired: medicine.prescriptionRequired,
    });
    
    toast.success(`${medicine.name} added to cart!`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success('Added to wishlist!');
  };

  const discount = medicine.discountPrice
    ? Math.round(((medicine.price - medicine.discountPrice) / medicine.price) * 100)
    : 0;

  return (
    <Link href={`/medicines/${medicine.slug}`} className="group block">
      <Card className="relative overflow-hidden border-2 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
        <CardContent className="p-0">
          {/* Image Container with Hover Effects */}
          <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 overflow-hidden">
            <Image
              src={medicine.images[0] || '/placeholder-medicine.jpg'}
              alt={medicine.name}
              fill
              className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
              <div className="flex flex-col gap-2">
                {discount > 0 && (
                  <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg font-bold">
                    {discount}% OFF
                  </Badge>
                )}
                {medicine.prescriptionRequired && (
                  <Badge className="bg-orange-500 text-white border-0 shadow-lg">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Rx Required
                  </Badge>
                )}
              </div>
              
              {/* Wishlist Button */}
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-900 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                onClick={handleWishlist}
              >
                <Heart className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </Button>
            </div>

            {/* Stock Badge */}
            {medicine.stock > 0 && medicine.stock < 10 && (
              <Badge className="absolute bottom-3 left-3 bg-yellow-500 text-white border-0 shadow-lg">
                Only {medicine.stock} left
              </Badge>
            )}
            {medicine.stock === 0 && (
              <Badge className="absolute bottom-3 left-3 bg-slate-500 text-white border-0 shadow-lg">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="p-5">
            {/* Brand & Category */}
            {medicine.brand && (
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1 uppercase tracking-wide">
                {medicine.brand.name}
              </p>
            )}
            
            {/* Product Name */}
            <h3 className="font-bold text-base mb-1 text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {medicine.name}
            </h3>
            
            {/* Generic Name */}
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-1">
              {medicine.genericName}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                ৳{medicine.discountPrice || medicine.price}
              </span>
              {medicine.discountPrice && (
                <span className="text-sm text-slate-500 line-through">
                  ৳{medicine.price}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
              onClick={handleAddToCart}
              disabled={medicine.stock === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4 group-hover/btn:animate-bounce" />
              {medicine.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </CardContent>

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Card>
    </Link>
  );
}
