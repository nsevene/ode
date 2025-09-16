import React, { useState } from 'react';
import { useABTesting, ABVariant } from '@/hooks/useABTesting';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, TrendingUp, Users, Target, Play, Square, AlertCircle } from 'lucide-react';
import { HeatmapTracker } from '@/components/analytics/HeatmapTracker';
import { FunnelAnalytics } from '@/components/analytics/FunnelAnalytics';

export const ABTestDashboard = () => {
  const { 
    currentTests, 
    getTestResults, 
    stopTest, 
    getWinningVariant 
  } = useABTesting();
  
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  const activeTests = currentTests.filter(test => test.isActive);
  const completedTests = currentTests.filter(test => !test.isActive);

  const getVariantColor = (variant: ABVariant) => {
    const colors = { A: '#3b82f6', B: '#10b981', C: '#f59e0b' };
    return colors[variant];
  };

  const StatCard = ({ title, value, change, icon: Icon }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                {change}
              </p>
            )}
          </div>
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  const TestCard = ({ test, results }: any) => {
    const winningVariant = getWinningVariant(test.id);
    const totalVisits = results.reduce((sum: number, r: any) => sum + r.visits, 0);
    const totalConversions = results.reduce((sum: number, r: any) => sum + r.conversions, 0);
    const overallConversionRate = totalVisits > 0 ? (totalConversions / totalVisits) * 100 : 0;

    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedTest(selectedTest === test.id ? null : test.id)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{test.name}</CardTitle>
              <CardDescription>
                {test.isActive ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <Play className="w-3 h-3 mr-1" />
                    Активный
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <Square className="w-3 h-3 mr-1" />
                    Завершен
                  </Badge>
                )}
              </CardDescription>
            </div>
            {winningVariant && (
              <Badge variant="outline" className="border-yellow-400 text-yellow-600">
                <Trophy className="w-3 h-3 mr-1" />
                Лидер: {winningVariant}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{totalVisits}</p>
              <p className="text-sm text-muted-foreground">Посещений</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{totalConversions}</p>
              <p className="text-sm text-muted-foreground">Конверсий</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{overallConversionRate.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Общий CR</p>
            </div>
          </div>

          {selectedTest === test.id && (
            <div className="space-y-4 border-t pt-4">
              {results.map((result: any) => (
                <div key={result.variant} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getVariantColor(result.variant) }}
                    />
                    <div>
                      <p className="font-medium">Вариант {result.variant}</p>
                      <p className="text-sm text-muted-foreground">
                        {test.variants[result.variant]?.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{result.conversionRate.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">
                      {result.conversions}/{result.visits}
                    </p>
                  </div>
                </div>
              ))}
              
              {test.isActive && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    stopTest(test.id);
                  }}
                >
                  Остановить тест
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">A/B Testing Dashboard</h1>
          <p className="text-muted-foreground">
            Управление и анализ A/B тестов
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Активные тесты"
          value={activeTests.length}
          icon={Play}
        />
        <StatCard
          title="Завершенные тесты"
          value={completedTests.length}
          icon={Target}
        />
        <StatCard
          title="Общие посещения"
          value={currentTests.reduce((sum, test) => {
            const results = getTestResults(test.id);
            return sum + results.reduce((s, r) => s + r.visits, 0);
          }, 0)}
          icon={Users}
        />
        <StatCard
          title="Общие конверсии"
          value={currentTests.reduce((sum, test) => {
            const results = getTestResults(test.id);
            return sum + results.reduce((s, r) => s + r.conversions, 0);
          }, 0)}
          icon={Trophy}
        />
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="active">Активные тесты</TabsTrigger>
          <TabsTrigger value="completed">Завершенные</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          <TabsTrigger value="heatmap">Тепловые карты</TabsTrigger>
          <TabsTrigger value="funnel">Воронка</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeTests.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center p-12">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Нет активных тестов</h3>
                  <p className="text-muted-foreground">
                    Создайте новый A/B тест для начала оптимизации
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            activeTests.map(test => (
              <TestCard 
                key={test.id} 
                test={test} 
                results={getTestResults(test.id)} 
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedTests.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center p-12">
                <div className="text-center">
                  <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Нет завершенных тестов</h3>
                  <p className="text-muted-foreground">
                    Завершенные тесты появятся здесь
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            completedTests.map(test => (
              <TestCard 
                key={test.id} 
                test={test} 
                results={getTestResults(test.id)} 
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {currentTests.map(test => {
            const results = getTestResults(test.id);
            if (results.length === 0) return null;

            const chartData = results.map(r => ({
              variant: `Вариант ${r.variant}`,
              conversions: r.conversions,
              visits: r.visits,
              conversionRate: r.conversionRate
            }));

            return (
              <Card key={test.id}>
                <CardHeader>
                  <CardTitle>{test.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-4">Конверсии по вариантам</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="variant" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="conversions" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-4">Коэффициент конверсии</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="variant" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value}%`, 'Конверсия']} />
                          <Bar dataKey="conversionRate" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="heatmap">
          <HeatmapTracker enabled={true} />
        </TabsContent>

        <TabsContent value="funnel">
          <FunnelAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};