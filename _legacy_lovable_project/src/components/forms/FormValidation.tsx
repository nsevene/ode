import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { devWarn, validateEmail, validateRequired } from '@/utils/errorCleanup';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  custom?: (value: string) => string | null;
}

interface ValidationErrors {
  [key: string]: string;
}

interface FormField {
  name: string;
  value: string;
  rules: ValidationRule;
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (
    name: string,
    value: string,
    rules: ValidationRule
  ): string | null => {
    // Required validation
    if (rules.required && !validateRequired(value, name)) {
      return 'Это поле обязательно для заполнения';
    }

    // Skip other validations if field is empty and not required
    if (!value && !rules.required) {
      return null;
    }

    // Email validation
    if (rules.email && !validateEmail(value)) {
      return 'Введите корректный email адрес';
    }

    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
      return `Минимум ${rules.minLength} символов`;
    }

    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      return `Максимум ${rules.maxLength} символов`;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Неверный формат';
    }

    // Custom validation
    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  };

  const validateForm = (fields: FormField[]): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    fields.forEach(({ name, value, rules }) => {
      const error = validateField(name, value, rules);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const validateSingleField = (
    name: string,
    value: string,
    rules: ValidationRule
  ) => {
    const error = validateField(name, value, rules);
    setErrors((prev) => ({
      ...prev,
      [name]: error || '',
    }));
    return !error;
  };

  const clearErrors = () => {
    setErrors({});
  };

  const clearError = (fieldName: string) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: '',
    }));
  };

  return {
    errors,
    isSubmitting,
    setIsSubmitting,
    validateForm,
    validateSingleField,
    clearErrors,
    clearError,
  };
};

interface FormErrorDisplayProps {
  error?: string;
  className?: string;
}

export const FormErrorDisplay: React.FC<FormErrorDisplayProps> = ({
  error,
  className = '',
}) => {
  if (!error) return null;

  return (
    <Alert variant="destructive" className={`mt-2 ${className}`}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

interface FormSuccessDisplayProps {
  message?: string;
  className?: string;
}

export const FormSuccessDisplay: React.FC<FormSuccessDisplayProps> = ({
  message,
  className = '',
}) => {
  if (!message) return null;

  return (
    <Alert
      className={`mt-2 border-green-200 bg-green-50 text-green-800 ${className}`}
    >
      <CheckCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

// Common validation rules
export const validationRules = {
  email: {
    required: true,
    email: true,
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  phone: {
    required: true,
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 1000,
  },
  companyName: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  password: {
    required: true,
    minLength: 8,
    custom: (value: string) => {
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        return 'Пароль должен содержать строчные, заглавные буквы и цифры';
      }
      return null;
    },
  },
};

export default {
  useFormValidation,
  FormErrorDisplay,
  FormSuccessDisplay,
  validationRules,
};
