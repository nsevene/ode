import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Ingredient {
  id: string;
  name: string;
  description?: string;
  calories_per_100g: number;
  protein_per_100g: number;
  fat_per_100g: number;
  carbs_per_100g: number;
  unit: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

export const IngredientsManager = () => {
  const { toast } = useToast();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    calories_per_100g: '',
    protein_per_100g: '',
    fat_per_100g: '',
    carbs_per_100g: '',
    unit: 'г',
    category: ''
  });

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const { data, error } = await supabase
        .from('ingredients' as any)
        .select('*')
        .order('name');

      if (error) throw error;
      setIngredients((data as any[]) || []);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      toast({
        title: "Ошибка",
        description: "Ошибка загрузки ингредиентов",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const ingredientData = {
        name: formData.name,
        description: formData.description || null,
        calories_per_100g: parseFloat(formData.calories_per_100g),
        protein_per_100g: parseFloat(formData.protein_per_100g),
        fat_per_100g: parseFloat(formData.fat_per_100g),
        carbs_per_100g: parseFloat(formData.carbs_per_100g),
        unit: formData.unit,
        category: formData.category
      };

      if (editingIngredient) {
        const { error } = await supabase
          .from('ingredients' as any)
          .update(ingredientData)
          .eq('id', editingIngredient.id);
        
        if (error) throw error;
        toast({
          title: "Успешно",
          description: "Ингредиент обновлен"
        });
      } else {
        const { error } = await supabase
          .from('ingredients' as any)
          .insert([ingredientData]);
        
        if (error) throw error;
        toast({
          title: "Успешно",
          description: "Ингредиент добавлен"
        });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchIngredients();
    } catch (error) {
      console.error('Error saving ingredient:', error);
      toast({
        title: "Ошибка",
        description: "Ошибка сохранения ингредиента",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setFormData({
      name: ingredient.name,
      description: ingredient.description || '',
      calories_per_100g: ingredient.calories_per_100g.toString(),
      protein_per_100g: ingredient.protein_per_100g.toString(),
      fat_per_100g: ingredient.fat_per_100g.toString(),
      carbs_per_100g: ingredient.carbs_per_100g.toString(),
      unit: ingredient.unit,
      category: ingredient.category
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить ингредиент?')) return;

    try {
      const { error } = await supabase
        .from('ingredients' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Успешно",
        description: "Ингредиент удален"
      });
      fetchIngredients();
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      toast({
        title: "Ошибка",
        description: "Ошибка удаления ингредиента",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      calories_per_100g: '',
      protein_per_100g: '',
      fat_per_100g: '',
      carbs_per_100g: '',
      unit: 'г',
      category: ''
    });
    setEditingIngredient(null);
  };

  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ingredient.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Поиск ингредиентов..."
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
              Добавить ингредиент
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingIngredient ? 'Редактировать ингредиент' : 'Добавить ингредиент'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Название *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Категория *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="calories">Калории/100г *</Label>
                  <Input
                    id="calories"
                    type="number"
                    step="0.1"
                    value={formData.calories_per_100g}
                    onChange={(e) => setFormData({ ...formData, calories_per_100g: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Единица измерения</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="protein">Белки/100г</Label>
                  <Input
                    id="protein"
                    type="number"
                    step="0.1"
                    value={formData.protein_per_100g}
                    onChange={(e) => setFormData({ ...formData, protein_per_100g: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="fat">Жиры/100г</Label>
                  <Input
                    id="fat"
                    type="number"
                    step="0.1"
                    value={formData.fat_per_100g}
                    onChange={(e) => setFormData({ ...formData, fat_per_100g: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="carbs">Углеводы/100г</Label>
                  <Input
                    id="carbs"
                    type="number"
                    step="0.1"
                    value={formData.carbs_per_100g}
                    onChange={(e) => setFormData({ ...formData, carbs_per_100g: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">
                  {editingIngredient ? 'Обновить' : 'Добавить'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {filteredIngredients.map((ingredient) => (
          <Card key={ingredient.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{ingredient.name}</h3>
                    <Badge variant="secondary">{ingredient.category}</Badge>
                  </div>
                  {ingredient.description && (
                    <p className="text-muted-foreground text-sm mb-2">{ingredient.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{ingredient.calories_per_100g} ккал/100{ingredient.unit}</span>
                    <span>Б: {ingredient.protein_per_100g}г</span>
                    <span>Ж: {ingredient.fat_per_100g}г</span>
                    <span>У: {ingredient.carbs_per_100g}г</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(ingredient)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(ingredient.id)}
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