'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Pill, 
  ShoppingBag, 
  FileText, 
  Users, 
  Tag, 
  Building2,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth';

const sidebarItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/medicines', icon: Pill, label: 'Medicines' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { href: '/admin/prescriptions', icon: FileText, label: 'Prescriptions' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/categories', icon: Tag, label: 'Categories' },
  { href: '/admin/brands', icon: Building2, label: 'Brands' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#1E9972] to-[#175B64]">
              <Pill className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-[#1E9972] to-[#175B64] bg-clip-text text-transparent">
                Medora Admin
              </h1>
              <p className="text-xs text-muted-foreground">Management Portal</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname?.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#1E9972]/10 to-[#175B64]/10 text-[#1E9972] font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
          >
            <Link href="/admin/settings">
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={logout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
