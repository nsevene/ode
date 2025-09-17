import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, UserCheck } from 'lucide-react';
import { supabase, adminFunctions } from '@/lib/supabase';

export default function PromoteToAdmin() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handlePromoteToAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Проверяем, существует ли пользователь в auth.users
      const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(email);

      if (userError || !userData?.user) {
        setResult({
          success: false,
          message: 'Пользователь с таким email не найден в системе. Проверьте email и попробуйте снова.'
        });
        setLoading(false);
        return;
      }

      const userId = userData.user.id;

      // Проверяем, есть ли уже роль у пользователя
      const { data: existingRole, error: roleCheckError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleCheckError && roleCheckError.code !== 'PGRST116') {
        setResult({
          success: false,
          message: `Ошибка при проверке роли: ${roleCheckError.message}`
        });
        setLoading(false);
        return;
      }

      // Если роль уже существует, обновляем её, иначе создаём новую
      if (existingRole) {
        const { error: updateError } = await supabase
          .from('user_roles')
          .update({ 
            role: 'admin',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (updateError) {
          setResult({
            success: false,
            message: `Ошибка при обновлении роли: ${updateError.message}`
          });
        } else {
          setResult({
            success: true,
            message: `Пользователь ${email} успешно назначен администратором! Теперь он может войти в систему с правами администратора.`
          });
          setEmail(''); // Очищаем поле
        }
      } else {
        // Создаём новую роль
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: 'admin'
          });

        if (insertError) {
          setResult({
            success: false,
            message: `Ошибка при создании роли: ${insertError.message}`
          });
        } else {
          setResult({
            success: true,
            message: `Пользователь ${email} успешно назначен администратором! Теперь он может войти в систему с правами администратора.`
          });
          setEmail(''); // Очищаем поле
        }
      }
    } catch (error) {
      console.error('Error promoting user to admin:', error);
      setResult({
        success: false,
        message: 'Произошла ошибка при назначении администратора. Попробуйте снова.'
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <UserCheck className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Назначить Администратора
            </CardTitle>
            <CardDescription className="text-gray-600">
              Назначьте существующего пользователя администратором системы
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handlePromoteToAdmin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email пользователя
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@odefoodhall.com"
                  required
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Введите email пользователя, которого хотите назначить администратором
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Назначение...' : 'Назначить Администратором'}
              </Button>
            </form>

            {result && (
              <Alert className={`mt-6 ${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
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

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Инструкции:</h3>
              <ol className="text-xs text-blue-800 space-y-1">
                <li>1. Введите email пользователя для назначения администратором</li>
                <li>2. Нажмите "Назначить Администратором"</li>
                <li>3. Пользователь получит права администратора</li>
                <li>4. Теперь он может войти в систему как админ</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
