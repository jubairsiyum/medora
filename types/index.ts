export interface Medicine {
  id: string;
  name: string;
  slug: string;
  genericName: string;
  description: string;
  dosage: string;
  form: string;
  strength: string;
  packSize: string;
  manufacturer: string;
  price: number;
  discountPrice?: number;
  stock: number;
  prescriptionRequired: boolean;
  featured: boolean;
  active: boolean;
  categoryId: string;
  brandId?: string;
  images: string[];
  uses: string;
  sideEffects: string;
  warnings: string;
  interactions: string;
  contraindications: string;
  sku: string;
  barcode?: string;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
  brand?: Brand;
  averageRating?: number;
  reviewCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  role: 'CUSTOMER' | 'PHARMACIST' | 'ADMIN';
  image?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZipCode: string;
  deliveryPhone: string;
  prescriptionId?: string;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  medicineId: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
  medicine?: Medicine;
}

export interface Review {
  id: string;
  userId: string;
  medicineId: string;
  rating: number;
  comment?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface Prescription {
  id: string;
  userId: string;
  image: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes?: string;
  adminNotes?: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
