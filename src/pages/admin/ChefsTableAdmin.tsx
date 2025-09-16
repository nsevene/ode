
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChefHat, BarChart3, Settings, Users, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import ChefsTableManagement from '@/components/admin/ChefsTableManagement';
import ChefsTableAnalytics from '@/components/admin/ChefsTableAnalytics';

const ChefsTableAdmin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('management');


  return (
    <div className="min-h-screen bg-background">
      <ImprovedNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к админ панели
          </Button>
          
          <div className="flex items-center gap-3 mb-6">
            <ChefHat className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Администрирование Chef's Table</h1>
              <p className="text-muted-foreground">Управление эксклюзивным гастрономическим опытом</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="management" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Управление
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Аналитика
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="management" className="mt-6">
            <ChefsTableManagement />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <ChefsTableAnalytics />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Системные настройки</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Уведомления</h4>
                    <p className="text-sm text-muted-foreground">
                      Настройка автоматических уведомлений для администраторов и гостей
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Интеграции</h4>
                    <p className="text-sm text-muted-foreground">
                      Управление интеграциями с внешними сервисами (Stripe, почта, SMS)
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Резервное копирование</h4>
                    <p className="text-sm text-muted-foreground">
                      Настройка автоматического резервного копирования данных
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChefsTableAdmin;
