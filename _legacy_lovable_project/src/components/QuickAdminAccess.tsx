import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Crown, UserPlus, Settings, Users } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function QuickAdminAccess() {
  const { setUser, setSession, setRole, setPermissions } = useAuthStore();

  const handleCreateTestAdmin = () => {
    window.location.href = '/admin/create-test';
  };

  const handleLoginAsAdmin = () => {
    // Принудительно устанавливаем админа
    const authData = {
      user: {
        id: 'test-admin',
        email: 'just0aguest@gmail.com',
        user_metadata: {
          full_name: 'Test Admin',
        },
      },
      session: {
        access_token: 'test-token',
        refresh_token: 'test-refresh',
      },
      role: 'admin',
      permissions: ['admin:read', 'admin:write', 'admin:delete'],
      isAuthenticated: true,
    };

    localStorage.setItem('auth-store', JSON.stringify(authData));

    // Обновляем Zustand store
    setUser(authData.user);
    setSession(authData.session);
    setRole('admin');
    setPermissions(authData.permissions);

    window.location.href = '/admin';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <Crown className="h-6 w-6 text-red-600" />
        </div>
        <CardTitle className="text-xl font-bold text-gray-900">
          Быстрый Доступ к Админ Панели
        </CardTitle>
        <CardDescription className="text-gray-600">
          Создайте тестового администратора или войдите как админ
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Button
            onClick={handleCreateTestAdmin}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Создать Тестового Админа
          </Button>

          <Button
            onClick={handleLoginAsAdmin}
            variant="outline"
            className="w-full"
          >
            <Crown className="h-4 w-4 mr-2" />
            Войти как Админ
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button
            onClick={() => (window.location.href = '/admin')}
            variant="outline"
            className="w-full"
          >
            <Settings className="h-4 w-4 mr-2" />
            Админ Панель
          </Button>

          <Button
            onClick={() => (window.location.href = '/admin/users')}
            variant="outline"
            className="w-full"
          >
            <Users className="h-4 w-4 mr-2" />
            Управление Пользователями
          </Button>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800 text-center">
            💡 <strong>Совет:</strong> Используйте "Войти как Админ" для
            быстрого доступа
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
