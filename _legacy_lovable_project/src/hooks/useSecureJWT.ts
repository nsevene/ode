import { useState, useCallback } from 'react';
import { signDeepLink, verifyDeepLink } from '@/lib/jwt';
import { toast } from 'sonner';

interface JWTPayload {
  zone?: string;
  guest_id?: string;
  source?: string;
  exp?: number;
  iat?: number;
}

export const useSecureJWT = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signToken = useCallback(async (payload: Record<string, any>) => {
    setIsLoading(true);
    try {
      const token = await signDeepLink(payload);
      console.log('🔐 Токен успешно подписан');
      toast.success('Защищенный токен создан');
      return token;
    } catch (error) {
      console.error('❌ Ошибка подписи токена:', error);
      toast.error('Не удалось создать токен доступа');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = useCallback(async (token: string) => {
    setIsLoading(true);
    try {
      const result = await verifyDeepLink(token);

      // Проверяем истечение токена
      const payload = result.payload as JWTPayload;
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        toast.error('Срок действия токена истек');
        throw new Error('Токен истек');
      }

      console.log('✅ Токен успешно проверен');
      toast.success('Токен действителен');
      return result;
    } catch (error) {
      console.error('❌ Ошибка верификации токена:', error);
      toast.error('Токен недействителен или поврежден');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isTokenExpired = useCallback((token: string): boolean => {
    try {
      // Базовое декодирование JWT для проверки истечения без верификации
      const parts = token.split('.');
      if (parts.length !== 3) return true;

      const payload = JSON.parse(atob(parts[1])) as JWTPayload;
      return payload.exp ? Date.now() >= payload.exp * 1000 : false;
    } catch {
      return true; // Если не можем декодировать, считаем истекшим
    }
  }, []);

  return {
    signToken,
    verifyToken,
    isTokenExpired,
    isLoading,
  };
};
