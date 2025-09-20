import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, ChefHat } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RecipeIngredientsManager } from './RecipeIngredientsManager';

interface Recipe {
  id: string;
  name: string;
  description?: string;
  instructions: string;
  servings: number;
  prep_time_minutes: number;
  cook_time_minutes: number;
  total_calories?: number;
  total_protein?: number;
  total_fat?: number;
  total_carbs?: number;
  created_at: string;
}

export const RecipesManager = () => {
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructions: '',
    servings: '4',
    prep_time_minutes: '15',
    cook_time_minutes: '30',
  });

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes((data as any[]) || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast({
        title: 'Ошибка',
        description: 'Ошибка загрузки рецептов',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const recipeData = {
        name: formData.name,
        description: formData.description || null,
        instructions: formData.instructions,
        servings: parseInt(formData.servings),
        prep_time_minutes: parseInt(formData.prep_time_minutes),
        cook_time_minutes: parseInt(formData.cook_time_minutes),
      };

      if (editingRecipe) {
        const { error } = await supabase
          .from('recipes' as any)
          .update(recipeData)
          .eq('id', editingRecipe.id);

        if (error) throw error;
        toast({
          title: 'Успешно',
          description: 'Рецепт обновлен',
        });
      } else {
        const { data, error } = await supabase
          .from('recipes' as any)
          .insert([recipeData])
          .select()
          .single();

        if (error) throw error;
        toast({
          title: 'Успешно',
          description: 'Рецепт добавлен',
        });
        setSelectedRecipeId((data as any).id);
      }

      resetForm();
      setIsDialogOpen(false);
      fetchRecipes();
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: 'Ошибка',
        description: 'Ошибка сохранения рецепта',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      name: recipe.name,
      description: recipe.description || '',
      instructions: recipe.instructions,
      servings: recipe.servings.toString(),
      prep_time_minutes: recipe.prep_time_minutes.toString(),
      cook_time_minutes: recipe.cook_time_minutes.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить рецепт? Это также удалит все связанные ингредиенты.'))
      return;

    try {
      const { error } = await supabase
        .from('recipes' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: 'Успешно',
        description: 'Рецепт удален',
      });
      fetchRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast({
        title: 'Ошибка',
        description: 'Ошибка удаления рецепта',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      instructions: '',
      servings: '4',
      prep_time_minutes: '15',
      cook_time_minutes: '30',
    });
    setEditingRecipe(null);
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedRecipeId) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedRecipeId(null)}>
            ← Назад к рецептам
          </Button>
          <h2 className="text-xl font-semibold">Ингредиенты рецепта</h2>
        </div>
        <RecipeIngredientsManager
          recipeId={selectedRecipeId}
          onUpdate={fetchRecipes}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Поиск рецептов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить рецепт
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRecipe ? 'Редактировать рецепт' : 'Добавить рецепт'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Название рецепта *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="servings">Порций *</Label>
                  <Input
                    id="servings"
                    type="number"
                    min="1"
                    value={formData.servings}
                    onChange={(e) =>
                      setFormData({ ...formData, servings: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="prep_time">Подготовка (мин) *</Label>
                  <Input
                    id="prep_time"
                    type="number"
                    min="0"
                    value={formData.prep_time_minutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prep_time_minutes: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cook_time">Готовка (мин) *</Label>
                  <Input
                    id="cook_time"
                    type="number"
                    min="0"
                    value={formData.cook_time_minutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cook_time_minutes: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="instructions">
                  Инструкции по приготовлению *
                </Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) =>
                    setFormData({ ...formData, instructions: e.target.value })
                  }
                  rows={4}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Отмена
                </Button>
                <Button type="submit">
                  {editingRecipe ? 'Обновить' : 'Добавить'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {filteredRecipes.map((recipe) => (
          <Card key={recipe.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <ChefHat className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">{recipe.name}</h3>
                  </div>
                  {recipe.description && (
                    <p className="text-muted-foreground mb-3">
                      {recipe.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span>🍽️ {recipe.servings} порций</span>
                    <span>
                      ⏱️ {recipe.prep_time_minutes + recipe.cook_time_minutes}{' '}
                      мин
                    </span>
                    {recipe.total_calories && (
                      <span>🔥 {Math.round(recipe.total_calories)} ккал</span>
                    )}
                  </div>
                  {recipe.total_calories && (
                    <div className="flex items-center gap-4 text-sm">
                      <Badge variant="outline">
                        Б:{' '}
                        {recipe.total_protein
                          ? Math.round(recipe.total_protein)
                          : 0}
                        г
                      </Badge>
                      <Badge variant="outline">
                        Ж: {recipe.total_fat ? Math.round(recipe.total_fat) : 0}
                        г
                      </Badge>
                      <Badge variant="outline">
                        У:{' '}
                        {recipe.total_carbs
                          ? Math.round(recipe.total_carbs)
                          : 0}
                        г
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRecipeId(recipe.id)}
                  >
                    Ингредиенты
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(recipe)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(recipe.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
