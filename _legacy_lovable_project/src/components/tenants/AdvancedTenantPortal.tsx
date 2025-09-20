import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  FileText,
  Settings,
  Bell,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TenantData {
  id: string;
  name: string;
  businessType: string;
  status: 'active' | 'pending' | 'suspended';
  leaseStart: string;
  leaseEnd: string;
  monthlyRent: number;
  deposit: number;
  contactInfo: {
    email: string;
    phone: string;
    contactPerson: string;
  };
  performance: {
    revenue: number;
    footTraffic: number;
    rating: number;
    complaints: number;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    uploadDate: string;
    status: 'approved' | 'pending' | 'rejected';
  }>;
  maintenanceRequests: Array<{
    id: string;
    title: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'open' | 'in_progress' | 'resolved';
    createdAt: string;
  }>;
  payments: Array<{
    id: string;
    amount: number;
    dueDate: string;
    paidDate?: string;
    status: 'paid' | 'overdue' | 'pending';
  }>;
}

const AdvancedTenantPortal = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTenant, setSelectedTenant] = useState<TenantData | null>(null);

  const { toast } = useToast();

  // Mock data - in real app, this would come from API
  const [tenants, setTenants] = useState<TenantData[]>([
    {
      id: '1',
      name: 'Dolce Italia',
      businessType: 'Restaurant',
      status: 'active',
      leaseStart: '2023-01-01',
      leaseEnd: '2025-12-31',
      monthlyRent: 15000,
      deposit: 30000,
      contactInfo: {
        email: 'info@dolceitalia.com',
        phone: '+7 (495) 123-45-67',
        contactPerson: 'Marco Rossi',
      },
      performance: {
        revenue: 250000,
        footTraffic: 1200,
        rating: 4.8,
        complaints: 2,
      },
      documents: [
        {
          id: '1',
          name: 'Lease Agreement',
          type: 'contract',
          uploadDate: '2023-01-01',
          status: 'approved',
        },
        {
          id: '2',
          name: 'Insurance Certificate',
          type: 'insurance',
          uploadDate: '2023-01-15',
          status: 'approved',
        },
        {
          id: '3',
          name: 'Health Permit',
          type: 'permit',
          uploadDate: '2023-02-01',
          status: 'pending',
        },
      ],
      maintenanceRequests: [
        {
          id: '1',
          title: 'HVAC Repair',
          priority: 'medium',
          status: 'resolved',
          createdAt: '2024-01-15',
        },
        {
          id: '2',
          title: 'Lighting Issue',
          priority: 'low',
          status: 'open',
          createdAt: '2024-01-20',
        },
      ],
      payments: [
        {
          id: '1',
          amount: 15000,
          dueDate: '2024-01-01',
          paidDate: '2024-01-01',
          status: 'paid',
        },
        { id: '2', amount: 15000, dueDate: '2024-02-01', status: 'pending' },
      ],
    },
    {
      id: '2',
      name: 'Spicy Asia',
      businessType: 'Restaurant',
      status: 'active',
      leaseStart: '2023-03-01',
      leaseEnd: '2026-02-28',
      monthlyRent: 12000,
      deposit: 24000,
      contactInfo: {
        email: 'contact@spicyasia.com',
        phone: '+7 (495) 234-56-78',
        contactPerson: 'Li Wei',
      },
      performance: {
        revenue: 180000,
        footTraffic: 950,
        rating: 4.6,
        complaints: 1,
      },
      documents: [
        {
          id: '1',
          name: 'Lease Agreement',
          type: 'contract',
          uploadDate: '2023-03-01',
          status: 'approved',
        },
        {
          id: '2',
          name: 'Insurance Certificate',
          type: 'insurance',
          uploadDate: '2023-03-15',
          status: 'approved',
        },
      ],
      maintenanceRequests: [
        {
          id: '1',
          title: 'Plumbing Issue',
          priority: 'high',
          status: 'in_progress',
          createdAt: '2024-01-18',
        },
      ],
      payments: [
        {
          id: '1',
          amount: 12000,
          dueDate: '2024-01-01',
          paidDate: '2024-01-01',
          status: 'paid',
        },
        { id: '2', amount: 12000, dueDate: '2024-02-01', status: 'pending' },
      ],
    },
  ]);

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.businessType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || tenant.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddTenant = () => {
    toast({
      title: 'Добавление арендатора',
      description: 'Функция добавления нового арендатора будет реализована',
    });
  };

  const handleEditTenant = (tenant: TenantData) => {
    setSelectedTenant(tenant);
    toast({
      title: 'Редактирование арендатора',
      description: `Редактирование ${tenant.name}`,
    });
  };

  const handleDeleteTenant = (tenantId: string) => {
    setTenants((prev) => prev.filter((t) => t.id !== tenantId));
    toast({
      title: 'Арендатор удален',
      description: 'Арендатор успешно удален из системы',
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            🏢 Расширенный портал арендаторов
          </h1>
          <p className="text-muted-foreground">
            Управление арендаторами, документами, платежами и обслуживанием
          </p>
        </div>
        <Button onClick={handleAddTenant}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить арендатора
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Поиск арендаторов..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Все статусы</option>
                <option value="active">Активные</option>
                <option value="pending">Ожидающие</option>
                <option value="suspended">Приостановленные</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Фильтры
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {tenants.length}
              </p>
              <p className="text-sm text-muted-foreground">Всего арендаторов</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {tenants.filter((t) => t.status === 'active').length}
              </p>
              <p className="text-sm text-muted-foreground">Активных</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {tenants
                  .reduce((sum, t) => sum + t.monthlyRent, 0)
                  .toLocaleString()}{' '}
                ₽
              </p>
              <p className="text-sm text-muted-foreground">Месячная аренда</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {tenants
                  .reduce((sum, t) => sum + t.performance.revenue, 0)
                  .toLocaleString()}{' '}
                ₽
              </p>
              <p className="text-sm text-muted-foreground">Общий доход</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="tenants">Арендаторы</TabsTrigger>
          <TabsTrigger value="documents">Документы</TabsTrigger>
          <TabsTrigger value="maintenance">Обслуживание</TabsTrigger>
          <TabsTrigger value="payments">Платежи</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Топ арендаторы по доходу</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tenants
                    .sort(
                      (a, b) => b.performance.revenue - a.performance.revenue
                    )
                    .slice(0, 5)
                    .map((tenant, index) => (
                      <div
                        key={tenant.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{tenant.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {tenant.businessType}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {tenant.performance.revenue.toLocaleString()} ₽
                          </p>
                          <p className="text-sm text-muted-foreground">Доход</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Активные заявки на обслуживание</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tenants
                    .flatMap((t) =>
                      t.maintenanceRequests.filter(
                        (r) => r.status !== 'resolved'
                      )
                    )
                    .slice(0, 5)
                    .map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{request.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {request.createdAt}
                          </p>
                        </div>
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tenants Tab */}
        <TabsContent value="tenants" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTenants.map((tenant) => (
              <Card key={tenant.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{tenant.name}</CardTitle>
                    <Badge className={getStatusColor(tenant.status)}>
                      {tenant.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Тип бизнеса</p>
                    <p className="font-medium">{tenant.businessType}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Аренда</p>
                      <p className="font-medium">
                        {tenant.monthlyRent.toLocaleString()} ₽/мес
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Рейтинг</p>
                      <p className="font-medium">
                        {tenant.performance.rating}/5
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditTenant(tenant)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteTenant(tenant.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Управление документами</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenants.map((tenant) => (
                  <div key={tenant.id} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">{tenant.name}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {tenant.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 border rounded"
                        >
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {doc.type}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                doc.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : doc.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                              }
                            >
                              {doc.status}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Заявки на обслуживание</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenants
                  .flatMap((tenant) =>
                    tenant.maintenanceRequests.map((request) => ({
                      ...request,
                      tenantName: tenant.name,
                    }))
                  )
                  .map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{request.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.tenantName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {request.createdAt}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                        <Badge
                          className={
                            request.status === 'resolved'
                              ? 'bg-green-100 text-green-800'
                              : request.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {request.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Управление платежами</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenants
                  .flatMap((tenant) =>
                    tenant.payments.map((payment) => ({
                      ...payment,
                      tenantName: tenant.name,
                    }))
                  )
                  .map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{payment.tenantName}</p>
                        <p className="text-sm text-muted-foreground">
                          Сумма: {payment.amount.toLocaleString()} ₽
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Срок: {payment.dueDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={getPaymentStatusColor(payment.status)}
                        >
                          {payment.status}
                        </Badge>
                        {payment.paidDate && (
                          <p className="text-sm text-muted-foreground">
                            Оплачено: {payment.paidDate}
                          </p>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedTenantPortal;
