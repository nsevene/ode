import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface FunnelStep {
  id: string;
  name: string;
  description: string;
  count: number;
  conversionRate?: number;
  dropoffRate?: number;
}

interface FunnelData {
  name: string;
  steps: FunnelStep[];
  totalUsers: number;
  overallConversion: number;
}

const BOOKING_FUNNEL_STEPS = [
  { id: 'landing', name: 'Посадочная страница', description: 'Пользователи попали на главную' },
  { id: 'browse', name: 'Просмотр услуг', description: 'Изучают Taste Alley или Chef\'s Table' },
  { id: 'select', name: 'Выбор услуги', description: 'Выбрали конкретную услугу' },
  { id: 'booking_form', name: 'Форма бронирования', description: 'Открыли форму бронирования' },
  { id: 'form_filled', name: 'Заполнение формы', description: 'Заполнили основную информацию' },
  { id: 'payment', name: 'Переход к оплате', description: 'Нажали кнопку оплаты' },
  { id: 'completed', name: 'Завершение', description: 'Успешно завершили бронирование' }
];

export const FunnelAnalytics: React.FC = () => {
  const [funnelData, setFunnelData] = useState<FunnelData[]>([]);
  const [selectedFunnel, setSelectedFunnel] = useState<string>('booking');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const { getAnalyticsData } = useAnalytics();

  useEffect(() => {
    loadFunnelData();
  }, [timeRange]);

  const loadFunnelData = async () => {
    // Симуляция данных воронки
    const mockFunnelData: FunnelData[] = [
      {
        name: 'Воронка бронирования',
        totalUsers: 1250,
        overallConversion: 12.8,
        steps: [
          { id: 'landing', name: 'Посадочная страница', description: 'Пользователи попали на главную', count: 1250, conversionRate: 100 },
          { id: 'browse', name: 'Просмотр услуг', description: 'Изучают Taste Alley или Chef\'s Table', count: 875, conversionRate: 70, dropoffRate: 30 },
          { id: 'select', name: 'Выбор услуги', description: 'Выбрали конкретную услугу', count: 525, conversionRate: 60, dropoffRate: 40 },
          { id: 'booking_form', name: 'Форма бронирования', description: 'Открыли форму бронирования', count: 315, conversionRate: 60, dropoffRate: 40 },
          { id: 'form_filled', name: 'Заполнение формы', description: 'Заполнили основную информацию', count: 220, conversionRate: 70, dropoffRate: 30 },
          { id: 'payment', name: 'Переход к оплате', description: 'Нажали кнопку оплаты', count: 180, conversionRate: 82, dropoffRate: 18 },
          { id: 'completed', name: 'Завершение', description: 'Успешно завершили бронирование', count: 160, conversionRate: 89, dropoffRate: 11 }
        ]
      }
    ];

    setFunnelData(mockFunnelData);
  };

  const currentFunnel = funnelData.find(f => f.name.toLowerCase().includes(selectedFunnel));

  const getStepColor = (conversionRate?: number) => {
    if (!conversionRate) return 'bg-muted';
    if (conversionRate >= 80) return 'bg-green-500';
    if (conversionRate >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getDropoffSeverity = (dropoffRate?: number) => {
    if (!dropoffRate) return 'default';
    if (dropoffRate >= 40) return 'destructive';
    if (dropoffRate >= 25) return 'secondary';
    return 'default';
  };

  const exportFunnelData = () => {
    if (!currentFunnel) return;
    
    const csvContent = [
      ['Шаг', 'Название', 'Пользователи', 'Конверсия %', 'Отток %'].join(','),
      ...currentFunnel.steps.map(step => [
        step.id,
        `"${step.name}"`,
        step.count,
        step.conversionRate || 0,
        step.dropoffRate || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `funnel-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (!currentFunnel) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Загрузка данных воронки...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Анализ воронки бронирования
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Отслеживание пути пользователей от посещения до завершения бронирования
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              Общая конверсия: {currentFunnel.overallConversion}%
            </Badge>
            <Button variant="outline" size="sm" onClick={exportFunnelData}>
              Экспорт
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Funnel Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Визуализация воронки</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentFunnel.steps.map((step, index) => {
              const nextStep = currentFunnel.steps[index + 1];
              const widthPercent = (step.count / currentFunnel.totalUsers) * 100;
              
              return (
                <div key={step.id} className="space-y-2">
                  {/* Step Bar */}
                  <div className="relative">
                    <div 
                      className={`h-12 rounded-lg flex items-center justify-between px-4 text-white font-medium ${getStepColor(step.conversionRate)}`}
                      style={{ width: `${widthPercent}%`, minWidth: '200px' }}
                    >
                      <span className="text-sm">{step.name}</span>
                      <span className="text-sm">{step.count.toLocaleString()}</span>
                    </div>
                    
                    {/* Conversion rate badge */}
                    {step.conversionRate && (
                      <Badge 
                        className="absolute -top-2 -right-2"
                        variant={step.conversionRate >= 70 ? 'default' : 'secondary'}
                      >
                        {step.conversionRate}%
                      </Badge>
                    )}
                  </div>

                  {/* Step description and metrics */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground pl-4">
                    <span>{step.description}</span>
                    {step.dropoffRate && step.dropoffRate > 0 && (
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-500" />
                        <Badge variant={getDropoffSeverity(step.dropoffRate)}>
                          -{step.dropoffRate}% отток
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Arrow to next step */}
                  {nextStep && (
                    <div className="flex items-center justify-center py-2">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ключевые проблемы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentFunnel.steps
                .filter(step => (step.dropoffRate || 0) >= 25)
                .map(step => (
                  <div key={step.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium">{step.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Высокий отток: {step.dropoffRate}%
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Успешные этапы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentFunnel.steps
                .filter(step => (step.conversionRate || 0) >= 80)
                .map(step => (
                  <div key={step.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">{step.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Отличная конверсия: {step.conversionRate}%
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};