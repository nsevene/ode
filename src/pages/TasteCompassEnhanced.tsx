import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Compass, 
  Smartphone, 
  Users, 
  Gamepad2, 
  Settings,
  MapPin,
  Nfc,
  Bell,
  Camera,
  Trophy,
  Star,
  Zap,
  Crown,
  Target,
  Calendar,
  Gift,
  BarChart3,
  Eye,
  Download
} from "lucide-react";

// Импорты компонентов
import MobileTasteCompass from "@/components/taste-compass/MobileTasteCompass";
import SocialTasteCompass from "@/components/taste-compass/SocialTasteCompass";
import GamificationTasteCompass from "@/components/taste-compass/GamificationTasteCompass";
import AdminTasteCompass from "@/components/taste-compass/AdminTasteCompass";
import TasteCompassInteractive from "@/components/TasteCompassInteractive";
import { useAuth } from "@/hooks/useAuth";

const TasteCompassEnhanced = () => {
  const [selectedTab, setSelectedTab] = useState('interactive');
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Определяем доступные вкладки в зависимости от роли пользователя
  const getAvailableTabs = () => {
    const baseTabs = [
      { value: 'interactive', label: 'Интерактивный', icon: Compass },
      { value: 'mobile', label: 'Мобильный', icon: Smartphone },
      { value: 'social', label: 'Социальный', icon: Users },
      { value: 'gamification', label: 'Геймификация', icon: Gamepad2 }
    ];

    if (isAdmin) {
      baseTabs.push({ value: 'admin', label: 'Админ', icon: Settings });
    }

    return baseTabs;
  };

  const availableTabs = getAvailableTabs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Заголовок */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              🧭 Taste Compass 2.0
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Интерактивное путешествие по вкусовым секторам ODE Food Hall. 
              Исследуйте, сканируйте, соревнуйтесь и получайте награды!
            </p>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mb-8">
            {availableTabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Интерактивный Taste Compass */}
          <TabsContent value="interactive" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="h-6 w-6" />
                  Интерактивный Taste Compass
                </CardTitle>
                <p className="text-muted-foreground">
                  Исследуйте 8 вкусовых секторов и разблокируйте эксклюзивные награды
                </p>
              </CardHeader>
              <CardContent>
                <TasteCompassInteractive />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Мобильная интеграция */}
          <TabsContent value="mobile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-6 w-6" />
                  Мобильная интеграция
                </CardTitle>
                <p className="text-muted-foreground">
                  NFC сканирование, геолокация, push уведомления и камера для QR кодов
                </p>
              </CardHeader>
              <CardContent>
                <MobileTasteCompass />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Социальные функции */}
          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Социальные функции
                </CardTitle>
                <p className="text-muted-foreground">
                  Сравните свой прогресс с друзьями, делитесь достижениями и участвуйте в командных квестах
                </p>
              </CardHeader>
              <CardContent>
                <SocialTasteCompass />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Геймификация */}
          <TabsContent value="gamification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="h-6 w-6" />
                  Геймификация
                </CardTitle>
                <p className="text-muted-foreground">
                  Сезонные события, ежедневные квесты, специальные награды и бонусные множители
                </p>
              </CardHeader>
              <CardContent>
                <GamificationTasteCompass />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Админ панель */}
          {isAdmin && (
            <TabsContent value="admin" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-6 w-6" />
                    Админ панель
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Управление секторами, пользователями, аналитикой и событиями
                  </p>
                </CardHeader>
                <CardContent>
                  <AdminTasteCompass />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Футер с информацией */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl mb-2">🧭</div>
              <h3 className="font-semibold mb-2">Taste Compass</h3>
              <p className="text-sm text-muted-foreground">
                Интерактивное путешествие по 8 вкусовым секторам
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-2">📱</div>
              <h3 className="font-semibold mb-2">Мобильная интеграция</h3>
              <p className="text-sm text-muted-foreground">
                NFC, геолокация, push уведомления и QR коды
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-2">🎮</div>
              <h3 className="font-semibold mb-2">Геймификация</h3>
              <p className="text-sm text-muted-foreground">
                События, квесты, награды и соревнования
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              © 2024 ODE Food Hall. Все права защищены.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasteCompassEnhanced;
