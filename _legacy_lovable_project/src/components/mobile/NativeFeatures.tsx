import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  Share2,
  Vibrate,
  MapPin,
  Phone,
  Battery,
  Wifi,
  Smartphone,
  Bell,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const NativeFeatures = () => {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [networkStatus, setNetworkStatus] = useState<string>('unknown');
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get device info
    const getDeviceInfo = async () => {
      try {
        // Check if Capacitor is available
        if (typeof window !== 'undefined' && (window as any).Capacitor) {
          const { Device } = await import('@capacitor/device');
          const info = await Device.getInfo();
          setDeviceInfo(info);
        }
      } catch (error) {
        console.log('Capacitor not available in web mode');
      }
    };

    // Get network status
    const getNetworkStatus = async () => {
      try {
        if (typeof window !== 'undefined' && (window as any).Capacitor) {
          const { Network } = await import('@capacitor/network');
          const status = await Network.getStatus();
          setNetworkStatus(status.connected ? 'connected' : 'disconnected');
        }
      } catch (error) {
        console.log('Network API not available');
      }
    };

    // Get battery info
    const getBatteryInfo = async () => {
      try {
        if ('getBattery' in navigator) {
          const battery = await (navigator as any).getBattery();
          setBatteryLevel(Math.round(battery.level * 100));
        }
      } catch (error) {
        console.log('Battery API not available');
      }
    };

    getDeviceInfo();
    getNetworkStatus();
    getBatteryInfo();
  }, []);

  const takePhoto = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        const { Camera, CameraResultType } = await import('@capacitor/camera');
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.Uri,
        });

        toast({
          title: 'Фото сделано!',
          description: 'Фотография успешно получена с камеры',
        });
      } else if (
        navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia
      ) {
        // Веб-версия: используем getUserMedia для доступа к камере
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }, // Задняя камера по умолчанию
            audio: false,
          });

          // Создаем элемент video для превью
          const video = document.createElement('video');
          video.srcObject = stream;
          video.autoplay = true;
          video.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            max-width: 90vw;
            max-height: 90vh;
            border-radius: 12px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          `;

          // Создаем overlay
          const overlay = document.createElement('div');
          overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9998;
            display: flex;
            align-items: center;
            justify-content: center;
          `;

          // Создаем кнопки
          const buttonContainer = document.createElement('div');
          buttonContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10000;
            display: flex;
            gap: 10px;
          `;

          const captureBtn = document.createElement('button');
          captureBtn.textContent = '📸 Сделать фото';
          captureBtn.style.cssText = `
            background: #ffffff;
            color: #000000;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          `;

          const closeBtn = document.createElement('button');
          closeBtn.textContent = '❌ Закрыть';
          closeBtn.style.cssText = `
            background: rgba(255, 255, 255, 0.2);
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            backdrop-filter: blur(10px);
          `;

          const cleanup = () => {
            stream.getTracks().forEach((track) => track.stop());
            overlay?.parentNode && overlay.parentNode.removeChild(overlay);
            video?.parentNode && video.parentNode.removeChild(video);
            buttonContainer?.parentNode &&
              buttonContainer.parentNode.removeChild(buttonContainer);
          };

          captureBtn.onclick = () => {
            // Создаем canvas для захвата фото
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0);

            // Конвертируем в blob и скачиваем
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `ode-photo-${Date.now()}.jpg`;
                  a.click();
                  URL.revokeObjectURL(url);
                }
              },
              'image/jpeg',
              0.8
            );

            cleanup();

            toast({
              title: 'Фото сделано! 📸',
              description: 'Фотография сохранена в загрузки',
            });
          };

          closeBtn.onclick = cleanup;

          buttonContainer.appendChild(captureBtn);
          buttonContainer.appendChild(closeBtn);

          document.body.appendChild(overlay);
          document.body.appendChild(video);
          document.body.appendChild(buttonContainer);
        } catch (mediaError) {
          toast({
            title: 'Доступ к камере запрещен',
            description: 'Разрешите доступ к камере в настройках браузера',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Камера недоступна',
          description: 'Ваш браузер не поддерживает доступ к камере',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: 'Ошибка камеры',
        description: 'Не удалось получить доступ к камере',
        variant: 'destructive',
      });
    }
  };

  const shareContent = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        const { Share } = await import('@capacitor/share');
        await Share.share({
          title: 'ODE Ubud Food Hall',
          text: 'Visit ODE Ubud - the best food hall in Bali!',
          url: 'https://ode-ubud.com',
          dialogTitle: 'Share ODE Ubud',
        });
      } else if (navigator.share) {
        await navigator.share({
          title: 'ODE Ubud Food Hall',
          text: 'Visit ODE Ubud - the best food hall in Bali!',
          url: window.location.href,
        });
      } else {
        toast({
          title: 'Поделиться недоступно',
          description: 'Функция не поддерживается на этом устройстве',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.log('Share cancelled or failed');
    }
  };

  const vibrateDevice = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
        await Haptics.impact({ style: ImpactStyle.Medium });
        toast({
          title: 'Вибрация! 📳',
          description: 'Устройство завибрировало',
        });
      } else if ('vibrate' in navigator) {
        // Веб-версия: используем Vibration API
        const pattern = [200, 100, 200]; // Вибрация-пауза-вибрация
        const success = navigator.vibrate(pattern);
        if (success) {
          toast({
            title: 'Вибрация! 📳',
            description: 'Устройство завибрировало',
          });
        } else {
          toast({
            title: 'Вибрация недоступна',
            description: 'Функция не поддерживается на этом устройстве',
            variant: 'destructive',
          });
        }
      } else {
        // Fallback: визуальная вибрация
        const button = document.activeElement as HTMLElement;
        if (button) {
          button.style.animation = 'none';
          button.offsetHeight; // Trigger reflow
          button.style.animation = 'shake 0.5s ease-in-out';

          // Добавляем CSS для анимации если его нет
          if (!document.getElementById('shake-animation')) {
            const style = document.createElement('style');
            style.id = 'shake-animation';
            style.textContent = `
              @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
              }
            `;
            document.head.appendChild(style);
          }
        }

        toast({
          title: 'Визуальная вибрация! 🎯',
          description: 'Вибрация симулирована визуально',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка вибрации',
        description: 'Не удалось запустить вибрацию',
        variant: 'destructive',
      });
    }
  };

  const getLocation = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        const { Geolocation } = await import('@capacitor/geolocation');
        const coordinates = await Geolocation.getCurrentPosition();
        toast({
          title: 'Местоположение получено!',
          description: `Lat: ${coordinates.coords.latitude.toFixed(4)}, Lng: ${coordinates.coords.longitude.toFixed(4)}`,
        });
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          toast({
            title: 'Местоположение получено!',
            description: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`,
          });
        });
      } else {
        toast({
          title: 'Геолокация недоступна',
          description: 'Функция не поддерживается на этом устройстве',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка геолокации',
        description: 'Не удалось получить местоположение',
        variant: 'destructive',
      });
    }
  };

  const makeCall = async () => {
    try {
      const phoneNumber = '+6281943286395'; // ODE реальный номер
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        const { Browser } = await import('@capacitor/browser');
        await Browser.open({ url: `tel:${phoneNumber}` });
      } else {
        window.location.href = `tel:${phoneNumber}`;
      }
    } catch (error) {
      toast({
        title: 'Ошибка звонка',
        description: 'Не удалось инициировать звонок',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Информация об устройстве
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {deviceInfo && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium">Платформа:</span>
                <Badge variant="secondary" className="ml-2">
                  {deviceInfo.platform}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Модель:</span>
                <span className="ml-2">{deviceInfo.model}</span>
              </div>
              <div>
                <span className="font-medium">ОС:</span>
                <span className="ml-2">
                  {deviceInfo.operatingSystem} {deviceInfo.osVersion}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4" />
                <Badge
                  variant={
                    networkStatus === 'connected' ? 'default' : 'destructive'
                  }
                >
                  {networkStatus === 'connected' ? 'Онлайн' : 'Оффлайн'}
                </Badge>
              </div>
            </div>
          )}

          {batteryLevel !== null && (
            <div className="flex items-center gap-2">
              <Battery className="h-4 w-4" />
              <span className="text-sm">Батарея: {batteryLevel}%</span>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${batteryLevel}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Нативные функции</CardTitle>
          <CardDescription>
            Используйте возможности вашего устройства
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={takePhoto}
              variant="outline"
              className="flex flex-col gap-2 h-auto py-4"
            >
              <Camera className="h-6 w-6" />
              <span className="text-sm">Камера</span>
            </Button>

            <Button
              onClick={shareContent}
              variant="outline"
              className="flex flex-col gap-2 h-auto py-4"
            >
              <Share2 className="h-6 w-6" />
              <span className="text-sm">Поделиться</span>
            </Button>

            <Button
              onClick={vibrateDevice}
              variant="outline"
              className="flex flex-col gap-2 h-auto py-4"
            >
              <Vibrate className="h-6 w-6" />
              <span className="text-sm">Вибрация</span>
            </Button>

            <Button
              onClick={getLocation}
              variant="outline"
              className="flex flex-col gap-2 h-auto py-4"
            >
              <MapPin className="h-6 w-6" />
              <span className="text-sm">Геолокация</span>
            </Button>

            <Button
              onClick={makeCall}
              variant="outline"
              className="flex flex-col gap-2 h-auto py-4 col-span-2"
            >
              <Phone className="h-6 w-6" />
              <span className="text-sm">Позвонить в ODE Ubud</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
