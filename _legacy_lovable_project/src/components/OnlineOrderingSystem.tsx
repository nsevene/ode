import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  Minus,
  ShoppingCart,
  Clock,
  MapPin,
  CreditCard,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  vendor: string;
  image: string;
  prepTime: string;
}

const OnlineOrderingSystem = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const popularItems = [
    {
      id: 1,
      name: 'Signature Wagyu Burger',
      price: 28,
      vendor: 'Gourmet Corner',
      image: '/lovable-uploads/54e09b7b-cb56-4ad2-beff-b051ddc7a068.png',
      prepTime: '15-20 min',
      rating: 4.8,
      category: 'Burgers',
    },
    {
      id: 2,
      name: 'Truffle Pasta',
      price: 24,
      vendor: 'Italian Corner',
      image: '/lovable-uploads/72f429cb-e3f6-44d1-a685-dd4002161507.png',
      prepTime: '12-15 min',
      rating: 4.9,
      category: 'Pasta',
    },
    {
      id: 3,
      name: 'Dragon Roll',
      price: 18,
      vendor: 'Sushi Bar',
      image: '/lovable-uploads/9ca55f6a-7071-45b6-9db4-8adf9147c448.png',
      prepTime: '10-15 min',
      rating: 4.7,
      category: 'Sushi',
    },
    {
      id: 4,
      name: 'Grilled Salmon',
      price: 32,
      vendor: 'Seafood Station',
      image: '/lovable-uploads/c6e7fa60-45f0-43a6-b743-c737fd6748b0.png',
      prepTime: '20-25 min',
      rating: 4.6,
      category: 'Seafood',
    },
  ];

  const addToCart = (item: (typeof popularItems)[0]) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          vendor: item.vendor,
          image: item.image,
          prepTime: item.prepTime,
        },
      ]);
    }

    toast({
      title: 'Added to cart',
      description: `${item.name} added to your cart`,
    });
  };

  const updateQuantity = (id: number, change: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    // Simulate order process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: 'Order placed!',
      description: `Your order for $${getTotalPrice()} has been accepted. Expect SMS confirmation.`,
    });

    setCart([]);
    setIsCheckingOut(false);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            {t('order.title')}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Order your favorite dishes for delivery or pickup
          </p>

          <div className="flex justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Delivery 30-45 min</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>5 km delivery radius</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="w-4 h-4" />
              <span>Online payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Items */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-semibold mb-6">Popular Dishes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {popularItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-32 object-cover"
                    />
                    <Badge
                      className="absolute top-2 left-2"
                      variant="secondary"
                    >
                      ★ {item.rating}
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-1">{item.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.vendor}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{item.prepTime}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">
                        ${item.price}
                      </span>
                      <Button
                        onClick={() => addToCart(item)}
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Cart ({getTotalItems()})
                </CardTitle>
              </CardHeader>

              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Your cart is empty
                  </p>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{item.name}</h5>
                          <p className="text-xs text-muted-foreground">
                            {item.vendor}
                          </p>
                          <p className="text-sm font-semibold">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${getTotalPrice().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery:</span>
                        <span>$3.99</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>${(getTotalPrice() + 3.99).toFixed(2)}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                    >
                      {isCheckingOut ? 'Processing...' : 'Place Order'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnlineOrderingSystem;
