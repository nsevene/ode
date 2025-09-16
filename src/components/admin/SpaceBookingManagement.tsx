import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  Eye, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  MapPin,
  FileText,
  Plus
} from 'lucide-react';

interface SpaceBooking {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  business_type: string;
  cuisine_type?: string;
  description: string;
  expected_revenue?: string;
  investment_budget?: string;
  lease_duration: string;
  space_name: string;
  space_area: number;
  floor_number: number;
  status: string; // Allow any string from database
  admin_notes_count?: number;
  created_at: string;
  updated_at: string;
  previous_experience?: string;
  special_requirements?: string;
  preferred_contact_method?: string;
  best_contact_time?: string;
  has_food_license?: boolean;
  admin_notes?: string;
}

interface BookingComment {
  id: string;
  booking_id: string;
  admin_user_id: string;
  comment: string;
  is_internal: boolean;
  created_at: string;
  admin_name?: string;
}

const SpaceBookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<SpaceBooking[]>([]);
  const [comments, setComments] = useState<BookingComment[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<SpaceBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('space_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      console.error('Error loading bookings:', error);
      toast({
        title: "Ошибка загрузки заявок",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async (bookingId: string) => {
    try {
      const { data, error } = await supabase
        .from('space_booking_comments')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Get admin names for each comment
      const mappedComments = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('id', comment.admin_user_id)
            .single();
          
          return {
            ...comment,
            admin_name: profile?.display_name || 'Администратор'
          };
        })
      );
      
      setComments(mappedComments);
    } catch (error: any) {
      console.error('Error loading comments:', error);
      toast({
        title: "Ошибка загрузки комментариев",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('space_bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      // Send notification email
      if (newStatus !== 'pending') {
        try {
          await supabase.functions.invoke('send-tenant-notification', {
            body: {
              booking_id: bookingId,
              status: newStatus,
              admin_comment: `Статус вашей заявки изменен на: ${newStatus === 'approved' ? 'одобрено' : 'отклонено'}`
            }
          });
        } catch (emailError) {
          console.error('Error sending notification email:', emailError);
          // Don't throw here - status update succeeded
        }
      }

      toast({
        title: "Статус обновлен",
        description: `Заявка ${newStatus === 'approved' ? 'одобрена' : newStatus === 'rejected' ? 'отклонена' : 'переведена в ожидание'}. Уведомление отправлено заявителю.`,
      });

      loadBookings();
      if (selectedBooking) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: "Ошибка обновления статуса",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const addComment = async () => {
    if (!selectedBooking || !newComment.trim()) return;

    try {
      setIsAddingComment(true);
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('space_booking_comments')
        .insert([{
          booking_id: selectedBooking.id,
          admin_user_id: user.user.id,
          comment: newComment,
          is_internal: isInternal
        }]);

      if (error) throw error;

      toast({
        title: "Комментарий добавлен",
        description: "Комментарий успешно добавлен к заявке",
      });

      setNewComment('');
      setIsInternal(false);
      loadComments(selectedBooking.id);
      loadBookings(); // Refresh to update comment count
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        title: "Ошибка добавления комментария",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsAddingComment(false);
    }
  };

  const openBookingDetails = (booking: SpaceBooking) => {
    setSelectedBooking(booking);
    loadComments(booking.id);
    setIsDetailsOpen(true);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesSearch = !searchQuery || 
      booking.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.contact_person.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success text-success-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Загрузка заявок...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Управление заявками на аренду
          </CardTitle>
          <CardDescription>
            Просматривайте и управляйте заявками от потенциальных арендаторов
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Поиск по названию компании, имени или email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Фильтр по статусу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="pending">Ожидание</SelectItem>
                <SelectItem value="approved">Одобрено</SelectItem>
                <SelectItem value="rejected">Отклонено</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Заявки не найдены по заданным критериям'
                  : 'Заявок пока нет'
                }
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{booking.company_name}</h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1">
                              {booking.status === 'approved' ? 'Одобрено' : 
                               booking.status === 'rejected' ? 'Отклонено' : 'Ожидание'}
                            </span>
                          </Badge>
                          {booking.admin_notes_count > 0 && (
                            <Badge variant="outline">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              {booking.admin_notes_count}
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {booking.contact_person} ({booking.email})
                          </div>
                          <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {booking.business_type} • {booking.space_area}м²
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(booking.created_at).toLocaleDateString('ru-RU')}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openBookingDetails(booking)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Подробнее
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Заявка от {selectedBooking?.company_name}</DialogTitle>
            <DialogDescription>
              Подробная информация о заявке на аренду помещения
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <Tabs defaultValue="details" className="space-y-4">
              <TabsList>
                <TabsTrigger value="details">Детали заявки</TabsTrigger>
                <TabsTrigger value="comments">
                  Комментарии ({comments.length})
                </TabsTrigger>
                <TabsTrigger value="actions">Действия</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Контактная информация</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-medium">Название компании</Label>
                      <p>{selectedBooking.company_name}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-medium">Контактное лицо</Label>
                      <p>{selectedBooking.contact_person}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-medium">Email</Label>
                      <p>{selectedBooking.email}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-medium">Телефон</Label>
                      <p>{selectedBooking.phone}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-medium">Предпочтительная связь</Label>
                      <p>{selectedBooking.preferred_contact_method || 'Не указано'}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-medium">Удобное время</Label>
                      <p>{selectedBooking.best_contact_time || 'Не указано'}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Business Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Информация о бизнесе</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-medium">Тип бизнеса</Label>
                        <p>{selectedBooking.business_type}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-medium">Тип кухни</Label>
                        <p>{selectedBooking.cuisine_type || 'Не указано'}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-medium">Лицензия</Label>
                        <p>{selectedBooking.has_food_license ? 'Да' : 'Нет'}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-medium">Срок аренды</Label>
                        <p>{selectedBooking.lease_duration}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-medium">Описание концепции</Label>
                      <p className="whitespace-pre-wrap">{selectedBooking.description}</p>
                    </div>
                    {selectedBooking.previous_experience && (
                      <div className="space-y-2">
                        <Label className="font-medium">Предыдущий опыт</Label>
                        <p className="whitespace-pre-wrap">{selectedBooking.previous_experience}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Space and Financial */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Помещение и финансы</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-medium">Этаж</Label>
                      <p>{selectedBooking.floor_number}-й этаж</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-medium">Площадь</Label>
                      <p>{selectedBooking.space_area} м²</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-medium">Ожидаемый оборот</Label>
                      <p>{selectedBooking.expected_revenue || 'Не указано'}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-medium">Инвестиционный бюджет</Label>
                      <p>{selectedBooking.investment_budget || 'Не указано'}</p>
                    </div>
                    {selectedBooking.special_requirements && (
                      <div className="space-y-2 md:col-span-2">
                        <Label className="font-medium">Особые требования</Label>
                        <p className="whitespace-pre-wrap">{selectedBooking.special_requirements}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comments" className="space-y-4">
                {/* Add Comment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Добавить комментарий</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Введите комментарий..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="internal"
                          checked={isInternal}
                          onChange={(e) => setIsInternal(e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="internal">Внутренний комментарий (не видим заявителю)</Label>
                      </div>
                      <Button 
                        onClick={addComment}
                        disabled={!newComment.trim() || isAddingComment}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        {isAddingComment ? 'Добавление...' : 'Добавить'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Comments List */}
                <div className="space-y-3">
                  {comments.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center text-muted-foreground">
                        Комментариев пока нет
                      </CardContent>
                    </Card>
                  ) : (
                    comments.map((comment) => (
                      <Card key={comment.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {comment.admin_name || 'Администратор'}
                            </span>
                              {comment.is_internal && (
                                <Badge variant="outline" className="text-xs">
                                  Внутренний
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.created_at).toLocaleString('ru-RU')}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap">{comment.comment}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="actions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Управление статусом заявки</CardTitle>
                    <CardDescription>
                      Изменение статуса заявки повлияет на процесс обработки
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => updateBookingStatus(selectedBooking.id, 'approved')}
                        className="bg-success hover:bg-success/90"
                        disabled={selectedBooking.status === 'approved'}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Одобрить
                      </Button>
                      <Button
                        onClick={() => updateBookingStatus(selectedBooking.id, 'rejected')}
                        variant="destructive"
                        disabled={selectedBooking.status === 'rejected'}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Отклонить
                      </Button>
                      <Button
                        onClick={() => updateBookingStatus(selectedBooking.id, 'pending')}
                        variant="outline"
                        disabled={selectedBooking.status === 'pending'}
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        В ожидание
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpaceBookingManagement;