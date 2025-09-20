import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalUsers: number;
  totalTenants: number;
  totalInvestors: number;
  totalApplications: number;
  totalRevenue: number;
  activeBookings: number;
}

export interface RecentActivity {
  id: string;
  type: 'user_registration' | 'tenant_application' | 'booking' | 'payment';
  description: string;
  timestamp: string;
  user_email: string;
}

export const useAdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalTenants: 0,
    totalInvestors: 0,
    totalApplications: 0,
    totalRevenue: 0,
    activeBookings: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all counts in parallel for performance
      const [
        { count: totalUsers, error: usersError },
        { count: totalTenants, error: tenantsError },
        { count: totalInvestors, error: investorsError },
        { count: totalApplications, error: applicationsError },
        { count: activeBookings, error: bookingsError },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'tenant'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'investor'),
        supabase.from('vendor_applications').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
      ]);

      if (usersError) throw usersError;
      if (tenantsError) throw tenantsError;
      if (investorsError) throw investorsError;
      if (applicationsError) throw applicationsError;
      if (bookingsError) throw bookingsError;

      setStats({
        totalUsers: totalUsers || 0,
        totalTenants: totalTenants || 0,
        totalInvestors: totalInvestors || 0,
        totalApplications: totalApplications || 0,
        totalRevenue: 0, // Placeholder
        activeBookings: activeBookings || 0,
      });

      // Fetch recent activity (mocked for now)
      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          type: 'user_registration',
          description: 'New user registered',
          timestamp: new Date().toISOString(),
          user_email: 'user@example.com',
        },
        {
          id: '2',
          type: 'tenant_application',
          description: 'New tenant application received',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          user_email: 'tenant@example.com',
        },
      ];
      setRecentActivity(mockActivity);

    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return { stats, recentActivity, loading, error, refreshData: loadDashboardData };
};
