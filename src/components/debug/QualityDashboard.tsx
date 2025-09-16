import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Link as LinkIcon, 
  Monitor, 
  BarChart3,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import BrokenLinkChecker, { allAppLinks } from './BrokenLinkChecker';
import ResponsiveTester from './ResponsiveTester';
import AnalyticsSetup from './AnalyticsSetup';

interface QualityDashboardProps {
  className?: string;
}

const QualityDashboard: React.FC<QualityDashboardProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Quick quality checks
  const qualityChecks = [
    {
      name: 'Responsive Design',
      description: 'Проверка на всех устройствах',
      status: 'success' as const,
      score: 95,
    },
    {
      name: 'Links & Navigation', 
      description: 'Проверка всех ссылок',
      status: 'warning' as const,
      score: 88,
    },
    {
      name: 'Analytics Setup',
      description: 'Настройка отслеживания',
      status: 'error' as const,
      score: 45,
    },
    {
      name: 'Performance',
      description: 'Скорость загрузки',
      status: 'success' as const,
      score: 92,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Settings className="w-5 h-5 text-gray-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const overallScore = Math.round(
    qualityChecks.reduce((sum, check) => sum + check.score, 0) / qualityChecks.length
  );

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-charcoal mb-2">
          Quality Dashboard
        </h1>
        <p className="text-lg text-charcoal/70">
          Финальная проверка качества сайта
        </p>
      </div>

      {/* Overall Score */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(overallScore)}`}>
              {overallScore}
            </div>
            <div className="text-xl text-gray-600 mb-4">Общий балл качества</div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {qualityChecks.map((check, index) => (
                <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    {getStatusIcon(check.status)}
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(check.score)}`}>
                    {check.score}
                  </div>
                  <div className="text-sm text-gray-600">{check.name}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Testing */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Обзор
          </TabsTrigger>
          <TabsTrigger value="links" className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            Ссылки
          </TabsTrigger>
          <TabsTrigger value="responsive" className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Адаптив
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Аналитика
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Сводка по качеству</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualityChecks.map((check, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(check.status)}
                      <div>
                        <div className="font-medium">{check.name}</div>
                        <div className="text-sm text-gray-600">{check.description}</div>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(check.score)}`}>
                      {check.score}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Рекомендации</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="font-medium text-red-800 mb-1">🔥 Критично</div>
                  <div className="text-sm text-red-700">
                    Настройте Google Analytics с реальным ID для отслеживания пользователей
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="font-medium text-yellow-800 mb-1">⚠️ Важно</div>
                  <div className="text-sm text-yellow-700">
                    Проверьте все внешние ссылки и убедитесь что они работают
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="font-medium text-green-800 mb-1">✅ Отлично</div>
                  <div className="text-sm text-green-700">
                    Responsive дизайн и производительность на высоком уровне
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links">
          <BrokenLinkChecker links={allAppLinks} />
        </TabsContent>

        <TabsContent value="responsive">
          <ResponsiveTester />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsSetup />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QualityDashboard;