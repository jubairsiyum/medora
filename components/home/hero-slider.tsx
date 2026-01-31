'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Pill, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HotProduct {
  id: string;
  name: string;
  slug: string;
  genericName: string;
  price: number;
  discountPrice?: number;
  image: string;
  category: string;
  badge?: string;
}

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<HotProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotProducts();
  }, []);

  const fetchHotProducts = async () => {
    try {
      const response = await fetch('/api/medicines?featured=true&limit=5');
      if (response.ok) {
        const data = await response.json();
        const formattedProducts = (data.medicines || []).map((med: any) => ({
          id: med.id,
          name: med.name,
          slug: med.slug,
          genericName: med.genericName,
          price: med.price,
          discountPrice: med.discountPrice,
          image: med.images?.[0] || '/placeholder-medicine.jpg',
          category: med.category?.name || 'Medicine',
          badge: med.discountPrice ? 'Sale' : 'Hot',
        }));
        setProducts(formattedProducts.length > 0 ? formattedProducts : getDefaultProducts());
      }
    } catch (error) {
      console.error('Failed to fetch hot products:', error);
      setProducts(getDefaultProducts());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultProducts = (): HotProduct[] => [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      slug: 'paracetamol-500mg',
      genericName: 'Paracetamol',
      price: 5,
      discountPrice: 3.50,
      image: '/placeholder-medicine.jpg',
      category: 'Pain Relief',
      badge: 'Sale',
    },
    {
      id: '2',
      name: 'Vitamin C Plus',
      slug: 'vitamin-c-plus',
      genericName: 'Vitamin C',
      price: 8,
      image: '/placeholder-medicine.jpg',
      category: 'Vitamins',
      badge: 'Hot',
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(products.length, 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(products.length, 1)) % Math.max(products.length, 1));
  };

  useEffect(() => {
    if (products.length === 0) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [products.length]);

  const currentProduct = products[currentSlide] || products[0];
  const discount = currentProduct?.discountPrice
    ? Math.round(((currentProduct.price - currentProduct.discountPrice) / currentProduct.price) * 100)
    : 0;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#1E9972] via-[#0F6D5C] to-[#175B64]">
      {/* Hero Slider */}
      <div className="relative h-[280px] sm:h-[350px] md:h-[450px] lg:h-[550px] w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full bg-slate-200 animate-pulse">
            <Pill className="h-12 w-12 text-slate-400" />
          </div>
        ) : (
          <>
            {products.map((product, index) => (
              <div
                key={product.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 h-full items-center">
                  {/* Left Content */}
                  <div className="flex flex-col justify-center px-6 sm:px-8 md:px-12 py-8 text-white order-2 md:order-1">
                    <div className="space-y-4">
                      {/* Badge */}
                      <div className="inline-flex w-fit">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2">
                          {product.badge === 'Sale' ? (
                            <>
                              <TrendingUp className="h-3 w-3" />
                              {discount}% OFF
                            </>
                          ) : (
                            <>
                              <Pill className="h-3 w-3" />
                              HOT PRODUCT
                            </>
                          )}
                        </span>
                      </div>

                      {/* Category */}
                      <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider opacity-90">
                        {product.category}
                      </p>

                      {/* Product Name */}
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                        {product.name}
                      </h2>

                      {/* Generic Name */}
                      <p className="text-sm sm:text-base opacity-90 italic">
                        {product.genericName}
                      </p>

                      {/* Price */}
                      <div className="flex items-center gap-3">
                        {product.discountPrice ? (
                          <>
                            <span className="text-3xl sm:text-4xl font-bold">
                              ৳{product.discountPrice.toFixed(2)}
                            </span>
                            <span className="text-lg line-through opacity-70">
                              ৳{product.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-3xl sm:text-4xl font-bold">
                            ৳{product.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* CTA Button */}
                      <div className="pt-4">
                        <Link href={`/medicines/${product.slug}`}>
                          <Button
                            size="lg"
                            className="bg-white text-[#1E9972] hover:bg-gray-100 font-bold rounded-lg w-full sm:w-auto"
                          >
                            View Details
                            <ChevronRight className="ml-2 h-5 w-5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Right Image */}
                  <div className="relative h-full w-full order-1 md:order-2 flex items-center justify-center">
                    <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 w-full max-w-xs md:max-w-none">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain drop-shadow-xl"
                        priority={index === currentSlide}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Navigation Arrows */}
        {!loading && products.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 md:p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 md:p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </>
        )}
      </div>

      {/* Indicators */}
      {!loading && products.length > 1 && (
        <div className="flex justify-center items-center gap-2 py-4 bg-gradient-to-r from-[#1E9972] to-[#175B64]">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/40 w-2 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
