'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  ShoppingCart,
  Heart,
  AlertCircle,
  Package,
  Truck,
  Shield,
  Clock,
  Star,
  Minus,
  Plus,
} from 'lucide-react';
import { MedicineCard } from '@/components/medicine/medicine-card';
import { useCartStore } from '@/store/cart';
import Image from 'next/image';

interface Medicine {
  id: string;
  name: string;
  slug: string;
  genericName: string;
  description: string;
  dosage: string;
  form: string;
  strength: string;
  packSize: string;
  manufacturer: string;
  price: number;
  discountPrice?: number;
  stock: number;
  prescriptionRequired: boolean;
  featured: boolean;
  active: boolean;
  images: string[];
  uses: string;
  sideEffects: string;
  warnings: string;
  interactions: string;
  contraindications: string;
  sku: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function MedicineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [relatedMedicines, setRelatedMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (params.slug) {
      fetchMedicine(params.slug as string);
    }
  }, [params.slug]);

  const fetchMedicine = async (slug: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/medicines/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setMedicine(data.medicine);
        setRelatedMedicines(data.relatedMedicines || []);
      } else {
        router.push('/medicines');
      }
    } catch (error) {
      console.error('Failed to fetch medicine:', error);
      router.push('/medicines');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!medicine) return;
    
    addToCart({
      id: medicine.id,
      name: medicine.name,
      price: medicine.discountPrice || medicine.price,
      image: medicine.images[0] || '/placeholder-medicine.jpg',
      quantity,
    });
    
    toast.success(`${medicine.name} added to cart!`);
  };

  const increaseQuantity = () => {
    if (medicine && quantity < medicine.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="animate-pulse space-y-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!medicine) {
    return null;
  }

  const discount = medicine.discountPrice
    ? Math.round(((medicine.price - medicine.discountPrice) / medicine.price) * 100)
    : 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-6">
            <a href="/medicines" className="hover:text-slate-900 dark:hover:text-slate-50">
              Medicines
            </a>
            <span>/</span>
            <a
              href={`/medicines?category=${medicine.category.slug}`}
              className="hover:text-slate-900 dark:hover:text-slate-50"
            >
              {medicine.category.name}
            </a>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-50">{medicine.name}</span>
          </nav>

          {/* Product Detail */}
          <div className="grid gap-8 lg:grid-cols-2 mb-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <Card className="overflow-hidden border-slate-200 dark:border-slate-800">
                <CardContent className="p-0">
                  <div className="aspect-square relative bg-slate-50 dark:bg-slate-900">
                    <Image
                      src={medicine.images[selectedImage] || '/placeholder-medicine.jpg'}
                      alt={medicine.name}
                      fill
                      className="object-contain p-8"
                    />
                    {discount > 0 && (
                      <Badge className="absolute top-4 right-4 bg-red-500">
                        {discount}% OFF
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {medicine.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {medicine.images.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                        selectedImage === idx
                          ? 'border-slate-900 dark:border-slate-50'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${medicine.name} ${idx + 1}`}
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-slate-50">
                  {medicine.name}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  {medicine.genericName}
                </p>
                {medicine.brand && (
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                    by {medicine.brand.name}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-slate-900 dark:text-slate-50">
                  ৳{medicine.discountPrice || medicine.price}
                </span>
                {medicine.discountPrice && (
                  <span className="text-xl text-slate-500 line-through">
                    ৳{medicine.price}
                  </span>
                )}
              </div>

              {/* Product Details */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardContent className="p-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600 dark:text-slate-400">Form:</span>
                    <span className="ml-2 font-medium text-slate-900 dark:text-slate-50">
                      {medicine.form}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600 dark:text-slate-400">Strength:</span>
                    <span className="ml-2 font-medium text-slate-900 dark:text-slate-50">
                      {medicine.strength}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600 dark:text-slate-400">Pack Size:</span>
                    <span className="ml-2 font-medium text-slate-900 dark:text-slate-50">
                      {medicine.packSize}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600 dark:text-slate-400">Manufacturer:</span>
                    <span className="ml-2 font-medium text-slate-900 dark:text-slate-50">
                      {medicine.manufacturer}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Prescription Warning */}
              {medicine.prescriptionRequired && (
                <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-900">
                  <CardContent className="p-4 flex gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-orange-900 dark:text-orange-100">
                        Prescription Required
                      </p>
                      <p className="text-orange-700 dark:text-orange-300 mt-1">
                        This medicine requires a valid prescription. Please upload your prescription
                        during checkout.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stock Status */}
              <div>
                {medicine.stock > 0 ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    In Stock ({medicine.stock} available)
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                    Out of Stock
                  </Badge>
                )}
              </div>

              {/* Quantity Selector & Add to Cart */}
              {medicine.stock > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Quantity:
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                        className="h-10 w-10 p-0 border-slate-300 dark:border-slate-700"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium text-slate-900 dark:text-slate-50">
                        {quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={increaseQuantity}
                        disabled={quantity >= medicine.stock}
                        className="h-10 w-10 p-0 border-slate-300 dark:border-slate-700"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      size="lg"
                      className="flex-1 bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </Button>
                    <Button size="lg" variant="outline" className="border-slate-300 dark:border-slate-700">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-slate-600 dark:text-slate-400" />
                  <p className="text-xs text-slate-600 dark:text-slate-400">100% Genuine</p>
                </div>
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-slate-600 dark:text-slate-400" />
                  <p className="text-xs text-slate-600 dark:text-slate-400">Fast Delivery</p>
                </div>
                <div className="text-center">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-slate-600 dark:text-slate-400" />
                  <p className="text-xs text-slate-600 dark:text-slate-400">24/7 Support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information Tabs */}
          <Card className="mb-12 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                  <TabsTrigger
                    value="description"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 dark:data-[state=active]:border-slate-50"
                  >
                    Description
                  </TabsTrigger>
                  <TabsTrigger
                    value="uses"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 dark:data-[state=active]:border-slate-50"
                  >
                    Uses
                  </TabsTrigger>
                  <TabsTrigger
                    value="side-effects"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 dark:data-[state=active]:border-slate-50"
                  >
                    Side Effects
                  </TabsTrigger>
                  <TabsTrigger
                    value="warnings"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 dark:data-[state=active]:border-slate-50"
                  >
                    Warnings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-6 text-slate-600 dark:text-slate-400">
                  <p className="leading-relaxed">{medicine.description}</p>
                </TabsContent>

                <TabsContent value="uses" className="mt-6 text-slate-600 dark:text-slate-400">
                  <p className="leading-relaxed whitespace-pre-line">{medicine.uses}</p>
                </TabsContent>

                <TabsContent value="side-effects" className="mt-6 text-slate-600 dark:text-slate-400">
                  <p className="leading-relaxed whitespace-pre-line">{medicine.sideEffects}</p>
                </TabsContent>

                <TabsContent value="warnings" className="mt-6 text-slate-600 dark:text-slate-400">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">Warnings</h4>
                      <p className="leading-relaxed whitespace-pre-line">{medicine.warnings}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">
                        Drug Interactions
                      </h4>
                      <p className="leading-relaxed whitespace-pre-line">{medicine.interactions}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">
                        Contraindications
                      </h4>
                      <p className="leading-relaxed whitespace-pre-line">
                        {medicine.contraindications}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Related Medicines */}
          {relatedMedicines.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-50">
                Related Medicines
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedMedicines.map((relatedMedicine) => (
                  <MedicineCard key={relatedMedicine.id} medicine={relatedMedicine} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
