import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Key, User, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function AdminCredentials() {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const { setUser, setSession, setRole, setPermissions } = useAuthStore();

  // Готовые данные админа из документации
  const adminCredentials = {
    email: 'admin@odefoodhall.com',
    password: 'Admin123!',
    fullName: 'System Administrator',
    phone: '+62-XXX-XXXX-XXXX'
  };

  const handleLoginWithCredentials = () => {
    try {
      // Создаем админа с готовыми данными
      const testAdmin = {
        id: 'admin-' + Date.now(),
        email: adminCredentials.email,
        full_name: adminCredentials.fullName,
        phone: adminCredentials.phone,
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

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
          access_token: 'admin-token-' + Date.now(),
          refresh_token: 'admin-refresh-' + Date.now()
        },
        role: 'admin',
        permissions: ['admin:read', 'admin:write', 'admin:delete', 'admin:manage'],
        isAuthenticated: true
      };

      // Сохраняем в localStorage
      localStorage.setItem('admin-credentials', JSON.stringify(testAdmin));
      localStorage.setItem('auth-store', JSON.stringify(authData));
      
      // Обновляем Zustand store
      setUser(authData.user);
      setSession(authData.session);
      setRole('admin');
      setPermissions(authData.permissions);

      setResult({
        success: true,
        message: `Админ ${adminCredentials.email} создан успешно! Перенаправляем в админ панель...`
      });

      // Автоматически перенаправляем через 2 секунды
      setTimeout(() => {
        window.location.href = '/admin';
      }, 2000);

    } catch (error) {
      console.error('Error creating admin:', error);
      setResult({
        success: false,
        message: 'Ошибка при создании админа. Попробуйте снова.'
      });
    }
  };

  const handleQuickLogin = () => {
    // Быстрый вход с готовыми данными
    const authData = {
      user: {
        id: 'admin-quick',
        email: adminCredentials.email,
        user_metadata: {
          full_name: adminCredentials.fullName
        }
      },
      session: {
        access_token: 'admin-quick-token',
        refresh_token: 'admin-quick-refresh'
      },
      role: 'admin',
      permissions: ['admin:read', 'admin:write', 'admin:delete', 'admin:manage'],
      isAuthenticated: true
    };

    localStorage.setItem('auth-store', JSON.stringify(authData));
    
    // Обновляем Zustand store
    setUser(authData.user);
    setSession(authData.session);
    setRole('admin');
    setPermissions(authData.permissions);

    setResult({
      success: true,
      message: 'Быстрый вход как админ выполнен! Перенаправляем...'
    });

    setTimeout(() => {
      window.location.href = '/admin';
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Key className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Готовые Данные Админа
            </CardTitle>
            <CardDescription className="text-gray-600">
              Используйте готовые данные админа из документации проекта
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Готовые данные */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-3">📋 Готовые данные админа:</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    <strong>Email:</strong> {adminCredentials.email}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    <strong>Password:</strong> {adminCredentials.password}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    <strong>Full Name:</strong> {adminCredentials.fullName}
                  </span>
                </div>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Button
                onClick={handleLoginWithCredentials}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Key className="h-4 w-4 mr-2" />
                Создать Админа с Данными
              </Button>
              
              <Button
                onClick={handleQuickLogin}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <User className="h-4 w-4 mr-2" />
                Быстрый Вход как Админ
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

            {/* Информация о данных */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-900 mb-2">ℹ️ Информация:</h3>
              <ul className="text-xs text-yellow-800 space-y-1">
                <li>• Эти данные взяты из документации проекта</li>
                <li>• Email: <code>admin@odefoodhall.com</code> - стандартный админ</li>
                <li>• Password: <code>Admin123!</code> - стандартный пароль</li>
                <li>• Данные сохраняются в localStorage</li>
                <li>• После создания вы станете полноправным админом</li>
              </ul>
            </div>

            {/* Быстрые ссылки */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">🔗 Быстрые ссылки:</h3>
              <div className="text-xs text-gray-700 space-y-1">
                <p>• <a href="/admin" className="text-blue-600 hover:underline">Админ панель</a></p>
                <p>• <a href="/admin/users" className="text-blue-600 hover:underline">Управление пользователями</a></p>
                <p>• <a href="/admin/debug" className="text-blue-600 hover:underline">Отладка</a></p>
                <p>• <a href="/" className="text-blue-600 hover:underline">Главная страница</a></p>
              </div>
            </div>

            {/* Документация */}
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-sm font-medium text-purple-900 mb-2">📚 Источники данных:</h3>
              <div className="text-xs text-purple-800 space-y-1">
                <p>• <code>ADMIN_SETUP_GUIDE.md</code> - основное руководство</p>
                <p>• <code>FINAL_SOLUTION.md</code> - финальное решение</p>
                <p>• <code>src/lib/supabase.ts</code> - конфигурация</p>
                <p>• <code>src/lib/supabase-mock.ts</code> - mock данные</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
