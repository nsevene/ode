import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Link, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price_usd: number;
  calories?: number;
  recipe_id?: string;
  vendor_name?: string;
  is_available: boolean;
}

interface Recipe {
  id: string;
  name: string;
  total_calories?: number;
  total_protein?: number;
  total_fat?: number;
  total_carbs?: number;
}

export const MenuItemsManager = () => {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('');

  useEffect(() => {
    fetchMenuItems();
    fetchRecipes();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('name');

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast({
        title: "Ошибка",
        description: "Ошибка загрузки меню",
        variant: "destructive"
      });
    }
  };

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes' as any)
        .select('*')
        .order('name');

      if (error) throw error;
      setRecipes((data as any[]) || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast({
        title: "Ошибка",
        description: "Ошибка загрузки рецептов",
        variant: "destructive"
      });
    }
  };

  const handleLinkRecipe = async () => {
    if (!selectedMenuItem || !selectedRecipeId) {
      toast({
        title: "Ошибка",
        description: "Выберите рецепт для привязки",
        variant: "destructive"
      });
      return;
    }

    try {
      const selectedRecipe = recipes.find(r => r.id === selectedRecipeId);
      if (!selectedRecipe) return;

      const { error } = await supabase
        .from('menu_items')
        .update({
          recipe_id: selectedRecipeId,
          calories: selectedRecipe.total_calories ? Math.round(selectedRecipe.total_calories) : null
        })
        .eq('id', selectedMenuItem.id);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Рецепт привязан к блюду"
      });
      setIsDialogOpen(false);
      setSelectedMenuItem(null);
      setSelectedRecipeId('');
      fetchMenuItems();
    } catch (error) {
      console.error('Error linking recipe:', error);
      toast({
        title: "Ошибка",
        description: "Ошибка привязки рецепта",
        variant: "destructive"
      });
    }
  };

  const handleUnlinkRecipe = async (menuItemId: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({
          recipe_id: null,
          calories: null
        })
        .eq('id', menuItemId);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Рецепт отвязан от блюда"
      });
      fetchMenuItems();
    } catch (error) {
      console.error('Error unlinking recipe:', error);
      toast({
        title: "Ошибка",
        description: "Ошибка отвязки рецепта",
        variant: "destructive"
      });
    }
  };

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.vendor_name && item.vendor_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getRecipeInfo = (recipeId: string) => {
    return recipes.find(r => r.id === recipeId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Поиск блюд..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Привязывайте рецепты к блюдам для автоматического подсчета калорий
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Привязать рецепт к блюду</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedMenuItem && (
              <div>
                <Label>Блюдо</Label>
                <p className="font-medium">{selectedMenuItem.name}</p>
                {selectedMenuItem.vendor_name && (
                  <p className="text-sm text-muted-foreground">{selectedMenuItem.vendor_name}</p>
                )}
              </div>
            )}
            <div>
              <Label>Рецепт</Label>
              <Select value={selectedRecipeId} onValueChange={setSelectedRecipeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите рецепт" />
                </SelectTrigger>
                <SelectContent>
                  {recipes.map((recipe) => (
                    <SelectItem key={recipe.id} value={recipe.id}>
                      <div>
                        <div>{recipe.name}</div>
                        {recipe.total_calories && (
                          <div className="text-sm text-muted-foreground">
                            {Math.round(recipe.total_calories)} ккал
                          </div>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleLinkRecipe}>
                Привязать
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {filteredMenuItems.map((item) => {
          const linkedRecipe = item.recipe_id ? getRecipeInfo(item.recipe_id) : null;
          
          return (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      {item.vendor_name && (
                        <Badge variant="secondary">{item.vendor_name}</Badge>
                      )}
                      {!item.is_available && (
                        <Badge variant="destructive">Недоступно</Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-muted-foreground text-sm mb-2">{item.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-medium">${item.price_usd}</span>
                      {item.calories && (
                        <span className="text-muted-foreground">
                          🔥 {item.calories} ккал
                        </span>
                      )}
                    </div>
                    {linkedRecipe && (
                      <div className="mt-2 p-2 bg-muted rounded-md">
                        <div className="flex items-center gap-2 text-sm">
                          <Link className="h-4 w-4" />
                          <span className="font-medium">Привязан рецепт: {linkedRecipe.name}</span>
                        </div>
                        {linkedRecipe.total_calories && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Калории автоматически обновляются из рецепта
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {item.recipe_id ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnlinkRecipe(item.id)}
                      >
                        Отвязать рецепт
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMenuItem(item);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Link className="h-4 w-4 mr-2" />
                        Привязать рецепт
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};