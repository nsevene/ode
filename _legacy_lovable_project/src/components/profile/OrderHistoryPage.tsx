import { useAuthStore } from '@/store/authStore';
import { useOrderSubscription } from '@/hooks/useOrderSubscription';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ShoppingBag } from 'lucide-react';

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'pending':
      return 'secondary';
    case 'confirmed':
      return 'default';
    case 'preparing':
      return 'default';
    case 'ready':
      return 'default';
    case 'delivered':
      return 'success';
    case 'cancelled':
      return 'destructive';
    default:
      return 'outline';
  }
};

const OrderHistoryPage = () => {
  const { user } = useAuthStore();
  const { orders, isLoading, error } = useOrderSubscription(user?.id);

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Order History</h1>
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 flex items-center gap-2">
        <AlertCircle /> {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
          <p className="text-muted-foreground">
            You haven't placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">
                  Order #{order.id.substring(0, 8)}
                </CardTitle>
                <Badge variant={getStatusVariant(order.status)}>
                  {order.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p>
                  <strong>Total:</strong> {order.total_amount.toFixed(2)} ₽
                </p>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Status updates will appear here in real-time.
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
