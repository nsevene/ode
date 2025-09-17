import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, UserPlus, Crown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function CreateTestAdmin() {
  const [formData, setFormData] = useState({
    email: 'just0aguest@gmail.com',
    password: 'admin123',
    fullName: 'Test Admin',
    phone: '+62-XXX-XXXX-XXXX'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const { setUser, setSession, setRole, setPermissions } = useAuthStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Создаем тестового админа в localStorage
      const testAdmin = {
        id: 'test-admin-' + Date.now(),
        email: formData.email,
        full_name: formData.fullName,
        phone: formData.phone,
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Сохраняем в localStorage
      localStorage.setItem('test-admin', JSON.stringify(testAdmin));
      
      // Сохраняем в authStore
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

      localStorage.setItem('auth-store', JSON.stringify(authData));
      
      // Обновляем Zustand store
      setUser(authData.user);
      setSession(authData.session);
      setRole('admin');
      setPermissions(authData.permissions);

      setResult({
        success: true,
        message: `Тестовый админ ${formData.email} создан успешно! Теперь вы можете войти в админ панель.`
      });

      // Автоматически перенаправляем через 2 секунды
      setTimeout(() => {
        window.location.href = '/admin';
      }, 2000);

    } catch (error) {
      console.error('Error creating test admin:', error);
      setResult({
        success: false,
        message: 'Ошибка при создании тестового админа. Попробуйте снова.'
      });
    }

    setLoading(false);
  };

  const handleLoginAsAdmin = () => {
    // Принудительно устанавливаем админа
    const authData = {
      user: {
        id: 'test-admin',
        email: formData.email,
        user_metadata: {
          full_name: formData.fullName
        }
      },
      session: {
        access_token: 'test-token',
        refresh_token: 'test-refresh'
      },
      role: 'admin',
      permissions: ['admin:read', 'admin:write', 'admin:delete'],
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
      message: 'Вы вошли как админ! Перенаправляем в админ панель...'
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
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Crown className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Создание Тестового Админа
            </CardTitle>
            <CardDescription className="text-gray-600">
              Создайте тестового администратора для разработки и тестирования
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleCreateAdmin} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="admin@example.com"
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Пароль *
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Пароль"
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                    Полное имя *
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Имя Фамилия"
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Телефон
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+62-XXX-XXXX-XXXX"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {loading ? 'Создание...' : 'Создать Тестового Админа'}
                </Button>
                
                <Button
                  type="button"
                  onClick={handleLoginAsAdmin}
                  disabled={loading}
                  variant="outline"
                  className="flex-1"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Войти как Админ
                </Button>
              </div>
            </form>

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

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Инструкции:</h3>
              <ol className="text-xs text-blue-800 space-y-1">
                <li>1. <strong>Создать Тестового Админа</strong> - создает админа в localStorage</li>
                <li>2. <strong>Войти как Админ</strong> - принудительно устанавливает роль админа</li>
                <li>3. После создания перезагрузите страницу (F5)</li>
                <li>4. Проверьте доступ к админ панели</li>
              </ol>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-900 mb-2">Важно:</h3>
              <ul className="text-xs text-yellow-800 space-y-1">
                <li>• Это тестовый админ только для разработки</li>
                <li>• Данные сохраняются в localStorage</li>
                <li>• После перезагрузки браузера данные сохранятся</li>
                <li>• Для продакшена нужна реальная база данных</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Быстрые ссылки:</h3>
              <div className="text-xs text-gray-700 space-y-1">
                <p>• <a href="/admin" className="text-blue-600 hover:underline">Админ панель</a></p>
                <p>• <a href="/admin/users" className="text-blue-600 hover:underline">Управление пользователями</a></p>
                <p>• <a href="/auth" className="text-blue-600 hover:underline">Вход в систему</a></p>
                <p>• <a href="/" className="text-blue-600 hover:underline">Главная страница</a></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
