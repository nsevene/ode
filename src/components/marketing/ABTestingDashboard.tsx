import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Play, 
  Pause, 
  BarChart3, 
  TrendingUp,
  Target,
  Users,
  Eye,
  MousePointer
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';

interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'completed' | 'paused';
  test_type: 'landing_page' | 'pricing' | 'cta_button' | 'hero_section';
  traffic_split: number; // percentage for variant B
  start_date?: string;
  end_date?: string;
  variant_a: {
    name: string;
    content: any;
    conversions: number;
    views: number;
  };
  variant_b: {
    name: string;
    content: any;
    conversions: number;
    views: number;
  };
  significance_level: number;
  created_at: string;
}

interface LandingPageVariant {
  hero_title: string;
  hero_subtitle: string;
  cta_text: string;
  hero_image?: string;
  color_scheme: 'default' | 'vibrant' | 'minimal' | 'dark';
}

export const ABTestingDashboard: React.FC = () => {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('tests');
  const [showCreateTest, setShowCreateTest] = useState(false);
  
  const { toast } = useToast();
  const { track } = useAnalytics();

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    setLoading(true);
    try {
      // Симуляция данных A/B тестов
      const mockTests: ABTest[] = [
        {
          id: '1',
          name: 'Hero Section CTA Test',
          description: 'Тестирование эффективности разных кнопок призыва к действию',
          status: 'running',
          test_type: 'hero_section',
          traffic_split: 50,
          start_date: '2024-01-15T00:00:00Z',
          significance_level: 95,
          variant_a: {
            name: 'Оригинал',
            content: { cta_text: 'Забронировать столик', color: 'primary' },
            conversions: 45,
            views: 890
          },
          variant_b: {
            name: 'Новый дизайн',
            content: { cta_text: 'Получить стол сейчас', color: 'accent' },
            conversions: 58,
            views: 912
          },
          created_at: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'Pricing Display Test',
          description: 'Сравнение отображения цен: полная стоимость vs. стоимость за человека',
          status: 'completed',
          test_type: 'pricing',
          traffic_split: 50,
          start_date: '2024-01-01T00:00:00Z',
          end_date: '2024-01-14T23:59:59Z',
          significance_level: 95,
          variant_a: {
            name: 'Полная стоимость',
            content: { display_type: 'total', format: 'IDR 500,000 за стол' },
            conversions: 32,
            views: 654
          },
          variant_b: {
            name: 'За человека',
            content: { display_type: 'per_person', format: 'от IDR 125,000/чел' },
            conversions: 41,
            views: 667
          },
          created_at: '2024-01-01T00:00:00Z'
        }
      ];

      setTests(mockTests);
    } catch (error) {
      console.error('Error loading A/B tests:', error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить A/B тесты",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getConversionRate = (conversions: number, views: number): number => {
    return views > 0 ? (conversions / views) * 100 : 0;
  };

  const getConfidenceLevel = (test: ABTest): number => {
    // Упрощенный расчет статистической значимости
    const aRate = getConversionRate(test.variant_a.conversions, test.variant_a.views);
    const bRate = getConversionRate(test.variant_b.conversions, test.variant_b.views);
    const diff = Math.abs(aRate - bRate);
    const totalViews = test.variant_a.views + test.variant_b.views;
    
    if (totalViews < 100) return 0;
    if (diff < 1) return Math.min(70, totalViews / 10);
    if (diff < 2) return Math.min(85, totalViews / 8);
    return Math.min(95, totalViews / 5);
  };

  const getWinningVariant = (test: ABTest): 'a' | 'b' | 'tie' => {
    const aRate = getConversionRate(test.variant_a.conversions, test.variant_a.views);
    const bRate = getConversionRate(test.variant_b.conversions, test.variant_b.views);
    const confidence = getConfidenceLevel(test);
    
    if (confidence < 80) return 'tie';
    return aRate > bRate ? 'a' : 'b';
  };

  const toggleTestStatus = async (testId: string) => {
    const test = tests.find(t => t.id === testId);
    if (!test) return;

    const newStatus = test.status === 'running' ? 'paused' : 'running';
    
    setTests(tests.map(t => 
      t.id === testId ? { ...t, status: newStatus } : t
    ));

    track('ab_test_toggled', { test_id: testId, new_status: newStatus });
    
    toast({
      title: newStatus === 'running' ? "Тест запущен" : "Тест приостановлен",
      description: `A/B тест "${test.name}" ${newStatus === 'running' ? 'возобновлен' : 'приостановлен'}`
    });
  };

  const createNewTest = () => {
    // Логика создания нового теста
    track('ab_test_create_started');
    setShowCreateTest(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Загрузка A/B тестов...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">A/B тестирование</h1>
          <p className="text-muted-foreground">Оптимизация конверсий через тестирование</p>
        </div>
        <Button onClick={createNewTest}>
          <Plus className="h-4 w-4 mr-2" />
          Новый тест
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные тесты</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests.filter(t => t.status === 'running').length}</div>
            <p className="text-xs text-muted-foreground">
              Всего: {tests.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Средний прирост</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+12.5%</div>
            <p className="text-xs text-muted-foreground">
              По завершенным тестам
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего просмотров</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests.reduce((sum, t) => sum + t.variant_a.views + t.variant_b.views, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              За все время
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Конверсий</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests.reduce((sum, t) => sum + t.variant_a.conversions + t.variant_b.conversions, 0)}</div>
            <p className="text-xs text-muted-foreground">
              Общее количество
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tests List */}
      <div className="space-y-4">
        {tests.map((test) => {
          const aRate = getConversionRate(test.variant_a.conversions, test.variant_a.views);
          const bRate = getConversionRate(test.variant_b.conversions, test.variant_b.views);
          const confidence = getConfidenceLevel(test);
          const winner = getWinningVariant(test);
          const improvement = Math.abs(aRate - bRate);
          
          return (
            <Card key={test.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{test.name}</CardTitle>
                    <CardDescription>{test.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={test.status === 'running' ? 'default' : test.status === 'completed' ? 'secondary' : 'outline'}
                    >
                      {test.status === 'running' ? 'Активен' : 
                       test.status === 'completed' ? 'Завершен' : 
                       test.status === 'paused' ? 'Приостановлен' : 'Черновик'}
                    </Badge>
                    <Badge variant="outline">{test.test_type}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Variant A */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{test.variant_a.name}</h4>
                      {winner === 'a' && confidence >= 80 && (
                        <Badge className="bg-green-100 text-green-800">Победитель</Badge>
                      )}
                    </div>
                    <div className="text-2xl font-bold">{aRate.toFixed(2)}%</div>
                    <div className="text-sm text-muted-foreground">
                      {test.variant_a.conversions} из {test.variant_a.views} просмотров
                    </div>
                    <Progress value={aRate} className="h-2" />
                  </div>

                  {/* Variant B */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{test.variant_b.name}</h4>
                      {winner === 'b' && confidence >= 80 && (
                        <Badge className="bg-green-100 text-green-800">Победитель</Badge>
                      )}
                    </div>
                    <div className="text-2xl font-bold">{bRate.toFixed(2)}%</div>
                    <div className="text-sm text-muted-foreground">
                      {test.variant_b.conversions} из {test.variant_b.views} просмотров
                    </div>
                    <Progress value={bRate} className="h-2" />
                  </div>

                  {/* Stats */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Статистика</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Уверенность:</span>
                        <span className={confidence >= 95 ? 'text-green-600' : confidence >= 80 ? 'text-yellow-600' : 'text-gray-600'}>
                          {confidence.toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Улучшение:</span>
                        <span className={improvement > 0 ? 'text-green-600' : 'text-gray-600'}>
                          {improvement > 0 ? '+' : ''}{improvement.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Трафик:</span>
                        <span>{test.traffic_split}% / {100 - test.traffic_split}%</span>
                      </div>
                    </div>
                    
                    {test.status === 'running' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleTestStatus(test.id)}
                        className="w-full mt-2"
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Приостановить
                      </Button>
                    )}
                    
                    {test.status === 'paused' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleTestStatus(test.id)}
                        className="w-full mt-2"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Возобновить
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {tests.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Нет активных тестов</h3>
            <p className="text-muted-foreground mb-4">
              Создайте первый A/B тест для оптимизации конверсий
            </p>
            <Button onClick={createNewTest}>
              <Plus className="h-4 w-4 mr-2" />
              Создать тест
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ABTestingDashboard;