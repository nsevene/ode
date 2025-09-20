import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

// Assuming an Order type exists in your types folder
// If not, you should define it properly
interface Order {
  id: string;
  created_at: string;
  status:
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'delivered'
    | 'cancelled';
  total_amount: number;
  // Add other relevant order fields
}

export const useOrderSubscription = (userId: string | undefined) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    let channel: RealtimeChannel;

    const fetchInitialOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data as Order[]);
      } catch (err: any) {
        setError('Failed to fetch initial orders.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialOrders();

    const setupSubscription = () => {
      channel = supabase
        .channel(`public:orders:user_id=eq.${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            console.log('Change received!', payload);
            // Re-fetch all orders to ensure data consistency
            // A more optimized approach might be to update the state directly
            // based on payload, but refetching is simpler and more reliable.
            fetchInitialOrders();
          }
        )
        .subscribe((status, err) => {
          if (status === 'SUBSCRIBED') {
            console.log('Subscribed to order updates!');
          }
          if (status === 'CHANNEL_ERROR') {
            setError(`Subscription error: ${err?.message}`);
            console.error(err);
          }
        });
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [userId]);

  return { orders, isLoading, error };
};
