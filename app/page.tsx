'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Truck, Clock, Shield, Phone, MapPin, Users, TrendingUp, Sparkles } from 'lucide-react';
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
        {/* Hero Section - Modern Gradient Design */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-16 sm:py-20 md:py-28 lg:py-32">
          <div className="container relative z-10 px-4 sm:px-6">
            <div className="mx-auto max-w-4xl text-center">
              {/* Floating Badge with Animation */}
              <div className="inline-flex animate-fade-in-up mb-4 sm:mb-6">
                <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0 px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium shadow-lg">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2 inline" />
                  Free Delivery on Orders Over ৳1000
                </Badge>
              </div>
              
              {/* Main Heading with Gradient Text */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 sm:mb-6 animate-fade-in-up animation-delay-100">
                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  Your Trusted
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                  Online Pharmacy
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 sm:mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-200 leading-relaxed px-4">
                Quality medicines delivered to your doorstep with care and trust
              </p>
              
              {/* CTA Buttons with Modern Design */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 animate-fade-in-up animation-delay-300 px-4">
                <Button 
                  size="lg" 
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full group w-full sm:w-auto"
                >
                  <Link href="/medicines">
                    Browse Medicines 
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  asChild
                  className="border-2 border-slate-300 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-500 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                >
                  <Link href="/prescription">
                    <FileText className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Upload Prescription
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators - Modern Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto animate-fade-in-up animation-delay-400 px-4">
                {[
                  { icon: Shield, label: 'Licensed Pharmacy', desc: 'Certified & Trusted' },
                  { icon: Star, label: '5000+ Customers', desc: 'Highly Rated' },
                  { icon: Truck, label: 'Fast Delivery', desc: '24-48 Hours' }
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex flex-col items-center p-5 sm:p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-h-[140px] justify-center"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3 shadow-lg">
                      <item.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1 text-sm sm:text-base">{item.label}</p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Animated Background Elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/4 top-20 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-3xl animate-pulse-slow" />
            <div className="absolute right-1/4 bottom-20 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-cyan-400/20 dark:bg-cyan-600/10 blur-3xl animate-pulse-slow animation-delay-1000" />
          </div>
        </section>

        {/* Features Section - Bento Grid Style */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white dark:bg-slate-950">
          <div className="container px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-0">
                Why Choose Us
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent px-4">
                Healthcare at Your Fingertips
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4">
                Experience the future of pharmacy with our comprehensive healthcare solutions
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0">
              {[
                {
                  icon: Shield,
                  title: '100% Genuine',
                  description: 'All medicines sourced directly from authorized distributors',
                  gradient: 'from-blue-500 to-cyan-500',
                  delay: '0'
                },
                {
                  icon: Truck,
                  title: 'Express Delivery',
                  description: 'Get your medicines within 24-48 hours across Bangladesh',
                  gradient: 'from-purple-500 to-pink-500',
                  delay: '100'
                },
                {
                  icon: FileText,
                  title: 'Easy Prescription',
                  description: 'Upload prescription and our pharmacists will verify instantly',
                  gradient: 'from-orange-500 to-red-500',
                  delay: '200'
                },
                {
                  icon: Clock,
                  title: '24/7 Support',
                  description: 'Round-the-clock assistance for all your healthcare needs',
                  gradient: 'from-teal-500 to-emerald-500',
                  delay: '300'
                },
              ].map((feature, idx) => (
                <Card 
                  key={idx}
                  className="group relative overflow-hidden border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                  style={{ animationDelay: `${feature.delay}ms` }}
                >
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-slate-100">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                  {/* Hover Effect Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Medicines - Modern Carousel */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-950">
          <div className="container px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
              <div>
                <Badge className="mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0">
                  <TrendingUp className="w-4 h-4 mr-2 inline" />
                  Trending Now
                </Badge>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  Featured Medicines
                </h2>
              </div>
              <Button 
                asChild 
                variant="outline"
                className="hidden md:flex border-2 border-slate-300 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-500 rounded-full"
              >
                <Link href="/medicines">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse border-slate-200 dark:border-slate-800">
                    <CardContent className="p-6">
                      <div className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-xl mb-4" />
                      <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : featuredMedicines.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featuredMedicines.map((medicine) => (
                  <MedicineCard key={medicine.id} medicine={medicine} />
                ))}
              </div>
            ) : (
              <Card className="border-slate-200 dark:border-slate-800">
                <CardContent className="p-12 text-center">
                  <Pill className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-600 dark:text-slate-400">No featured medicines available</p>
                </CardContent>
              </Card>
            )}

            <div className="text-center mt-8 md:hidden">
              <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full">
                <Link href="/medicines">View All Medicines</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Categories Section - Modern Grid */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white dark:bg-slate-950">
          <div className="container px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <Badge className="mb-4 bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300 border-0">
                Browse by Category
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent px-4">
                Shop by Category
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4">
                Find exactly what you need from our comprehensive range
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: 'Pain Relief', icon: '💊', count: '150+', gradient: 'from-red-500/10 to-orange-500/10', border: 'hover:border-red-500' },
                { name: 'Vitamins & Supplements', icon: '🌿', count: '200+', gradient: 'from-green-500/10 to-emerald-500/10', border: 'hover:border-green-500' },
                { name: 'Cold & Flu', icon: '🤧', count: '80+', gradient: 'from-blue-500/10 to-cyan-500/10', border: 'hover:border-blue-500' },
                { name: 'Diabetes Care', icon: '💉', count: '120+', gradient: 'from-purple-500/10 to-pink-500/10', border: 'hover:border-purple-500' },
                { name: 'Heart Health', icon: '❤️', count: '90+', gradient: 'from-rose-500/10 to-red-500/10', border: 'hover:border-rose-500' },
                { name: 'Digestive Health', icon: '🫀', count: '110+', gradient: 'from-amber-500/10 to-yellow-500/10', border: 'hover:border-amber-500' },
                { name: 'Skin Care', icon: '✨', count: '180+', gradient: 'from-pink-500/10 to-fuchsia-500/10', border: 'hover:border-pink-500' },
                { name: 'Baby Care', icon: '👶', count: '140+', gradient: 'from-sky-500/10 to-blue-500/10', border: 'hover:border-sky-500' },
              ].map((category, idx) => (
                <Link
                  key={category.name}
                  href={`/medicines?category=${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                  className="group block"
                >
                  <Card className={`border-2 border-slate-200 dark:border-slate-800 ${category.border} transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden`}>
                    <CardContent className="p-8 text-center relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      <div className="relative z-10">
                        <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                          {category.icon}
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-slate-100 group-hover:text-slate-900 dark:group-hover:text-slate-100">
                          {category.name}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                          {category.count} products
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - Timeline Style */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-950">
          <div className="container px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-0">
                Simple Process
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent px-4">
                How It Works
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4">
                Get your medicines in three simple steps
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {[
                {
                  step: '1',
                  title: 'Search or Upload',
                  description: 'Search for medicines or upload your prescription for quick processing',
                  gradient: 'from-blue-500 to-cyan-500'
                },
                {
                  step: '2',
                  title: 'Add & Checkout',
                  description: 'Review your order and complete secure payment with multiple options',
                  gradient: 'from-purple-500 to-pink-500'
                },
                {
                  step: '3',
                  title: 'Fast Delivery',
                  description: 'Receive your medicines safely at your doorstep within 24-48 hours',
                  gradient: 'from-teal-500 to-emerald-500'
                },
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <Card className="border-2 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 hover:shadow-2xl group">
                    <CardContent className="p-8 text-center relative">
                      <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center font-bold text-3xl text-white shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                        {item.step}
                      </div>
                      <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-slate-100">{item.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                  {/* Connector Line */}
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Modern Gradient */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
          
          <div className="container relative z-10 text-center px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6 sm:mb-8 animate-bounce-slow">
                <Pill className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white px-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg sm:text-xl mb-8 sm:mb-10 text-blue-50 max-w-2xl mx-auto leading-relaxed px-4">
                Join thousands of satisfied customers who trust Medora for their healthcare needs
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Button 
                  size="lg" 
                  asChild
                  className="bg-white text-blue-600 hover:bg-blue-50 shadow-2xl text-lg px-8 py-6 rounded-full group"
                >
                  <Link href="/medicines">
                    Browse Medicines
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  asChild
                  className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-6 rounded-full"
                >
                  <Link href="/register">
                    Create Account
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
                {[
                  { value: '5000+', label: 'Happy Customers' },
                  { value: '10k+', label: 'Medicines' },
                  { value: '24/7', label: 'Support' },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-blue-100 text-sm md:text-base">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
