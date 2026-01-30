import { z } from 'zod';

export const createOrderSchema = z.object({
  items: z.array(z.object({
    medicineId: z.string(),
    quantity: z.number().int().positive(),
  })).min(1, 'Order must contain at least one item'),
  deliveryAddress: z.string().min(10, 'Delivery address is required'),
  deliveryCity: z.string().min(1, 'City is required'),
  deliveryState: z.string().min(1, 'State is required'),
  deliveryZipCode: z.string().min(4, 'ZIP code is required'),
  deliveryPhone: z.string().regex(/^[0-9]{10,15}$/, 'Invalid phone number'),
  prescriptionId: z.string().optional(),
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  trackingNumber: z.string().optional(),
  estimatedDelivery: z.string().datetime().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
