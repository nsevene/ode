import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MousePointer, Eye, BarChart3, Download } from 'lucide-react';

interface HeatmapData {
  x: number;
  y: number;
  clicks: number;
  timestamp: Date;
  element?: string;
  page: string;
}

interface HeatmapTrackerProps {
  enabled?: boolean;
  onDataUpdate?: (data: HeatmapData[]) => void;
}

export const HeatmapTracker: React.FC<HeatmapTrackerProps> = ({
  enabled = false,
  onDataUpdate,
}) => {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [isRecording, setIsRecording] = useState(enabled);
  const [showVisualization, setShowVisualization] = useState(false);

  useEffect(() => {
    if (!isRecording) return;

    const handleClick = (event: MouseEvent) => {
      const rect = document.documentElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / window.innerWidth) * 100;
      const y = ((event.clientY - rect.top) / window.innerHeight) * 100;

      const target = event.target as HTMLElement;
      const element =
        target.tagName.toLowerCase() +
        (target.className ? `.${target.className.split(' ')[0]}` : '') +
        (target.id ? `#${target.id}` : '');

      const newDataPoint: HeatmapData = {
        x,
        y,
        clicks: 1,
        timestamp: new Date(),
        element,
        page: window.location.pathname,
      };

      setHeatmapData((prev) => {
        const existing = prev.find(
          (item) => Math.abs(item.x - x) < 2 && Math.abs(item.y - y) < 2
        );

        if (existing) {
          return prev.map((item) =>
            item === existing
              ? { ...item, clicks: item.clicks + 1, timestamp: new Date() }
              : item
          );
        }

        const updated = [...prev, newDataPoint];
        onDataUpdate?.(updated);
        return updated;
      });

      // Сохраняем в localStorage
      const storageKey = `heatmap_${window.location.pathname}`;
      const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
      localStorage.setItem(
        storageKey,
        JSON.stringify([...existingData, newDataPoint])
      );
    };

    const handleScroll = () => {
      // Трекинг скролла для тепловой карты просмотров
      const scrollPercent =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        100;

      // Логика для отслеживания областей просмотра
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [isRecording, onDataUpdate]);

  const exportData = () => {
    const dataStr = JSON.stringify(heatmapData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `heatmap-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const renderHeatmapOverlay = () => {
    if (!showVisualization) return null;

    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {heatmapData.map((point, index) => (
          <div
            key={index}
            className="absolute w-4 h-4 rounded-full pointer-events-none"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              backgroundColor: `rgba(255, ${Math.max(255 - point.clicks * 30, 0)}, 0, ${Math.min(point.clicks * 0.1, 0.8)})`,
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 ${point.clicks * 2}px rgba(255, 0, 0, 0.3)`,
            }}
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-black text-white px-1 rounded opacity-0 hover:opacity-100 transition-opacity">
              {point.clicks}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Тепловая карта кликов
          </CardTitle>
          <Badge variant={isRecording ? 'default' : 'secondary'}>
            {isRecording ? 'Записывается' : 'Остановлено'}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <MousePointer className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">
                Кликов:{' '}
                {heatmapData.reduce((sum, point) => sum + point.clicks, 0)}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? 'Остановить' : 'Начать'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVisualization(!showVisualization)}
              >
                <Eye className="h-4 w-4 mr-1" />
                {showVisualization ? 'Скрыть' : 'Показать'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={exportData}
                disabled={heatmapData.length === 0}
              >
                <Download className="h-4 w-4 mr-1" />
                Экспорт
              </Button>
            </div>
          </div>

          {heatmapData.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">Популярные элементы:</h4>
              {Object.entries(
                heatmapData.reduce(
                  (acc, point) => {
                    if (point.element) {
                      acc[point.element] =
                        (acc[point.element] || 0) + point.clicks;
                    }
                    return acc;
                  },
                  {} as Record<string, number>
                )
              )
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([element, clicks]) => (
                  <div
                    key={element}
                    className="flex justify-between items-center text-xs"
                  >
                    <span className="font-mono truncate max-w-xs">
                      {element}
                    </span>
                    <Badge variant="outline">{clicks}</Badge>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {renderHeatmapOverlay()}
    </>
  );
};
