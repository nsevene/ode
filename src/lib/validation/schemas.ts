import * as yup from 'yup'

// =====================================================
// VALIDATION SCHEMAS FOR ODPORTAL B2B
// =====================================================

// =====================================================
// USER VALIDATION SCHEMAS
// =====================================================

export const userRegistrationSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required')
    .max(255, 'Email must be less than 255 characters'),
  
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  
  confirmPassword: yup
    .string()
    .required('Password confirmation is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .matches(
      /^[a-zA-Zа-яА-Я\s]+$/,
      'Full name can only contain letters and spaces'
    ),
  
  role: yup
    .string()
    .required('Role is required')
    .oneOf(['admin', 'investor', 'tenant'], 'Invalid role'),
  
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(
      /^\+?[1-9]\d{1,14}$/,
      'Invalid phone number format'
    ),
  
  organizationName: yup
    .string()
    .when('role', {
      is: (role: string) => role === 'investor' || role === 'tenant',
      then: (schema) => schema.required('Organization name is required'),
      otherwise: (schema) => schema.optional()
    })
    .min(2, 'Organization name must be at least 2 characters')
    .max(200, 'Organization name must be less than 200 characters')
})

export const userLoginSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  
  password: yup
    .string()
    .required('Password is required')
})

export const userProfileUpdateSchema = yup.object({
  fullName: yup
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .matches(
      /^[a-zA-Zа-яА-Я\s]+$/,
      'Full name can only contain letters and spaces'
    ),
  
  phone: yup
    .string()
    .matches(
      /^\+?[1-9]\d{1,14}$/,
      'Invalid phone number format'
    ),
  
  bio: yup
    .string()
    .max(500, 'Bio must be less than 500 characters'),
  
  avatar: yup
    .string()
    .url('Invalid avatar URL')
})

// =====================================================
// PROPERTY VALIDATION SCHEMAS
// =====================================================

export const propertyCreateSchema = yup.object({
  name: yup
    .string()
    .required('Property name is required')
    .min(3, 'Property name must be at least 3 characters')
    .max(200, 'Property name must be less than 200 characters'),
  
  address: yup
    .string()
    .required('Address is required')
    .min(10, 'Address must be at least 10 characters')
    .max(500, 'Address must be less than 500 characters'),
  
  type: yup
    .string()
    .required('Property type is required')
    .oneOf(['office', 'retail', 'warehouse', 'coworking'], 'Invalid property type'),
  
  size: yup
    .number()
    .required('Size is required')
    .positive('Size must be positive')
    .max(100000, 'Size must be less than 100,000 sqm'),
  
  price: yup
    .number()
    .required('Price is required')
    .positive('Price must be positive')
    .max(10000000, 'Price must be less than 10,000,000'),
  
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['available', 'occupied', 'maintenance'], 'Invalid status'),
  
  description: yup
    .string()
    .max(1000, 'Description must be less than 1000 characters'),
  
  amenities: yup
    .array()
    .of(yup.string())
    .max(20, 'Maximum 20 amenities allowed'),
  
  images: yup
    .array()
    .of(yup.string().url('Invalid image URL'))
    .max(10, 'Maximum 10 images allowed')
})

export const propertyUpdateSchema = propertyCreateSchema.partial()

// =====================================================
// APPLICATION VALIDATION SCHEMAS
// =====================================================

