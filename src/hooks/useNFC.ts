import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';

// NFC Plugin для Capacitor
interface NFCPlugin {
  isSupported(): Promise<{ isSupported: boolean }>;
  checkPermissions(): Promise<{ nfc: string }>;
  requestPermissions(): Promise<{ nfc: string }>;
  startScan(): Promise<void>;
  stopScan(): Promise<void>;
  write(options: { message: string }): Promise<void>;
  addListener(eventName: 'nfcTagScanned', listenerFunc: (data: any) => void): void;
  removeAllListeners(): Promise<void>;
}

// Web NFC API типы (для браузера)
interface NDEFMessage {
  records: NDEFRecord[];
}

interface NDEFRecord {
  recordType: string;
  data: any;
}

interface NFCReading extends Event {
  message: NDEFMessage;
  serialNumber?: string;
}

declare global {
  interface Window {
    NDEFReader?: any;
  }
}

export const useNFC = () => {
  const [nfcSupported, setNfcSupported] = useState(false);
  const [passportData, setPassportData] = useState<any>(null);
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reader, setReader] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkNFCSupport = async () => {
      if (Capacitor.isNativePlatform()) {
        // Для мобильных платформ проверяем поддержку NFC
        setNfcSupported(true);
        console.log('Native platform detected - NFC should be available');
      } else {
        // Для веб используем Web NFC API
        if ('NDEFReader' in window) {
          setNfcSupported(true);
          console.log('Web NFC API detected');
        } else {
          setNfcSupported(false);
          console.log('NFC not supported - using fallback mode');
        }
      }
    };

    checkNFCSupport();
    
    // Cleanup на размонтировании
    return () => {
      if (reader) {
        reader.removeEventListener?.('reading', handleNFCRead);
        reader.removeEventListener?.('readingerror', handleNFCError);
      }
    };
  }, []);

  const handleNFCRead = (event: any) => {
    const { message, serialNumber } = event;
    console.log('NFC Tag detected:', serialNumber);
    
    let sectorData = null;
    
    // Извлекаем данные из NFC сообщения
    if (message && message.records) {
      for (const record of message.records) {
        if (record.recordType === 'text') {
          try {
            const decoder = new TextDecoder();
            const text = decoder.decode(record.data);
            
            // Парсим JSON данные из NFC метки
            if (text.startsWith('{')) {
              sectorData = JSON.parse(text);
            } else if (text.includes('sector:')) {
              sectorData = {
                type: 'taste_sector',
                sector: text.split('sector:')[1],
                id: serialNumber
              };
            }
          } catch (e) {
            console.error('Error parsing NFC data:', e);
          }
        }
      }
    }

    const nfcData = sectorData || {
      type: 'taste_passport',
      id: serialNumber || 'demo_passport_' + Date.now(),
      points: Math.floor(Math.random() * 200) + 50,
      sectors_visited: ['ferment', 'smoke', 'spice'].slice(0, Math.floor(Math.random() * 3) + 1),
      created_at: new Date().toISOString()
    };

    setPassportData(nfcData);
    setIsReading(false);
    
    // Отправляем глобальное событие для других компонентов
    window.dispatchEvent(new CustomEvent('nfcRead', { detail: nfcData }));
    
    toast({
      title: "NFC метка обнаружена!",
      description: `Тип: ${nfcData.type} | ID: ${nfcData.id}`,
    });
  };

  const handleNFCError = () => {
    setError('Ошибка чтения NFC метки');
    setIsReading(false);
    toast({
      title: "Ошибка NFC",
      description: "Попробуйте еще раз или используйте QR-код",
      variant: "destructive",
    });
  };

  const startReading = async () => {
    if (!nfcSupported) {
      const message = 'NFC не поддерживается на этом устройстве. Используйте QR-код для навигации.';
      setError(message);
      
      toast({
        title: "NFC недоступен",
        description: message,
        variant: "destructive",
      });
      return false;
    }

    setIsReading(true);
    setError(null);

    try {
      if (Capacitor.isNativePlatform()) {
        // Для мобильной версии - реальная NFC функциональность
        // Пока используем демо, но готово для интеграции с NFC плагином
        setTimeout(() => {
          const demoData = {
            type: 'taste_passport',
            id: 'mobile_passport_' + Date.now(),
            points: Math.floor(Math.random() * 300) + 100,
            sectors_visited: ['ferment', 'smoke', 'spice', 'sweet'].slice(0, Math.floor(Math.random() * 4) + 1),
            created_at: new Date().toISOString()
          };
          
          setPassportData(demoData);
          setIsReading(false);
          
          window.dispatchEvent(new CustomEvent('nfcRead', { detail: demoData }));
          
          toast({
            title: "NFC метка обнаружена! (Демо)",
            description: `Паспорт: ${demoData.id}`,
          });
        }, 2000);
        
      } else {
        // Web NFC API для браузера
        if ('NDEFReader' in window) {
          const ndef = new window.NDEFReader();
          setReader(ndef);
          
          // Запрашиваем разрешение и начинаем сканирование
          await ndef.scan();
          
          ndef.addEventListener('reading', handleNFCRead);
          ndef.addEventListener('readingerror', handleNFCError);
          
          toast({
            title: "NFC активирован",
            description: "Приложите NFC-метку к устройству",
          });
          
        } else {
          // Демо для браузеров без NFC
          setTimeout(() => {
            const demoData = {
              type: 'taste_passport',
              id: 'web_demo_' + Date.now(),
              points: Math.floor(Math.random() * 200) + 75,
              sectors_visited: ['spice', 'ferment'].slice(0, Math.floor(Math.random() * 2) + 1),
              created_at: new Date().toISOString()
            };
            
            setPassportData(demoData);
            setIsReading(false);
            
            window.dispatchEvent(new CustomEvent('nfcRead', { detail: demoData }));
            
            toast({
              title: "Демо NFC метка обнаружена!",
              description: `Паспорт: ${demoData.id}`,
            });
          }, 1500);
        }
      }
      
      return true;
      
    } catch (err: any) {
      const errorMessage = err.name === 'NotAllowedError' 
        ? 'NFC доступ запрещен. Разрешите доступ в настройках браузера.'
        : 'Ошибка при запуске сканирования NFC';
        
      setError(errorMessage);
      setIsReading(false);
      
      toast({
        title: "Ошибка NFC",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.error('NFC scanning error:', err);
      return false;
    }
  };

  const stopReading = async () => {
    if (reader) {
      reader.removeEventListener?.('reading', handleNFCRead);
      reader.removeEventListener?.('readingerror', handleNFCError);
      setReader(null);
    }
    setIsReading(false);
  };

  const writeNFC = async (message: string) => {
    if (!nfcSupported) {
      const errorMsg = 'NFC не поддерживается на этом устройстве';
      setError(errorMsg);
      toast({
        title: "Ошибка записи",
        description: errorMsg,
        variant: "destructive",
      });
      return false;
    }

    try {
      if (Capacitor.isNativePlatform()) {
        // Для мобильной версии
        setTimeout(() => {
          toast({
            title: "NFC Passport записан",
            description: "Метка успешно записана (демо режим)",
          });
        }, 1000);
        return true;
        
      } else {
        if ('NDEFReader' in window) {
          const ndef = new window.NDEFReader();
          
          await ndef.write({
            records: [{
              recordType: 'text',
              data: message
            }]
          });
          
          toast({
            title: "NFC метка записана",
            description: "Данные успешно записаны на метку",
          });
          
          return true;
        } else {
          // Демо для браузеров без NFC
          setTimeout(() => {
            toast({
              title: "NFC Passport создан (демо)",
              description: "Метка создана в демо режиме",
            });
          }, 1000);
          return true;
        }
      }
    } catch (err: any) {
      const errorMsg = 'Ошибка записи NFC метки';
      setError(errorMsg);
      
      toast({
        title: "Ошибка записи",
        description: err.message || errorMsg,
        variant: "destructive",
      });
      
      console.error('NFC write error:', err);
      return false;
    }
  };

  return { 
    nfcSupported, 
    passportData, 
    isReading,
    error,
    startReading,
    stopReading,
    writeNFC,
    clearError: () => setError(null),
    clearPassportData: () => setPassportData(null)
  };
};