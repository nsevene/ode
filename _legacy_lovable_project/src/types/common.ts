// ============= Common Types =============

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price_usd: number;
  price_idr?: number;
  category_id: string;
  image_url?: string;
  vendor_id?: string;
  vendor_name?: string;
  is_available?: boolean;
  is_featured?: boolean;
  prep_time_minutes?: number;
  allergens?: string[];
  dietary_tags?: string[];
  spice_level?: number;
  calories?: number;
  display_order?: number;
  ingredients?: string[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  customizations?: string;
  specialRequests?: string;
}

export interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: string;
  description?: string;
  category: 'primary' | 'secondary' | 'main' | 'experiences' | 'user' | 'admin';
  isAnchor?: boolean;
  isCallToAction?: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role?: 'user' | 'admin' | 'vendor';
  created_at?: string;
  updated_at?: string;
}

export interface Booking {
  id: string;
  user_id: string;
  experience_type: string;
  date: string;
  time_slot: string;
  guests_count: number;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled';
  total_amount?: number;
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export interface VendorApplication {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  cuisine_type: string;
  preferred_sector?: string;
  description: string;
  experience_years?: number;
  investment_budget?: string;
  documents?: string[];
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location?: string;
  capacity: number;
  price?: number;
  image_url?: string;
  category: string;
  status: 'draft' | 'published' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  file_url: string;
  size: number;
  uploaded_by: string;
  created_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

export interface UpsellItem {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category?: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SitemapPage {
  url: string;
  lastModified: string;
  changeFrequency:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority: number;
}

// ============= Common Enums =============

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  VENDOR = 'vendor',
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export enum ApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// ============= Utility Types =============

export type LoadingState = boolean;
export type ModalState = boolean;
export type SubmittingState = boolean;
