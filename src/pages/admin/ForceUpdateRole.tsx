import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, RefreshCw, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

export default function ForceUpdateRole() {
  const [email, setEmail] = useState('just0aguest@gmail.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { user, role, checkRole, refreshSession } = useAuthStore();

  // Загружаем информацию о текущем пользователе
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
      loadCurrentUser(user.email);
    }
  }, [user]);

  const loadCurrentUser = async (userEmail: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', userEmail)
        .single();

      if (error) {
        console.error('Error loading user:', error);
        setCurrentUser(null);
      } else {
        setCurrentUser(data);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      setCurrentUser(null);
    }
  };

  const handleForceUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Принудительно обновляем роль пользователя
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          role: 'admin',
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('email', email);

      if (updateError) {
        setResult({
          success: false,
          message: `Ошибка при обновлении роли: ${updateError.message}`
        });
      } else {
        setResult({
          success: true,
          message: `Роль пользователя ${email} принудительно обновлена на admin!`
        });
        
        // Обновляем информацию о пользователе
        await loadCurrentUser(email);
        
        // Принудительно обновляем роль в store
        if (user?.email === email) {
          await checkRole();
          await refreshSession();
        }
      }
    } catch (error) {
      console.error('Error updating role:', error);
      setResult({
        success: false,
        message: 'Произошла ошибка при обновлении роли. Попробуйте снова.'
      });
    }

    setLoading(false);
  };

  const handleRefreshRole = async () => {
    setLoading(true);
    try {
      await checkRole();
      await refreshSession();
      await loadCurrentUser(email);
      setResult({
        success: true,
        message: 'Роль обновлена в локальном хранилище!'
      });
    } catch (error) {
      setResult({
        success: false,
        message: 'Ошибка при обновлении роли в локальном хранилище.'
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <RefreshCw className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Принудительное Обновление Роли
            </CardTitle>
            <CardDescription className="text-gray-600">
              Принудительно обновите роль пользователя и локальное хранилище
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Текущая информация о пользователе */}
            {currentUser && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Текущая информация:</h3>
                <div className="text-xs text-blue-800 space-y-1">
                  <p><strong>Email:</strong> {currentUser.email}</p>
                  <p><strong>Роль в БД:</strong> <span className="font-mono bg-blue-100 px-2 py-1 rounded">{currentUser.role}</span></p>
                  <p><strong>Активен:</strong> {currentUser.is_active ? 'Да' : 'Нет'}</p>
                  <p><strong>Локальная роль:</strong> <span className="font-mono bg-blue-100 px-2 py-1 rounded">{role || 'Не определена'}</span></p>
                </div>
              </div>
            )}

            <form onSubmit={handleForceUpdateRole} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email пользователя
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="just0aguest@gmail.com"
                  required
                  className="w-full"
                />
              </div>

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {loading ? 'Обновление...' : 'Принудительно Обновить Роль'}
                </Button>
                
                <Button
                  type="button"
                  onClick={handleRefreshRole}
                  disabled={loading}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Обновить Локально
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

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-900 mb-2">Инструкции:</h3>
              <ol className="text-xs text-yellow-800 space-y-1">
                <li>1. <strong>Принудительно Обновить Роль</strong> - обновляет роль в базе данных</li>
                <li>2. <strong>Обновить Локально</strong> - обновляет роль в локальном хранилище</li>
                <li>3. После обновления перезагрузите страницу (F5)</li>
                <li>4. Проверьте доступ к админ панели</li>
              </ol>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Быстрые ссылки:</h3>
              <div className="text-xs text-gray-700 space-y-1">
                <p>• <a href="/admin" className="text-blue-600 hover:underline">Админ панель</a></p>
                <p>• <a href="/admin/users" className="text-blue-600 hover:underline">Управление пользователями</a></p>
                <p>• <a href="/auth" className="text-blue-600 hover:underline">Вход в систему</a></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
