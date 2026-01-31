'use client';

import Link from 'next/link';
import { ShoppingCart, Heart, User, Search, Menu, X, Pill, Phone, Mail, ChevronDown } from 'lucide-react';
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
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { items } = useCartStore();
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
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

  return (
    <>
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-200 ${
          scrolled 
            ? 'bg-background/95 backdrop-blur-xl shadow-sm' 
            : 'bg-background/95 backdrop-blur-md'
        }`}
        role="banner"
      >
        {/* Top Bar - Hidden on mobile */}
        <div className="hidden lg:block border-b bg-gradient-to-r from-[#1E9972] to-[#175B64] text-white">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8">
            <div className="flex h-9 items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-6">
                <a 
                  href="tel:+8801234567890" 
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  aria-label="Call us at +880 1234-567890"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Call us: +880 1234-567890</span>
                </a>
                <a 
                  href="mailto:support@medora.com" 
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  aria-label="Email us at support@medora.com"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>support@medora.com</span>
                </a>
              </div>
              <span className="flex items-center gap-2">
                <span className="inline-block animate-pulse">✨</span>
                <span>Free delivery on orders over ৳1000</span>
              </span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="border-b">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8">
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 lg:gap-8 h-16 lg:h-[72px]">
              {/* Logo - Left */}
              <Link 
                href="/" 
                className="flex-shrink-0"
                aria-label="Medora Home"
              >
                <img 
                  src="/logo.svg" 
                  alt="Medora" 
                  className="h-9 w-auto lg:h-10"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const pill = document.createElement('div');
                    pill.className = 'flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#1E9972] to-[#175B64]';
                    pill.innerHTML = '<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>';
                    e.currentTarget.parentNode?.appendChild(pill);
                  }}
                />
              </Link>

              {/* Search Bar - Center */}
              <div className="hidden md:flex justify-center">
                <div className="relative w-full max-w-[600px]">
                  <Search 
                    className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200 ${
                      searchFocused ? 'text-[#1E9972]' : 'text-muted-foreground'
                    }`} 
                    aria-hidden="true"
                  />
                  <Input
                    type="search"
                    placeholder="Search medicines, brands, or health concerns..."
                    className={`w-full pl-11 h-10 rounded-full border transition-all duration-200 ${
                      searchFocused 
                        ? 'border-[#1E9972] shadow-sm ring-1 ring-[#1E9972]/20' 
                        : 'border-input bg-muted/50 hover:bg-muted/70'
                    }`}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    aria-label="Search medicines, brands, or health concerns"
                  />
                </div>
              </div>

              {/* Actions - Right */}
              <nav className="flex items-center gap-1" aria-label="User actions">
                {/* Search Icon - Mobile Only */}
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="md:hidden h-10 w-10 hover:bg-[#1E9972]/10 hover:text-[#1E9972] transition-colors"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </Button>

                {/* Wishlist */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  asChild
                  className="hidden sm:flex h-10 w-10 hover:bg-[#1E9972]/10 hover:text-[#175B64] transition-colors"
                >
                  <Link href="/dashboard/wishlist" aria-label="Wishlist">
                    <Heart className="h-5 w-5" />
                  </Link>
                </Button>

                {/* Cart */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  asChild 
                  className="relative h-10 w-10 hover:bg-[#1E9972]/10 hover:text-[#1E9972] transition-colors"
                  aria-label={`Shopping cart with ${cartItemCount} items`}
                >
                  <Link href="/cart">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemCount > 0 && (
                      <Badge
                        className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-[10px] flex items-center justify-center bg-gradient-to-r from-[#1E9972] to-[#175B64] border-2 border-background"
                        aria-live="polite"
                      >
                        {cartItemCount}
                      </Badge>
                    )}
                  </Link>
                </Button>

                {/* User Menu */}
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="hidden md:flex h-10 gap-2 hover:bg-[#1E9972]/10 transition-colors px-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#1E9972] to-[#175B64]">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <span className="max-w-[100px] truncate text-sm font-medium">
                          {user.name}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2">
                    <DropdownMenuLabel className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1E9972] to-[#175B64]">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex flex-col space-y-0.5">
                          <p className="text-sm font-semibold">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.email || user.phone}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/dashboard" className="flex items-center gap-2 p-2">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/dashboard/orders" className="flex items-center gap-2 p-2">
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/dashboard/prescriptions" className="flex items-center gap-2 p-2">
                        Prescriptions
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/dashboard/profile" className="flex items-center gap-2 p-2">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'ADMIN' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href="/admin" className="flex items-center gap-2 p-2 text-[#1E9972] dark:text-[#6B96BF]">
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={logout} 
                      className="cursor-pointer text-red-600 dark:text-red-400 p-2"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  asChild 
                  size="sm"
                  className="hidden md:flex h-10 bg-gradient-to-r from-[#1E9972] to-[#175B64] hover:opacity-90 transition-opacity"
                >
                  <Link href="/login">Login</Link>
                </Button>
              )}

                {/* Mobile User Icon */}
                {user && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="md:hidden h-10 w-10"
                    asChild
                  >
                    <Link href="/dashboard">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#1E9972] to-[#175B64]">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    </Link>
                  </Button>
                )}

                {/* Mobile Menu Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-10 w-10 hover:bg-[#1E9972]/10 transition-colors"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </nav>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block border-b">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-6 xl:px-8">
            <nav className="flex items-center gap-1 h-12" aria-label="Main navigation">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-[#1E9972]/10 ${
                      isActive 
                        ? 'text-[#1E9972]' 
                        : 'text-foreground/80 hover:text-[#1E9972]'
                    }`}
                  >
                    {item.title}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-[#1E9972] to-[#175B64] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Slide-in */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-[85%] max-w-sm bg-background md:hidden transform transition-transform duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-[#1E9972]/10 to-[#175B64]/10">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E9972] to-[#175B64]">
                <Pill className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg bg-gradient-to-r from-[#1E9972] to-[#175B64] bg-clip-text text-transparent">
                  Medora
                </span>
                <span className="text-[10px] text-muted-foreground -mt-0.5">
                  Your Health Partner
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:bg-primary/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Search medicines..."
                className="pl-10 rounded-full bg-muted/50 border-transparent focus:border-[#1E9972] focus:ring-2 focus:ring-[#1E9972]/20"
                aria-label="Search medicines in mobile menu"
              />
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#1E9972]/10 to-[#175B64]/10 text-[#1E9972]'
                        : 'hover:bg-muted text-foreground/80'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.title}
                    {isActive && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-gradient-to-r from-[#1E9972] to-[#175B64]" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile User Section */}
            {user && (
              <div className="mt-6 pt-6 border-t space-y-1">
                <p className="px-4 text-xs font-semibold text-muted-foreground mb-2">
                  YOUR ACCOUNT
                </p>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground/80 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/orders"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground/80 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
                <Link
                  href="/dashboard/wishlist"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground/80 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Wishlist
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground/80 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-[#1E9972] dark:text-[#6B96BF] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
              </div>
            )}
          </nav>

          {/* Mobile Menu Footer */}
          <div className="p-4 border-t bg-gradient-to-r from-[#1E9972]/5 to-[#175B64]/5">
            {user ? (
              <Button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
              >
                Logout
              </Button>
            ) : (
              <Button
                asChild
                className="w-full bg-gradient-to-r from-[#1E9972] to-[#175B64] hover:shadow-lg transition-all duration-300"
              >
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  Login / Register
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
