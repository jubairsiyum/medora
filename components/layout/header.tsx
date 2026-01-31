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
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled 
            ? 'bg-background/80 backdrop-blur-xl border-b shadow-sm' 
            : 'bg-background/95 backdrop-blur-md border-b'
        }`}
      >
        {/* Top Bar - Hidden on mobile */}
        <div className="hidden lg:block border-b bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
          <div className="container flex h-9 items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                Call us: +880 1234-567890
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                support@medora.com
              </span>
            </div>
            <span className="flex items-center gap-1.5 animate-pulse">
              ✨ Free delivery on orders over ৳1000
            </span>
          </div>
        </div>

        {/* Main Header */}
        <div className="container">
          <div className="flex h-16 md:h-20 items-center gap-3 md:gap-6">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-2.5 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 transform group-hover:scale-105 transition-transform duration-300">
                  <Pill className="h-6 w-6 md:h-7 md:w-7 text-white" />
                </div>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-bold text-xl md:text-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Medora
                </span>
                <span className="text-[10px] text-muted-foreground -mt-1">
                  Your Health Partner
                </span>
              </div>
            </Link>

            {/* Search Bar - Desktop & Tablet */}
            <div className="hidden md:flex flex-1 max-w-2xl">
              <div className={`relative w-full transition-all duration-300 ${
                searchFocused ? 'scale-[1.02]' : ''
              }`}>
                <Search className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200 ${
                  searchFocused ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <Input
                  type="search"
                  placeholder="Search medicines, brands, or health concerns..."
                  className={`pl-11 h-11 rounded-full border-2 transition-all duration-200 ${
                    searchFocused 
                      ? 'border-primary shadow-lg shadow-primary/20' 
                      : 'border-transparent bg-muted/50 hover:bg-muted'
                  }`}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1 md:gap-2 ml-auto">
              {/* Search Icon - Mobile Only */}
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Wishlist */}
              <Button 
                variant="ghost" 
                size="icon" 
                asChild
                className="hidden sm:flex hover:bg-pink-100 dark:hover:bg-pink-950 hover:text-pink-600 dark:hover:text-pink-400 transition-colors relative group"
              >
                <Link href="/dashboard/wishlist">
                  <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </Link>
              </Button>

              {/* Cart */}
              <Button 
                variant="ghost" 
                size="icon" 
                asChild 
                className="relative hover:bg-primary/10 hover:text-primary transition-colors group"
              >
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  {cartItemCount > 0 && (
                    <Badge
                      className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-[10px] flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 border-2 border-background animate-bounce"
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
                      className="hidden md:flex gap-1.5 hover:bg-primary/10 transition-colors"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
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
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
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
                          <Link href="/admin" className="flex items-center gap-2 p-2 text-purple-600 dark:text-purple-400">
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
                  className="hidden md:flex bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
                >
                  <Link href="/login">Login</Link>
                </Button>
              )}

              {/* Mobile User Icon */}
              {user && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="md:hidden"
                  asChild
                >
                  <Link href="/dashboard">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </Link>
                </Button>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-primary/10 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <div className="hidden md:block border-t">
            <nav className="flex h-12 items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-primary/10 ${
                      isActive 
                        ? 'text-primary' 
                        : 'text-foreground/80 hover:text-primary'
                    }`}
                  >
                    {item.title}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full" />
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
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
                <Pill className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
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
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search medicines..."
                className="pl-10 rounded-full bg-muted/50 border-transparent"
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
                        ? 'bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 text-primary'
                        : 'hover:bg-muted text-foreground/80'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.title}
                    {isActive && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
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
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-purple-600 dark:text-purple-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
              </div>
            )}
          </nav>

          {/* Mobile Menu Footer */}
          <div className="p-4 border-t bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5">
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
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg transition-all duration-300"
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
