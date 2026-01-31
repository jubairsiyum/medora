'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, Shield, Truck, Clock, FileText, Star, Pill, Sparkles, Heart, CheckCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MedicineCard } from '@/components/medicine/medicine-card';

interface Medicine {
  id: string;
  name: string;
  slug: string;
  genericName: string;
  price: number;
  discountPrice?: number;
  stock: number;
  prescriptionRequired: boolean;
  images: string[];
  category: { name: string; slug: string };
  brand?: { name: string; slug: string };
}

export default function Home() {
  const [featuredMedicines, setFeaturedMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedMedicines();
  }, []);

  const fetchFeaturedMedicines = async () => {
    try {
      const response = await fetch('/api/medicines?featured=true&limit=8');
      if (response.ok) {
        const data = await response.json();
        setFeaturedMedicines(data.medicines || []);
      }
    } catch (error) {
      console.error('Failed to fetch featured medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Modern Gradient Design */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-20 md:py-32">
          <div className="container relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              {/* Floating Badge with Animation */}
              <div className="inline-flex animate-fade-in-up mb-6">
                <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0 px-6 py-2 text-sm font-medium shadow-lg">
                  <Sparkles className="w-4 h-4 mr-2 inline" />
                  Free Delivery on Orders Over ৳1000
                </Badge>
              </div>
              
              {/* Main Heading with Gradient Text */}
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in-up animation-delay-100">
                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  Your Trusted
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                  Online Pharmacy
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-200 leading-relaxed">
                Quality medicines delivered to your doorstep with care and trust
              </p>
              
              {/* CTA Buttons with Modern Design */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up animation-delay-300">
                <Button 
                  size="lg" 
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6 rounded-full group"
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
                  className="border-2 border-slate-300 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-500 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-lg px-8 py-6 rounded-full hover:shadow-xl transition-all duration-300"
                >
                  <Link href="/prescription">
                    <FileText className="mr-2 h-5 w-5" />
                    Upload Prescription
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators - Modern Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
                {[
                  { icon: Shield, label: 'Licensed Pharmacy', desc: 'Certified & Trusted' },
                  { icon: Star, label: '5000+ Customers', desc: 'Highly Rated' },
                  { icon: Truck, label: 'Fast Delivery', desc: '24-48 Hours' }
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex flex-col items-center p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3 shadow-lg">
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{item.label}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Animated Background Elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/4 top-20 w-96 h-96 rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-3xl animate-pulse-slow" />
            <div className="absolute right-1/4 bottom-20 w-96 h-96 rounded-full bg-cyan-400/20 dark:bg-cyan-600/10 blur-3xl animate-pulse-slow animation-delay-1000" />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Medora?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're committed to providing you with the best healthcare experience
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">100% Genuine Medicines</h3>
                  <p className="text-sm text-muted-foreground">
                    All medicines are sourced directly from manufacturers and authorized distributors
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Fast Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    Get your medicines delivered within 24-48 hours across Bangladesh
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Easy Prescription Upload</h3>
                  <p className="text-sm text-muted-foreground">
                    Simply upload your prescription and our pharmacists will verify it
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">24/7 Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Our team is always available to help you with your healthcare needs
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 md:py-32 bg-muted/40">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Find medicines by browsing our comprehensive categories
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: 'Pain Relief', icon: '💊', count: '150+ products' },
                { name: 'Vitamins & Supplements', icon: '🌿', count: '200+ products' },
                { name: 'Cold & Flu', icon: '🤧', count: '80+ products' },
                { name: 'Diabetes Care', icon: '💉', count: '120+ products' },
                { name: 'Heart Health', icon: '❤️', count: '90+ products' },
                { name: 'Digestive Health', icon: '🫀', count: '110+ products' },
                { name: 'Skin Care', icon: '✨', count: '180+ products' },
                { name: 'Baby Care', icon: '👶', count: '140+ products' },
              ].map((category) => (
                <Link
                  key={category.name}
                  href={`/medicines?category=${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                  className="group"
                >
                  <Card className="hover:border-primary transition-all hover:shadow-md">
                    <CardContent className="pt-6 text-center">
                      <div className="text-4xl mb-3">{category.icon}</div>
                      <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{category.count}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get your medicines in three simple steps
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl">
                  1
                </div>
                <h3 className="font-semibold mb-2">Search or Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Search for medicines or upload your prescription
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl">
                  2
                </div>
                <h3 className="font-semibold mb-2">Add to Cart & Checkout</h3>
                <p className="text-sm text-muted-foreground">
                  Review your order and complete secure payment
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl">
                  3
                </div>
                <h3 className="font-semibold mb-2">Get Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Receive your medicines at your doorstep
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 bg-primary text-primary-foreground">
          <div className="container text-center">
            <Pill className="h-12 w-12 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust Medora for their healthcare needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/medicines">
                  Browse Medicines
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link href="/register">
                  Create Account
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
