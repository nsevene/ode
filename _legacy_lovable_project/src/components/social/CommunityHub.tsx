import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SocialFeed } from './SocialFeed';
import { GamificationHub } from '@/components/gamification/GamificationHub';
import { Users, Trophy, Share2, Target } from 'lucide-react';

export const CommunityHub = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Community Hub
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Присоединяйтесь к сообществу гурманов, делитесь опытом и участвуйте
            в захватывающих квестах!
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="social" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="social" className="flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Социальная лента</span>
            </TabsTrigger>
            <TabsTrigger
              value="gamification"
              className="flex items-center space-x-2"
            >
              <Trophy className="w-4 h-4" />
              <span>Геймификация</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="social" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Social Feed */}
              <div className="lg:col-span-3">
                <SocialFeed />
              </div>

              {/* Community Stats Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Статистика сообщества
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Активных пользователей
                      </span>
                      <span className="font-semibold">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Постов сегодня
                      </span>
                      <span className="font-semibold">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Достижений разблокировано
                      </span>
                      <span className="font-semibold">456</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Квестов завершено
                      </span>
                      <span className="font-semibold">2,341</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Популярные хештеги
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {[
                        '#ODEFoodHall',
                        '#TasteAlley',
                        '#Foodie',
                        '#Achievement',
                        '#Quest',
                      ].map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-muted rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gamification">
            <GamificationHub />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