export const tenantApplicationSchema = yup.object({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(
      /^\+?[1-9]\d{1,14}$/,
      'Invalid phone number format'
    ),
  
  companyName: yup
    .string()
    .required('Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(200, 'Company name must be less than 200 characters'),
  
  businessType: yup
    .string()
    .required('Business type is required')
    .oneOf(['retail', 'office', 'warehouse', 'restaurant', 'other'], 'Invalid business type'),
  
  desiredArea: yup
    .number()
    .required('Desired area is required')
    .positive('Desired area must be positive')
    .max(10000, 'Desired area must be less than 10,000 sqm'),
  
  budget: yup
    .number()
    .required('Budget is required')
    .positive('Budget must be positive')
    .max(1000000, 'Budget must be less than 1,000,000'),
  
  leaseTerm: yup
    .number()
    .required('Lease term is required')
    .positive('Lease term must be positive')
    .max(120, 'Lease term must be less than 120 months'),
  
  businessDescription: yup
    .string()
    .required('Business description is required')
    .min(50, 'Business description must be at least 50 characters')
    .max(1000, 'Business description must be less than 1000 characters'),
  
  additionalRequirements: yup
    .string()
    .max(500, 'Additional requirements must be less than 500 characters')
})

// =====================================================
// INVESTMENT VALIDATION SCHEMAS
// =====================================================

export const investmentOpportunitySchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(10, 'Title must be at least 10 characters')
    .max(200, 'Title must be less than 200 characters'),
  
  description: yup
    .string()
    .required('Description is required')
    .min(50, 'Description must be at least 50 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  
  type: yup
    .string()
    .required('Type is required')
    .oneOf(['commercial', 'retail', 'warehouse', 'residential'], 'Invalid type'),
  
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['active', 'funding', 'completed', 'cancelled'], 'Invalid status'),
  
  location: yup
    .string()
    .required('Location is required')
    .min(10, 'Location must be at least 10 characters')
    .max(500, 'Location must be less than 500 characters'),
  
  totalInvestment: yup
    .number()
    .required('Total investment is required')
    .positive('Total investment must be positive')
    .max(100000000, 'Total investment must be less than 100,000,000'),
  
  minInvestment: yup
    .number()
    .required('Minimum investment is required')
    .positive('Minimum investment must be positive')
    .max(10000000, 'Minimum investment must be less than 10,000,000'),
  
  expectedReturn: yup
    .number()
    .required('Expected return is required')
    .min(0, 'Expected return must be non-negative')
    .max(100, 'Expected return must be less than 100%'),
  
  investmentPeriod: yup
    .number()
    .required('Investment period is required')
    .positive('Investment period must be positive')
    .max(120, 'Investment period must be less than 120 months'),
  
  riskLevel: yup
    .string()
    .required('Risk level is required')
    .oneOf(['low', 'medium', 'high'], 'Invalid risk level'),
  
  features: yup
    .array()
    .of(yup.string())
    .max(20, 'Maximum 20 features allowed'),
  
  documents: yup
    .array()
    .of(yup.string())
    .max(10, 'Maximum 10 documents allowed')
})

export const investmentInterestSchema = yup.object({
  opportunityId: yup
    .string()
    .required('Opportunity ID is required')
    .uuid('Invalid opportunity ID'),
  
  amount: yup
    .number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .max(10000000, 'Amount must be less than 10,000,000'),
  
  message: yup
    .string()
    .max(500, 'Message must be less than 500 characters')
})

// =====================================================
// FINANCIAL VALIDATION SCHEMAS
// =====================================================

export const financialTransactionSchema = yup.object({
  type: yup
    .string()
    .required('Transaction type is required')
    .oneOf(['income', 'expense', 'transfer', 'refund'], 'Invalid transaction type'),
  
  amount: yup
    .number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .max(10000000, 'Amount must be less than 10,000,000'),
  
  description: yup
    .string()
    .required('Description is required')
    .min(5, 'Description must be at least 5 characters')
    .max(200, 'Description must be less than 200 characters'),
  
  category: yup
    .string()
    .required('Category is required')
    .oneOf(['rent', 'utilities', 'maintenance', 'taxes', 'insurance', 'other'], 'Invalid category'),
  
  date: yup
    .date()
    .required('Date is required')
    .max(new Date(), 'Date cannot be in the future'),
  
  reference: yup
    .string()
    .max(100, 'Reference must be less than 100 characters')
})

// =====================================================
// DOCUMENT VALIDATION SCHEMAS
// =====================================================

