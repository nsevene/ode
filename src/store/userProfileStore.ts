import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  address?: {
    street?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
  preferences?: {
    language: string;
    currency: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    dietary: {
      isVegetarian: boolean;
      isVegan: boolean;
      isGlutenFree: boolean;
      allergies: string[];
    };
    marketing: {
      newsletter: boolean;
      promotions: boolean;
      events: boolean;
    };
  };
  loyalty?: {
    points: number;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    totalSpent: number;
    totalOrders: number;
    memberSince: string;
    nextTierPoints: number;
  };
  social?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface UserProfileState {
  // State
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  // Actions
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Profile Operations
  updateAvatar: (avatarUrl: string) => Promise<void>;
  updatePreferences: (preferences: Partial<UserProfile['preferences']>) => Promise<void>;
  updateLoyaltyPoints: (points: number) => Promise<void>;
  addLoyaltyPoints: (points: number) => Promise<void>;
  
  // Profile Validation
  validateProfile: () => { isValid: boolean; errors: string[] };
  
  // Profile Analytics
  getProfileAnalytics: () => {
    accountAge: number; // in days
    loyaltyTier: string;
    pointsToNextTier: number;
    totalValue: number;
    averageOrderValue: number;
    favoriteCategories: string[];
    dietaryRestrictions: string[];
  };
  
  // Profile Persistence
  saveProfile: () => void;
  loadProfile: () => void;
}

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    immer((set, get) => ({
      // Initial State
      profile: null,
      loading: false,
      error: null,
      isInitialized: false,

      // Actions
      fetchProfile: async (userId: string) => {
        set((state) => {
          state.loading = true;
          state.error = null;
        });

        try {
          // Simulate API call - replace with actual Supabase call
          const response = await fetch(`/api/users/${userId}/profile`);
          if (!response.ok) {
            throw new Error('Failed to fetch profile');
          }
          
          const profile = await response.json();
          
          set((state) => {
            state.profile = profile;
            state.loading = false;
            state.isInitialized = true;
          });
        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : 'Unknown error';
            state.loading = false;
          });
        }
      },

      updateProfile: async (updates: Partial<UserProfile>) => {
        const { profile } = get();
        if (!profile) {
          set((state) => {
            state.error = 'No profile to update';
          });
          return;
        }

        set((state) => {
          state.loading = true;
          state.error = null;
        });

        try {
          // Simulate API call - replace with actual Supabase call
          const response = await fetch(`/api/users/${profile.id}/profile`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
          });

          if (!response.ok) {
            throw new Error('Failed to update profile');
          }

          const updatedProfile = await response.json();
          
          set((state) => {
            if (state.profile) {
              state.profile = { ...state.profile, ...updatedProfile, updatedAt: new Date().toISOString() };
            }
            state.loading = false;
          });
        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : 'Unknown error';
            state.loading = false;
          });
        }
      },

      setProfile: (profile: UserProfile) => {
        set((state) => {
          state.profile = profile;
          state.isInitialized = true;
          state.error = null;
        });
      },

      clearProfile: () => {
        set((state) => {
          state.profile = null;
          state.isInitialized = false;
          state.error = null;
        });
      },

      setLoading: (loading: boolean) => {
        set((state) => {
          state.loading = loading;
        });
      },

      setError: (error: string | null) => {
        set((state) => {
          state.error = error;
        });
      },

      // Profile Operations
      updateAvatar: async (avatarUrl: string) => {
        const { profile } = get();
        if (!profile) return;

        await get().updateProfile({ avatar: avatarUrl });
      },

      updatePreferences: async (preferences: Partial<UserProfile['preferences']>) => {
        const { profile } = get();
        if (!profile) return;

        const updatedPreferences = {
          ...profile.preferences,
          ...preferences,
        };

        await get().updateProfile({ preferences: updatedPreferences });
      },

      updateLoyaltyPoints: async (points: number) => {
        const { profile } = get();
        if (!profile || !profile.loyalty) return;

        const updatedLoyalty = {
          ...profile.loyalty,
          points: Math.max(0, points),
        };

        await get().updateProfile({ loyalty: updatedLoyalty });
      },

      addLoyaltyPoints: async (points: number) => {
        const { profile } = get();
        if (!profile || !profile.loyalty) return;

        const newPoints = profile.loyalty.points + points;
        await get().updateLoyaltyPoints(newPoints);
      },

      // Profile Validation
      validateProfile: () => {
        const { profile } = get();
        const errors: string[] = [];

        if (!profile) {
          errors.push('Profile not loaded');
          return { isValid: false, errors };
        }

        if (!profile.email || !isValidEmail(profile.email)) {
          errors.push('Invalid email address');
        }

        if (!profile.fullName || profile.fullName.trim().length < 2) {
          errors.push('Full name must be at least 2 characters');
        }

        if (profile.phone && !isValidPhone(profile.phone)) {
          errors.push('Invalid phone number format');
        }

        if (profile.dateOfBirth && !isValidDate(profile.dateOfBirth)) {
          errors.push('Invalid date of birth');
        }

        return {
          isValid: errors.length === 0,
          errors
        };
      },

      // Profile Analytics
      getProfileAnalytics: () => {
        const { profile } = get();
        
        if (!profile) {
          return {
            accountAge: 0,
            loyaltyTier: 'bronze',
            pointsToNextTier: 0,
            totalValue: 0,
            averageOrderValue: 0,
            favoriteCategories: [],
            dietaryRestrictions: [],
          };
        }

        const accountAge = Math.floor(
          (Date.now() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        );

        const loyaltyTier = profile.loyalty?.tier || 'bronze';
        const pointsToNextTier = profile.loyalty?.nextTierPoints || 0;
        const totalValue = profile.loyalty?.totalSpent || 0;
        const totalOrders = profile.loyalty?.totalOrders || 0;
        const averageOrderValue = totalOrders > 0 ? totalValue / totalOrders : 0;

        const favoriteCategories: string[] = [];
        const dietaryRestrictions: string[] = [];

        if (profile.preferences?.dietary) {
          if (profile.preferences.dietary.isVegetarian) dietaryRestrictions.push('Vegetarian');
          if (profile.preferences.dietary.isVegan) dietaryRestrictions.push('Vegan');
          if (profile.preferences.dietary.isGlutenFree) dietaryRestrictions.push('Gluten-Free');
          dietaryRestrictions.push(...(profile.preferences.dietary.allergies || []));
        }

        return {
          accountAge,
          loyaltyTier,
          pointsToNextTier,
          totalValue,
          averageOrderValue,
          favoriteCategories,
          dietaryRestrictions,
        };
      },

      // Profile Persistence
      saveProfile: () => {
        const { profile } = get();
        if (profile) {
          try {
            localStorage.setItem('ode-user-profile', JSON.stringify(profile));
          } catch (error) {
            console.error('Error saving profile to localStorage:', error);
          }
        }
      },

      loadProfile: () => {
        try {
          const savedProfile = localStorage.getItem('ode-user-profile');
          if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            set((state) => {
              state.profile = profile;
              state.isInitialized = true;
            });
          }
        } catch (error) {
          console.error('Error loading profile from localStorage:', error);
        }
      },
    })),
    {
      name: 'ode-user-profile-storage',
      partialize: (state) => ({ profile: state.profile }),
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

// Profile Store Hooks for specific use cases
export const useUserProfile = () => useUserProfileStore(state => state.profile);
export const useProfileLoading = () => useUserProfileStore(state => state.loading);
export const useProfileError = () => useUserProfileStore(state => state.error);
export const useProfileIsInitialized = () => useUserProfileStore(state => state.isInitialized);

// Profile Actions Hooks
export const useProfileActions = () => useUserProfileStore(state => ({
  fetchProfile: state.fetchProfile,
  updateProfile: state.updateProfile,
  setProfile: state.setProfile,
  clearProfile: state.clearProfile,
  updateAvatar: state.updateAvatar,
  updatePreferences: state.updatePreferences,
  updateLoyaltyPoints: state.updateLoyaltyPoints,
  addLoyaltyPoints: state.addLoyaltyPoints,
}));

// Profile Validation Hook
export const useProfileValidation = () => useUserProfileStore(state => state.validateProfile);

// Profile Analytics Hook
export const useProfileAnalytics = () => useUserProfileStore(state => state.getProfileAnalytics);

export default useUserProfileStore;
