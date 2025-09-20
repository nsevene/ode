import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface NFCSector {
  id: string;
  name: string;
  description: string;
  nfcTag: string;
  isActive: boolean;
  visitCount: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface NFCReading {
  serialNumber?: string;
  message?: any;
  sector?: string;
  timestamp: string;
}

interface NFCStatus {
  isSupported: boolean;
  isEnabled: boolean;
  isScanning: boolean;
  error: string | null;
}

export const useNFCEnhanced = () => {
  const [nfcStatus, setNfcStatus] = useState<NFCStatus>({
    isSupported: false,
    isEnabled: false,
    isScanning: false,
    error: null,
  });

  const [passportData, setPassportData] = useState<any>(null);
  const [recentReadings, setRecentReadings] = useState<NFCReading[]>([]);
  const [sectors, setSectors] = useState<NFCSector[]>([]);
  const [userProgress, setUserProgress] = useState<any>(null);

  const { toast } = useToast();
  const { user } = useAuth();

  // Проверка поддержки NFC
  const checkNFCSupport = useCallback(async () => {
    try {
      // Проверяем поддержку Web NFC API
      if ('NDEFReader' in window) {
        setNfcStatus((prev) => ({ ...prev, isSupported: true }));

        // Пытаемся инициализировать NFC
        const ndef = new (window as any).NDEFReader();
        await ndef.scan();
        setNfcStatus((prev) => ({ ...prev, isEnabled: true }));

        return true;
      } else {
        setNfcStatus((prev) => ({
          ...prev,
          isSupported: false,
          error: 'NFC не поддерживается в этом браузере',
        }));
        return false;
      }
    } catch (error: any) {
      setNfcStatus((prev) => ({
        ...prev,
        isEnabled: false,
        error: `Ошибка инициализации NFC: ${error.message}`,
      }));
      return false;
    }
  }, []);

  // Загрузка секторов из базы данных
  const loadSectors = useCallback(async () => {
    try {
      // Здесь будет реальный API вызов
      const mockSectors: NFCSector[] = [
        {
          id: '1',
          name: 'Spicy Asia',
          description: 'Thai & Vietnamese flavors',
          nfcTag: 'spicy-asia-001',
          isActive: true,
          visitCount: 0,
          coordinates: { lat: 55.7558, lng: 37.6176 },
        },
        {
          id: '2',
          name: 'Wild Bali',
          description: 'Authentic Balinese cuisine',
          nfcTag: 'wild-bali-002',
          isActive: true,
          visitCount: 0,
          coordinates: { lat: 55.7558, lng: 37.6176 },
        },
        {
          id: '3',
          name: 'Dolce Italia',
          description: 'Sicilian & Tuscan specialties',
          nfcTag: 'dolce-italia-003',
          isActive: true,
          visitCount: 0,
          coordinates: { lat: 55.7558, lng: 37.6176 },
        },
        {
          id: '4',
          name: 'Fresh Nordic',
          description: 'Scandinavian flavors',
          nfcTag: 'fresh-nordic-004',
          isActive: true,
          visitCount: 0,
          coordinates: { lat: 55.7558, lng: 37.6176 },
        },
      ];

      setSectors(mockSectors);
    } catch (error) {
      console.error('Error loading sectors:', error);
    }
  }, []);

  // Загрузка прогресса пользователя
  const loadUserProgress = useCallback(async () => {
    if (!user) return;

    try {
      // Здесь будет реальный API вызов
      const mockProgress = {
        userId: user.id,
        totalSectors: 8,
        completedSectors: 3,
        totalPoints: 450,
        level: 2,
        achievements: [
          {
            id: '1',
            name: 'First Visit',
            description: 'Посетили первый сектор',
            unlocked: true,
          },
          {
            id: '2',
            name: 'Spice Master',
            description: 'Завершили Spicy Asia',
            unlocked: true,
          },
        ],
      };

      setUserProgress(mockProgress);
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  }, [user]);

  // Обработка NFC чтения
  const handleNFCRead = useCallback(
    (event: any) => {
      const { message, serialNumber } = event;
      const timestamp = new Date().toISOString();

      console.log('NFC Tag detected:', serialNumber);

      let sectorData = null;
      let sectorName = 'Unknown Sector';

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
                sectorName = sectorData.sector || 'Unknown';
              } else if (text.includes('sector:')) {
                sectorName = text.split('sector:')[1];
                sectorData = {
                  type: 'taste_sector',
                  sector: sectorName,
                  id: serialNumber,
                };
              }
            } catch (e) {
              console.error('Error parsing NFC data:', e);
            }
          }
        }
      }

      const nfcReading: NFCReading = {
        serialNumber,
        message: sectorData,
        sector: sectorName,
        timestamp,
      };

      // Добавляем в историю чтений
      setRecentReadings((prev) => [nfcReading, ...prev.slice(0, 9)]);

      // Обновляем прогресс пользователя
      if (user) {
        updateUserProgress(sectorName, sectorData);
      }

      // Показываем уведомление
      toast({
        title: '🎯 NFC метка обнаружена!',
        description: `Сектор: ${sectorName}`,
      });
    },
    [user, toast]
  );

  // Обновление прогресса пользователя
  const updateUserProgress = useCallback(
    async (sectorName: string, sectorData: any) => {
      if (!user) return;

      try {
        // Здесь будет реальный API вызов для обновления прогресса
        console.log('Updating user progress for sector:', sectorName);

        // Обновляем локальное состояние
        setUserProgress((prev) => {
          if (!prev) return prev;

          const newProgress = { ...prev };
          newProgress.completedSectors = Math.min(
            newProgress.completedSectors + 1,
            newProgress.totalSectors
          );
          newProgress.totalPoints += 50; // Бонус за посещение сектора

          return newProgress;
        });

        // Проверяем достижения
        checkAchievements(sectorName);
      } catch (error) {
        console.error('Error updating user progress:', error);
      }
    },
    [user]
  );

  // Проверка достижений
  const checkAchievements = useCallback(
    async (sectorName: string) => {
      if (!user) return;

      try {
        // Здесь будет реальная логика проверки достижений
        const newAchievements = [];

        // Проверяем различные условия для достижений
        if (userProgress?.completedSectors === 1) {
          newAchievements.push({
            id: 'first_sector',
            name: 'First Steps',
            description: 'Посетили первый сектор Taste Compass',
          });
        }

        if (userProgress?.completedSectors === 8) {
          newAchievements.push({
            id: 'compass_master',
            name: 'Compass Master',
            description: 'Завершили все секторы Taste Compass!',
          });
        }

        if (newAchievements.length > 0) {
          // Показываем уведомления о новых достижениях
          newAchievements.forEach((achievement) => {
            toast({
              title: '🏆 Новое достижение!',
              description: achievement.description,
            });
          });
        }
      } catch (error) {
        console.error('Error checking achievements:', error);
      }
    },
    [user, userProgress, toast]
  );

  // Начало сканирования NFC
  const startNFCScanning = useCallback(async () => {
    if (!nfcStatus.isSupported) {
      toast({
        title: 'NFC не поддерживается',
        description: 'Ваше устройство не поддерживает NFC',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const ndef = new (window as any).NDEFReader();

      // Добавляем обработчики событий
      ndef.addEventListener('reading', handleNFCRead);
      ndef.addEventListener('readingerror', (event: any) => {
        console.error('NFC reading error:', event);
        setNfcStatus((prev) => ({ ...prev, error: 'Ошибка чтения NFC' }));
      });

      // Начинаем сканирование
      await ndef.scan();
      setNfcStatus((prev) => ({ ...prev, isScanning: true, error: null }));

      toast({
        title: 'NFC сканирование запущено',
        description: 'Поднесите устройство к NFC метке',
      });

      return true;
    } catch (error: any) {
      setNfcStatus((prev) => ({
        ...prev,
        isScanning: false,
        error: `Ошибка запуска NFC: ${error.message}`,
      }));

      toast({
        title: 'Ошибка NFC',
        description: error.message,
        variant: 'destructive',
      });

      return false;
    }
  }, [nfcStatus.isSupported, handleNFCRead, toast]);

  // Остановка сканирования NFC
  const stopNFCScanning = useCallback(() => {
    setNfcStatus((prev) => ({ ...prev, isScanning: false }));

    toast({
      title: 'NFC сканирование остановлено',
      description: 'Сканирование NFC меток приостановлено',
    });
  }, [toast]);

  // Запись данных в NFC метку
  const writeNFC = useCallback(
    async (data: any) => {
      if (!nfcStatus.isSupported) {
        toast({
          title: 'NFC не поддерживается',
          description: 'Ваше устройство не поддерживает запись NFC',
          variant: 'destructive',
        });
        return false;
      }

      try {
        const ndef = new (window as any).NDEFReader();
        const message = {
          records: [
            {
              recordType: 'text',
              data: JSON.stringify(data),
            },
          ],
        };

        await ndef.write(message);

        toast({
          title: 'NFC запись успешна',
          description: 'Данные записаны в NFC метку',
        });

        return true;
      } catch (error: any) {
        toast({
          title: 'Ошибка записи NFC',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }
    },
    [nfcStatus.isSupported, toast]
  );

  // Инициализация при монтировании
  useEffect(() => {
    checkNFCSupport();
    loadSectors();
    loadUserProgress();
  }, [checkNFCSupport, loadSectors, loadUserProgress]);

  return {
    // Статус NFC
    nfcStatus,

    // Данные
    passportData,
    recentReadings,
    sectors,
    userProgress,

    // Методы
    startNFCScanning,
    stopNFCScanning,
    writeNFC,
    loadUserProgress,

    // Утилиты
    checkNFCSupport,
  };
};
