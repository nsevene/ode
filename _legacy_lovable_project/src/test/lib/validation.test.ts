import { describe, it, expect } from 'vitest';
import {
  emailSchema,
  passwordSchema,
  phoneSchema,
  nameSchema,
  userSchema,
  loginSchema,
  registerSchema,
  bookingSchema,
  tenantApplicationSchema,
  validateForm,
  validateField,
  validateFutureDate,
  validateDateRange,
  validateBookingTime,
  validateLeaseDuration,
} from '@/lib/validation';

describe('Validation Schemas', () => {
  describe('emailSchema', () => {
    it('validates correct email', () => {
      const result = emailSchema.safeParse('test@example.com');
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = emailSchema.safeParse('invalid-email');
      expect(result.success).toBe(false);
    });

    it('rejects empty email', () => {
      const result = emailSchema.safeParse('');
      expect(result.success).toBe(false);
    });
  });

  describe('passwordSchema', () => {
    it('validates strong password', () => {
      const result = passwordSchema.safeParse('Password123!');
      expect(result.success).toBe(true);
    });

    it('rejects weak password', () => {
      const result = passwordSchema.safeParse('weak');
      expect(result.success).toBe(false);
    });

    it('rejects password without special character', () => {
      const result = passwordSchema.safeParse('Password123');
      expect(result.success).toBe(false);
    });
  });

  describe('phoneSchema', () => {
    it('validates correct phone number', () => {
      const result = phoneSchema.safeParse('+62-XXX-XXXX-XXXX');
      expect(result.success).toBe(true);
    });

    it('rejects invalid phone number', () => {
      const result = phoneSchema.safeParse('invalid-phone');
      expect(result.success).toBe(false);
    });
  });

  describe('nameSchema', () => {
    it('validates correct name', () => {
      const result = nameSchema.safeParse('John Doe');
      expect(result.success).toBe(true);
    });

    it('rejects name with numbers', () => {
      const result = nameSchema.safeParse('John123');
      expect(result.success).toBe(false);
    });

    it('rejects too short name', () => {
      const result = nameSchema.safeParse('J');
      expect(result.success).toBe(false);
    });

    it('rejects too long name', () => {
      const result = nameSchema.safeParse('A'.repeat(51));
      expect(result.success).toBe(false);
    });
  });

  describe('userSchema', () => {
    it('validates complete user data', () => {
      const userData = {
        email: 'test@example.com',
        full_name: 'John Doe',
        phone: '+62-XXX-XXXX-XXXX',
        role: 'admin',
        is_active: true,
      };
      const result = userSchema.safeParse(userData);
      expect(result.success).toBe(true);
    });

    it('rejects user with invalid email', () => {
      const userData = {
        email: 'invalid-email',
        full_name: 'John Doe',
      };
      const result = userSchema.safeParse(userData);
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('validates login data', () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };
      const result = loginSchema.safeParse(loginData);
      expect(result.success).toBe(true);
    });

    it('rejects empty password', () => {
      const loginData = {
        email: 'test@example.com',
        password: '',
      };
      const result = loginSchema.safeParse(loginData);
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('validates register data with matching passwords', () => {
      const registerData = {
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        full_name: 'John Doe',
      };
      const result = registerSchema.safeParse(registerData);
      expect(result.success).toBe(true);
    });

    it('rejects mismatched passwords', () => {
      const registerData = {
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!',
        full_name: 'John Doe',
      };
      const result = registerSchema.safeParse(registerData);
      expect(result.success).toBe(false);
    });
  });

  describe('bookingSchema', () => {
    it('validates booking data', () => {
      const bookingData = {
        user_id: 'user-123',
        space_id: 'space-123',
        date: '2024-12-01T10:00:00Z',
        time_slot: '10:00',
        duration: 2,
        guests: 4,
      };
      const result = bookingSchema.safeParse(bookingData);
      expect(result.success).toBe(true);
    });

    it('rejects booking with invalid duration', () => {
      const bookingData = {
        user_id: 'user-123',
        space_id: 'space-123',
        date: '2024-12-01T10:00:00Z',
        time_slot: '10:00',
        duration: 0,
        guests: 4,
      };
      const result = bookingSchema.safeParse(bookingData);
      expect(result.success).toBe(false);
    });
  });

  describe('tenantApplicationSchema', () => {
    it('validates tenant application data', () => {
      const applicationData = {
        company_name: 'Test Restaurant',
        contact_person: 'John Doe',
        email: 'test@example.com',
        phone: '+62-XXX-XXXX-XXXX',
        business_type: 'Restaurant',
        description: 'A great restaurant',
        space_name: 'Kitchen A',
        space_area: 50,
        floor_number: 1,
        lease_duration: '12 months',
        has_food_license: true,
      };
      const result = tenantApplicationSchema.safeParse(applicationData);
      expect(result.success).toBe(true);
    });

    it('rejects application with short description', () => {
      const applicationData = {
        company_name: 'Test Restaurant',
        contact_person: 'John Doe',
        email: 'test@example.com',
        phone: '+62-XXX-XXXX-XXXX',
        business_type: 'Restaurant',
        description: 'Short',
        space_name: 'Kitchen A',
        space_area: 50,
        floor_number: 1,
        lease_duration: '12 months',
        has_food_license: true,
      };
      const result = tenantApplicationSchema.safeParse(applicationData);
      expect(result.success).toBe(false);
    });
  });
});

describe('Validation Helpers', () => {
  describe('validateForm', () => {
    it('returns success for valid data', () => {
      const result = validateForm(emailSchema, 'test@example.com');
      expect(result.success).toBe(true);
      expect(result.data).toBe('test@example.com');
    });

    it('returns errors for invalid data', () => {
      const result = validateForm(emailSchema, 'invalid-email');
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('validateField', () => {
    it('returns success for valid field', () => {
      const result = validateField(emailSchema, 'test@example.com');
      expect(result.success).toBe(true);
    });

    it('returns error for invalid field', () => {
      const result = validateField(emailSchema, 'invalid-email');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('validateFutureDate', () => {
    it('validates future date', () => {
      const futureDate = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ).toISOString();
      expect(validateFutureDate(futureDate)).toBe(true);
    });

    it('rejects past date', () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      expect(validateFutureDate(pastDate)).toBe(false);
    });
  });

  describe('validateDateRange', () => {
    it('validates correct date range', () => {
      const startDate = '2024-01-01T00:00:00Z';
      const endDate = '2024-12-31T23:59:59Z';
      expect(validateDateRange(startDate, endDate)).toBe(true);
    });

    it('rejects invalid date range', () => {
      const startDate = '2024-12-31T23:59:59Z';
      const endDate = '2024-01-01T00:00:00Z';
      expect(validateDateRange(startDate, endDate)).toBe(false);
    });
  });

  describe('validateBookingTime', () => {
    it('validates future booking time', () => {
      const futureDate = new Date(Date.now() + 3 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      const timeSlot = '10:00';
      expect(validateBookingTime(futureDate, timeSlot)).toBe(true);
    });

    it('rejects past booking time', () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      const timeSlot = '10:00';
      expect(validateBookingTime(pastDate, timeSlot)).toBe(false);
    });
  });

  describe('validateLeaseDuration', () => {
    it('validates correct lease duration', () => {
      const startDate = '2024-01-01T00:00:00Z';
      const endDate = '2024-12-31T23:59:59Z';
      expect(validateLeaseDuration(startDate, endDate)).toBe(true);
    });

    it('rejects too short lease duration', () => {
      const startDate = '2024-01-01T00:00:00Z';
      const endDate = '2024-03-31T23:59:59Z';
      expect(validateLeaseDuration(startDate, endDate)).toBe(false);
    });

    it('rejects too long lease duration', () => {
      const startDate = '2024-01-01T00:00:00Z';
      const endDate = '2026-12-31T23:59:59Z';
      expect(validateLeaseDuration(startDate, endDate)).toBe(false);
    });
  });
});
