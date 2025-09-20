import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BookingData {
  id?: string;
  date: string;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  experienceType?: string;
  totalAmount?: number;
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt?: string;
  updatedAt?: string;
}

interface BookingState {
  // State
  currentBooking: BookingData | null;
  bookings: BookingData[];
  loading: boolean;
  error: string | null;
  isBookingModalOpen: boolean;
  
  // Actions
  setCurrentBooking: (booking: BookingData | null) => void;
  updateCurrentBooking: (updates: Partial<BookingData>) => void;
  clearCurrentBooking: () => void;
  setBookings: (bookings: BookingData[]) => void;
  addBooking: (booking: BookingData) => void;
  updateBooking: (bookingId: string, updates: Partial<BookingData>) => void;
  removeBooking: (bookingId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Booking Operations
  createBooking: (bookingData: BookingData) => Promise<void>;
  confirmBooking: (bookingId: string) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  completeBooking: (bookingId: string) => Promise<void>;
  
  // Booking Validation
  validateBooking: (booking: BookingData) => { isValid: boolean; errors: string[] };
  validateCurrentBooking: () => { isValid: boolean; errors: string[] };
  
  // Booking Analytics
  getBookingAnalytics: () => {
    totalBookings: number;
    confirmedBookings: number;
    cancelledBookings: number;
    completedBookings: number;
    totalGuests: number;
    averageGuestsPerBooking: number;
    mostPopularTime: string;
    mostPopularDate: string;
    totalRevenue: number;
  };
  
  // Booking Persistence
  saveBookings: () => void;
  loadBookings: () => void;
  
  // Modal Operations
  openBookingModal: () => void;
  closeBookingModal: () => void;
  toggleBookingModal: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentBooking: null,
      bookings: [],
      loading: false,
      error: null,
      isBookingModalOpen: false,

      // Actions
      setCurrentBooking: (booking: BookingData | null) => {
        set({
          currentBooking: booking,
          error: null
        });
      },

      updateCurrentBooking: (updates: Partial<BookingData>) => {
        const state = get();
        if (state.currentBooking) {
          set({
            currentBooking: { ...state.currentBooking, ...updates },
            error: null
          });
        }
      },

      clearCurrentBooking: () => {
        set({
          currentBooking: null,
          error: null
        });
      },

      setBookings: (bookings: BookingData[]) => {
        set({
          bookings: bookings,
          error: null
        });
      },

      addBooking: (booking: BookingData) => {
        const state = get();
        set({
          bookings: [...state.bookings, booking],
          error: null
        });
      },

      updateBooking: (bookingId: string, updates: Partial<BookingData>) => {
        const state = get();
        const index = state.bookings.findIndex(booking => booking.id === bookingId);
        if (index !== -1) {
          set({
            bookings: state.bookings.map((booking, i) => 
              i === index ? { ...booking, ...updates } : booking
            ),
            error: null
          });
        }
      },

      removeBooking: (bookingId: string) => {
        const state = get();
        set({
          bookings: state.bookings.filter(booking => booking.id !== bookingId),
          error: null
        });
      },

      setLoading: (loading: boolean) => {
        set({
          loading: loading
        });
      },

      setError: (error: string | null) => {
        set({
          error: error
        });
      },

      // Booking Operations
      createBooking: async (bookingData: BookingData) => {
        set({
          loading: true,
          error: null
        });

        try {
          // Simulate API call - replace with actual Supabase call
          const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
          });

          if (!response.ok) {
            throw new Error('Failed to create booking');
          }

          const createdBooking = await response.json();
          const state = get();
          
          set({
            bookings: [...state.bookings, createdBooking],
            currentBooking: createdBooking,
            loading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            loading: false
          });
        }
      },

      confirmBooking: async (bookingId: string) => {
        set({
          loading: true,
          error: null
        });

        try {
          // Simulate API call - replace with actual Supabase call
          const response = await fetch(`/api/bookings/${bookingId}/confirm`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to confirm booking');
          }

          const state = get();
          const updatedBookings = state.bookings.map(booking => 
            booking.id === bookingId ? { ...booking, status: 'confirmed' as const } : booking
          );
          const updatedCurrentBooking = state.currentBooking?.id === bookingId 
            ? { ...state.currentBooking, status: 'confirmed' as const }
            : state.currentBooking;

          set({
            bookings: updatedBookings,
            currentBooking: updatedCurrentBooking,
            loading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            loading: false
          });
        }
      },

      cancelBooking: async (bookingId: string) => {
        set({
          loading: true,
          error: null
        });

        try {
          // Simulate API call - replace with actual Supabase call
          const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to cancel booking');
          }

          const state = get();
          const updatedBookings = state.bookings.map(booking => 
            booking.id === bookingId ? { ...booking, status: 'cancelled' as const } : booking
          );
          const updatedCurrentBooking = state.currentBooking?.id === bookingId 
            ? { ...state.currentBooking, status: 'cancelled' as const }
            : state.currentBooking;

          set({
            bookings: updatedBookings,
            currentBooking: updatedCurrentBooking,
            loading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            loading: false
          });
        }
      },

      completeBooking: async (bookingId: string) => {
        set({
          loading: true,
          error: null
        });

        try {
          // Simulate API call - replace with actual Supabase call
          const response = await fetch(`/api/bookings/${bookingId}/complete`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to complete booking');
          }

          const state = get();
          const updatedBookings = state.bookings.map(booking => 
            booking.id === bookingId ? { ...booking, status: 'completed' as const } : booking
          );
          const updatedCurrentBooking = state.currentBooking?.id === bookingId 
            ? { ...state.currentBooking, status: 'completed' as const }
            : state.currentBooking;

          set({
            bookings: updatedBookings,
            currentBooking: updatedCurrentBooking,
            loading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            loading: false
          });
        }
      },

      // Booking Validation
      validateBooking: (booking: BookingData) => {
        const errors: string[] = [];

        if (!booking.date || !isValidDate(booking.date)) {
          errors.push('Invalid booking date');
        }

        if (!booking.time || !isValidTime(booking.time)) {
          errors.push('Invalid booking time');
        }

        if (!booking.guests || booking.guests < 1 || booking.guests > 20) {
          errors.push('Number of guests must be between 1 and 20');
        }

        if (!booking.name || booking.name.trim().length < 2) {
          errors.push('Name must be at least 2 characters');
        }

        if (!booking.email || !isValidEmail(booking.email)) {
          errors.push('Invalid email address');
        }

        if (!booking.phone || !isValidPhone(booking.phone)) {
          errors.push('Invalid phone number');
        }

        // Check if booking date is in the future
        const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
        const now = new Date();
        if (bookingDateTime <= now) {
          errors.push('Booking date and time must be in the future');
        }

        return {
          isValid: errors.length === 0,
          errors
        };
      },

      validateCurrentBooking: () => {
        const { currentBooking } = get();
        if (!currentBooking) {
          return { isValid: false, errors: ['No current booking'] };
        }
        return get().validateBooking(currentBooking);
      },

      // Booking Analytics
      getBookingAnalytics: () => {
        const { bookings } = get();
        
        if (bookings.length === 0) {
          return {
            totalBookings: 0,
            confirmedBookings: 0,
            cancelledBookings: 0,
            completedBookings: 0,
            totalGuests: 0,
            averageGuestsPerBooking: 0,
            mostPopularTime: '',
            mostPopularDate: '',
            totalRevenue: 0,
          };
        }

        const totalBookings = bookings.length;
        const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
        const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
        const completedBookings = bookings.filter(b => b.status === 'completed').length;
        const totalGuests = bookings.reduce((total, booking) => total + booking.guests, 0);
        const averageGuestsPerBooking = totalGuests / totalBookings;

        // Find most popular time
        const timeCounts: Record<string, number> = {};
        bookings.forEach(booking => {
          timeCounts[booking.time] = (timeCounts[booking.time] || 0) + 1;
        });
        const mostPopularTime = Object.entries(timeCounts).reduce((a, b) => 
          timeCounts[a[0]] > timeCounts[b[0]] ? a : b
        )[0];

        // Find most popular date
        const dateCounts: Record<string, number> = {};
        bookings.forEach(booking => {
          dateCounts[booking.date] = (dateCounts[booking.date] || 0) + 1;
        });
        const mostPopularDate = Object.entries(dateCounts).reduce((a, b) => 
          dateCounts[a[0]] > dateCounts[b[0]] ? a : b
        )[0];

        const totalRevenue = bookings.reduce((total, booking) => 
          total + (booking.totalAmount || 0), 0
        );

        return {
          totalBookings,
          confirmedBookings,
          cancelledBookings,
          completedBookings,
          totalGuests,
          averageGuestsPerBooking,
          mostPopularTime,
          mostPopularDate,
          totalRevenue,
        };
      },

      // Booking Persistence
      saveBookings: () => {
        const { bookings } = get();
        try {
          localStorage.setItem('ode-bookings', JSON.stringify(bookings));
        } catch (error) {
          console.error('Error saving bookings to localStorage:', error);
        }
      },

      loadBookings: () => {
        try {
          const savedBookings = localStorage.getItem('ode-bookings');
          if (savedBookings) {
            const bookings = JSON.parse(savedBookings);
            set((state) => {
              state.bookings = bookings;
            });
          }
        } catch (error) {
          console.error('Error loading bookings from localStorage:', error);
        }
      },

      // Modal Operations
      openBookingModal: () => {
        set({
          isBookingModalOpen: true
        });
      },

      closeBookingModal: () => {
        set({
          isBookingModalOpen: false
        });
      },

      toggleBookingModal: () => {
        const state = get();
        set({
          isBookingModalOpen: !state.isBookingModalOpen
        });
      },
    }),
    {
      name: 'ode-booking-storage',
      partialize: (state) => ({ 
        bookings: state.bookings,
        currentBooking: state.currentBooking 
      }),
    }
  )
);

