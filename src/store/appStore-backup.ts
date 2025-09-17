import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { APP_CONFIG, FEATURE_FLAGS } from '@/lib/constants';

// Types
interface AppState {
  // UI State
  isLoading: boolean;
  isOnline: boolean;
  theme: 'light' | 'dark';
  language: string;
  sidebarOpen: boolean;
  
  // Notifications
  notifications: Notification[];
  
  // Cache
  cache: Record<string, any>;
  cacheExpiry: Record<string, number>;
  
  // Feature flags
  features: typeof FEATURE_FLAGS;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setOnline: (online: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: string) => void;
  toggleSidebar: () => void;
  
  // Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Cache
  setCache: (key: string, value: any, ttl?: number) => void;
  getCache: (key: string) => any;
  clearCache: (key?: string) => void;
  
  // Features
  toggleFeature: (feature: keyof typeof FEATURE_FLAGS) => void;
  setFeatures: (features: Partial<typeof FEATURE_FLAGS>) => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

// Initial state
const initialState = {
  isLoading: false,
  isOnline: navigator.onLine,
  theme: 'light' as const,
  language: 'en',
  sidebarOpen: false,
  notifications: [],
  cache: {},
  cacheExpiry: {},
  features: FEATURE_FLAGS
};

// Store
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // UI Actions
        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },
        
        setOnline: (online: boolean) => {
          set({ isOnline: online });
        },
        
        setTheme: (theme: 'light' | 'dark') => {
          set((state) => {
            state.theme = theme;
            document.documentElement.classList.toggle('dark', theme === 'dark');
          });
        },
        
        setLanguage: (language: string) => {
          set((state) => {
            state.language = language;
          });
        },
        
        toggleSidebar: () => {
          set((state) => {
            state.sidebarOpen = !state.sidebarOpen;
          });
        },
        
        // Notification Actions
        addNotification: (notification) => {
          set((state) => {
            const newNotification: Notification = {
              ...notification,
              id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              timestamp: Date.now(),
              read: false
            };
            state.notifications.unshift(newNotification);
            
            // Keep only last 50 notifications
            if (state.notifications.length > 50) {
              state.notifications = state.notifications.slice(0, 50);
            }
          });
        },
        
        removeNotification: (id: string) => {
          set((state) => {
            state.notifications = state.notifications.filter(n => n.id !== id);
          });
        },
        
        clearNotifications: () => {
          set((state) => {
            state.notifications = [];
          });
        },
        
        // Cache Actions
        setCache: (key: string, value: any, ttl: number = 300000) => { // 5 minutes default
          set((state) => {
            state.cache[key] = value;
            state.cacheExpiry[key] = Date.now() + ttl;
          });
        },
        
        getCache: (key: string) => {
          const state = get();
          const expiry = state.cacheExpiry[key];
          
          if (expiry && Date.now() > expiry) {
            // Cache expired, remove it
            set((state) => {
              delete state.cache[key];
              delete state.cacheExpiry[key];
            });
            return null;
          }
          
          return state.cache[key] || null;
        },
        
        clearCache: (key?: string) => {
          set((state) => {
            if (key) {
              delete state.cache[key];
              delete state.cacheExpiry[key];
            } else {
              state.cache = {};
              state.cacheExpiry = {};
            }
          });
        },
        
        // Feature Actions
        toggleFeature: (feature: keyof typeof FEATURE_FLAGS) => {
          set((state) => {
            state.features[feature] = !state.features[feature];
          });
        },
        
        setFeatures: (features: Partial<typeof FEATURE_FLAGS>) => {
          set((state) => {
            state.features = { ...state.features, ...features };
          });
        }
      })),
      {
        name: 'app-store',
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
          sidebarOpen: state.sidebarOpen,
          features: state.features
        })
      }
    ),
    {
      name: 'app-store'
    }
  )
);

// Selectors
export const useAppLoading = () => useAppStore((state) => state.isLoading);
export const useAppOnline = () => useAppStore((state) => state.isOnline);
export const useAppTheme = () => useAppStore((state) => state.theme);
export const useAppLanguage = () => useAppStore((state) => state.language);
export const useSidebarOpen = () => useAppStore((state) => state.sidebarOpen);
export const useNotifications = () => useAppStore((state) => state.notifications);
export const useUnreadNotifications = () => useAppStore((state) => 
  state.notifications.filter(n => !n.read)
);
export const useFeatures = () => useAppStore((state) => state.features);

// Actions
export const useAppActions = () => useAppStore((state) => ({
  setLoading: state.setLoading,
  setOnline: state.setOnline,
  setTheme: state.setTheme,
  setLanguage: state.setLanguage,
  toggleSidebar: state.toggleSidebar,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  clearNotifications: state.clearNotifications,
  setCache: state.setCache,
  getCache: state.getCache,
  clearCache: state.clearCache,
  toggleFeature: state.toggleFeature,
  setFeatures: state.setFeatures
}));
