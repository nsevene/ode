import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { WifiOff, Wifi, Download, Database, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CachedData {
  menus: any[];
  events: any[];
  userBookings: any[];
  loyaltyData: any;
  lastSync: Date;
}

interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSync: Date | null;
  pendingActions: number;
  cacheSize: number;
}

export const OfflineMode: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    isSyncing: false,
    lastSync: null,
    pendingActions: 0,
    cacheSize: 0,
  });

  const [cachedData, setCachedData] = useState<CachedData | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Слушаем изменения статуса сети
    const handleOnline = () => {
      setSyncStatus((prev) => ({ ...prev, isOnline: true }));
      toast({
        title: 'Подключение восстановлено',
        description: 'Синхронизация данных...',
      });
      syncData();
    };

    const handleOffline = () => {
      setSyncStatus((prev) => ({ ...prev, isOnline: false }));
      toast({
        title: 'Соединение потеряно',
        description: 'Работаем в автономном режиме',
        variant: 'destructive',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Инициализация
    loadCachedData();
    calculateCacheSize();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadCachedData = () => {
    try {
      const cached = localStorage.getItem('offline_cache');
      if (cached) {
        const data = JSON.parse(cached);
        setCachedData({
          ...data,
          lastSync: new Date(data.lastSync),
        });
        setSyncStatus((prev) => ({
          ...prev,
          lastSync: new Date(data.lastSync),
        }));
      }
    } catch (error) {
      console.error('Ошибка загрузки кэша:', error);
    }
  };

  const calculateCacheSize = () => {
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length;
      }
    }

    // Примерный размер в КБ
    const sizeKB = Math.round(totalSize / 1024);
    setSyncStatus((prev) => ({ ...prev, cacheSize: sizeKB }));
  };

  const downloadForOffline = async () => {
    setSyncStatus((prev) => ({ ...prev, isSyncing: true }));
    setDownloadProgress(0);

    try {
      // Симулируем загрузку данных
      const endpoints = [
        { name: 'menus', url: '/api/menus' },
        { name: 'events', url: '/api/events' },
        { name: 'locations', url: '/api/locations' },
        { name: 'reviews', url: '/api/reviews' },
      ];

      const totalSteps = endpoints.length;
      const cachedData: any = {};

      for (let i = 0; i < endpoints.length; i++) {
        const endpoint = endpoints[i];

        // In a real application this would be fetch
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Симулируем данные
        cachedData[endpoint.name] = generateMockData(endpoint.name);

        setDownloadProgress(((i + 1) / totalSteps) * 100);
      }

      // Сохраняем в localStorage
      const cacheData: CachedData = {
        ...cachedData,
        lastSync: new Date(),
      };

      localStorage.setItem('offline_cache', JSON.stringify(cacheData));
      setCachedData(cacheData);

      setSyncStatus((prev) => ({
        ...prev,
        lastSync: new Date(),
        isSyncing: false,
      }));

      calculateCacheSize();

      toast({
        title: 'Данные загружены',
        description: 'Приложение готово к работе офлайн',
      });
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setSyncStatus((prev) => ({ ...prev, isSyncing: false }));
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить данные для офлайн режима',
        variant: 'destructive',
      });
    }
  };

  const syncData = async () => {
    if (!syncStatus.isOnline) return;

    setSyncStatus((prev) => ({ ...prev, isSyncing: true }));

    try {
      // Отправляем накопленные действия на сервер
      const pendingActions = JSON.parse(
        localStorage.getItem('pending_actions') || '[]'
      );

      if (pendingActions.length > 0) {
        // In a real application this would be sending to server
        await new Promise((resolve) => setTimeout(resolve, 1000));

        localStorage.removeItem('pending_actions');
        setSyncStatus((prev) => ({ ...prev, pendingActions: 0 }));
      }

      // Обновляем кэшированные данные
      await downloadForOffline();

      toast({
        title: 'Синхронизация завершена',
        description: 'Все данные обновлены',
      });
    } catch (error) {
      console.error('Ошибка синхронизации:', error);
    } finally {
      setSyncStatus((prev) => ({ ...prev, isSyncing: false }));
    }
  };

  const generateMockData = (type: string) => {
    switch (type) {
      case 'menus':
        return [
          {
            id: 1,
            name: 'Taste Alley Menu',
            items: ['Nasi Goreng', 'Pad Thai', 'Ramen'],
          },
          {
            id: 2,
            name: "Chef's Table Menu",
            items: ['Wagyu Steak', 'Lobster', 'Truffle Pasta'],
          },
        ];
      case 'events':
        return [
          { id: 1, name: 'Wine Tasting', date: '2024-02-15', available: true },
          {
            id: 2,
            name: 'Cooking Class',
            date: '2024-02-20',
            available: false,
          },
        ];
      default:
        return [];
    }
  };

  const clearCache = () => {
    localStorage.removeItem('offline_cache');
    localStorage.removeItem('pending_actions');
    setCachedData(null);
    setSyncStatus((prev) => ({
      ...prev,
      lastSync: null,
      pendingActions: 0,
      cacheSize: 0,
    }));
    calculateCacheSize();

    toast({
      title: 'Кэш очищен',
      description: 'Все офлайн данные удалены',
    });
  };

  const addPendingAction = (action: any) => {
    const pending = JSON.parse(localStorage.getItem('pending_actions') || '[]');
    pending.push({ ...action, timestamp: new Date() });
    localStorage.setItem('pending_actions', JSON.stringify(pending));
    setSyncStatus((prev) => ({ ...prev, pendingActions: pending.length }));
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            {syncStatus.isOnline ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            <CardTitle>Статус подключения</CardTitle>
          </div>
          <Badge variant={syncStatus.isOnline ? 'default' : 'destructive'}>
            {syncStatus.isOnline ? 'Онлайн' : 'Офлайн'}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Последняя синхронизация</p>
                <p className="font-medium">
                  {syncStatus.lastSync
                    ? syncStatus.lastSync.toLocaleString()
                    : 'Никогда'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Размер кэша</p>
                <p className="font-medium">{syncStatus.cacheSize} КБ</p>
              </div>
            </div>

            {syncStatus.pendingActions > 0 && (
              <div className="p-3 border rounded-lg bg-yellow-50">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">
                    {syncStatus.pendingActions} действий ожидают синхронизации
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Download for Offline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Подготовка к автономной работе
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Загрузите данные для работы без интернета. Это включает меню,
              события, информацию о локациях и ваши бронирования.
            </p>

            {syncStatus.isSyncing && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Загрузка данных...</span>
                  <span className="text-sm">
                    {Math.round(downloadProgress)}%
                  </span>
                </div>
                <Progress value={downloadProgress} />
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={downloadForOffline}
                disabled={syncStatus.isSyncing || !syncStatus.isOnline}
                className="flex-1"
              >
                {syncStatus.isSyncing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Загрузить данные
                  </>
                )}
              </Button>

              {syncStatus.isOnline && (
                <Button
                  variant="outline"
                  onClick={syncData}
                  disabled={syncStatus.isSyncing}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cached Data Info */}
      {cachedData && (
        <Card>
          <CardHeader>
            <CardTitle>Кэшированные данные</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>Меню:</span>
                  <span>{cachedData.menus?.length || 0} элементов</span>
                </div>
                <div className="flex justify-between">
                  <span>События:</span>
                  <span>{cachedData.events?.length || 0} элементов</span>
                </div>
                <div className="flex justify-between">
                  <span>Бронирования:</span>
                  <span>{cachedData.userBookings?.length || 0} элементов</span>
                </div>
                <div className="flex justify-between">
                  <span>Программа лояльности:</span>
                  <span>{cachedData.loyaltyData ? 'Есть' : 'Нет'}</span>
                </div>
              </div>

              <Button variant="outline" onClick={clearCache} className="w-full">
                Очистить кэш
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