// Helper functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

function isValidTime(timeString: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeString);
}

// Booking Store Hooks for specific use cases
export const useCurrentBooking = () => useBookingStore(state => state.currentBooking);
export const useBookings = () => useBookingStore(state => state.bookings);
export const useBookingLoading = () => useBookingStore(state => state.loading);
export const useBookingError = () => useBookingStore(state => state.error);
export const useBookingModalOpen = () => useBookingStore(state => state.isBookingModalOpen);

// Booking Actions Hooks
export const useBookingActions = () => useBookingStore(state => ({
  setCurrentBooking: state.setCurrentBooking,
  updateCurrentBooking: state.updateCurrentBooking,
  clearCurrentBooking: state.clearCurrentBooking,
  setBookings: state.setBookings,
  addBooking: state.addBooking,
  updateBooking: state.updateBooking,
  removeBooking: state.removeBooking,
  createBooking: state.createBooking,
  confirmBooking: state.confirmBooking,
  cancelBooking: state.cancelBooking,
  completeBooking: state.completeBooking,
  openBookingModal: state.openBookingModal,
  closeBookingModal: state.closeBookingModal,
  toggleBookingModal: state.toggleBookingModal,
}));

// Booking Validation Hook
export const useBookingValidation = () => useBookingStore(state => state.validateBooking);
export const useCurrentBookingValidation = () => useBookingStore(state => state.validateCurrentBooking);

// Booking Analytics Hook
export const useBookingAnalytics = () => useBookingStore(state => state.getBookingAnalytics);

export default useBookingStore;
