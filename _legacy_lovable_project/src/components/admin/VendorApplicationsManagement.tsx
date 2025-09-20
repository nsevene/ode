import React, { useState, useEffect } from 'react';
import {
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  Download,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ExportData from './ExportData';

interface VendorApplication {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  cuisine_type: string;
  preferred_sector: string;
  experience_years: number | null;
  description: string;
  expected_revenue: string | null;
  investment_budget: string | null;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  documents?: string[];
}

const VendorApplicationsManagement = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] =
    useState<VendorApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications((data as VendorApplication[]) || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить заявки',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (
    id: string,
    status: string,
    notes?: string
  ) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('vendor_applications')
        .update({
          status,
          admin_notes: notes || null,
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Статус обновлен',
        description: `Заявка отмечена как ${getStatusLabel(status)}`,
      });

      fetchApplications();
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ожидает рассмотрения';
      case 'reviewing':
        return 'На рассмотрении';
      case 'approved':
        return 'Одобрена';
      case 'rejected':
        return 'Отклонена';
      default:
        return status;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'outline';
      case 'reviewing':
        return 'secondary';
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    total: applications.length,
    pending: applications.filter((app) => app.status === 'pending').length,
    reviewing: applications.filter((app) => app.status === 'reviewing').length,
    approved: applications.filter((app) => app.status === 'approved').length,
    rejected: applications.filter((app) => app.status === 'rejected').length,
  };

  if (loading) {
    return <div className="p-6">Загрузка заявок...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{statusCounts.total}</div>
            <p className="text-xs text-muted-foreground">Всего заявок</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">
              {statusCounts.pending}
            </div>
            <p className="text-xs text-muted-foreground">Ожидают</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {statusCounts.reviewing}
            </div>
            <p className="text-xs text-muted-foreground">На рассмотрении</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {statusCounts.approved}
            </div>
            <p className="text-xs text-muted-foreground">Одобрены</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {statusCounts.rejected}
            </div>
            <p className="text-xs text-muted-foreground">Отклонены</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Поиск по названию, имени или email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Фильтр по статусу" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="pending">Ожидают</SelectItem>
            <SelectItem value="reviewing">На рассмотрении</SelectItem>
            <SelectItem value="approved">Одобрены</SelectItem>
            <SelectItem value="rejected">Отклонены</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <Card key={application.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {application.company_name}
                  </CardTitle>
                  <CardDescription>
                    {application.contact_person} • {application.email} •{' '}
                    {application.cuisine_type}
                  </CardDescription>
                </div>
                <Badge variant={getStatusBadgeVariant(application.status)}>
                  {getStatusLabel(application.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p>
                  <strong>Сектор:</strong> {application.preferred_sector}
                </p>
                <p>
                  <strong>Опыт:</strong>{' '}
                  {application.experience_years || 'Не указан'} лет
                </p>
                <p>
                  <strong>Инвестиции:</strong>{' '}
                  {application.investment_budget || 'Не указан'}
                </p>
                <p>
                  <strong>Дата подачи:</strong>{' '}
                  {new Date(application.created_at).toLocaleDateString('ru-RU')}
                </p>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedApplication(application);
                        setAdminNotes(application.admin_notes || '');
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Просмотр
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{application.company_name}</DialogTitle>
                      <DialogDescription>
                        Заявка от {application.contact_person}
                      </DialogDescription>
                    </DialogHeader>

                    {selectedApplication && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Контактное лицо</Label>
                            <p className="text-sm">
                              {selectedApplication.contact_person}
                            </p>
                          </div>
                          <div>
                            <Label>Email</Label>
                            <p className="text-sm">
                              {selectedApplication.email}
                            </p>
                          </div>
                          <div>
                            <Label>Телефон</Label>
                            <p className="text-sm">
                              {selectedApplication.phone}
                            </p>
                          </div>
                          <div>
                            <Label>Тип кухни</Label>
                            <p className="text-sm">
                              {selectedApplication.cuisine_type}
                            </p>
                          </div>
                        </div>

                        <div>
                          <Label>Описание концепции</Label>
                          <p className="text-sm mt-1 p-3 bg-gray-50 rounded">
                            {selectedApplication.description}
                          </p>
                        </div>

                        {/* Documents Section */}
                        {selectedApplication.documents &&
                          selectedApplication.documents.length > 0 && (
                            <div>
                              <Label>Загруженные документы</Label>
                              <div className="mt-2 space-y-2">
                                {selectedApplication.documents.map(
                                  (docUrl, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2 p-2 border rounded"
                                    >
                                      <FileText className="w-4 h-4 text-blue-600" />
                                      <span className="text-sm flex-1">
                                        Документ {index + 1}
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          window.open(docUrl, '_blank')
                                        }
                                      >
                                        <ExternalLink className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        <div>
                          <Label>Заметки администратора</Label>
                          <Textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Добавьте заметки..."
                            rows={3}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() =>
                              updateApplicationStatus(
                                selectedApplication.id,
                                'reviewing',
                                adminNotes
                              )
                            }
                            disabled={isUpdating}
                            variant="secondary"
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            На рассмотрении
                          </Button>
                          <Button
                            onClick={() =>
                              updateApplicationStatus(
                                selectedApplication.id,
                                'approved',
                                adminNotes
                              )
                            }
                            disabled={isUpdating}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Одобрить
                          </Button>
                          <Button
                            onClick={() =>
                              updateApplicationStatus(
                                selectedApplication.id,
                                'rejected',
                                adminNotes
                              )
                            }
                            disabled={isUpdating}
                            variant="destructive"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Отклонить
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateApplicationStatus(application.id, 'reviewing')
                  }
                  disabled={application.status === 'reviewing' || isUpdating}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />В работу
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredApplications.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Заявки не найдены</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Export Section */}
      <div className="mt-8">
        <ExportData />
      </div>
    </div>
  );
};

export default VendorApplicationsManagement;
