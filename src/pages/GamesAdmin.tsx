import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GamesAdminPanel } from '@/components/admin/GamesAdminPanel';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import ChefsTableManagement from '@/components/admin/ChefsTableManagement';
import NotificationSystem from '@/components/admin/NotificationSystem';
import ImprovedNavigation from '@/components/ImprovedNavigation';

const GamesAdmin = () => {

  return (
    <>
      <ImprovedNavigation />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Админ-панель игр</h1>
            <p className="text-muted-foreground">
              Управление мини-играми, квестами и игровой аналитикой
            </p>
          </div>

          <Tabs defaultValue="games" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="games">🎮 Игры и квесты</TabsTrigger>
              <TabsTrigger value="analytics">📊 Аналитика</TabsTrigger>
              <TabsTrigger value="bookings">📅 Бронирования</TabsTrigger>
              <TabsTrigger value="notifications">🔔 Уведомления</TabsTrigger>
            </TabsList>

            <TabsContent value="games">
              <GamesAdminPanel />
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Аналитика игр и активности</CardTitle>
                </CardHeader>
                <CardContent>
                  <AnalyticsDashboard />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Управление бронированиями</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChefsTableManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Система уведомлений</CardTitle>
                </CardHeader>
                <CardContent>
                  <NotificationSystem />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default GamesAdmin;