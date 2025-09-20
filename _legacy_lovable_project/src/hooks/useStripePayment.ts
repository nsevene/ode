import { useState, useEffect } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/integrations/supabase/client';

// Public key should be stored in environment variables
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : Promise.resolve(null);

export const useStripePayment = () => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { items } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    stripePromise.then(setStripe);
  }, []);

  useEffect(() => {
    if (items.length > 0 && user) {
      const createPaymentIntent = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const { data, error } = await supabase.functions.invoke(
            'create-payment-intent',
            {
              body: {
                items: items.map((item) => ({
                  id: item.id,
                  quantity: item.quantity,
                })),
                userId: user.id,
              },
            }
          );

          if (error) throw new Error(error.message);
          if (data.error) throw new Error(data.error);

          setClientSecret(data.client_secret);
        } catch (err: any) {
          setError('Failed to initialize payment. Please try again.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      createPaymentIntent();
    }
  }, [items, user]);

  return { stripe, clientSecret, isLoading, error };
};
