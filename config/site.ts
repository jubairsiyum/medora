export const siteConfig = {
  name: 'Medora',
  description: 'Your trusted online pharmacy - Quality medicines delivered to your doorstep',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/medora',
    facebook: 'https://facebook.com/medora',
  },
  contact: {
    email: 'support@medora.com',
    phone: '+880 1234-567890',
    address: '123 Healthcare Street, Dhaka, Bangladesh',
  },
};

export const navItems = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Medicines',
    href: '/medicines',
  },
  {
    title: 'Categories',
    href: '/categories',
  },
  {
    title: 'Upload Prescription',
    href: '/prescription',
  },
  {
    title: 'About',
    href: '/about',
  },
  {
    title: 'Contact',
    href: '/contact',
  },
];

export const dashboardNav = {
  customer: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: 'LayoutDashboard',
    },
    {
      title: 'Orders',
      href: '/dashboard/orders',
      icon: 'ShoppingBag',
    },
    {
      title: 'Prescriptions',
      href: '/dashboard/prescriptions',
      icon: 'FileText',
    },
    {
      title: 'Wishlist',
      href: '/dashboard/wishlist',
      icon: 'Heart',
    },
    {
      title: 'Profile',
      href: '/dashboard/profile',
      icon: 'User',
    },
  ],
  admin: [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: 'LayoutDashboard',
    },
    {
      title: 'Medicines',
      href: '/admin/medicines',
      icon: 'Pill',
    },
    {
      title: 'Categories',
      href: '/admin/categories',
      icon: 'FolderTree',
    },
    {
      title: 'Brands',
      href: '/admin/brands',
      icon: 'Tag',
    },
    {
      title: 'Orders',
      href: '/admin/orders',
      icon: 'ShoppingCart',
    },
    {
      title: 'Prescriptions',
      href: '/admin/prescriptions',
      icon: 'FileCheck',
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: 'Users',
    },
    {
      title: 'Reviews',
      href: '/admin/reviews',
      icon: 'Star',
    },
  ],
};
