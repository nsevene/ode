import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Clock, Flame, Leaf, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MenuItem, CartItem } from '@/types/common';

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

interface FoodMenuProps {
  onAddToCart: (item: CartItem) => void;
  cartItems: CartItem[];
}

const FoodMenu: React.FC<FoodMenuProps> = ({ onAddToCart, cartItems }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Моковые данные для демонстрации
    const mockCategories: Category[] = [
      {
        id: 'asian',
        name: 'Asian Cuisine',
        description: 'Asian dishes',
        image_url: '/lovable-uploads/5a02d773-9b89-4a29-ac97-07e8608431ef.png'
      },
      {
        id: 'italian',
        name: 'Italian Cuisine',
        description: 'Traditional Italian dishes',
        image_url: '/lovable-uploads/2109f2a7-74ec-4216-b0a3-322a7bdd5ebb.png'
      },
      {
        id: 'desserts',
        name: 'Desserts',
        description: 'Sweet dishes and desserts',
        image_url: '/lovable-uploads/251dead2-e4e7-451a-b372-3b2e71a8df93.png'
      }
    ];

    const mockMenuItems: MenuItem[] = [
      {
        id: '1',
        category_id: 'asian',
        name: 'Pad Thai with Shrimp',
        description: 'Traditional Thai noodles with shrimp, peanuts and vegetables',
        price_usd: 1250,
        image_url: '/lovable-uploads/9661fa44-47b8-4375-9a53-04abf298479f.png',
        ingredients: ['rice noodles', 'shrimp', 'peanuts', 'bean sprouts'],
        allergens: ['seafood', 'peanuts'],
        dietary_tags: ['spicy'],
        prep_time_minutes: 15,
        calories: 450,
        spice_level: 2,
        vendor_name: 'Spicy Asia',
        is_featured: true
      },
      {
        id: '2',
        category_id: 'italian',
        name: 'Pizza Margherita',
        description: 'Classic Italian pizza with tomatoes, mozzarella and basil',
        price_usd: 1100,
        image_url: '/lovable-uploads/0ca7fb09-8d00-4dd7-8021-256042b21946.png',
        ingredients: ['dough', 'tomato sauce', 'mozzarella', 'basil'],
        allergens: ['gluten', 'dairy'],
        dietary_tags: ['vegetarian'],
        prep_time_minutes: 20,
        calories: 320,
        spice_level: 0,
        vendor_name: 'Dolce Italia',
        is_featured: false
      },
      {
        id: '3',
        category_id: 'asian',
        name: 'Sushi Set "Tokyo"',
        description: 'Assortment of 8 sushi pieces with salmon, tuna and eel',
        price_usd: 1800,
        image_url: '/lovable-uploads/72f429cb-e3f6-44d1-a685-dd4002161507.png',
        ingredients: ['sushi rice', 'salmon', 'tuna', 'eel', 'nori'],
        allergens: ['seafood'],
        dietary_tags: [],
        prep_time_minutes: 25,
        calories: 380,
        spice_level: 0,
        vendor_name: 'Spicy Asia',
        is_featured: true
      },
      {
        id: '4',
        category_id: 'desserts',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with mascarpone and coffee',
        price_usd: 650,
        image_url: '/lovable-uploads/d6f6f18b-48dd-418c-af60-7b1db82dff84.png',
        ingredients: ['mascarpone', 'ladyfingers', 'coffee', 'cocoa'],
        allergens: ['eggs', 'dairy', 'gluten'],
        dietary_tags: ['vegetarian'],
        prep_time_minutes: 5,
        calories: 280,
        spice_level: 0,
        vendor_name: 'Dolce Italia',
        is_featured: false
      },
      {
        id: '5',
        category_id: 'italian',
        name: 'Mushroom Risotto',
        description: 'Creamy risotto with wild mushrooms and parmesan',
        price_usd: 1350,
        image_url: '/lovable-uploads/eb0ecf72-72e4-4040-9c75-dbf57409f27d.png',
        ingredients: ['arborio rice', 'mushrooms', 'parmesan', 'white wine'],
        allergens: ['dairy'],
        dietary_tags: ['vegetarian'],
        prep_time_minutes: 30,
        calories: 420,
        spice_level: 0,
        vendor_name: 'Dolce Italia',
        is_featured: false
      },
      {
        id: '6',
        category_id: 'asian',
        name: 'Tom Yam with Seafood',
        description: 'Spicy Thai soup with shrimp, squid and mushrooms',
        price_usd: 950,
        image_url: '/lovable-uploads/c33d8018-01dd-4115-9c91-b4a6d128735c.png',
        ingredients: ['shrimp', 'squid', 'mushrooms', 'lemongrass'],
        allergens: ['seafood'],
        dietary_tags: ['spicy'],
        prep_time_minutes: 18,
        calories: 180,
        spice_level: 3,
        vendor_name: 'Spicy Asia',
        is_featured: false
      }
    ];

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setCategories(mockCategories);
    setMenuItems(mockMenuItems);
    setLoading(false);
  };

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category_id === selectedCategory);

  const getItemQuantityInCart = (itemId: string) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (menuItem: MenuItem) => {
    const existingItem = cartItems.find(item => item.id === menuItem.id);
    
    if (existingItem) {
      onAddToCart({
        ...menuItem,
        quantity: existingItem.quantity + 1
      });
    } else {
      onAddToCart({
        ...menuItem,
        quantity: 1
      });
    }

    toast({
      title: "Added to cart",
      description: `${menuItem.name} added to cart`,
    });
  };

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  const getSpiceLevel = (level: number) => {
    return Array.from({ length: level }, (_, i) => (
      <Flame key={i} className="w-3 h-3 text-red-500 fill-current" />
    ));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted rounded-lg h-48 mb-4"></div>
              <div className="bg-muted rounded h-4 mb-2"></div>
              <div className="bg-muted rounded h-3 mb-4 w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Filter */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-charcoal mb-6">Our Menu</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            className="mb-2"
          >
            All Dishes
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="mb-2"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="relative">
              <img
                src={item.image_url || '/lovable-uploads/3f00f862-daaa-4d2d-b462-b7347e9e5cdb.png'}
                alt={item.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {item.is_featured && (
                <Badge className="absolute top-2 left-2 bg-gradient-to-r from-forest-green to-sage-blue text-white">
                  Featured
                </Badge>
              )}
              {getItemQuantityInCart(item.id) > 0 && (
                <Badge className="absolute top-2 right-2 bg-primary text-white">
                  In cart: {getItemQuantityInCart(item.id)}
                </Badge>
              )}
            </div>

            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold text-charcoal group-hover:text-forest-green transition-colors">
                  {item.name}
                </CardTitle>
                <div className="text-xl font-bold text-forest-green">
                  {formatPrice(item.price_usd)}
                </div>
              </div>
              {item.vendor_name && (
                <p className="text-sm text-muted-foreground">{item.vendor_name}</p>
              )}
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-sm text-charcoal/70 mb-4 line-clamp-2">
                {item.description}
              </p>

              {/* Tags and Info */}
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {item.prep_time_minutes} min
                </div>
                {item.calories && (
                  <div className="text-xs text-muted-foreground">
                    {item.calories} cal
                  </div>
                )}
                {item.spice_level > 0 && (
                  <div className="flex items-center gap-1">
                    {getSpiceLevel(item.spice_level)}
                  </div>
                )}
              </div>

              {/* Dietary Tags */}
              {item.dietary_tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.dietary_tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Leaf className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Ingredients */}
              {item.ingredients.length > 0 && (
                <p className="text-xs text-muted-foreground mb-4">
                  <strong>Ingredients:</strong> {item.ingredients.slice(0, 4).join(', ')}
                  {item.ingredients.length > 4 && '...'}
                </p>
              )}

              {/* Allergens */}
              {item.allergens.length > 0 && (
                <p className="text-xs text-red-600 mb-4">
                  <strong>Allergens:</strong> {item.allergens.join(', ')}
                </p>
              )}

              <Button
                onClick={() => handleAddToCart(item)}
                className="w-full bg-gradient-to-r from-forest-green to-sage-blue hover:from-forest-green/90 hover:to-sage-blue/90 text-white"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No dishes available in this category yet
          </p>
        </div>
      )}
    </div>
  );
};

export default FoodMenu;