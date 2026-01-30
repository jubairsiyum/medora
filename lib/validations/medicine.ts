import { z } from 'zod';

export const medicineSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  genericName: z.string().min(1, 'Generic name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  dosage: z.string().min(1, 'Dosage is required'),
  form: z.string().min(1, 'Form is required'),
  strength: z.string().min(1, 'Strength is required'),
  packSize: z.string().min(1, 'Pack size is required'),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  price: z.number().positive('Price must be positive'),
  discountPrice: z.number().positive().optional(),
  stock: z.number().int().nonnegative('Stock cannot be negative'),
  prescriptionRequired: z.boolean(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  brandId: z.string().optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  uses: z.string().min(10, 'Uses must be at least 10 characters'),
  sideEffects: z.string().min(10, 'Side effects must be at least 10 characters'),
  warnings: z.string().min(10, 'Warnings must be at least 10 characters'),
  interactions: z.string().optional(),
  contraindications: z.string().optional(),
  sku: z.string().min(1, 'SKU is required'),
  barcode: z.string().optional(),
});

export const medicineSearchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  prescriptionRequired: z.boolean().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  featured: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['name', 'price', 'createdAt', 'popularity']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export type MedicineInput = z.infer<typeof medicineSchema>;
export type MedicineSearchInput = z.infer<typeof medicineSearchSchema>;
