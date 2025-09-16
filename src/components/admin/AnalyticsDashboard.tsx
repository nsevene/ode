import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  CalendarDays, 
  Users, 
  TrendingUp, 
  DollarSign,
  Star,
  Wine,
  Mail,
  Target
} from "lucide-react";
import EventsManagement from "@/components/admin/EventsManagement";
import NotificationSystem from "@/components/admin/NotificationSystem";
import ExportData from "@/components/admin/ExportData";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useEffect, useState } from "react";

// Mock data for analytics (replace with real data)
const mockAnalyticsData = {
  bookings: [
    { month: 'Jan', count: 45, revenue: 2250000 },
    { month: 'Feb', count: 52, revenue: 2600000 },
    { month: 'Mar', count: 38, revenue: 1900000 },
    { month: 'Apr', count: 67, revenue: 3350000 },
    { month: 'May', count: 73, revenue: 3650000 },
    { month: 'Jun', count: 81, revenue: 4050000 },
  ],
  experiences: [
    { name: 'Wine Staircase', bookings: 156, percentage: 45 },
    { name: 'Taste Compass', bookings: 89, percentage: 26 },
    { name: 'Lounge Experience', bookings: 67, percentage: 19 },
    { name: 'VIP Tasting', bookings: 34, percentage: 10 },
  ],
  conversion: [
    { step: 'Landing Page', users: 2450, rate: 100 },
    { step: 'Experience View', users: 1960, rate: 80 },
    { step: 'Booking Form', users: 980, rate: 40 },
    { step: 'Payment', users: 735, rate: 30 },
    { step: 'Completed', users: 662, rate: 27 },
  ],
  upsells: [
    { name: 'Cheese Board', conversions: 89, revenue: 10680000 },
    { name: 'Wine Upgrade', conversions: 67, revenue: 13400000 },
    { name: 'Dessert Pairing', conversions: 34, revenue: 2890000 },
  ]
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

export default function Admin() {
  const { getAnalyticsData } = useAnalytics();
  const [realTimeEvents, setRealTimeEvents] = useState<any[]>([]);

  useEffect(() => {
    // Load real analytics data
    const events = getAnalyticsData();
    setRealTimeEvents(events.slice(-20)); // Last 20 events
  }, [getAnalyticsData]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your food hall operations and analytics</p>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data Export</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">356</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">IDR 17.8M</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+8%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">27%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+3%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+0.2</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bookings & Revenue Trend</CardTitle>
                <CardDescription>Monthly performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockAnalyticsData.bookings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip formatter={(value, name) => [
                      name === 'count' ? value : `IDR ${(value as number).toLocaleString()}`,
                      name === 'count' ? 'Bookings' : 'Revenue'
                    ]} />
                    <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="count" />
                    <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Experience Popularity</CardTitle>
                <CardDescription>Distribution of bookings by experience type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockAnalyticsData.experiences}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="bookings"
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                    >
                      {mockAnalyticsData.experiences.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>User journey from landing to completion</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={mockAnalyticsData.conversion}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="step" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'users' ? value : `${value}%`,
                    name === 'users' ? 'Users' : 'Conversion Rate'
                  ]} />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" />
                  <Line type="monotone" dataKey="rate" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Upsell Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Upsell Performance</CardTitle>
              <CardDescription>Revenue generated from add-on services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalyticsData.upsells.map((upsell, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Wine className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{upsell.name}</p>
                        <p className="text-sm text-muted-foreground">{upsell.conversions} conversions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">IDR {upsell.revenue.toLocaleString()}</p>
                      <Badge variant="secondary">
                        {((upsell.conversions / 356) * 100).toFixed(1)}% rate
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <EventsManagement />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSystem />
        </TabsContent>

        <TabsContent value="data">
          <ExportData />
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Real-time Events
              </CardTitle>
              <CardDescription>Live user activity and analytics events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {realTimeEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <div>
                        <p className="font-medium">{event.event_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{event.properties?.page || 'Unknown'}</Badge>
                      {event.user_id && (
                        <p className="text-xs text-muted-foreground mt-1">User: {event.user_id.slice(0, 8)}...</p>
                      )}
                    </div>
                  </div>
                ))}
                {realTimeEvents.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No recent events</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}