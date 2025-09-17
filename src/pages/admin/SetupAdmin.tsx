import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Shield, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SetupData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export default function SetupAdmin() {
  const [setupData, setSetupData] = useState<SetupData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Validate passwords match
      if (setupData.password !== setupData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Check if admin already exists
      const { data: existingAdmins, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);

      if (checkError) throw checkError;

      if (existingAdmins && existingAdmins.length > 0) {
        throw new Error('Admin user already exists. Please contact the system administrator.');
      }

      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: setupData.email,
        password: setupData.password,
        options: {
          data: {
            full_name: setupData.fullName,
            role: 'admin'
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      // Create admin profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: setupData.email,
          full_name: setupData.fullName,
          role: 'admin',
          is_active: true
        });

      if (profileError) throw profileError;

      setMessage({
        type: 'success',
        text: 'Admin user created successfully! You can now login and access the admin panel.'
      });

      // Clear form
      setSetupData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
      });

    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to create admin user'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Setup Admin Account</CardTitle>
          <p className="text-muted-foreground">
            Create the first administrator account for ODE Food Hall
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={setupData.fullName}
                onChange={(e) => setSetupData({ ...setupData, fullName: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={setupData.email}
                onChange={(e) => setSetupData({ ...setupData, email: e.target.value })}
                placeholder="admin@odefoodhall.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={setupData.password}
                onChange={(e) => setSetupData({ ...setupData, password: e.target.value })}
                placeholder="Enter secure password"
                required
                minLength={8}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={setupData.confirmPassword}
                onChange={(e) => setSetupData({ ...setupData, confirmPassword: e.target.value })}
                placeholder="Confirm password"
                required
              />
            </div>

            {message && (
              <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
                {message.type === 'error' ? (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating Admin...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Create Admin Account
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">After Setup:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Login with your admin credentials</li>
              <li>• Access admin panel at /admin</li>
              <li>• Create additional users as needed</li>
              <li>• Configure system settings</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
