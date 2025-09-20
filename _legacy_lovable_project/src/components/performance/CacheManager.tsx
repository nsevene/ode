import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, RefreshCw, HardDrive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CacheManager = () => {
  const { toast } = useToast();

  const clearCache = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );

        // Force service worker update after cache clear
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            await registration.update();
          }
        }

        toast({
          title: 'Кэш очищен',
          description:
            'Все кэшированные данные удалены. Страница будет перезагружена.',
        });

        // Reload page to reflect changes
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось очистить кэш',
        variant: 'destructive',
      });
    }
  };

  const updateApp = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          window.location.reload();
        }
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить приложение',
        variant: 'destructive',
      });
    }
  };

  const getCacheSize = async () => {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          available: estimate.quota || 0,
        };
      }
    } catch (error) {
      console.error('Error getting cache size:', error);
    }
    return null;
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <HardDrive className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Управление кэшем</h3>
        </div>

        <div className="space-y-3">
          <Button
            onClick={clearCache}
            variant="outline"
            className="w-full justify-start"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Очистить кэш
          </Button>

          <Button
            onClick={updateApp}
            variant="outline"
            className="w-full justify-start"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Обновить приложение
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Кэш помогает загружать страницы быстрее и работать офлайн.</p>
          <p>Очистка кэша может временно замедлить загрузку.</p>
        </div>
      </div>
    </Card>
  );
};
