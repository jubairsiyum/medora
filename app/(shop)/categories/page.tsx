'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Pill, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/header-new';
import { Footer } from '@/components/layout/footer';

interface Category {
  id: string;
  name: string;
  slug: string;
  medicineCount: number;
  description?: string;
  icon?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        const parentCategories = (data || [])
          .filter((cat: any) => !cat.parentId)
          .sort((a: any, b: any) => b.medicineCount - a.medicineCount);
        setCategories(parentCategories);
        setFilteredCategories(parentCategories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (name: string) => {
    const iconMap: Record<string, string> = {
      'Pain Relief': '💊',
      'Cold & Fever': '🤒',
      'Vitamins': '🥕',
      'Antacid': '🫙',
      'Antibiotics': '⚕️',
      'Respiratory': '💨',
      'Skin Care': '🧴',
      'Digestive': '🍎',
      'Eye Care': '👁️',
      'Mental Health': '🧠',
    };
    return iconMap[name] || '💊';
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#1E9972] to-[#0F6D5C] text-white py-12 md:py-16">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Browse by Category
              </h1>
              <p className="text-lg opacity-90">
                Find medicines organized by health condition and treatment type. Explore our comprehensive catalog of {categories.length} categories.
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8 bg-gray-50 border-b">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8">
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>
            {searchTerm && (
              <p className="text-center text-sm text-gray-600 mt-4">
                Found {filteredCategories.length} matching categories
              </p>
            )}
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-16">
                <Pill className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No categories found</h3>
                <p className="text-gray-600">Try adjusting your search terms</p>
                <Button
                  onClick={() => setSearchTerm('')}
                  variant="outline"
                  className="mt-4"
                >
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/medicines?category=${category.slug}`}
                    className="group"
                  >
                    <div className="h-full p-8 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-[#1E9972] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-4xl">
                          {getCategoryIcon(category.name)}
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-[#1E9972] transition-colors" />
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#1E9972] transition-colors">
                        {category.name}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4">
                        {category.description || `Browse our selection of ${category.name} medicines`}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <span className="text-sm font-medium text-[#1E9972]">
                          {category.medicineCount} medicines
                        </span>
                        <span className="text-xs text-gray-500 group-hover:text-[#1E9972] transition-colors">
                          Shop Now →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Category Tips */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              How to Find the Right Medicine
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'By Health Condition',
                  description:
                    'Browse categories based on your symptoms or health concern. Each category contains medicines specifically for that condition.',
                },
                {
                  title: 'By Ingredient',
                  description:
                    'Search for generic names of medicines you know work for you. We show all brands containing that ingredient.',
                },
                {
                  title: 'Consult Our Pharmacists',
                  description:
                    'Not sure what you need? Chat with our licensed pharmacists 24/7 for personalized recommendations.',
                },
              ].map((tip, i) => (
                <div key={i} className="bg-white p-8 rounded-xl border border-gray-200">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#1E9972] to-[#0F6D5C] text-white rounded-lg flex items-center justify-center font-bold mb-4">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{tip.title}</h3>
                  <p className="text-gray-600">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-[#1E9972] to-[#0F6D5C] text-white py-12 md:py-16">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Didn't find what you're looking for?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Use our search feature or contact our pharmacists for personalized help.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/medicines">
                <Button size="lg" className="bg-white text-[#1E9972] hover:bg-gray-100 font-bold">
                  Browse All Medicines
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Chat with Pharmacist
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
