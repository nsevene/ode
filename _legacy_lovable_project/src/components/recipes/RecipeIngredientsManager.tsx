import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Calculator } from 'lucide-react';
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

interface Ingredient {
  id: string;
  name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  fat_per_100g: number;
  carbs_per_100g: number;
  unit: string;
  category: string;
}

interface RecipeIngredient {
  id: string;
  ingredient_id: string;
  quantity: number;
  ingredient: Ingredient;
}

interface RecipeIngredientsManagerProps {
  recipeId: string;
  onUpdate: () => void;
}

export const RecipeIngredientsManager: React.FC<
  RecipeIngredientsManagerProps
> = ({ recipeId, onUpdate }) => {
  const { toast } = useToast();
  const [recipeIngredients, setRecipeIngredients] = useState<
    RecipeIngredient[]
  >([]);
  const [availableIngredients, setAvailableIngredients] = useState<
    Ingredient[]
  >([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [nutritionTotals, setNutritionTotals] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  });

  useEffect(() => {
    fetchRecipeIngredients();
    fetchAvailableIngredients();
  }, [recipeId]);

  useEffect(() => {
    calculateNutrition();
  }, [recipeIngredients]);

  const fetchRecipeIngredients = async () => {
    try {
      const { data, error } = await supabase
        .from('recipe_ingredients' as any)
        .select(
          `
          *,
          ingredients(*)
        `
        )
        .eq('recipe_id', recipeId);

      if (error) throw error;

      // Transform data to match our interface
      const transformedData = (data || []).map((item: any) => ({
        id: item.id,
        ingredient_id: item.ingredient_id,
        quantity: item.quantity,
        ingredient: item.ingredients,
      }));

      setRecipeIngredients(transformedData);
    } catch (error) {
      console.error('Error fetching recipe ingredients:', error);
      toast({
        title: 'Ошибка',
        description: 'Ошибка загрузки ингредиентов рецепта',
        variant: 'destructive',
      });
    }
  };

  const fetchAvailableIngredients = async () => {
    try {
      const { data, error } = await supabase
        .from('ingredients' as any)
        .select('*')
        .order('name');

      if (error) throw error;
      setAvailableIngredients((data as any[]) || []);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      toast({
        title: 'Ошибка',
        description: 'Ошибка загрузки ингредиентов',
        variant: 'destructive',
      });
    }
  };

  const calculateNutrition = () => {
    const totals = recipeIngredients.reduce(
      (acc, item) => {
        const ingredient = item.ingredient;
        const quantityInGrams = item.quantity; // Assuming quantity is in grams
        const factor = quantityInGrams / 100;

        return {
          calories: acc.calories + ingredient.calories_per_100g * factor,
          protein: acc.protein + ingredient.protein_per_100g * factor,
          fat: acc.fat + ingredient.fat_per_100g * factor,
          carbs: acc.carbs + ingredient.carbs_per_100g * factor,
        };
      },
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );

    setNutritionTotals(totals);
  };

  const handleAddIngredient = async () => {
    if (!selectedIngredientId || !quantity) {
      toast({
        title: 'Ошибка',
        description: 'Выберите ингредиент и укажите количество',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('recipe_ingredients' as any)
        .insert([
          {
            recipe_id: recipeId,
            ingredient_id: selectedIngredientId,
            quantity: parseFloat(quantity),
          },
        ]);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Ингредиент добавлен в рецепт',
      });
      setIsDialogOpen(false);
      setSelectedIngredientId('');
      setQuantity('');
      fetchRecipeIngredients();
      onUpdate();
    } catch (error) {
      console.error('Error adding ingredient:', error);
      toast({
        title: 'Ошибка',
        description: 'Ошибка добавления ингредиента',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveIngredient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recipe_ingredients' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Ингредиент удален из рецепта',
      });
      fetchRecipeIngredients();
      onUpdate();
    } catch (error) {
      console.error('Error removing ingredient:', error);
      toast({
        title: 'Ошибка',
        description: 'Ошибка удаления ингредиента',
        variant: 'destructive',
      });
    }
  };

  const handleRecalculateNutrition = async () => {
    try {
      // Manual calculation for now since function doesn't exist yet
      calculateNutrition();
      toast({
        title: 'Успешно',
        description: 'Пищевая ценность пересчитана',
      });
      onUpdate();
    } catch (error) {
      console.error('Error recalculating nutrition:', error);
      toast({
        title: 'Ошибка',
        description: 'Ошибка пересчета пищевой ценности',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Пищевая ценность рецепта
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRecalculateNutrition}
            >
              Пересчитать
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.round(nutritionTotals.calories)}
              </div>
              <div className="text-sm text-muted-foreground">ккал</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round(nutritionTotals.protein)}г
              </div>
              <div className="text-sm text-muted-foreground">Белки</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round(nutritionTotals.fat)}г
              </div>
              <div className="text-sm text-muted-foreground">Жиры</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round(nutritionTotals.carbs)}г
              </div>
              <div className="text-sm text-muted-foreground">Углеводы</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Ингредиенты рецепта</h3>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Добавить ингредиент
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить ингредиент в рецепт</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Ингредиент</Label>
                <Select
                  value={selectedIngredientId}
                  onValueChange={setSelectedIngredientId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите ингредиент" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIngredients.map((ingredient) => (
                      <SelectItem key={ingredient.id} value={ingredient.id}>
                        {ingredient.name} ({ingredient.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Количество (в граммах)</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="100"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Отмена
                </Button>
                <Button onClick={handleAddIngredient}>Добавить</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {recipeIngredients.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{item.ingredient.name}</span>
                    <Badge variant="secondary">
                      {item.ingredient.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{item.quantity}г</span>
                    <span>
                      {Math.round(
                        (item.ingredient.calories_per_100g * item.quantity) /
                          100
                      )}{' '}
                      ккал
                    </span>
                    <span>
                      Б:{' '}
                      {Math.round(
                        (item.ingredient.protein_per_100g * item.quantity) / 100
                      )}
                      г
                    </span>
                    <span>
                      Ж:{' '}
                      {Math.round(
                        (item.ingredient.fat_per_100g * item.quantity) / 100
                      )}
                      г
                    </span>
                    <span>
                      У:{' '}
                      {Math.round(
                        (item.ingredient.carbs_per_100g * item.quantity) / 100
                      )}
                      г
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveIngredient(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
