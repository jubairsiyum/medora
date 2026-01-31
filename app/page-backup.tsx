'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Truck, Clock, Shield, Phone, MapPin, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header-new';
import { Footer } from '@/components/layout/footer';
import { HeroSlider } from '@/components/home/hero-slider';
import { CategorySidebar } from '@/components/home/category-sidebar';
import { MobileCategorySidebar } from '@/components/home/mobile-category-sidebar';
import { MedicineCard } from '@/components/medicine/medicine-card';
import { Medicine } from '@/types';

export default function Home() {
  const [featuredMedicines, setFeaturedMedicines] = useState<Medicine[]>([]);
  const [topMedicines, setTopMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const [featured, top] = await Promise.all([
        fetch('/api/medicines?featured=true&limit=8'),
        fetch('/api/medicines?limit=8&sort=popularity'),
      ]);

      if (featured.ok) {
        const data = await featured.json();
        setFeaturedMedicines(data.medicines || []);
      }

      if (top.ok) {
        const data = await top.json();
        setTopMedicines(data.medicines || []);
      }
    } catch (error) {
      console.error('Failed to fetch medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <MobileCategorySidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main className="flex-1">
        {/* Hero Slider Section */}
        <section className="bg-gray-50 py-6 md:py-8 lg:py-10">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8">
            <HeroSlider />
          </div>
        </section>

        {/* Main Content with Sidebar */}
        <section className="py-8 md:py-12 lg:py-16">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar - Desktop Only */}
              <aside className="hidden lg:block">
                <CategorySidebar />
              </aside>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Featured Medicines */}
                <div className="mb-16">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">Featured Medicines</h2>
                      <p className="text-gray-600 mt-2">Handpicked health solutions for you</p>
                    </div>
                    <Link href="/medicines">
                      <Button variant="outline" className="gap-2">
                        View All
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
                      ))}
                    </div>
                  ) : featuredMedicines.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {featuredMedicines.map((medicine) => (
                        <MedicineCard key={medicine.id} medicine={medicine} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">No medicines available</p>
                    </div>
                  )}
                </div>

                {/* Why Choose Us */}
                <section className="mb-16 bg-gradient-to-r from-[#1E9972]/10 to-[#0F6D5C]/10 rounded-2xl p-8 md:p-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                    Why Choose Medora?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-4 bg-gradient-to-br from-[#1E9972] to-[#0F6D5C] rounded-full">
                          <Truck className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Fast Delivery</h3>
                      <p className="text-gray-600 text-sm">
                        Quick delivery across Bangladesh with real-time tracking
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-4 bg-gradient-to-br from-[#1E9972] to-[#0F6D5C] rounded-full">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">100% Authentic</h3>
                      <p className="text-gray-600 text-sm">
                        All medicines verified and sourced from authorized distributors
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-4 bg-gradient-to-br from-[#1E9972] to-[#0F6D5C] rounded-full">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">24/7 Support</h3>
                      <p className="text-gray-600 text-sm">
                        Expert pharmacists available round the clock for guidance
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-4 bg-gradient-to-br from-[#1E9972] to-[#0F6D5C] rounded-full">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Local Trust</h3>
                      <p className="text-gray-600 text-sm">
                        Serving Bangladesh since 2020 with 100,000+ satisfied customers
                      </p>
                    </div>
                  </div>
                </section>

                {/* Top Medicines */}
                {topMedicines.length > 0 && (
                  <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                          <TrendingUp className="h-8 w-8 text-[#1E9972]" />
                          Top Selling Medicines
                        </h2>
                        <p className="text-gray-600 mt-2">Most trusted by our customers</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {topMedicines.map((medicine) => (
                        <MedicineCard key={medicine.id} medicine={medicine} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Call to Action */}
                <section className="bg-gradient-to-r from-[#1E9972] to-[#0F6D5C] rounded-2xl p-8 md:p-12 text-white text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Looking for Wholesale Supplies?
                  </h2>
                  <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                    Medora offers special B2B packages for pharmacies, clinics, and healthcare retailers.
                  </p>
                  <Link href="/wholesale">
                    <Button size="lg" className="bg-white text-[#1E9972] hover:bg-gray-100 font-bold">
                      Explore Wholesale
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </section>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="bg-gradient-to-r from-[#0F6D5C] to-[#175B64] text-white py-12 md:py-16">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">10,000+</div>
                <p className="text-lg opacity-90">Medicines in Stock</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">100,000+</div>
                <p className="text-lg opacity-90">Happy Customers</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">64</div>
                <p className="text-lg opacity-90">Districts Covered</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">4.8★</div>
                <p className="text-lg opacity-90">Customer Rating</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
