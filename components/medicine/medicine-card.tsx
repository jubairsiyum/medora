'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Medicine } from '@/types';
import { useCartStore } from '@/store/cart';
import { toast } from 'sonner';

interface MedicineCardProps {
  medicine: Medicine & { averageRating?: number; reviewCount?: number };
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      id: medicine.id,
      medicineId: medicine.id,
      name: medicine.name,
      price: medicine.price,
      discountPrice: medicine.discountPrice,
      quantity: 1,
      image: medicine.images[0] || '/placeholder-medicine.jpg',
      prescriptionRequired: medicine.prescriptionRequired,
    });
    
    toast.success('Added to cart', {
      description: `${medicine.name} has been added to your cart`,
    });
  };

  const displayPrice = medicine.discountPrice || medicine.price;
  const hasDiscount = !!medicine.discountPrice;
  const discountPercent = hasDiscount
    ? Math.round(((medicine.price - medicine.discountPrice!) / medicine.price) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link href={`/medicines/${medicine.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={medicine.images[0] || '/placeholder-medicine.jpg'}
            alt={medicine.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {medicine.featured && (
              <Badge variant="default" className="bg-primary">
                Featured
              </Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive">
                {discountPercent}% OFF
              </Badge>
            )}
            {medicine.prescriptionRequired && (
              <Badge variant="secondary">
                ℞ Prescription Required
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              toast.info('Wishlist feature coming soon!');
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/medicines/${medicine.slug}`}>
          <div className="mb-2">
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {medicine.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {medicine.genericName}
            </p>
          </div>

          {/* Rating */}
          {medicine.reviewCount && medicine.reviewCount > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.round(medicine.averageRating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({medicine.reviewCount})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">
              ৳{displayPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                ৳{medicine.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="mt-2">
            {medicine.stock > 0 ? (
              <p className="text-xs text-green-600">
                {medicine.stock > 10 ? 'In Stock' : `Only ${medicine.stock} left`}
              </p>
            ) : (
              <p className="text-xs text-destructive">Out of Stock</p>
            )}
          </div>
        </Link>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={medicine.stock === 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {medicine.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
}
