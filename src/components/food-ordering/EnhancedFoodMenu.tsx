import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Plus, Minus, Star, Clock, Flame } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MenuItem, CartItem } from '@/types/common';

interface Category {
  id: string;
  name: string;
  description?: string;
  display_order: number;
}

export const EnhancedFoodMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const dietaryFilters = [
    'Vegan', 'Gluten-free', 'Low Carb', 'Keto', 'Raw vegan', 
    'High protein', 'Low calorie', 'Organic'
  ];

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('is_featured', { ascending: false })
        .order('display_order');

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Error loading menu');
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('food_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const addToCart = (item: MenuItem, customizations = '') => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => 
        cartItem.id === item.id && cartItem.customizations === customizations
      );
      
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id && cartItem.customizations === customizations
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      
      return [...prev, { ...item, quantity: 1, customizations }];
    });
    toast.success(`${item.name} added to cart`);
  };

  const updateCartQuantity = (itemId: string, customizations: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(prev => prev.filter(item => 
        !(item.id === itemId && item.customizations === customizations)
      ));
    } else {
      setCart(prev => prev.map(item =>
        item.id === itemId && item.customizations === customizations
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendor_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || 
      item.category_id === selectedCategory;

    const matchesFilters = activeFilters.length === 0 || 
      activeFilters.every(filter => item.dietary_tags?.includes(filter));

    return matchesSearch && matchesCategory && matchesFilters;
  });

  const featuredItems = filteredItems.filter(item => item.is_featured).slice(0, 6);
  const regularItems = filteredItems.filter(item => !item.is_featured);

  const getCartItemCount = (itemId: string) => {
    return cart.filter(item => item.id === itemId)
      .reduce((total, item) => total + item.quantity, 0);
  };

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + (item.price_usd * item.quantity), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with search and cart */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search dishes, ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button
              variant={isFilterOpen ? "default" : "outline"}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilters.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>

            {totalCartItems > 0 && (
              <Button className="gap-2 relative">
                🛒 Cart
                <Badge variant="secondary" className="ml-1">
                  {totalCartItems}
                </Badge>
                <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {totalCartItems}
                </div>
              </Button>
            )}
          </div>

          {/* Filters */}
          {isFilterOpen && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Dietary Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {dietaryFilters.map(filter => (
                  <Button
                    key={filter}
                    variant={activeFilters.includes(filter) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setActiveFilters(prev =>
                        prev.includes(filter)
                          ? prev.filter(f => f !== filter)
                          : [...prev, filter]
                      );
                    }}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
              {activeFilters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveFilters([])}
                  className="mt-2"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            {categories.slice(0, 4).map(category => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Featured Items */}
          {selectedCategory === 'all' && featuredItems.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">🔥 Popular</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredItems.map(item => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={addToCart}
                    cartQuantity={getCartItemCount(item.id)}
                    onUpdateQuantity={updateCartQuantity}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Menu Items */}
          <TabsContent value="all" className="space-y-6">
            <MenuItemGrid
              items={regularItems}
              onAddToCart={addToCart}
              getCartQuantity={getCartItemCount}
              onUpdateQuantity={updateCartQuantity}
            />
          </TabsContent>

          <TabsContent value="popular" className="space-y-6">
            <MenuItemGrid
              items={featuredItems}
              onAddToCart={addToCart}
              getCartQuantity={getCartItemCount}
              onUpdateQuantity={updateCartQuantity}
            />
          </TabsContent>

          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              <MenuItemGrid
                items={filteredItems.filter(item => item.category_id === category.id)}
                onAddToCart={addToCart}
                getCartQuantity={getCartItemCount}
                onUpdateQuantity={updateCartQuantity}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Floating Cart Summary */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
          <div className="text-sm font-medium">
            {totalCartItems} items • ${totalPrice.toFixed(2)}
          </div>
          <Button size="sm" variant="secondary" className="mt-2 w-full">
            Checkout
          </Button>
        </div>
      )}
    </div>
  );
};

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, customizations?: string) => void;
  cartQuantity: number;
  onUpdateQuantity: (itemId: string, customizations: string, quantity: number) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  onAddToCart, 
  cartQuantity, 
  onUpdateQuantity 
}) => {
  const [customizations, setCustomizations] = useState('');
  const [showCustomizations, setShowCustomizations] = useState(false);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        {item.image_url && (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-48 object-cover"
          />
        )}
        {item.is_featured && (
          <Badge className="absolute top-2 left-2 bg-orange-500">
            ⭐ Popular
          </Badge>
        )}
        {item.spice_level && item.spice_level > 0 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            🌶️ {item.spice_level}
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg leading-tight">{item.name}</h3>
          <div className="text-lg font-bold text-primary">${item.price_usd}</div>
        </div>

        {item.description && (
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Nutrition Info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          {item.calories && (
            <div className="flex items-center gap-1">
              <Flame className="h-3 w-3" />
              {item.calories} cal
            </div>
          )}
          {item.prep_time_minutes && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {item.prep_time_minutes} min
            </div>
          )}
        </div>

        {/* Dietary Tags */}
        {item.dietary_tags && item.dietary_tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.dietary_tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {item.vendor_name && (
          <div className="text-xs text-muted-foreground mb-3">
            by {item.vendor_name}
          </div>
        )}

        {/* Add to Cart Controls */}
        <div className="space-y-2">
          {cartQuantity > 0 ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateQuantity(item.id, '', cartQuantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="font-medium">{cartQuantity}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAddToCart(item)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowCustomizations(!showCustomizations)}
              >
                Edit
              </Button>
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={() => onAddToCart(item, customizations)}
            >
              Add to Cart
            </Button>
          )}

          {showCustomizations && (
            <div className="mt-2">
              <Input
                placeholder="No onions, extra cheese..."
                value={customizations}
                onChange={(e) => setCustomizations(e.target.value)}
                className="text-sm"
              />
            </div>
          )}
        </div>

        {/* Allergens Warning */}
        {item.allergens && item.allergens.length > 0 && (
          <div className="mt-2 text-xs text-orange-600">
            ⚠️ Contains: {item.allergens.join(', ')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface MenuItemGridProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem, customizations?: string) => void;
  getCartQuantity: (itemId: string) => number;
  onUpdateQuantity: (itemId: string, customizations: string, quantity: number) => void;
}

const MenuItemGrid: React.FC<MenuItemGridProps> = ({ 
  items, 
  onAddToCart, 
  getCartQuantity, 
  onUpdateQuantity 
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🍽️</div>
        <h3 className="text-lg font-medium mb-2">No dishes found</h3>
        <p className="text-muted-foreground">
          Try changing filters or search query
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map(item => (
        <MenuItemCard
          key={item.id}
          item={item}
          onAddToCart={onAddToCart}
          cartQuantity={getCartQuantity(item.id)}
          onUpdateQuantity={onUpdateQuantity}
        />
      ))}
    </div>
  );
};