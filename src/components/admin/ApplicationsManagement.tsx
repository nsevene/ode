import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Building,
  FileText,
  Filter,
  Search,
  Eye,
  Send
} from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { applicationApi } from '@/lib/api-client';

interface Application {
  id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  business_name: string;
  business_type: string;
  cuisine_type: string;
  experience_years: number;
  proposed_location: string;
  investment_amount: number;
  message: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  created_at: string;
  updated_at: string;
  reviewed_by?: string;
  review_notes?: string;
}

const ApplicationsManagement: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [isApproving, setIsApproving] = useState(false);

  const { toast } = useToast();

  const statusOptions = [
    { value: '', label: 'Все статусы' },
    { value: 'pending', label: 'Ожидает рассмотрения' },
    { value: 'under_review', label: 'На рассмотрении' },
    { value: 'approved', label: 'Одобрено' },
    { value: 'rejected', label: 'Отклонено' }
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    under_review: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    pending: 'Ожидает рассмотрения',
    under_review: 'На рассмотрении',
    approved: 'Одобрено',
    rejected: 'Отклонено'
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await applicationApi.getAll();
      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить заявки",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: Application['status'], notes?: string) => {
    try {
      const { error } = await applicationApi.updateStatus(applicationId, newStatus, notes);
      if (error) throw error;

      toast({
        title: "Статус обновлен",
        description: `Заявка ${statusLabels[newStatus].toLowerCase()}`
      });

      loadApplications();
      setIsDialogOpen(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус заявки",
        variant: "destructive"
      });
    }
  };

  const handleApprove = async (application: Application) => {
    if (!confirm('Вы уверены, что хотите одобрить эту заявку? Это создаст пользователя и назначит роль.')) return;
    setIsApproving(true);
    try {
      const { error } = await supabase.functions.invoke('approve-tenant-application', {
        body: { applicationId: application.id },
      });

      if (error) throw new Error(error.message);

      toast({
        title: "Заявка одобрена",
        description: "Пользователь создан, вендор добавлен, роль назначена."
      });
      loadApplications();
    } catch (error) {
      console.error('Error approving application:', error);
      toast({
        title: "Ошибка одобрения",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async (application: Application) => {
    const notes = prompt('Укажите причину отклонения:');
    if (notes === null) return;

    await handleStatusChange(application.id, 'rejected', notes);
  };

  const handleView = (application: Application) => {
    setSelectedApplication(application);
    setReviewNotes(application.review_notes || '');
    setIsDialogOpen(true);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicant_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Загрузка заявок...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Управление заявками</h2>
          <p className="text-muted-foreground">
            Рассматривайте заявки от потенциальных вендоров
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Всего заявок</p>
                <p className="text-2xl font-bold">{applications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Ожидают рассмотрения</p>
                <p className="text-2xl font-bold">
                  {applications.filter(a => a.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Одобрено</p>
                <p className="text-2xl font-bold">
                  {applications.filter(a => a.status === 'approved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Отклонено</p>
                <p className="text-2xl font-bold">
                  {applications.filter(a => a.status === 'rejected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Поиск по имени, бизнесу или email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md"
            />
          </div>
        </div>
        <div className="w-full sm:w-64">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Фильтр по статусу" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Список заявок</CardTitle>
          <CardDescription>
            Управляйте заявками от потенциальных вендоров
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Заявитель</TableHead>
                <TableHead>Бизнес</TableHead>
                <TableHead>Тип кухни</TableHead>
                <TableHead>Инвестиции</TableHead>
                <TableHead>Дата подачи</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{application.applicant_name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{application.applicant_email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{application.applicant_phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{application.business_name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{application.proposed_location}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{application.cuisine_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">₽{application.investment_amount.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    {format(new Date(application.created_at), 'dd.MM.yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[application.status]}>
                      {statusLabels[application.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(application)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {application.status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApprove(application)}
                            className="text-green-600 hover:text-green-700"
                            disabled={isApproving}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReject(application)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Application Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Детали заявки</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              {/* Applicant Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Информация о заявителе</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Имя</Label>
                    <p className="font-medium">{selectedApplication.applicant_name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="font-medium">{selectedApplication.applicant_email}</p>
                  </div>
                  <div>
                    <Label>Телефон</Label>
                    <p className="font-medium">{selectedApplication.applicant_phone}</p>
                  </div>
                  <div>
                    <Label>Опыт работы</Label>
                    <p className="font-medium">{selectedApplication.experience_years} лет</p>
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Информация о бизнесе</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Название бизнеса</Label>
                    <p className="font-medium">{selectedApplication.business_name}</p>
                  </div>
                  <div>
                    <Label>Тип бизнеса</Label>
                    <p className="font-medium">{selectedApplication.business_type}</p>
                  </div>
                  <div>
                    <Label>Тип кухни</Label>
                    <p className="font-medium">{selectedApplication.cuisine_type}</p>
                  </div>
                  <div>
                    <Label>Предлагаемое место</Label>
                    <p className="font-medium">{selectedApplication.proposed_location}</p>
                  </div>
                  <div>
                    <Label>Размер инвестиций</Label>
                    <p className="font-medium">₽{selectedApplication.investment_amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <Label>Сообщение от заявителя</Label>
                <p className="mt-1 p-3 bg-muted rounded-md">{selectedApplication.message}</p>
              </div>

              {/* Review Notes */}
              <div>
                <Label htmlFor="review_notes">Заметки по рассмотрению</Label>
                <Textarea
                  id="review_notes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                  placeholder="Добавьте заметки по рассмотрению заявки..."
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Закрыть
                </Button>
                {selectedApplication.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange(selectedApplication.id, 'under_review', reviewNotes)}
                    >
                      На рассмотрение
                    </Button>
                    <Button
                      onClick={() => handleApprove(selectedApplication)}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isApproving}
                    >
                      Одобрить
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(selectedApplication)}
                    >
                      Отклонить
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationsManagement;
