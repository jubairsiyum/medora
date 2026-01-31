'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MedicineCard } from '@/components/medicine/medicine-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Medicine {
  id: string;
  name: string;
  slug: string;
  genericName: string;
  manufacturer: string;
  price: number;
  discountPrice?: number;
  stock: number;
  prescriptionRequired: boolean;
  featured: boolean;
  images: string[];
  dosage: string;
  form: string;
  strength: string;
  category: {
    name: string;
    slug: string;
  };
  brand?: {
    name: string;
    slug: string;
  };
}

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [prescriptionFilter, setPrescriptionFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, [search, category, sortBy, priceRange, prescriptionFilter]);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category !== 'all') params.append('category', category);
      if (sortBy) params.append('sort', sortBy);
      if (priceRange !== 'all') params.append('priceRange', priceRange);
      if (prescriptionFilter !== 'all') params.append('prescription', prescriptionFilter);

      const response = await fetch(`/api/medicines?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setMedicines(data.medicines || []);
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

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 border-b">
          <div className="container">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-slate-50">
                Browse Medicines
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                Find quality medicines from trusted manufacturers across Bangladesh
              </p>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="search"
                  placeholder="Search by medicine name, generic name, or manufacturer..."
                  className="pl-12 h-14 text-base bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="container py-8">
          <div className="flex gap-6">
            {/* Filters Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <Card className="sticky top-24 border-slate-200 dark:border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Filter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    <h2 className="font-semibold text-slate-900 dark:text-slate-50">Filters</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Category Filter */}
                    <div>
                      <label className="text-sm font-medium mb-3 block text-slate-700 dark:text-slate-300">
                        Category
                      </label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="border-slate-200 dark:border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="pain-relief">Pain Relief</SelectItem>
                          <SelectItem value="cold-flu">Cold & Flu</SelectItem>
                          <SelectItem value="diabetes">Diabetes Care</SelectItem>
                          <SelectItem value="vitamins">Vitamins & Supplements</SelectItem>
                          <SelectItem value="antibiotics">Antibiotics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="text-sm font-medium mb-3 block text-slate-700 dark:text-slate-300">
                        Price Range
                      </label>
                      <Select value={priceRange} onValueChange={setPriceRange}>
                        <SelectTrigger className="border-slate-200 dark:border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Prices</SelectItem>
                          <SelectItem value="0-100">Under ৳100</SelectItem>
                          <SelectItem value="100-500">৳100 - ৳500</SelectItem>
                          <SelectItem value="500-1000">৳500 - ৳1,000</SelectItem>
                          <SelectItem value="1000+">৳1,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Prescription Required */}
                    <div>
                      <label className="text-sm font-medium mb-3 block text-slate-700 dark:text-slate-300">
                        Prescription
                      </label>
                      <Select value={prescriptionFilter} onValueChange={setPrescriptionFilter}>
                        <SelectTrigger className="border-slate-200 dark:border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Medicines</SelectItem>
                          <SelectItem value="required">Prescription Required</SelectItem>
                          <SelectItem value="not-required">No Prescription</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-slate-200 dark:border-slate-700"
                      onClick={() => {
                        setCategory('all');
                        setPriceRange('all');
                        setPrescriptionFilter('all');
                        setSearch('');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  className="w-full border-slate-200 dark:border-slate-700"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>

                {showFilters && (
                  <Card className="mt-4 border-slate-200 dark:border-slate-800">
                    <CardContent className="p-4 space-y-4">
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="pain-relief">Pain Relief</SelectItem>
                          <SelectItem value="cold-flu">Cold & Flu</SelectItem>
                          <SelectItem value="diabetes">Diabetes Care</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={priceRange} onValueChange={setPriceRange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Price Range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Prices</SelectItem>
                          <SelectItem value="0-100">Under ৳100</SelectItem>
                          <SelectItem value="100-500">৳100 - ৳500</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {loading ? 'Loading...' : `${medicines.length} medicines found`}
                  </p>
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48 border-slate-200 dark:border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="name-asc">Name: A to Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Medicine Grid */}
              {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="animate-pulse border-slate-200 dark:border-slate-800">
                      <CardContent className="p-4">
                        <div className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-lg mb-4" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : medicines.length === 0 ? (
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardContent className="p-12 text-center">
                    <p className="text-slate-600 dark:text-slate-400 mb-4">No medicines found matching your criteria</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCategory('all');
                        setPriceRange('all');
                        setPrescriptionFilter('all');
                        setSearch('');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {medicines.map((medicine) => (
                    <MedicineCard key={medicine.id} medicine={medicine} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
