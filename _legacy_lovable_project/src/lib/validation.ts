import { z } from 'zod';
import { VALIDATION_RULES } from './constants';

// Base validation schemas
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email(VALIDATION_RULES.EMAIL.MESSAGE)
  .regex(VALIDATION_RULES.EMAIL.PATTERN, VALIDATION_RULES.EMAIL.MESSAGE);

export const passwordSchema = z
  .string()
  .min(
    VALIDATION_RULES.PASSWORD.MIN_LENGTH,
    `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`
  )
  .regex(VALIDATION_RULES.PASSWORD.PATTERN, VALIDATION_RULES.PASSWORD.MESSAGE);

export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(VALIDATION_RULES.PHONE.PATTERN, VALIDATION_RULES.PHONE.MESSAGE);

export const nameSchema = z
  .string()
  .min(
    VALIDATION_RULES.NAME.MIN_LENGTH,
    `Name must be at least ${VALIDATION_RULES.NAME.MIN_LENGTH} characters`
  )
  .max(
    VALIDATION_RULES.NAME.MAX_LENGTH,
    `Name must be no more than ${VALIDATION_RULES.NAME.MAX_LENGTH} characters`
  )
  .regex(VALIDATION_RULES.NAME.PATTERN, VALIDATION_RULES.NAME.MESSAGE);

// User validation schemas
export const userSchema = z.object({
  id: z.string().uuid().optional(),
  email: emailSchema,
  full_name: nameSchema,
  phone: phoneSchema.optional(),
  role: z.enum(['admin', 'tenant', 'investor', 'internal', 'guest']).optional(),
  is_active: z.boolean().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const userRoleSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  role: z.enum(['admin', 'tenant', 'investor', 'internal', 'guest']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Auth validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    full_name: nameSchema,
    phone: phoneSchema.optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Booking validation schemas
export const bookingSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  space_id: z.string().uuid(),
  date: z.string().datetime(),
  time_slot: z.string(),
  duration: z.number().min(1).max(8),
  guests: z.number().min(1).max(20),
  special_requests: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

// Tenant application validation schemas
export const tenantApplicationSchema = z.object({
  id: z.string().uuid().optional(),
  company_name: z.string().min(1, 'Company name is required'),
  contact_person: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  business_type: z.string().min(1, 'Business type is required'),
  cuisine_type: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  space_name: z.string().min(1, 'Space name is required'),
  space_area: z.number().min(1, 'Space area must be positive'),
  floor_number: z.number().min(1, 'Floor number must be positive'),
  lease_duration: z.string().min(1, 'Lease duration is required'),
  lease_start_date: z.string().datetime().optional(),
  investment_budget: z.string().optional(),
  expected_revenue: z.string().optional(),
  has_food_license: z.boolean(),
  previous_experience: z.string().optional(),
  special_requirements: z.string().optional(),
  status: z
    .enum(['pending', 'approved', 'rejected', 'under_review'])
    .optional(),
  admin_notes: z.string().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

// Event validation schemas
export const vendorSchema = z.object({
  name: z.string().min(2, 'Название вендора должно быть длиннее 2 символов'),
  description: z.string().optional(),
  cuisine_type: z.string().min(1, 'Необходимо выбрать тип кухни'),
  location: z.string().min(3, 'Необходимо указать местоположение'),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, 'Некорректный формат телефона'),
  email: z.string().email('Некорректный формат email'),
  website: z
    .string()
    .url('Некорректный URL веб-сайта')
    .optional()
    .or(z.literal('')),
  is_active: z.boolean().default(true),
});

export const menuItemSchema = z.object({
  name: z.string().min(2, 'Название блюда должно быть длиннее 2 символов'),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, 'Цена должна быть положительной'),
  category: z.string().min(1, 'Необходимо выбрать категорию'),
  vendor_id: z.string().uuid('Некорректный ID вендора'),
  is_available: z.boolean().default(true),
  preparation_time: z.coerce
    .number()
    .int()
    .min(1, 'Время приготовления должно быть положительным числом'),
  spice_level: z.enum(['mild', 'medium', 'hot', 'extra-hot']).default('mild'),
  is_vegetarian: z.boolean().default(false),
  is_vegan: z.boolean().default(false),
  is_gluten_free: z.boolean().default(false),
  allergens: z.array(z.string()).optional(),
});

export const eventSchema = z.object({
  title: z.string().min(5, 'Название должно быть длиннее 5 символов'),
  description: z.string().optional(),
  event_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Некорректный формат даты'),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, 'Некорректный формат времени'),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, 'Некорректный формат времени'),
  location: z.string().min(3, 'Необходимо указать место проведения'),
  max_attendees: z.coerce
    .number()
    .int()
    .positive('Количество участников должно быть положительным числом'),
  price: z.coerce.number().min(0, 'Цена не может быть отрицательной'),
  event_type: z.string().min(1, 'Необходимо выбрать тип события'),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  image_url: z
    .string()
    .url('Некорректный URL изображения')
    .optional()
    .or(z.literal('')),
});

// Form validation helpers
export const validateForm = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
} => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: ['Validation failed'] } };
  }
};

// Field validation helpers
export const validateField = (
  schema: z.ZodSchema,
  value: unknown
): {
  success: boolean;
  error?: string;
} => {
  try {
    schema.parse(value);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || 'Invalid value',
      };
    }
    return { success: false, error: 'Validation failed' };
  }
};

// Async validation helpers
export const validateEmailExists = async (email: string): Promise<boolean> => {
  // This would be implemented with actual API call
  // For now, return true to simulate validation
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate API call
      resolve(true);
    }, 100);
  });
};

export const validatePhoneExists = async (phone: string): Promise<boolean> => {
  // This would be implemented with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 100);
  });
};

// Custom validation rules
export const createCustomValidator = (
  rule: (value: any) => boolean,
  message: string
) => {
  return z.custom((value) => {
    if (!rule(value)) {
      throw new z.ZodError([
        {
          code: 'custom',
          message,
          path: [],
        },
      ]);
    }
    return value;
  });
};

// Date validation helpers
export const validateFutureDate = (date: string): boolean => {
  return new Date(date) > new Date();
};

export const validateDateRange = (
  startDate: string,
  endDate: string
): boolean => {
  return new Date(startDate) < new Date(endDate);
};

// Business logic validation
export const validateBookingTime = (
  date: string,
  timeSlot: string
): boolean => {
  const bookingDateTime = new Date(`${date}T${timeSlot}`);
  const now = new Date();
  const minAdvanceTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours advance

  return bookingDateTime > minAdvanceTime;
};

export const validateLeaseDuration = (
  startDate: string,
  endDate: string
): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  return diffMonths >= 6 && diffMonths <= 24; // 6-24 months
};
