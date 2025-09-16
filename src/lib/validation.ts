import { z } from 'zod';

// User validation schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const userRoleSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  role: z.enum(['admin', 'tenant', 'investor', 'internal', 'guest']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Booking validation schemas
export const bookingSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  guest_email: z.string().email().optional(),
  guest_name: z.string().min(2).optional(),
  guest_phone: z.string().min(10).optional(),
  booking_date: z.string().datetime(),
  booking_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  guests: z.number().int().min(1).max(20),
  special_requests: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).default('pending'),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
}).refine(
  (data) => data.user_id || (data.guest_email && data.guest_name && data.guest_phone),
  {
    message: 'Either user_id or guest information must be provided',
    path: ['user_id'],
  }
);

// Food order validation schemas
export const foodOrderItemSchema = z.object({
  id: z.string().uuid(),
  menu_item_id: z.string().uuid(),
  quantity: z.number().int().min(1),
  price: z.number().min(0),
  special_instructions: z.string().optional(),
});

export const foodOrderSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  guest_email: z.string().email().optional(),
  guest_name: z.string().min(2).optional(),
  guest_phone: z.string().min(10).optional(),
  items: z.array(foodOrderItemSchema).min(1, 'At least one item is required'),
  total_amount: z.number().min(0),
  status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']).default('pending'),
  payment_method: z.enum(['card', 'cash', 'digital_wallet']),
  payment_status: z.enum(['pending', 'paid', 'failed', 'refunded']).default('pending'),
  special_requests: z.string().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
}).refine(
  (data) => data.user_id || (data.guest_email && data.guest_name && data.guest_phone),
  {
    message: 'Either user_id or guest information must be provided',
    path: ['user_id'],
  }
);

// Menu item validation schemas
export const menuItemSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  cuisine_type: z.string().optional(),
  dietary_info: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
  available: z.boolean().default(true),
  image_url: z.string().url().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

// Event validation schemas
export const eventSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  event_date: z.string().datetime(),
  event_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  duration: z.number().int().min(30).max(480), // 30 minutes to 8 hours
  max_attendees: z.number().int().min(1).max(1000),
  price: z.number().min(0),
  location: z.string().min(1, 'Location is required'),
  status: z.enum(['draft', 'published', 'cancelled', 'completed']).default('draft'),
  image_url: z.string().url().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

// Vendor application validation
export const vendorApplicationSchema = z.object({
  id: z.string().uuid().optional(),
  company_name: z.string().min(1, 'Company name is required'),
  contact_person: z.string().min(1, 'Contact person is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  business_type: z.string().min(1, 'Business type is required'),
  cuisine_type: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  expected_revenue: z.string().optional(),
  investment_budget: z.string().optional(),
  previous_experience: z.string().optional(),
  special_requirements: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  admin_notes: z.string().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

// API response validation
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
    status: z.number().int().min(200).max(599),
  });

// Pagination validation
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

// Search validation
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  filters: z.record(z.any()).optional(),
  pagination: paginationSchema.optional(),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  type: z.enum(['image', 'document', 'video']),
  maxSize: z.number().int().min(1).max(10 * 1024 * 1024), // 10MB max
  allowedTypes: z.array(z.string()).optional(),
});

// Validation helper functions
export const validateData = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): { success: boolean; data?: z.infer<T>; errors?: string[] } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
      };
    }
    return { success: false, errors: ['Validation failed'] };
  }
};

export const validateFormData = <T extends z.ZodTypeAny>(
  schema: T,
  formData: FormData
): { success: boolean; data?: z.infer<T>; errors?: string[] } => {
  try {
    const data = Object.fromEntries(formData.entries());
    return validateData(schema, data);
  } catch (error) {
    return { success: false, errors: ['Form data validation failed'] };
  }
};

// Type exports for use in components
export type User = z.infer<typeof userSchema>;
export type UserRole = z.infer<typeof userRoleSchema>;
export type Booking = z.infer<typeof bookingSchema>;
export type FoodOrder = z.infer<typeof foodOrderSchema>;
export type FoodOrderItem = z.infer<typeof foodOrderItemSchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type Event = z.infer<typeof eventSchema>;
export type VendorApplication = z.infer<typeof vendorApplicationSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type Search = z.infer<typeof searchSchema>;
export type FileUpload = z.infer<typeof fileUploadSchema>;
