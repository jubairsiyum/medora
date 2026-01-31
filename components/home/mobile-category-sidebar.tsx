'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ChevronRight, Grid, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Category {
  id: string;
  name: string;
  slug: string;
  medicineCount: number;
  children?: Category[];
}

interface MobileCategorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileCategorySidebar({ isOpen, onClose }: MobileCategorySidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
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

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCategory = activeCategory
    ? categories.find((c) => c.id === activeCategory)
    : null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-full max-w-xs bg-white z-40 md:hidden transform transition-transform duration-300 overflow-hidden flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E9972] to-[#175B64] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Grid className="h-5 w-5" />
            <h3 className="font-bold text-lg">Categories</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Categories List */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="sticky top-0 bg-gray-50 p-3 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 text-sm bg-white border-gray-300"
                />
              </div>
            </div>

            {loading ? (
              <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>
            ) : filteredCategories.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">No results</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                      className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors flex items-center justify-between ${
                        activeCategory === category.id
                          ? 'bg-[#1E9972] text-white'
                          : 'text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      <span className="truncate">{category.name}</span>
                      <ChevronRight className="h-4 w-4 ml-1 flex-shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Subcategories/Details */}
          <div className="w-2/3 bg-gray-50 overflow-y-auto flex flex-col">
            {selectedCategory ? (
              <>
                {/* Selected Category Header */}
                <div className="sticky top-0 bg-white border-b p-4">
                  <h4 className="font-bold text-gray-900 text-sm">{selectedCategory.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedCategory.medicineCount} medicines
                  </p>
                </div>

                {/* Main Category Link */}
                <div className="p-4 border-b">
                  <Link
                    href={`/medicines?category=${selectedCategory.slug}`}
                    onClick={onClose}
                    className="block w-full py-2.5 px-4 bg-gradient-to-r from-[#1E9972] to-[#175B64] text-white text-center font-medium rounded-lg text-sm hover:shadow-md transition-shadow"
                  >
                    All {selectedCategory.name}
                  </Link>
                </div>

                {/* Subcategories */}
                {selectedCategory.children && selectedCategory.children.length > 0 ? (
                  <ul className="flex-1 divide-y divide-gray-200">
                    {selectedCategory.children.map((subcat) => (
                      <li key={subcat.id}>
                        <Link
                          href={`/medicines?category=${subcat.slug}`}
                          onClick={onClose}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-white hover:text-[#1E9972] transition-colors"
                        >
                          {subcat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500 text-sm p-4 text-center">
                    No subcategories
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-center p-4">
                <p className="text-sm">Select a category to view</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
