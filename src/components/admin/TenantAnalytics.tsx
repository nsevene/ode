import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, MessageSquare, Calendar, TrendingUp, Download, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

interface AnalyticsData {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  applicationsByMonth: any[];
  applicationsByStatus: any[];
  applicationsBySector: any[];
  communicationStats: any[];
  meetingStats: any[];
}

const TenantAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('3months');
  const { toast } = useToast();

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      switch (timeRange) {
        case '1month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case '3months':
          startDate.setMonth(endDate.getMonth() - 3);
          break;
        case '6months':
          startDate.setMonth(endDate.getMonth() - 6);
          break;
        case '1year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      // Fetch vendor applications
      const { data: applications, error: appsError } = await supabase
        .from('vendor_applications')
        .select('*')
        .gte('created_at', startDate.toISOString());

      if (appsError) throw appsError;

      // Fetch communications
      const { data: communications, error: commError } = await supabase
        .from('vendor_communications')
        .select('*')
        .gte('created_at', startDate.toISOString());

      if (commError) throw commError;

      // Fetch meetings
      const { data: meetings, error: meetError } = await supabase
        .from('vendor_meetings')
        .select('*')
        .gte('created_at', startDate.toISOString());

      if (meetError) throw meetError;

      // Process analytics data
      const totalApplications = applications?.length || 0;
      const pendingApplications = applications?.filter(app => app.status === 'pending').length || 0;
      const approvedApplications = applications?.filter(app => app.status === 'approved').length || 0;
      const rejectedApplications = applications?.filter(app => app.status === 'rejected').length || 0;

      // Applications by month
      const applicationsByMonth = processApplicationsByMonth(applications || []);
      
      // Applications by status
      const applicationsByStatus = [
        { name: 'Pending', value: pendingApplications, color: COLORS[0] },
        { name: 'Approved', value: approvedApplications, color: COLORS[1] },
        { name: 'Rejected', value: rejectedApplications, color: COLORS[2] }
      ];

      // Applications by sector
      const applicationsBySector = processApplicationsBySector(applications || []);

      // Communication stats
      const communicationStats = processCommunicationStats(communications || []);

      // Meeting stats
      const meetingStats = processMeetingStats(meetings || []);

      setAnalyticsData({
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        applicationsByMonth,
        applicationsByStatus,
        applicationsBySector,
        communicationStats,
        meetingStats
      });

    } catch (error: any) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const processApplicationsByMonth = (applications: any[]) => {
    const monthCounts: { [key: string]: number } = {};
    
    applications.forEach(app => {
      const month = new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });

    return Object.entries(monthCounts).map(([month, count]) => ({
      month,
      applications: count
    }));
  };

  const processApplicationsBySector = (applications: any[]) => {
    const sectorCounts: { [key: string]: number } = {};
    
    applications.forEach(app => {
      const sector = app.preferred_sector || 'Unknown';
      sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
    });

    return Object.entries(sectorCounts).map(([sector, count]) => ({
      sector,
      count
    }));
  };

  const processCommunicationStats = (communications: any[]) => {
    const typeCounts: { [key: string]: number } = {};
    
    communications.forEach(comm => {
      const type = comm.communication_type || 'email';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    return Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count
    }));
  };

  const processMeetingStats = (meetings: any[]) => {
    const statusCounts: { [key: string]: number } = {};
    
    meetings.forEach(meeting => {
      const status = meeting.status || 'scheduled';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count
    }));
  };

  const exportAnalytics = () => {
    if (!analyticsData) return;

    const csvData = [
      ['Metric', 'Value'],
      ['Total Applications', analyticsData.totalApplications],
      ['Pending Applications', analyticsData.pendingApplications],
      ['Approved Applications', analyticsData.approvedApplications],
      ['Rejected Applications', analyticsData.rejectedApplications],
      ['', ''],
      ['Applications by Month', ''],
      ...analyticsData.applicationsByMonth.map(item => [item.month, item.applications]),
      ['', ''],
      ['Applications by Sector', ''],
      ...analyticsData.applicationsBySector.map(item => [item.sector, item.count])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tenant-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Analytics data has been exported to CSV",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Tenant Analytics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tenant Analytics</h2>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportAnalytics} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalApplications}</div>
            <p className="text-xs text-muted-foreground">All tenant applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{analyticsData.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analyticsData.approvedApplications}</div>
            <p className="text-xs text-muted-foreground">Successfully approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.totalApplications > 0 
                ? `${Math.round((analyticsData.approvedApplications / analyticsData.totalApplications) * 100)}%`
                : '0%'
              }
            </div>
            <p className="text-xs text-muted-foreground">Approval rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="applications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="status">Status Distribution</TabsTrigger>
          <TabsTrigger value="sectors">Sectors</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Applications Over Time</CardTitle>
              <CardDescription>Monthly application submission trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.applicationsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="applications" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Application Status Distribution</CardTitle>
              <CardDescription>Breakdown of application statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.applicationsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.applicationsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors">
          <Card>
            <CardHeader>
              <CardTitle>Applications by Sector</CardTitle>
              <CardDescription>Preferred sectors for tenant applications</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.applicationsBySector}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sector" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Communication Types</CardTitle>
                <CardDescription>Breakdown of communication methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analyticsData.communicationStats.map((stat, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="capitalize">{stat.type}</span>
                      <Badge variant="secondary">{stat.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Meeting Status</CardTitle>
                <CardDescription>Current status of scheduled meetings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analyticsData.meetingStats.map((stat, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="capitalize">{stat.status}</span>
                      <Badge variant="secondary">{stat.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantAnalytics;