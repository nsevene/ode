import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  description?: string;
  kitchen?: string;
  allergens?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  spiceLevel?: 'mild' | 'medium' | 'hot' | 'extra-hot';
  preparationTime?: number; // in minutes
}

interface CartState {
  // State
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed State - Now part of the regular state
  totalItems: number;
  totalPrice: number;
  isEmpty: boolean;

  // Cart Operations
  incrementItem: (itemId: string) => void;
  decrementItem: (itemId: string) => void;
  setItemQuantity: (itemId: string, quantity: number) => void;

  // Cart Validation
  validateCart: () => { isValid: boolean; errors: string[] };

  // Cart Persistence
  saveCart: () => void;
  loadCart: () => void;

  // Cart Analytics
  getCartAnalytics: () => {
    totalValue: number;
    averageItemPrice: number;
    mostExpensiveItem: CartItem | null;
    cheapestItem: CartItem | null;
    categoryBreakdown: Record<string, number>;
    kitchenBreakdown: Record<string, number>;
  };
}

const calculateComputedValues = (items: CartItem[]) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const isEmpty = items.length === 0;
  return { totalItems, totalPrice, isEmpty };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial State
      items: [],
      isOpen: false,
      isLoading: false,
      error: null,
      totalItems: 0,
      totalPrice: 0,
      isEmpty: true,

      // Actions
      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (cartItem) => cartItem.id === item.id
        );

        let newItems;
        if (existingItem) {
          newItems = currentItems.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        } else {
          newItems = [...currentItems, { ...item, quantity: 1 }];
        }
        set({
          items: newItems,
          error: null,
          ...calculateComputedValues(newItems),
        });
      },

      removeItem: (itemId) => {
        const newItems = get().items.filter((item) => item.id !== itemId);
        set({
          items: newItems,
          error: null,
          ...calculateComputedValues(newItems),
        });
      },

      updateQuantity: (itemId, quantity) => {
        let newItems;
        if (quantity <= 0) {
          newItems = get().items.filter((item) => item.id !== itemId);
        } else {
          newItems = get().items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          );
        }
        set({
          items: newItems,
          error: null,
          ...calculateComputedValues(newItems),
        });
      },

      clearCart: () => {
        set({
          items: [],
          error: null,
          ...calculateComputedValues([]),
        });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      // Cart Operations
      incrementItem: (itemId) => {
        const currentItems = get().items;
        const newItems = currentItems.map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        set({
          items: newItems,
          ...calculateComputedValues(newItems),
        });
      },

      decrementItem: (itemId) => {
        const currentItems = get().items;
        const item = currentItems.find((item) => item.id === itemId);

        let newItems;
        if (item && item.quantity > 1) {
          newItems = currentItems.map((cartItem) =>
            cartItem.id === itemId
              ? { ...cartItem, quantity: cartItem.quantity - 1 }
              : cartItem
          );
        } else {
          newItems = currentItems.filter((cartItem) => cartItem.id !== itemId);
        }
        set({
          items: newItems,
          ...calculateComputedValues(newItems),
        });
      },

      setItemQuantity: (itemId, quantity) => {
        get().updateQuantity(itemId, quantity);
      },

      // Cart Validation (can remain as a method)
      validateCart: () => {
        const { items } = get();
        const errors: string[] = [];

        if (items.length === 0) {
          errors.push('Корзина пуста');
        }

        // Check for items with zero or negative quantity
        const invalidItems = items.filter((item) => item.quantity <= 0);
        if (invalidItems.length > 0) {
          errors.push('Некоторые товары имеют некорректное количество');
        }

        // Check for items with zero or negative price
        const invalidPriceItems = items.filter((item) => item.price <= 0);
        if (invalidPriceItems.length > 0) {
          errors.push('Некоторые товары имеют некорректную цену');
        }

        // Check total price
        const totalPrice = items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        if (totalPrice <= 0) {
          errors.push('Общая стоимость корзины некорректна');
        }

        return {
          isValid: errors.length === 0,
          errors,
        };
      },

      // Cart Persistence
      saveCart: () => {
        const { items } = get();
        try {
          localStorage.setItem('ode-cart', JSON.stringify(items));
        } catch (error) {
          console.error('Error saving cart to localStorage:', error);
        }
      },

      loadCart: () => {
        try {
          const savedCart = localStorage.getItem('ode-cart');
          if (savedCart) {
            const items = JSON.parse(savedCart);
            set({
              items: items,
              ...calculateComputedValues(items),
            });
          }
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      },

      // Cart Analytics (can remain as a method)
      getCartAnalytics: () => {
        const { items } = get();

        if (items.length === 0) {
          return {
            totalValue: 0,
            averageItemPrice: 0,
            mostExpensiveItem: null,
            cheapestItem: null,
            categoryBreakdown: {},
            kitchenBreakdown: {},
          };
        }

        const totalValue = items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        const averageItemPrice =
          totalValue / items.reduce((total, item) => total + item.quantity, 0);

        const sortedByPrice = [...items].sort((a, b) => b.price - a.price);
        const mostExpensiveItem = sortedByPrice[0];
        const cheapestItem = sortedByPrice[sortedByPrice.length - 1];

        const categoryBreakdown: Record<string, number> = {};
        const kitchenBreakdown: Record<string, number> = {};

        items.forEach((item) => {
          if (item.category) {
            categoryBreakdown[item.category] =
              (categoryBreakdown[item.category] || 0) + item.quantity;
          }
          if (item.kitchen) {
            kitchenBreakdown[item.kitchen] =
              (kitchenBreakdown[item.kitchen] || 0) + item.quantity;
          }
        });

        return {
          totalValue,
          averageItemPrice,
          mostExpensiveItem,
          cheapestItem,
          categoryBreakdown,
          kitchenBreakdown,
        };
      },
    }),
    {
      name: 'ode-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// Cart Store Hooks for specific use cases
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartTotal = () => useCartStore((state) => state.totalPrice);
export const useCartTotalFormatted = () =>
  useCartStore((state) => state.totalPriceFormatted);
export const useCartItemCount = () => useCartStore((state) => state.totalItems);
export const useCartIsEmpty = () => useCartStore((state) => state.isEmpty);
export const useCartIsOpen = () => useCartStore((state) => state.isOpen);

// Cart Actions Hooks
export const useCartActions = () =>
  useCartStore((state) => ({
    addItem: state.addItem,
    removeItem: state.removeItem,
    updateQuantity: state.updateQuantity,
    clearCart: state.clearCart,
    toggleCart: state.toggleCart,
    openCart: state.openCart,
    closeCart: state.closeCart,
    incrementItem: state.incrementItem,
    decrementItem: state.decrementItem,
    setItemQuantity: state.setItemQuantity,
  }));

// Cart Validation Hook
export const useCartValidation = () =>
  useCartStore((state) => state.validateCart);

// Cart Analytics Hook
export const useCartAnalytics = () =>
  useCartStore((state) => state.getCartAnalytics);

export default useCartStore;
