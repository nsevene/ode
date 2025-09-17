import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Search, User, Crown, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function FindExistingAdmin() {
  const [result, setResult] = useState<{ success: boolean; message: string; data?: any } | null>(null);
  const [loading, setLoading] = useState(false);
  const { setUser, setSession, setRole, setPermissions, user, role } = useAuthStore();

  const checkLocalStorage = () => {
    setResult(null);
    setLoading(true);

    try {
      console.log('🔍 Checking localStorage for existing users...');
      
      const findings: any = {
        localStorage: {},
        sessionStorage: {},
        zustandStore: {
          user: user,
          role: role,
          isAuthenticated: !!user
        }
      };

      // Проверяем все ключи в localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          try {
            const value = localStorage.getItem(key);
            if (value) {
              // Пытаемся распарсить JSON
              try {
                const parsed = JSON.parse(value);
                findings.localStorage[key] = parsed;
              } catch {
                findings.localStorage[key] = value;
              }
            }
          } catch (error) {
            findings.localStorage[key] = 'Error reading value';
          }
        }
      }

      // Проверяем sessionStorage
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          try {
            const value = sessionStorage.getItem(key);
            if (value) {
              try {
                const parsed = JSON.parse(value);
                findings.sessionStorage[key] = parsed;
              } catch {
                findings.sessionStorage[key] = value;
              }
            }
          } catch (error) {
            findings.sessionStorage[key] = 'Error reading value';
          }
        }
      }

      console.log('📊 Found data:', findings);

      setResult({
        success: true,
        message: 'Поиск завершен! Проверьте найденные данные ниже.',
        data: findings
      });

    } catch (error) {
      console.error('Error searching:', error);
      setResult({
        success: false,
        message: 'Ошибка при поиске данных: ' + error
      });
    }

    setLoading(false);
  };

  const tryLoginWithFoundData = (userData: any) => {
    try {
      console.log('🚀 Trying to login with found data:', userData);

      // Создаем пользователя из найденных данных
      const adminUser = {
        id: userData.id || 'found-admin-' + Date.now(),
        email: userData.email || 'found@admin.com',
        user_metadata: {
          full_name: userData.full_name || userData.user_metadata?.full_name || 'Found Administrator'
        },
        aud: 'authenticated',
        role: 'authenticated',
        email_confirmed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const adminSession = {
        access_token: 'found-admin-token-' + Date.now(),
        refresh_token: 'found-admin-refresh-' + Date.now(),
        expires_in: 3600,
        token_type: 'bearer',
        user: adminUser
      };

      // Устанавливаем данные
      setUser(adminUser as any);
      setSession(adminSession as any);
      setRole('admin');
      setPermissions(['admin:read', 'admin:write', 'admin:delete', 'admin:manage', 'admin:all']);

      setResult({
        success: true,
        message: `Успешно вошли как: ${adminUser.email}`
      });

      // Перенаправляем в админ панель
      setTimeout(() => {
        window.location.href = '/admin';
      }, 2000);

    } catch (error) {
      setResult({
        success: false,
        message: 'Ошибка при входе: ' + error
      });
    }
  };

  const becomeAdminWithEmail = (email: string) => {
    try {
      console.log('👑 Becoming admin with email:', email);

      const adminUser = {
        id: 'email-admin-' + Date.now(),
        email: email,
        user_metadata: {
          full_name: 'Email Administrator'
        },
        aud: 'authenticated',
        role: 'authenticated',
        email_confirmed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const adminSession = {
        access_token: 'email-admin-token-' + Date.now(),
        refresh_token: 'email-admin-refresh-' + Date.now(),
        expires_in: 3600,
        token_type: 'bearer',
        user: adminUser
      };

      setUser(adminUser as any);
      setSession(adminSession as any);
      setRole('admin');
      setPermissions(['admin:read', 'admin:write', 'admin:delete', 'admin:manage', 'admin:all']);

      setResult({
        success: true,
        message: `Стали админом с email: ${email}`
      });

      setTimeout(() => {
        window.location.href = '/admin';
      }, 2000);

    } catch (error) {
      setResult({
        success: false,
        message: 'Ошибка: ' + error
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Search className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Поиск Существующего Админа
            </CardTitle>
            <CardDescription className="text-gray-600">
              Найдем существующие данные пользователей в системе
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Кнопки действий */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Button
                onClick={checkLocalStorage}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Search className="h-4 w-4 mr-2" />
                {loading ? 'Поиск...' : 'Найти Существующих Пользователей'}
              </Button>
              
              <Button
                onClick={() => becomeAdminWithEmail('just0aguest@gmail.com')}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Crown className="h-4 w-4 mr-2" />
                Стать Админом (just0aguest@gmail.com)
              </Button>
            </div>

            {/* Быстрые кнопки для известных email */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-3">🎯 Быстрый вход с известными email:</h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Button
                  onClick={() => becomeAdminWithEmail('admin@odefoodhall.com')}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  admin@odefoodhall.com
                </Button>
                <Button
                  onClick={() => becomeAdminWithEmail('just0aguest@gmail.com')}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  just0aguest@gmail.com
                </Button>
              </div>
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

            {/* Показываем найденные данные */}
            {result?.data && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">📊 Найденные данные:</h3>
                
                {/* localStorage */}
                {Object.keys(result.data.localStorage).length > 0 && (
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="text-sm font-medium text-yellow-900 mb-2">💾 localStorage:</h4>
                    <div className="space-y-2">
                      {Object.entries(result.data.localStorage).map(([key, value]: [string, any]) => (
                        <div key={key} className="text-xs">
                          <div className="flex justify-between items-start">
                            <span className="font-mono text-yellow-800">{key}:</span>
                            {typeof value === 'object' && value?.email && (
                              <Button
                                onClick={() => tryLoginWithFoundData(value)}
                                size="sm"
                                variant="outline"
                                className="ml-2 h-6 text-xs"
                              >
                                <User className="h-3 w-3 mr-1" />
                                Войти как {value.email}
                              </Button>
                            )}
                          </div>
                          <pre className="text-yellow-700 mt-1 whitespace-pre-wrap text-xs">
                            {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Zustand Store */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="text-sm font-medium text-green-900 mb-2">🏪 Zustand Store:</h4>
                  <pre className="text-green-700 text-xs whitespace-pre-wrap">
                    {JSON.stringify(result.data.zustandStore, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Инструкции */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">📝 Инструкции:</h3>
              <ol className="text-xs text-gray-700 space-y-1">
                <li>1. <strong>Найти Существующих Пользователей</strong> - ищет данные в браузере</li>
                <li>2. <strong>Войти как [email]</strong> - использует найденные данные для входа</li>
                <li>3. <strong>Быстрый вход</strong> - создает админа с известным email</li>
                <li>4. После входа перейдите в админ панель</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
