'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Grid, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Category {
  id: string;
  name: string;
  slug: string;
  medicineCount: number;
  children?: Category[];
}

export function CategorySidebar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        const sorted = (data || [])
          .filter((cat: any) => !cat.parentId)
          .sort((a: any, b: any) => a.name.localeCompare(b.name));
        setCategories(sorted);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sticky top-20 h-fit bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E9972] to-[#175B64] text-white px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <Grid className="h-5 w-5" />
          <h3 className="font-bold text-lg">Categories</h3>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/50 focus:bg-white/20"
          />
        </div>
      </div>

      {/* Categories List */}
      <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
        {loading ? (
          <div className="px-5 py-8 text-center text-gray-500">Loading...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="px-5 py-8 text-center text-gray-500 text-sm">
            No categories found
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredCategories.map((category) => (
              <li key={category.id}>
                <div className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                  <Link
                    href={`/medicines?category=${category.slug}`}
                    className="flex-1 group"
                  >
                    <p className="font-medium text-gray-800 group-hover:text-[#1E9972] transition-colors text-sm">
                      {category.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {category.medicineCount} medicines
                    </p>
                  </Link>

                  {category.children && category.children.length > 0 && (
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                      aria-label={`Toggle ${category.name} subcategories`}
                    >
                      {expandedCategories.has(category.id) ? (
                        <ChevronUp className="h-4 w-4 text-gray-600" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                  )}
                </div>

                {/* Subcategories */}
                {category.children &&
                  category.children.length > 0 &&
                  expandedCategories.has(category.id) && (
                    <ul className="bg-gray-50 divide-y divide-gray-100">
                      {category.children.map((subcat) => (
                        <li key={subcat.id}>
                          <Link
                            href={`/medicines?category=${subcat.slug}`}
                            className="block px-5 py-2 text-sm text-gray-700 hover:text-[#1E9972] hover:bg-gray-100 transition-colors pl-10"
                          >
                            {subcat.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer CTA */}
      <div className="border-t bg-gray-50 px-5 py-4">
        <Link
          href="/medicines"
          className="block w-full text-center py-2 bg-gradient-to-r from-[#1E9972] to-[#175B64] text-white font-medium rounded-lg hover:shadow-md transition-shadow text-sm"
        >
          View All Categories
        </Link>
      </div>
    </div>
  );
}
