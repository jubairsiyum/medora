import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  medicineId: string;
  name: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  image: string;
  prescriptionRequired: boolean;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.medicineId === item.medicineId
          );
          
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.medicineId === item.medicineId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          
          return { items: [...state.items, item] };
        }),
      removeItem: (medicineId) =>
        set((state) => ({
          items: state.items.filter((i) => i.medicineId !== medicineId),
        })),
      updateQuantity: (medicineId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.medicineId === medicineId ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const price = item.discountPrice || item.price;
          return total + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
