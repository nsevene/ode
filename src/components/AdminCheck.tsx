import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import SetupAdmin from '@/pages/admin/SetupAdmin';

interface AdminCheckProps {
  children: React.ReactNode;
}

export default function AdminCheck({ children }: AdminCheckProps) {
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Пропускаем проверку для маршрутов создания тестового админа, отладки и готовых данных
  if (location.pathname === '/admin/create-test' || location.pathname === '/admin/debug' || location.pathname === '/admin/credentials' || location.pathname === '/quick-admin' || location.pathname === '/find-admin') {
    return <>{children}</>;
  }

  useEffect(() => {
    checkForAdmin();
  }, []);

  const checkForAdmin = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);

      if (error) {
        console.error('Error checking for admin:', error);
        setHasAdmin(false);
      } else {
        setHasAdmin(data && data.length > 0);
      }
    } catch (error) {
      console.error('Error checking for admin:', error);
      setHasAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking system status...</p>
        </div>
      </div>
    );
  }

  // If no admin exists, show setup page
  if (hasAdmin === false) {
    return <SetupAdmin />;
  }

  // If admin exists, show the app
  return <>{children}</>;
}
