import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MapPin, 
  Nfc, 
  Bell, 
  Camera, 
  Compass, 
  Trophy, 
  Star,
  Zap,
  Shield,
  Wifi
} from "lucide-react";
import { useNFCEnhanced } from "@/hooks/useNFCEnhanced";
import { useToast } from "@/hooks/use-toast";

interface LocationData {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: string;
}

interface NearbySector {
  id: string;
  name: string;
  distance: number;
  direction: string;
  isActive: boolean;
}

const MobileTasteCompass = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [nearbySectors, setNearbySectors] = useState<NearbySector[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const { 
    nfcStatus, 
    sectors, 
    userProgress, 
    recentReadings,
    startNFCScanning, 
    stopNFCScanning 
  } = useNFCEnhanced();
  
  const { toast } = useToast();

  // Проверка геолокации
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Геолокация не поддерживается",
        description: "Ваше устройство не поддерживает геолокацию",
        variant: "destructive"
      });
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const locationData: LocationData = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date().toISOString()
      };

      setLocation(locationData);
      
      // Находим ближайшие секторы
      findNearbySectors(locationData);
      
      toast({
        title: "📍 Местоположение определено",
        description: `Точность: ${Math.round(locationData.accuracy)}м`,
      });
      
    } catch (error: any) {
      toast({
        title: "Ошибка геолокации",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Поиск ближайших секторов
  const findNearbySectors = (userLocation: LocationData) => {
    const nearby: NearbySector[] = sectors
      .filter(sector => sector.coordinates)
      .map(sector => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          sector.coordinates!.lat,
          sector.coordinates!.lng
        );
        
        const direction = calculateDirection(
          userLocation.lat,
          userLocation.lng,
          sector.coordinates!.lat,
          sector.coordinates!.lng
        );
        
        return {
          id: sector.id,
          name: sector.name,
          distance: Math.round(distance),
          direction,
          isActive: sector.isActive
        };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);

    setNearbySectors(nearby);
  };

  // Расчет расстояния между точками
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Радиус Земли в км
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000; // Возвращаем в метрах
  };

  // Расчет направления
  const calculateDirection = (lat1: number, lng1: number, lat2: number, lng2: number): string => {
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const y = Math.sin(dLng) * Math.cos(lat2 * Math.PI / 180);
    const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
              Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLng);
    const bearing = Math.atan2(y, x) * 180 / Math.PI;
    
    const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
    const index = Math.round(bearing / 45) % 8;
    return directions[index < 0 ? index + 8 : index];
  };

  // Запрос разрешения на уведомления
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Уведомления не поддерживаются",
        description: "Ваш браузер не поддерживает уведомления",
        variant: "destructive"
      });
      return;
    }

    if (Notification.permission === 'granted') {
      setNotificationsEnabled(true);
      return;
    }

    if (Notification.permission === 'denied') {
      toast({
        title: "Уведомления заблокированы",
        description: "Разрешите уведомления в настройках браузера",
        variant: "destructive"
      });
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setNotificationsEnabled(true);
      toast({
        title: "🔔 Уведомления включены",
        description: "Вы будете получать уведомления о достижениях",
      });
    }
  };

  // Запрос разрешения на камеру
  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setCameraPermission(true);
      toast({
        title: "📷 Камера разрешена",
        description: "Теперь вы можете сканировать QR коды",
      });
    } catch (error) {
      toast({
        title: "Ошибка доступа к камере",
        description: "Разрешите доступ к камере для сканирования QR кодов",
        variant: "destructive"
      });
    }
  };

  // Отправка push уведомления
  const sendNotification = (title: string, body: string) => {
    if (notificationsEnabled && 'Notification' in window) {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }
  };

  // Отслеживание онлайн статуса
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Автоматическое определение местоположения при загрузке
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Отправка уведомлений при достижениях
  useEffect(() => {
    if (userProgress && notificationsEnabled) {
      const newAchievements = userProgress.achievements?.filter((a: any) => a.unlocked);
      if (newAchievements && newAchievements.length > 0) {
        newAchievements.forEach((achievement: any) => {
          sendNotification(
            "🏆 Новое достижение!",
            achievement.description
          );
        });
      }
    }
  }, [userProgress, notificationsEnabled]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Заголовок */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          🧭 Mobile Taste Compass
        </h1>
        <p className="text-muted-foreground">
          Интерактивное путешествие по вкусовым секторам ODE Food Hall
        </p>
      </div>

      {/* Статус подключений */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="pt-4">
            <Wifi className={`h-6 w-6 mx-auto mb-2 ${isOnline ? 'text-green-500' : 'text-red-500'}`} />
            <p className="text-sm font-medium">Интернет</p>
            <p className="text-xs text-muted-foreground">
              {isOnline ? 'Подключен' : 'Отключен'}
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-4">
            <Nfc className={`h-6 w-6 mx-auto mb-2 ${nfcStatus.isSupported ? 'text-green-500' : 'text-red-500'}`} />
            <p className="text-sm font-medium">NFC</p>
            <p className="text-xs text-muted-foreground">
              {nfcStatus.isSupported ? 'Поддерживается' : 'Не поддерживается'}
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-4">
            <Bell className={`h-6 w-6 mx-auto mb-2 ${notificationsEnabled ? 'text-green-500' : 'text-gray-400'}`} />
            <p className="text-sm font-medium">Уведомления</p>
            <p className="text-xs text-muted-foreground">
              {notificationsEnabled ? 'Включены' : 'Отключены'}
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-4">
            <Camera className={`h-6 w-6 mx-auto mb-2 ${cameraPermission ? 'text-green-500' : 'text-gray-400'}`} />
            <p className="text-sm font-medium">Камера</p>
            <p className="text-xs text-muted-foreground">
              {cameraPermission ? 'Разрешена' : 'Заблокирована'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Геолокация и ближайшие секторы */}
      {location && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Ваше местоположение
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Широта</p>
                <p className="font-mono">{location.lat.toFixed(6)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Долгота</p>
                <p className="font-mono">{location.lng.toFixed(6)}</p>
              </div>
            </div>
            
            {nearbySectors.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Ближайшие секторы:</h4>
                {nearbySectors.map(sector => (
                  <div key={sector.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div>
                      <p className="font-medium">{sector.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {sector.distance}м {sector.direction}
                      </p>
                    </div>
                    <Badge variant={sector.isActive ? "default" : "secondary"}>
                      {sector.isActive ? "Активен" : "Закрыт"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* NFC сканирование */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Nfc className="h-5 w-5" />
            NFC сканирование
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {nfcStatus.error && (
            <Alert variant="destructive">
              <AlertDescription>{nfcStatus.error}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex gap-2">
            <Button 
              onClick={startNFCScanning}
              disabled={!nfcStatus.isSupported || nfcStatus.isScanning}
              className="flex-1"
            >
              {nfcStatus.isScanning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Сканирование...
                </>
              ) : (
                <>
                  <Nfc className="h-4 w-4 mr-2" />
                  Начать сканирование
                </>
              )}
            </Button>
            
            {nfcStatus.isScanning && (
              <Button onClick={stopNFCScanning} variant="outline">
                Остановить
              </Button>
            )}
          </div>
          
          {recentReadings.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Последние сканирования:</h4>
              {recentReadings.slice(0, 3).map((reading, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div>
                    <p className="font-medium">{reading.sector}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(reading.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge variant="outline">NFC</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Прогресс пользователя */}
      {userProgress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Ваш прогресс
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{userProgress.completedSectors}</p>
                <p className="text-sm text-muted-foreground">Секторов</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">{userProgress.totalPoints}</p>
                <p className="text-sm text-muted-foreground">Очков</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">{userProgress.level}</p>
                <p className="text-sm text-muted-foreground">Уровень</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Прогресс</span>
                <span>{userProgress.completedSectors}/{userProgress.totalSectors}</span>
              </div>
              <Progress 
                value={(userProgress.completedSectors / userProgress.totalSectors) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Настройки разрешений */}
      <Card>
        <CardHeader>
          <CardTitle>Разрешения и настройки</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push уведомления</p>
              <p className="text-sm text-muted-foreground">
                Получать уведомления о достижениях
              </p>
            </div>
            <Button 
              onClick={requestNotificationPermission}
              variant={notificationsEnabled ? "outline" : "default"}
              size="sm"
            >
              {notificationsEnabled ? "Включены" : "Включить"}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Доступ к камере</p>
              <p className="text-sm text-muted-foreground">
                Сканирование QR кодов
              </p>
            </div>
            <Button 
              onClick={requestCameraPermission}
              variant={cameraPermission ? "outline" : "default"}
              size="sm"
            >
              {cameraPermission ? "Разрешена" : "Разрешить"}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Геолокация</p>
              <p className="text-sm text-muted-foreground">
                Определение ближайших секторов
              </p>
            </div>
            <Button 
              onClick={getCurrentLocation}
              variant="outline"
              size="sm"
            >
              Обновить
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileTasteCompass;
