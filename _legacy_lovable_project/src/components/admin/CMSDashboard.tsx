import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import KitchenManagement from './KitchenManagement';
import SpaceManagement from './SpaceManagement';
import ExperienceManagement from './ExperienceManagement';
import TenantManagement from './TenantManagement';
import ContentManagement from './ContentManagement';
import {
  ChefHat,
  Building,
  Star,
  Building2,
  FileText,
  BarChart3,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

interface DashboardStats {
  totalKitchens: number;
  totalSpaces: number;
  totalExperiences: number;
  totalTenants: number;
  totalContentBlocks: number;
  activeKitchens: number;
  activeSpaces: number;
  activeExperiences: number;
  activeTenants: number;
  activeContentBlocks: number;
}

const CMSDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalKitchens: 0,
    totalSpaces: 0,
    totalExperiences: 0,
    totalTenants: 0,
    totalContentBlocks: 0,
    activeKitchens: 0,
    activeSpaces: 0,
    activeExperiences: 0,
    activeTenants: 0,
    activeContentBlocks: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Load kitchens stats
      const { data: kitchens, error: kitchensError } = await supabase
        .from('kitchens')
        .select('id, is_available');

      // Load spaces stats
      const { data: spaces, error: spacesError } = await supabase
        .from('spaces')
        .select('id, is_available');

      // Load experiences stats
      const { data: experiences, error: experiencesError } = await supabase
        .from('experiences')
        .select('id, is_available');

      // Load tenants stats
      const { data: tenants, error: tenantsError } = await supabase
        .from('tenants')
        .select('id, is_active');

      // Load content blocks stats
      const { data: contentBlocks, error: contentBlocksError } = await supabase
        .from('content_blocks')
        .select('id, is_active');

      if (
        kitchensError ||
        spacesError ||
        experiencesError ||
        tenantsError ||
        contentBlocksError
      ) {
        throw new Error('Error loading stats');
      }

      setStats({
        totalKitchens: kitchens?.length || 0,
        totalSpaces: spaces?.length || 0,
        totalExperiences: experiences?.length || 0,
        totalTenants: tenants?.length || 0,
        totalContentBlocks: contentBlocks?.length || 0,
        activeKitchens: kitchens?.filter((k) => k.is_available).length || 0,
        activeSpaces: spaces?.filter((s) => s.is_available).length || 0,
        activeExperiences:
          experiences?.filter((e) => e.is_available).length || 0,
        activeTenants: tenants?.filter((t) => t.is_active).length || 0,
        activeContentBlocks:
          contentBlocks?.filter((c) => c.is_active).length || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить статистику',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">CMS Dashboard</h1>
        <p className="text-muted-foreground">
          Управление контентом ODE Food Hall
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Кухни</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalKitchens}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeKitchens} активных
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Пространства</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSpaces}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeSpaces} активных
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Опыт</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExperiences}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeExperiences} активных
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Арендаторы</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTenants}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeTenants} активных
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Контент</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContentBlocks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeContentBlocks} активных
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="kitchens" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="kitchens">Кухни</TabsTrigger>
          <TabsTrigger value="spaces">Пространства</TabsTrigger>
          <TabsTrigger value="experiences">Опыт</TabsTrigger>
          <TabsTrigger value="tenants">Арендаторы</TabsTrigger>
          <TabsTrigger value="content">Контент</TabsTrigger>
        </TabsList>

        <TabsContent value="kitchens" className="space-y-4">
          <KitchenManagement />
        </TabsContent>

        <TabsContent value="spaces" className="space-y-4">
          <SpaceManagement />
        </TabsContent>

        <TabsContent value="experiences" className="space-y-4">
          <ExperienceManagement />
        </TabsContent>

        <TabsContent value="tenants" className="space-y-4">
          <TenantManagement />
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <ContentManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CMSDashboard;
