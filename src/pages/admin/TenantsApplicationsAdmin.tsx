import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useEmailNotifications } from "@/hooks/useEmailNotifications";
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, MapPin, DollarSign, Users, FileText, Clock, Mail, Phone } from 'lucide-react';

interface TenantApplication {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  business_type: string;
  cuisine_type?: string;
  description: string;
  space_name: string;
  space_area: number;
  floor_number: number;
  lease_duration: string;
  lease_start_date?: string;
  investment_budget?: string;
  expected_revenue?: string;
  has_food_license: boolean;
  previous_experience?: string;
  special_requirements?: string;
  status: string;
  admin_notes?: string;
  admin_notes_count: number;
  created_at: string;
  updated_at: string;
}

export default function TenantsApplicationsAdmin() {
  const [applications, setApplications] = useState<TenantApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<TenantApplication | null>(null);
  const [adminComment, setAdminComment] = useState('');
  const { toast } = useToast();
  const { sendTenantNotification } = useEmailNotifications();

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('space_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить заявки",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id: string, status: string, adminComment?: string) => {
    try {
      const { error } = await supabase
        .from('space_bookings')
        .update({ 
          status,
          admin_notes: adminComment,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Send email notification
      const emailResult = await sendTenantNotification(
        id, 
        status as 'approved' | 'rejected' | 'pending', 
        adminComment
      );

      if (!emailResult.success) {
        console.warn('Email notification failed:', emailResult.error);
      }

      // Refresh the data
      fetchApplications();
      
      toast({
        title: "Успешно обновлено",
        description: `Статус заявки изменен на: ${status}${emailResult.success ? ' и отправлено уведомление' : ''}`,
      });
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус заявки",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Одобрено';
      case 'rejected': return 'Отклонено';
      case 'pending': return 'На рассмотрении';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Загрузка заявок...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Заявки на аренду помещений</h1>
        <p className="text-muted-foreground mt-2">
          Управление заявками от потенциальных арендаторов
        </p>
      </div>

      <div className="grid gap-6">
        {applications.map((app) => (
          <Card key={app.id} className="w-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{app.company_name}</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {app.contact_person}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {app.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {app.phone}
                    </span>
                  </CardDescription>
                </div>
                <Badge variant={getStatusBadgeVariant(app.status)}>
                  {getStatusText(app.status)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{app.space_name}</span>
                    <span className="text-sm text-muted-foreground">
                      {app.space_area}м² (этаж {app.floor_number})
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{app.business_type}</span>
                    {app.cuisine_type && (
                      <span className="text-sm text-muted-foreground">• {app.cuisine_type}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{app.lease_duration}</span>
                    {app.lease_start_date && (
                      <span className="text-sm text-muted-foreground">
                        с {new Date(app.lease_start_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {app.investment_budget && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Бюджет: {app.investment_budget}</span>
                    </div>
                  )}
                  
                  {app.expected_revenue && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Ожидаемый доход: {app.expected_revenue}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Подана: {new Date(app.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {app.description}
              </p>

              <div className="flex gap-2 flex-wrap">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedApp(app)}>
                      Подробнее
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{app.company_name}</DialogTitle>
                      <DialogDescription>
                        Детальная информация о заявке
                      </DialogDescription>
                    </DialogHeader>
                    
                    {selectedApp && (
                      <div className="grid gap-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Контактная информация</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>Контактное лицо:</strong> {selectedApp.contact_person}</p>
                              <p><strong>Email:</strong> {selectedApp.email}</p>
                              <p><strong>Телефон:</strong> {selectedApp.phone}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Информация о бизнесе</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>Тип бизнеса:</strong> {selectedApp.business_type}</p>
                              {selectedApp.cuisine_type && (
                                <p><strong>Тип кухни:</strong> {selectedApp.cuisine_type}</p>
                              )}
                              <p><strong>Лицензия на питание:</strong> {selectedApp.has_food_license ? 'Да' : 'Нет'}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Описание бизнеса</h4>
                          <p className="text-sm">{selectedApp.description}</p>
                        </div>
                        
                        {selectedApp.previous_experience && (
                          <div>
                            <h4 className="font-semibold mb-2">Предыдущий опыт</h4>
                            <p className="text-sm">{selectedApp.previous_experience}</p>
                          </div>
                        )}
                        
                        {selectedApp.special_requirements && (
                          <div>
                            <h4 className="font-semibold mb-2">Особые требования</h4>
                            <p className="text-sm">{selectedApp.special_requirements}</p>
                          </div>
                        )}
                        
                        {selectedApp.admin_notes && (
                          <div>
                            <h4 className="font-semibold mb-2">Административные заметки</h4>
                            <p className="text-sm">{selectedApp.admin_notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                {app.status === 'pending' && (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Одобрить
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Одобрить заявку</DialogTitle>
                          <DialogDescription>
                            Добавьте комментарий для заявителя (опционально)
                          </DialogDescription>
                        </DialogHeader>
                        <Textarea
                          placeholder="Комментарий..."
                          value={adminComment}
                          onChange={(e) => setAdminComment(e.target.value)}
                        />
                        <DialogFooter>
                          <Button 
                            onClick={() => {
                              updateApplicationStatus(app.id, 'approved', adminComment);
                              setAdminComment('');
                            }}
                          >
                            Одобрить заявку
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          Отклонить
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Отклонить заявку</DialogTitle>
                          <DialogDescription>
                            Добавьте комментарий с причиной отклонения
                          </DialogDescription>
                        </DialogHeader>
                        <Textarea
                          placeholder="Причина отклонения..."
                          value={adminComment}
                          onChange={(e) => setAdminComment(e.target.value)}
                        />
                        <DialogFooter>
                          <Button 
                            variant="destructive"
                            onClick={() => {
                              updateApplicationStatus(app.id, 'rejected', adminComment);
                              setAdminComment('');
                            }}
                          >
                            Отклонить заявку
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {applications.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Заявок пока нет</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}