export const documentUploadSchema = yup.object({
  name: yup
    .string()
    .required('Document name is required')
    .min(2, 'Document name must be at least 2 characters')
    .max(200, 'Document name must be less than 200 characters'),
  
  type: yup
    .string()
    .required('Document type is required')
    .oneOf(['contract', 'report', 'certificate', 'invoice', 'other'], 'Invalid document type'),
  
  description: yup
    .string()
    .max(500, 'Description must be less than 500 characters'),
  
  isPublic: yup
    .boolean()
    .default(false),
  
  tags: yup
    .array()
    .of(yup.string())
    .max(10, 'Maximum 10 tags allowed')
})

// =====================================================
-- SEARCH AND FILTER VALIDATION SCHEMAS
// =====================================================

export const searchSchema = yup.object({
  query: yup
    .string()
    .max(100, 'Search query must be less than 100 characters'),
  
  filters: yup.object({
    type: yup.string().oneOf(['all', 'office', 'retail', 'warehouse', 'coworking']),
    status: yup.string().oneOf(['all', 'available', 'occupied', 'maintenance']),
    minPrice: yup.number().min(0),
    maxPrice: yup.number().min(0),
    minSize: yup.number().min(0),
    maxSize: yup.number().min(0)
  }),
  
  sortBy: yup
    .string()
    .oneOf(['newest', 'oldest', 'price_asc', 'price_desc', 'size_asc', 'size_desc']),
  
  page: yup
    .number()
    .min(1, 'Page must be at least 1')
    .max(1000, 'Page must be less than 1000'),
  
  limit: yup
    .number()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit must be less than 100')
})

// =====================================================
-- CUSTOM VALIDATION FUNCTIONS
// =====================================================

// Validate Russian phone number
export const validateRussianPhone = (phone: string): boolean => {
  const russianPhoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/
  return russianPhoneRegex.test(phone)
}

// Validate email domain
export const validateEmailDomain = (email: string, allowedDomains: string[]): boolean => {
  const domain = email.split('@')[1]
  return allowedDomains.includes(domain)
}

// Validate file size
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

// Validate file type
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type)
}

// Validate image dimensions
export const validateImageDimensions = (
  file: File, 
  maxWidth: number, 
  maxHeight: number
): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve(img.width <= maxWidth && img.height <= maxHeight)
    }
    img.onerror = () => resolve(false)
    img.src = URL.createObjectURL(file)
  })
}

// =====================================================
-- VALIDATION UTILITIES
// =====================================================

// Sanitize input data
export const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '')
  }
  if (Array.isArray(input)) {
    return input.map(item => sanitizeInput(item))
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {}
    for (const key in input) {
      sanitized[key] = sanitizeInput(input[key])
    }
    return sanitized
  }
  return input
}

// Validate and sanitize data
export const validateAndSanitize = async <T>(
  schema: yup.Schema<T>,
  data: any
): Promise<{ isValid: boolean; data?: T; errors?: string[] }> => {
  try {
    const sanitizedData = sanitizeInput(data)
    const validatedData = await schema.validate(sanitizedData, { abortEarly: false })
    return { isValid: true, data: validatedData }
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { 
        isValid: false, 
        errors: error.errors 
      }
    }
    return { 
      isValid: false, 
      errors: ['Validation failed'] 
    }
  }
}

// =====================================================
-- EXPORT ALL SCHEMAS
// =====================================================

export const validationSchemas = {
  user: {
    registration: userRegistrationSchema,
    login: userLoginSchema,
    profileUpdate: userProfileUpdateSchema
  },
  property: {
    create: propertyCreateSchema,
    update: propertyUpdateSchema
  },
  application: {
    tenant: tenantApplicationSchema
  },
  investment: {
    opportunity: investmentOpportunitySchema,
    interest: investmentInterestSchema
  },
  financial: {
    transaction: financialTransactionSchema
  },
  document: {
    upload: documentUploadSchema
  },
  search: searchSchema
} as const

export type ValidationSchemas = typeof validationSchemas
