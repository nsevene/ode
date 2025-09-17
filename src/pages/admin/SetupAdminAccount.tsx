import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Shield, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function SetupAdminAccount() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setResult({
        success: false,
        message: 'Пароли не совпадают'
      });
      setLoading(false);
      return;
    }

    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName
          }
        }
      });

      if (authError) {
        setResult({
          success: false,
          message: `Ошибка создания пользователя: ${authError.message}`
        });
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setResult({
          success: false,
          message: 'Не удалось создать пользователя'
        });
        setLoading(false);
        return;
      }

      // Wait a moment for the profile to be created by trigger
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Promote user to admin using the database function
      const { data: promoteResult, error: promoteError } = await supabase
        .rpc('promote_to_admin', { user_email: formData.email });

      if (promoteError) {
        setResult({
          success: false,
          message: `Ошибка назначения роли администратора: ${promoteError.message}`
        });
        setLoading(false);
        return;
      }

      setResult({
        success: true,
        message: `Администратор ${formData.email} создан успешно! Теперь вы можете войти в систему.`
      });

      // Clear form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

    } catch (error) {
      console.error('Error creating admin:', error);
      setResult({
        success: false,
        message: 'Произошла ошибка при создании администратора. Попробуйте снова.'
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
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Setup Admin Account
            </CardTitle>
            <CardDescription className="text-gray-600">
              Create the first administrator account for ODE Food Hall
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleCreateAdmin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
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
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  required
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Creating...' : 'Create Admin Account'}
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
              <h3 className="text-sm font-medium text-blue-900 mb-2">After Setup:</h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Login with your admin credentials</li>
                <li>• Access admin panel at /admin</li>
                <li>• Create additional users as needed</li>
                <li>• Configure system settings</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
