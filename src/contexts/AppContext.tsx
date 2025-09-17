import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRoles } from '@/hooks/useRoles';
import { useNavigate } from 'react-router-dom';

// Types
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
}

interface BookingData {
  id?: string;
  date: string;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
}

interface AppContextType {
  // User state
  user: any;
  isAuthenticated: boolean;
  role: string | null;
  
  // Cart state
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItem: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  
  // Booking state
  currentBooking: BookingData | null;
  setCurrentBooking: (booking: BookingData | null) => void;
  updateBooking: (updates: Partial<BookingData>) => void;
  clearBooking: () => void;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Navigation state
  currentPage: string;
  setCurrentPage: (page: string) => void;
  navigateTo: (path: string) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

// Create context
const AppContext = createContext<AppContextType | null>(null);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { userRole } = useRoles();
  const navigate = useNavigate();
  
  // State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentBooking, setCurrentBooking] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('ode-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ode-cart', JSON.stringify(cart));
  }, [cart]);

  // Load booking from localStorage on mount
  useEffect(() => {
    const savedBooking = localStorage.getItem('ode-booking');
    if (savedBooking) {
      try {
        setCurrentBooking(JSON.parse(savedBooking));
      } catch (error) {
        console.error('Error loading booking from localStorage:', error);
      }
    }
  }, []);

  // Save booking to localStorage whenever it changes
  useEffect(() => {
    if (currentBooking) {
      localStorage.setItem('ode-booking', JSON.stringify(currentBooking));
    } else {
      localStorage.removeItem('ode-booking');
    }
  }, [currentBooking]);

  // Cart functions
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateCartItem = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Booking functions
  const updateBooking = (updates: Partial<BookingData>) => {
    setCurrentBooking(prev => prev ? { ...prev, ...updates } : null);
  };

  const clearBooking = () => {
    setCurrentBooking(null);
  };

  // Navigation functions
  const navigateTo = (path: string) => {
    setCurrentPage(path);
    navigate(path);
  };

  // Notification functions
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep only last 50 notifications
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Context value
  const value: AppContextType = {
    // User state
    user,
    isAuthenticated,
    role: userRole,
    
    // Cart state
    cart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    
    // Booking state
    currentBooking,
    setCurrentBooking,
    updateBooking,
    clearBooking,
    
    // UI state
    isLoading,
    error,
    setLoading: setIsLoading,
    setError,
    
    // Navigation state
    currentPage,
    setCurrentPage,
    navigateTo,
    
    // Notifications
    notifications,
    addNotification,
    removeNotification,
    clearNotifications
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
