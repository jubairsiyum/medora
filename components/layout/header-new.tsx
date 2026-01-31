'use client';

import Link from 'next/link';
import { ShoppingCart, Heart, User, Search, Menu, X, Pill, Phone, Mail, ChevronDown, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { navItems } from '@/config/site';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { items } = useCartStore();
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-200 ${
          scrolled 
            ? 'bg-background/95 backdrop-blur-xl shadow-md' 
            : 'bg-background/95 backdrop-blur-md'
        }`}
        role="banner"
      >
        {/* Top Bar - Hidden on mobile */}
        <div className="hidden lg:block border-b bg-gradient-to-r from-[#1E9972] to-[#0F6D5C] text-white">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8">
            <div className="flex h-10 items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-6">
                <a 
                  href="tel:+8801234567890" 
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  aria-label="Call us"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <span>+880 1234-567890</span>
                </a>
                <a 
                  href="mailto:support@medora.com" 
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  aria-label="Email us"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <span>support@medora.com</span>
                </a>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <span>🎁 Fast Delivery All Over Bangladesh</span>
                </span>
                <span>|</span>
                <span className="flex items-center gap-2">
                  <span>✨ Free Delivery on ৳1000+</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="border-b">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8">
            <div className="flex items-center gap-4 lg:gap-6 h-20 lg:h-24">
              {/* Logo - Left - Larger on Desktop */}
              <Link 
                href="/" 
                className="flex-shrink-0 group"
                aria-label="Medora Home"
              >
                <div className="flex items-center gap-2 lg:gap-3">
                  {/* Logo Container */}
                  <div className="flex h-14 w-14 lg:h-20 lg:w-20 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E9972] to-[#0F6D5C] shadow-lg group-hover:shadow-xl transition-shadow">
                    <Pill className="h-7 w-7 lg:h-10 lg:w-10 text-white" />
                  </div>
                  
                  {/* Text Logo */}
                  <div className="hidden sm:flex flex-col">
                    <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#1E9972] to-[#0F6D5C] bg-clip-text text-transparent">
                      MEDORA
                    </span>
                    <span className="text-xs lg:text-sm text-gray-600 font-medium">
                      Your Health, Our Priority
                    </span>
                  </div>
                </div>
              </Link>

              {/* Search Bar - Center - Hidden on Mobile */}
              <div className="hidden md:flex flex-1 justify-center max-w-md lg:max-w-2xl">
                <div className="relative w-full">
                  <Search 
                    className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200 ${
                      searchFocused ? 'text-[#1E9972]' : 'text-muted-foreground'
                    }`} 
                    aria-hidden="true"
                  />
                  <Input
                    type="search"
                    placeholder="Search medicines, brands, conditions..."
                    className={`w-full pl-11 h-11 lg:h-12 rounded-full border transition-all duration-200 text-sm lg:text-base ${
                      searchFocused 
                        ? 'border-[#1E9972] shadow-md ring-1 ring-[#1E9972]/20' 
                        : 'border-input bg-muted/50 hover:bg-muted/70'
                    }`}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    aria-label="Search medicines"
                  />
                </div>
              </div>

              {/* Actions - Right */}
              <nav className="flex items-center gap-1 lg:gap-2 ml-auto" aria-label="User actions">
                {/* Search Icon - Mobile Only */}
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="md:hidden h-10 w-10"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </Button>

                {/* Wishlist */}
                <Link href="/wishlist">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-10 w-10 lg:h-11 lg:w-11 relative"
                    aria-label="Wishlist"
                  >
                    <Heart className="h-5 w-5 lg:h-6 lg:w-6" />
                  </Button>
                </Link>

                {/* Cart */}
                <Link href="/cart">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-10 w-10 lg:h-11 lg:w-11 relative"
                    aria-label="Shopping cart"
                  >
                    <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6" />
                    {cartItemCount > 0 && (
                      <Badge 
                        className="absolute -right-2 -top-2 h-5 w-5 lg:h-6 lg:w-6 flex items-center justify-center p-0 bg-red-500 text-white text-xs lg:text-sm"
                        variant="default"
                      >
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </Badge>
                    )}
                  </Button>
                </Link>

                {/* User Menu - Desktop */}
                <div className="hidden md:block">
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-10 w-10 lg:h-11 lg:w-11"
                          aria-label="User menu"
                        >
                          <User className="h-5 w-5 lg:h-6 lg:w-6" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                          <div>
                            <p className="font-semibold">{user.name || user.email}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard">My Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/orders">My Orders</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/prescriptions">My Prescriptions</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/settings">Settings</Link>
                        </DropdownMenuItem>
                        {user.role === 'ADMIN' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href="/admin" className="text-amber-600 font-medium">
                                Admin Portal
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className="flex gap-2">
                      <Link href="/auth/login">
                        <Button variant="outline" size="sm" className="h-10 text-sm">
                          Login
                        </Button>
                      </Link>
                      <Link href="/auth/register">
                        <Button 
                          size="sm" 
                          className="h-10 bg-gradient-to-r from-[#1E9972] to-[#0F6D5C] hover:shadow-lg text-sm"
                        >
                          Register
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-10 w-10"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </nav>
            </div>
          </div>
        </div>

        {/* Navigation Menu - Desktop */}
        <nav className="hidden lg:block border-b bg-gradient-to-r from-[#1E9972]/5 to-[#0F6D5C]/5">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8">
            <div className="flex items-center gap-8 h-12">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/' 
                    ? 'text-[#1E9972] border-b-2 border-[#1E9972]' 
                    : 'text-gray-700 hover:text-[#1E9972]'
                }`}
              >
                Home
              </Link>
              <Link
                href="/medicines"
                className={`text-sm font-medium transition-colors ${
                  pathname.includes('/medicines') 
                    ? 'text-[#1E9972] border-b-2 border-[#1E9972]' 
                    : 'text-gray-700 hover:text-[#1E9972]'
                }`}
              >
                Medicines
              </Link>
              <DropdownMenu open={categoryMenuOpen} onOpenChange={setCategoryMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="text-sm font-medium text-gray-700 hover:text-[#1E9972] transition-colors flex items-center gap-1">
                    Categories
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/medicines?category=pain-relief">Pain Relief</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/medicines?category=cold-fever">Cold & Fever</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/medicines?category=vitamins">Vitamins & Supplements</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/medicines">View All</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                href="/wholesale"
                className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                  pathname === '/wholesale' 
                    ? 'text-[#1E9972] border-b-2 border-[#1E9972]' 
                    : 'text-gray-700 hover:text-[#1E9972]'
                }`}
              >
                Wholesale
                <Badge className="bg-amber-100 text-amber-800 text-xs">B2B</Badge>
              </Link>
              <Link
                href="/about"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/about' 
                    ? 'text-[#1E9972] border-b-2 border-[#1E9972]' 
                    : 'text-gray-700 hover:text-[#1E9972]'
                }`}
              >
                About Us
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-0 right-0 bg-white border-b shadow-lg z-40">
          <div className="p-4 space-y-3">
            <Link href="/" className="block py-2 text-base font-medium text-gray-700 hover:text-[#1E9972]">
              Home
            </Link>
            <Link href="/medicines" className="block py-2 text-base font-medium text-gray-700 hover:text-[#1E9972]">
              Medicines
            </Link>
            <Link href="/categories" className="block py-2 text-base font-medium text-gray-700 hover:text-[#1E9972]">
              Categories
            </Link>
            <Link href="/wholesale" className="block py-2 text-base font-medium text-gray-700 hover:text-[#1E9972]">
              Wholesale (B2B)
            </Link>
            <Link href="/about" className="block py-2 text-base font-medium text-gray-700 hover:text-[#1E9972]">
              About Us
            </Link>
            <div className="border-t pt-3 mt-3">
              {user ? (
                <>
                  <Link href="/dashboard" className="block py-2 text-base font-medium text-gray-700 hover:text-[#1E9972]">
                    My Dashboard
                  </Link>
                  <Link href="/dashboard/orders" className="block py-2 text-base font-medium text-gray-700 hover:text-[#1E9972]">
                    My Orders
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link href="/admin" className="block py-2 text-base font-medium text-amber-600 hover:text-amber-700">
                      Admin Portal
                    </Link>
                  )}
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full mt-3 text-red-600 border-red-200"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link href="/auth/login" className="block">
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register" className="block">
                    <Button className="w-full bg-gradient-to-r from-[#1E9972] to-[#0F6D5C]">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
