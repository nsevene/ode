import { useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthSecurity = () => {
  const { user, session, signOut } = useAuth();

  // Проверка истечения сессии
  const isSessionExpired = useCallback(() => {
    if (!session?.expires_at) return false;
    return Date.now() >= session.expires_at * 1000;
  }, [session]);

  // Автообновление сессии перед истечением
  const refreshSessionIfNeeded = useCallback(async () => {
    if (!session) return;
    
    const expiresAt = session.expires_at;
    if (!expiresAt) return;

    // Обновляем за 5 минут до истечения
    const refreshThreshold = expiresAt - 300; // 5 минут в секундах
    const currentTime = Math.floor(Date.now() / 1000);

    if (currentTime >= refreshThreshold) {
      try {
        console.log('🔄 Обновление сессии...');
        const { error } = await supabase.auth.refreshSession();
        if (error) {
          console.error('❌ Ошибка обновления сессии:', error);
          toast.error('Сессия истекла. Войдите в систему заново');
          await signOut();
        } else {
          console.log('✅ Сессия обновлена успешно');
          toast.success('Сессия обновлена');
        }
      } catch (error) {
        console.error('💥 Критическая ошибка обновления сессии:', error);
        toast.error('Критическая ошибка. Выход из системы...');
        await signOut();
      }
    }
  }, [session, signOut]);

  // Проверка истечения сессии каждую минуту
  useEffect(() => {
    if (!user || !session) return;

    const interval = setInterval(() => {
      if (isSessionExpired()) {
        console.warn('⚠️ Сессия истекла');
        toast.warning('Сессия истекла. Войдите заново');
        signOut();
        return;
      }

      refreshSessionIfNeeded();
    }, 60000); // Проверяем каждую минуту

    return () => clearInterval(interval);
  }, [user, session, isSessionExpired, refreshSessionIfNeeded, signOut]);

  // Валидация ролевых разрешений
  const validateUserRole = useCallback(async (requiredRole: string = 'user') => {
    if (!user) {
      console.warn('🚫 Пользователь не аутентифицирован');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        console.error('❌ Ошибка валидации роли:', error);
        toast.error('Ошибка проверки прав доступа');
        return false;
      }

      // Проверяем иерархию ролей
      const roleHierarchy = { 'user': 0, 'moderator': 1, 'admin': 2 };
      const userRoleLevel = roleHierarchy[data.role as keyof typeof roleHierarchy] ?? -1;
      const requiredRoleLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] ?? 999;

      const hasAccess = userRoleLevel >= requiredRoleLevel;
      
      if (!hasAccess) {
        console.warn(`🚫 Недостаточно прав: требуется ${requiredRole}, имеется ${data.role}`);
        toast.error('Недостаточно прав для выполнения действия');
      }

      return hasAccess;
    } catch (error) {
      console.error('💥 Критическая ошибка валидации роли:', error);
      toast.error('Критическая ошибка проверки прав');
      return false;
    }
  }, [user]);

  return {
    isSessionExpired,
    refreshSessionIfNeeded,
    validateUserRole,
    isAuthenticated: !!user && !!session && !isSessionExpired()
  };
};