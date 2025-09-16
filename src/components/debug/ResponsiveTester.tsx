import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Check, 
  AlertTriangle,
  RefreshCw 
} from 'lucide-react';

interface ResponsiveTestProps {
  className?: string;
}

interface ViewportTest {
  name: string;
  width: number;
  height: number;
  icon: typeof Monitor;
  category: 'desktop' | 'tablet' | 'mobile';
}

const viewportTests: ViewportTest[] = [
  // Desktop
  { name: 'Desktop XL', width: 1920, height: 1080, icon: Monitor, category: 'desktop' },
  { name: 'Desktop Large', width: 1440, height: 900, icon: Monitor, category: 'desktop' },
  { name: 'Desktop', width: 1024, height: 768, icon: Monitor, category: 'desktop' },
  
  // Tablet
  { name: 'iPad Pro', width: 1024, height: 1366, icon: Tablet, category: 'tablet' },
  { name: 'iPad', width: 768, height: 1024, icon: Tablet, category: 'tablet' },
  { name: 'Tablet Landscape', width: 1024, height: 768, icon: Tablet, category: 'tablet' },
  
  // Mobile
  { name: 'iPhone 14 Pro Max', width: 430, height: 932, icon: Smartphone, category: 'mobile' },
  { name: 'iPhone 14', width: 390, height: 844, icon: Smartphone, category: 'mobile' },
  { name: 'Android Large', width: 412, height: 915, icon: Smartphone, category: 'mobile' },
  { name: 'Mobile Small', width: 320, height: 568, icon: Smartphone, category: 'mobile' },
];

const checkBreakpoints = [
  { name: 'Mobile', query: '(max-width: 768px)', expected: true },
  { name: 'Tablet', query: '(min-width: 768px) and (max-width: 1024px)', expected: true },
  { name: 'Desktop', query: '(min-width: 1024px)', expected: true },
];

const ResponsiveTester: React.FC<ResponsiveTestProps> = ({ className = '' }) => {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [isTestingViewports, setIsTestingViewports] = useState(false);
  const [currentViewport, setCurrentViewport] = useState<ViewportTest | null>(null);

  const runViewportTest = (viewport: ViewportTest) => {
    setCurrentViewport(viewport);
    
    // In a real test, we would use browser automation tools
    // For now, we'll simulate testing based on CSS media queries
    const testPassed = window.innerWidth >= viewport.width * 0.8; // Allow some tolerance
    
    setTestResults(prev => ({
      ...prev,
      [viewport.name]: testPassed
    }));
  };

  const runAllTests = async () => {
    setIsTestingViewports(true);
    
    for (const viewport of viewportTests) {
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate testing delay
      runViewportTest(viewport);
    }
    
    setIsTestingViewports(false);
    setCurrentViewport(null);
  };

  const checkCurrentBreakpoints = () => {
    const results: Record<string, boolean> = {};
    
    checkBreakpoints.forEach(bp => {
      results[bp.name] = window.matchMedia(bp.query).matches;
    });
    
    return results;
  };

  const [breakpointResults] = useState(checkCurrentBreakpoints());

  const getStatusIcon = (passed: boolean) => {
    return passed ? (
      <Check className="w-4 h-4 text-green-500" />
    ) : (
      <AlertTriangle className="w-4 h-4 text-red-500" />
    );
  };

  const getStatusBadge = (passed: boolean) => {
    return (
      <Badge variant={passed ? 'default' : 'destructive'} className="text-xs">
        {passed ? 'Проходит' : 'Ошибка'}
      </Badge>
    );
  };

  const getStatusColor = (passed: boolean) => {
    return passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Breakpoints */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Текущие брейкпоинты
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(breakpointResults).map(([name, matches]) => (
              <div key={name} className={`p-4 rounded-lg border ${getStatusColor(matches)}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{name}</span>
                  {getStatusIcon(matches)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {matches ? 'Активен' : 'Неактивен'}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>Текущий размер:</strong> {window.innerWidth} × {window.innerHeight}px
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Viewport Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Tablet className="w-5 h-5" />
              Тестирование устройств
            </span>
            <Button 
              onClick={runAllTests} 
              disabled={isTestingViewports}
              size="sm"
            >
              {isTestingViewports ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Тестируем...
                </>
              ) : (
                'Запустить тесты'
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isTestingViewports && currentViewport && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Тестируем {currentViewport.name}...</span>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {['desktop', 'tablet', 'mobile'].map(category => (
              <div key={category}>
                <h4 className="font-semibold mb-3 capitalize flex items-center gap-2">
                  {category === 'desktop' && <Monitor className="w-4 h-4" />}
                  {category === 'tablet' && <Tablet className="w-4 h-4" />}
                  {category === 'mobile' && <Smartphone className="w-4 h-4" />}
                  {category === 'desktop' ? 'Десктоп' : category === 'tablet' ? 'Планшеты' : 'Мобильные'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {viewportTests
                    .filter(vp => vp.category === category)
                    .map(viewport => {
                      const tested = viewport.name in testResults;
                      const passed = testResults[viewport.name];
                      
                      return (
                        <div 
                          key={viewport.name}
                          className={`p-3 rounded-lg border ${tested ? getStatusColor(passed) : 'border-gray-200 bg-gray-50'}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{viewport.name}</span>
                            {tested && getStatusIcon(passed)}
                          </div>
                          
                          <div className="text-xs text-gray-600 mb-2">
                            {viewport.width} × {viewport.height}px
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => runViewportTest(viewport)}
                              className="text-xs h-6"
                            >
                              Тест
                            </Button>
                            {tested && getStatusBadge(passed)}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Summary */}
      {Object.keys(testResults).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Сводка тестов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(testResults).filter(Boolean).length}
                </div>
                <div className="text-sm text-green-600">Прошли тест</div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {Object.values(testResults).filter(result => !result).length}
                </div>
                <div className="text-sm text-red-600">Ошибки</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round((Object.values(testResults).filter(Boolean).length / Object.keys(testResults).length) * 100)}%
                </div>
                <div className="text-sm text-blue-600">Успешность</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResponsiveTester;