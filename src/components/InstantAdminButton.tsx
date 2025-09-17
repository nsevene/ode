import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function InstantAdminButton() {
  const { setUser, setSession, setRole, setPermissions, user, role } = useAuthStore();

  const handleBecomeAdmin = () => {
    console.log('🚀 Becoming admin instantly...');
    
    // Создаем админа мгновенно
    const adminUser = {
      id: 'instant-admin-' + Date.now(),
      email: 'admin@odefoodhall.com',
      user_metadata: {
        full_name: 'Instant Administrator'
      },
      aud: 'authenticated',
      role: 'authenticated',
      email_confirmed_at: new Date().toISOString(),
      phone_confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString()
    };

    const adminSession = {
      access_token: 'instant-admin-token-' + Date.now(),
      refresh_token: 'instant-admin-refresh-' + Date.now(),
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
      user: adminUser
    };

    // Устанавливаем все данные
    setUser(adminUser as any);
    setSession(adminSession as any);
    setRole('admin');
    setPermissions(['admin:read', 'admin:write', 'admin:delete', 'admin:manage', 'admin:all']);

    // Сохраняем в localStorage для постоянства
    localStorage.setItem('instant-admin', JSON.stringify({
      user: adminUser,
      session: adminSession,
      role: 'admin',
      permissions: ['admin:read', 'admin:write', 'admin:delete', 'admin:manage', 'admin:all'],
      isAuthenticated: true
    }));

    console.log('✅ Admin status set!');
    console.log('👤 User:', adminUser.email);
    console.log('👑 Role:', 'admin');
    
    // Показываем уведомление
    alert('🎉 Вы стали админом! Обновите страницу (F5) и перейдите на /admin');
    
    // Перезагружаем страницу через секунду
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Если уже админ, показываем статус
  if (role === 'admin') {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg flex items-center space-x-2">
          <Crown className="h-4 w-4" />
          <span className="text-sm font-medium">Админ: {user?.email}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.location.href = '/admin'}
            className="ml-2"
          >
            Админ Панель
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={handleBecomeAdmin}
        className="bg-red-600 hover:bg-red-700 text-white shadow-lg"
        size="lg"
      >
        <Crown className="h-5 w-5 mr-2" />
        СТАТЬ АДМИНОМ
      </Button>
    </div>
  );
}
