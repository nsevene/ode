import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, User, Settings, Users, Zap, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function QuickAdmin() {
  const { setUser, setSession, setRole, setPermissions, user, role, isAuthenticated } = useAuthStore();

  const handleBecomeAdmin = () => {
    console.log('🚀 Becoming admin...');
    
    const adminUser = {
      id: 'quick-admin-' + Date.now(),
      email: 'admin@odefoodhall.com',
      user_metadata: {
        full_name: 'Quick Administrator'
      },
      aud: 'authenticated',
      role: 'authenticated',
      email_confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const adminSession = {
      access_token: 'quick-admin-token-' + Date.now(),
      refresh_token: 'quick-admin-refresh-' + Date.now(),
      expires_in: 3600,
      token_type: 'bearer',
      user: adminUser
    };

    setUser(adminUser as any);
    setSession(adminSession as any);
    setRole('admin');
    setPermissions(['admin:read', 'admin:write', 'admin:delete', 'admin:manage', 'admin:all']);

    localStorage.setItem('quick-admin-data', JSON.stringify({
      user: adminUser,
      session: adminSession,
      role: 'admin',
      isAuthenticated: true
    }));

    alert('✅ Вы стали админом!');
  };

  const handleClearAll = () => {
    localStorage.clear();
    setUser(null);
    setSession(null);
    setRole(null);
    setPermissions([]);
    alert('🗑️ Все данные очищены!');
    window.location.reload();
  };

  const handleGoToAdmin = () => {
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Zap className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Быстрый Доступ к Админ Панели
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Мгновенно станьте администратором системы
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Текущий статус */}
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-medium text-blue-900 mb-4">📊 Текущий статус:</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-800 font-medium">Пользователь:</span>
                  <span className="text-blue-700">{user?.email || 'Не авторизован'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800 font-medium">Роль:</span>
                  <span className={`font-mono px-2 py-1 rounded ${role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                    {role || 'Не определена'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800 font-medium">Аутентифицирован:</span>
                  <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                    {isAuthenticated ? '✅ Да' : '❌ Нет'}
                  </span>
                </div>
              </div>
            </div>

            {/* Основные действия */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Button
                onClick={handleBecomeAdmin}
                className="h-20 text-lg bg-red-600 hover:bg-red-700 text-white"
                size="lg"
              >
                <Crown className="h-6 w-6 mr-3" />
                СТАТЬ АДМИНОМ
              </Button>
              
              <Button
                onClick={handleGoToAdmin}
                variant="outline"
                className="h-20 text-lg border-green-600 text-green-600 hover:bg-green-50"
                size="lg"
              >
                <Settings className="h-6 w-6 mr-3" />
                Админ Панель
              </Button>
            </div>

            {/* Дополнительные действия */}
            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={() => window.location.href = '/admin/users'}
                variant="outline"
                className="h-14 text-base"
              >
                <Users className="h-5 w-5 mr-2" />
                Управление Пользователями
              </Button>
              
              <Button
                onClick={() => window.location.href = '/admin/debug'}
                variant="outline"
                className="h-14 text-base"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Отладка Системы
              </Button>
              
              <Button
                onClick={handleClearAll}
                variant="outline"
                className="h-14 text-base text-red-600 border-red-300 hover:bg-red-50"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Очистить Все Данные
              </Button>
            </div>

            {/* Инструкции */}
            <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-medium text-yellow-900 mb-3">📝 Инструкции:</h3>
              <ol className="text-sm text-yellow-800 space-y-2">
                <li><strong>1. Нажмите "СТАТЬ АДМИНОМ"</strong> - мгновенно получите права администратора</li>
                <li><strong>2. Нажмите "Админ Панель"</strong> - перейдите в панель управления</li>
                <li><strong>3. Используйте другие кнопки</strong> - для доступа к функциям</li>
                <li><strong>4. "Очистить Все Данные"</strong> - если нужно начать заново</li>
              </ol>
            </div>

            {/* Быстрые ссылки */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">🔗 Быстрые ссылки:</h3>
              <div className="text-xs text-gray-700 space-y-1">
                <p>• <a href="/admin" className="text-blue-600 hover:underline">Админ панель</a></p>
                <p>• <a href="/admin/users" className="text-blue-600 hover:underline">Управление пользователями</a></p>
                <p>• <a href="/admin/debug" className="text-blue-600 hover:underline">Отладка</a></p>
                <p>• <a href="/admin/credentials" className="text-blue-600 hover:underline">Готовые данные</a></p>
                <p>• <a href="/" className="text-blue-600 hover:underline">Главная страница</a></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
