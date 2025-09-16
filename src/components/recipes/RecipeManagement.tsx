import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IngredientsManager } from './IngredientsManager';
import { RecipesManager } from './RecipesManager';
import { MenuItemsManager } from './MenuItemsManager';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ChefHat, Package, Menu } from 'lucide-react';

export const RecipeManagement = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('ingredients');

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Пожалуйста, войдите в систему для управления рецептами</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Управление рецептами</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <ChefHat className="h-5 w-5" />
          <span>Система автоматического подсчета калорий</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ingredients" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Ингредиенты
          </TabsTrigger>
          <TabsTrigger value="recipes" className="flex items-center gap-2">
            <ChefHat className="h-4 w-4" />
            Рецепты
          </TabsTrigger>
          <TabsTrigger value="menu-items" className="flex items-center gap-2">
            <Menu className="h-4 w-4" />
            Меню
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ingredients" className="space-y-4">
          <IngredientsManager />
        </TabsContent>

        <TabsContent value="recipes" className="space-y-4">
          <RecipesManager />
        </TabsContent>

        <TabsContent value="menu-items" className="space-y-4">
          <MenuItemsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};