import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  Calendar,
  Activity,
  BarChart3,
  PieChart,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useAdminDashboard, RecentActivity } from '@/hooks/useAdminDashboard';
import UserManagement from './UserManagement';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className={`p-2 bg-${colorClass}-100 rounded-lg`}>
          <Icon className={`h-6 w-6 text-${colorClass}-600`} />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const getActivityIcon = (type: RecentActivity['type']) => {
  switch (type) {
    case 'user_registration':
      return <Users className="h-4 w-4 text-blue-500" />;
    case 'tenant_application':
      return <Building2 className="h-4 w-4 text-green-500" />;
    case 'booking':
      return <Calendar className="h-4 w-4 text-purple-500" />;
    case 'payment':
      return <DollarSign className="h-4 w-4 text-yellow-500" />;
    default:
      return <Activity className="h-4 w-4 text-gray-500" />;
  }
};

const getActivityColor = (type: RecentActivity['type']) => {
  switch (type) {
    case 'user_registration':
      return 'text-blue-600';
    case 'tenant_application':
      return 'text-green-600';
    case 'booking':
      return 'text-purple-600';
    case 'payment':
      return 'text-yellow-600';
    default:
      return 'text-gray-600';
  }
};

export default function AdminDashboard() {
  const { stats, recentActivity, loading, error, refreshData } = useAdminDashboard();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
       <div className="container mx-auto p-6 text-center">
         <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
         <h2 className="text-2xl font-semibold text-red-600 mb-2">Failed to load dashboard data</h2>
         <p className="text-muted-foreground mb-4">{error}</p>
         <Button onClick={refreshData}>
           <RefreshCw className="mr-2 h-4 w-4" />
           Try Again
         </Button>
       </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
            Manage your ODE Food Hall platform
            </p>
        </div>
        <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="ml-2">Refresh</span>
        </Button>
      </div>


      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Users" value={stats.totalUsers} icon={Users} colorClass="blue" />
            <StatCard title="Tenants" value={stats.totalTenants} icon={Building2} colorClass="green" />
            <StatCard title="Applications" value={stats.totalApplications} icon={DollarSign} colorClass="purple" />
            <StatCard title="Active Bookings" value={stats.activeBookings} icon={Calendar} colorClass="yellow" />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${getActivityColor(activity.type)}`}
                        >
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.user_email} •{' '}
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    View All Users
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Building2 className="h-4 w-4 mr-2" />
                    Review Applications
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Manage Bookings
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Analytics Coming Soon
                </h3>
                <p className="text-muted-foreground">
                  Detailed analytics and reporting will be available here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Settings Coming Soon
                </h3>
                <p className="text-muted-foreground">
                  System configuration options will be available here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
