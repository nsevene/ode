import { loadStripe, Stripe } from '@stripe/stripe-js';

// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const STRIPE_SECRET_KEY = import.meta.env.VITE_STRIPE_SECRET_KEY;

if (!STRIPE_PUBLISHABLE_KEY) {
  console.warn(
    'Stripe publishable key not found. Payment functionality will be disabled.'
  );
}

// Initialize Stripe
let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise && STRIPE_PUBLISHABLE_KEY) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise || Promise.resolve(null);
};

// Payment intent creation
export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
  customer_email?: string;
  description?: string;
}

export interface CreatePaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
  amount: number;
  currency: string;
}

export const createPaymentIntent = async (
  request: CreatePaymentIntentRequest
): Promise<CreatePaymentIntentResponse> => {
  try {
    const response = await fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create payment intent');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

// Payment confirmation
export interface ConfirmPaymentRequest {
  payment_intent_id: string;
  client_secret: string;
}

export const confirmPayment = async (
  request: ConfirmPaymentRequest
): Promise<{ success: boolean; payment_intent_id: string }> => {
  try {
    const response = await fetch('/api/payments/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to confirm payment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

// Payment status check
export const getPaymentStatus = async (
  payment_intent_id: string
): Promise<{ status: string; amount: number; currency: string }> => {
  try {
    const response = await fetch(`/api/payments/status/${payment_intent_id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get payment status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting payment status:', error);
    throw error;
  }
};

// Utility functions
export const formatAmountForStripe = (amount: number): number => {
  // Convert rubles to kopecks for Stripe
  return Math.round(amount * 100);
};

export const formatAmountFromStripe = (amount: number): number => {
  // Convert kopecks back to rubles
  return amount / 100;
};

// Error handling
export class StripeError extends Error {
  constructor(
    message: string,
    public code?: string,
    public type?: string
  ) {
    super(message);
    this.name = 'StripeError';
  }
}

// Payment method validation
export const validatePaymentMethod = (paymentMethod: any): boolean => {
  if (!paymentMethod) return false;

  // Basic validation for card payment methods
  if (paymentMethod.type === 'card') {
    return !!(
      paymentMethod.card &&
      paymentMethod.card.brand &&
      paymentMethod.card.last4
    );
  }

  return true;
};

// Currency support
export const SUPPORTED_CURRENCIES = ['rub', 'usd', 'eur'] as const;
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export const isSupportedCurrency = (
  currency: string
): currency is SupportedCurrency => {
  return SUPPORTED_CURRENCIES.includes(currency as SupportedCurrency);
};

// Default configuration
export const STRIPE_CONFIG = {
  currency: 'rub' as SupportedCurrency,
  locale: 'ru',
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#ea580c', // Orange theme
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#dc2626',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  },
} as const;
