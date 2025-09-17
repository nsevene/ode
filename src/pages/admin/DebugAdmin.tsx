import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Bug, Crown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function DebugAdmin() {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const { setUser, setSession, setRole, setPermissions, user, role, isAuthenticated } = useAuthStore();

  const handleCreateAdmin = () => {
    try {
      setDebugInfo('Начинаем создание админа...\n');
      
      // Создаем тестового админа
      const testAdmin = {
        id: 'test-admin-' + Date.now(),
        email: 'just0aguest@gmail.com',
        full_name: 'Test Admin',
        phone: '+62-XXX-XXXX-XXXX',
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setDebugInfo(prev => prev + 'Тестовый админ создан: ' + JSON.stringify(testAdmin, null, 2) + '\n');

      // Создаем authData
      const authData = {
        user: {
          id: testAdmin.id,
          email: testAdmin.email,
          user_metadata: {
            full_name: testAdmin.full_name
          }
        },
        session: {
          access_token: 'test-token-' + Date.now(),
          refresh_token: 'test-refresh-' + Date.now()
        },
        role: 'admin',
        permissions: ['admin:read', 'admin:write', 'admin:delete'],
        isAuthenticated: true
      };

      setDebugInfo(prev => prev + 'AuthData создан: ' + JSON.stringify(authData, null, 2) + '\n');

      // Сохраняем в localStorage
      localStorage.setItem('test-admin', JSON.stringify(testAdmin));
      localStorage.setItem('auth-store', JSON.stringify(authData));
      
      setDebugInfo(prev => prev + 'Данные сохранены в localStorage\n');

      // Обновляем Zustand store
      setUser(authData.user);
      setSession(authData.session);
      setRole('admin');
      setPermissions(authData.permissions);
      
      setDebugInfo(prev => prev + 'Zustand store обновлен\n');

      // Проверяем результат
      const currentUser = useAuthStore.getState().user;
      const currentRole = useAuthStore.getState().role;
      const currentAuth = useAuthStore.getState().isAuthenticated;
      
      setDebugInfo(prev => prev + `Текущий пользователь: ${JSON.stringify(currentUser)}\n`);
      setDebugInfo(prev => prev + `Текущая роль: ${currentRole}\n`);
      setDebugInfo(prev => prev + `Аутентифицирован: ${currentAuth}\n`);

      setResult({
        success: true,
        message: 'Админ создан успешно! Проверьте отладочную информацию.'
      });

    } catch (error) {
      console.error('Error creating admin:', error);
      setDebugInfo(prev => prev + `Ошибка: ${error}\n`);
      setResult({
        success: false,
        message: 'Ошибка при создании админа: ' + error
      });
    }
  };

  const handleCheckStatus = () => {
    const currentUser = useAuthStore.getState().user;
    const currentRole = useAuthStore.getState().role;
    const currentAuth = useAuthStore.getState().isAuthenticated;
    const localStorageData = localStorage.getItem('auth-store');
    
    setDebugInfo(`Текущий статус:
Пользователь: ${JSON.stringify(currentUser)}
Роль: ${currentRole}
Аутентифицирован: ${currentAuth}
localStorage: ${localStorageData}
`);
  };

  const handleClearAll = () => {
    localStorage.clear();
    setUser(null);
    setSession(null);
    setRole(null);
    setPermissions([]);
    setDebugInfo('Все данные очищены\n');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Bug className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Отладка Создания Админа
            </CardTitle>
            <CardDescription className="text-gray-600">
              Создайте админа с подробной отладочной информацией
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Button
                onClick={handleCreateAdmin}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Crown className="h-4 w-4 mr-2" />
                Создать Админа
              </Button>
              
              <Button
                onClick={handleCheckStatus}
                variant="outline"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Проверить Статус
              </Button>
              
              <Button
                onClick={handleClearAll}
                variant="outline"
                className="text-red-600 hover:text-red-700"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Очистить Все
              </Button>
            </div>

            {result && (
              <Alert className={`${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={result.success ? 'text-green-800' : 'text-red-800'}>
                  {result.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Отладочная информация:</h3>
              <pre className="text-xs text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border">
                {debugInfo || 'Нажмите "Создать Админа" для начала отладки...'}
              </pre>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Текущий статус:</h3>
              <div className="text-xs text-blue-800 space-y-1">
                <p><strong>Пользователь:</strong> {user ? user.email : 'Не авторизован'}</p>
                <p><strong>Роль:</strong> {role || 'Не определена'}</p>
                <p><strong>Аутентифицирован:</strong> {isAuthenticated ? 'Да' : 'Нет'}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Быстрые ссылки:</h3>
              <div className="text-xs text-gray-700 space-y-1">
                <p>• <a href="/admin" className="text-blue-600 hover:underline">Админ панель</a></p>
                <p>• <a href="/admin/users" className="text-blue-600 hover:underline">Управление пользователями</a></p>
                <p>• <a href="/admin/create-test" className="text-blue-600 hover:underline">Создание тестового админа</a></p>
                <p>• <a href="/" className="text-blue-600 hover:underline">Главная страница</a></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
