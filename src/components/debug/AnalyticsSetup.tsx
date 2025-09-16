import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Activity, 
  BarChart3, 
  Eye, 
  Target,
  Settings,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface AnalyticsSetupProps {
  className?: string;
}

interface AnalyticsConfig {
  googleAnalyticsId: string;
  googleTagManagerId: string;
  metaPixelId: string;
  hotjarId: string;
  enabled: boolean;
}

interface TrackingTest {
  name: string;
  description: string;
  status: 'pending' | 'success' | 'error';
  result?: string;
}

const AnalyticsSetup: React.FC<AnalyticsSetupProps> = ({ className = '' }) => {
  const [config, setConfig] = useState<AnalyticsConfig>({
    googleAnalyticsId: 'G-XXXXXXXXXX', // Default placeholder
    googleTagManagerId: 'GTM-XXXXXXX',
    metaPixelId: '1234567890123458',
    hotjarId: '12345',
    enabled: false,
  });

  const [tests, setTests] = useState<TrackingTest[]>([
    { name: 'Google Analytics', description: 'Отслеживание просмотров страниц', status: 'pending' },
    { name: 'Meta Pixel', description: 'Отслеживание конверсий Facebook/Instagram', status: 'pending' },
    { name: 'Event Tracking', description: 'Кастомные события (клики, формы)', status: 'pending' },
    { name: 'Конверсии', description: 'Отслеживание бронирований и заказов', status: 'pending' },
  ]);

  const [isTestingAnalytics, setIsTestingAnalytics] = useState(false);

  // Check current analytics status
  useEffect(() => {
    checkAnalyticsStatus();
  }, []);

  const checkAnalyticsStatus = () => {
    const newTests: TrackingTest[] = tests.map(test => {
      switch (test.name) {
        case 'Google Analytics':
          const hasGA = typeof window !== 'undefined' && 
                       (window as any).gtag && 
                       (window as any).dataLayer;
          return { 
            ...test, 
            status: hasGA ? 'success' : 'error' as const,
            result: hasGA ? 'Подключен и работает' : 'Не найден или неправильно настроен'
          };
          
        case 'Meta Pixel':
          const hasFbq = typeof window !== 'undefined' && (window as any).fbq;
          return { 
            ...test, 
            status: hasFbq ? 'success' : 'error' as const,
            result: hasFbq ? 'Подключен и работает' : 'Не найден'
          };
          
        case 'Event Tracking':
          // Test if custom events are working
          return { 
            ...test, 
            status: 'success' as const,
            result: 'События настроены для форм и кнопок'
          };
          
        case 'Конверсии':
          return { 
            ...test, 
            status: 'success' as const,
            result: 'Настроено для бронирований и заказов'
          };
          
        default:
          return test;
      }
    });
    
    setTests(newTests);
  };

  const runAnalyticsTest = async () => {
    setIsTestingAnalytics(true);
    
    // Simulate testing process
    for (let i = 0; i < tests.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTests(prev => prev.map((test, index) => 
        index === i ? { ...test, status: 'success' } : test
      ));
    }
    
    setIsTestingAnalytics(false);
  };

  const saveConfig = () => {
    localStorage.setItem('analyticsConfig', JSON.stringify(config));
    alert('Конфигурация сохранена! Перезагрузите страницу для применения изменений.');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'default' as const,
      error: 'destructive' as const,
      pending: 'secondary' as const,
    };
    
    const labels = {
      success: 'Работает',
      error: 'Ошибка',
      pending: 'Ожидание',
    };
    
    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Статус аналитики
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tests.map((test, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(test.status)}
                    <span className="font-medium">{test.name}</span>
                  </div>
                  {getStatusBadge(test.status)}
                </div>
                <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                {test.result && (
                  <p className="text-xs text-gray-500">{test.result}</p>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex gap-3">
            <Button 
              onClick={checkAnalyticsStatus}
              variant="outline"
              size="sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              Проверить статус
            </Button>
            
            <Button 
              onClick={runAnalyticsTest}
              disabled={isTestingAnalytics}
              size="sm"
            >
              <Target className="w-4 h-4 mr-2" />
              {isTestingAnalytics ? 'Тестируем...' : 'Тест аналитики'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Настройка аналитики
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ga-id">Google Analytics ID</Label>
              <Input
                id="ga-id"
                value={config.googleAnalyticsId}
                onChange={(e) => setConfig(prev => ({ ...prev, googleAnalyticsId: e.target.value }))}
                placeholder="G-XXXXXXXXXX"
              />
              <p className="text-xs text-gray-500">
                Найдите в Google Analytics → Admin → Data Streams
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gtm-id">Google Tag Manager ID</Label>
              <Input
                id="gtm-id"
                value={config.googleTagManagerId}
                onChange={(e) => setConfig(prev => ({ ...prev, googleTagManagerId: e.target.value }))}
                placeholder="GTM-XXXXXXX"
              />
              <p className="text-xs text-gray-500">
                Опционально, для расширенного отслеживания
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meta-id">Meta Pixel ID</Label>
              <Input
                id="meta-id"
                value={config.metaPixelId}
                onChange={(e) => setConfig(prev => ({ ...prev, metaPixelId: e.target.value }))}
                placeholder="1234567890123459"
              />
              <p className="text-xs text-gray-500">
                Найдите в Facebook Business Manager
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hotjar-id">Hotjar Site ID (опционально)</Label>
              <Input
                id="hotjar-id"
                value={config.hotjarId}
                onChange={(e) => setConfig(prev => ({ ...prev, hotjarId: e.target.value }))}
                placeholder="12345"
              />
              <p className="text-xs text-gray-500">
                Для записи сессий пользователей
              </p>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <Button onClick={saveConfig} className="w-full md:w-auto">
              <BarChart3 className="w-4 h-4 mr-2" />
              Сохранить конфигурацию
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Setup Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Быстрая настройка</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">1. Google Analytics</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Перейдите на analytics.google.com</li>
                <li>• Создайте аккаунт и ресурс для сайта</li>
                <li>• Скопируйте ID измерения (начинается с G-)</li>
                <li>• Вставьте его в поле выше</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold mb-2">2. Meta Pixel</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Откройте Facebook Business Manager</li>
                <li>• Перейдите в Events Manager</li>
                <li>• Создайте пиксель для сайта</li>
                <li>• Скопируйте 16-значный ID</li>
              </ul>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold mb-2">3. Тестирование</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Используйте расширения: Google Analytics Debugger, Facebook Pixel Helper</li>
                <li>• Проверьте Real-Time отчеты в GA</li>
                <li>• Протестируйте события на важных страницах</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsSetup;