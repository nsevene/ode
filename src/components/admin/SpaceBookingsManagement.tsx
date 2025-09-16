import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Calendar, MapPin, Users, Phone, Mail, Building, FileText, Clock } from "lucide-react";
import { format } from "date-fns";

interface SpaceBooking {
  id: string;
  space_id: number;
  space_name: string;
  space_area: number;
  floor_number: number;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  business_type: string;
  cuisine_type?: string;
  description: string;
  expected_revenue?: string;
  investment_budget?: string;
  lease_start_date?: string;
  lease_duration: string;
  status: string;
  admin_notes?: string;
  preferred_contact_method: string;
  best_contact_time?: string;
  has_food_license: boolean;
  previous_experience?: string;
  special_requirements?: string;
  created_at: string;
  updated_at: string;
}

const SpaceBookingsManagement = () => {
  const [bookings, setBookings] = useState<SpaceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<SpaceBooking | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('space_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching space bookings:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить заявки на аренду.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('space_bookings')
        .update({ 
          status: newStatus,
          admin_notes: adminNotes || undefined
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Статус обновлен",
        description: `Статус заявки изменен на "${getStatusLabel(newStatus)}"`,
      });

      fetchBookings();
      setAdminNotes("");
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус заявки.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Ожидает", variant: "secondary" as const },
      reviewing: { label: "На рассмотрении", variant: "default" as const },
      approved: { label: "Одобрено", variant: "default" as const },
      rejected: { label: "Отклонено", variant: "destructive" as const },
      contract_signed: { label: "Договор подписан", variant: "default" as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: "Ожидает",
      reviewing: "На рассмотрении", 
      approved: "Одобрено",
      rejected: "Отклонено",
      contract_signed: "Договор подписан",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const filteredBookings = bookings.filter(booking => 
    statusFilter === "all" || booking.status === statusFilter
  );

  if (loading) {
    return <div className="text-center py-8">Загрузка заявок...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Управление арендой площадей</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Фильтр по статусу" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все заявки</SelectItem>
            <SelectItem value="pending">Ожидают</SelectItem>
            <SelectItem value="reviewing">На рассмотрении</SelectItem>
            <SelectItem value="approved">Одобрено</SelectItem>
            <SelectItem value="rejected">Отклонено</SelectItem>
            <SelectItem value="contract_signed">Договор подписан</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Заявок на аренду пока нет</p>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="w-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{booking.company_name}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{booking.space_name} ({booking.space_area} м², {booking.floor_number} этаж)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{format(new Date(booking.created_at), "dd.MM.yyyy HH:mm")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(booking.status)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Контактная информация
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Контактное лицо:</strong> {booking.contact_person}</p>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <a href={`mailto:${booking.email}`} className="text-primary hover:underline">
                          {booking.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <a href={`tel:${booking.phone}`} className="text-primary hover:underline">
                          {booking.phone}
                        </a>
                      </div>
                      <p><strong>Предпочитаемый способ связи:</strong> {booking.preferred_contact_method}</p>
                      {booking.best_contact_time && (
                        <p><strong>Удобное время:</strong> {booking.best_contact_time}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Информация о бизнесе
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Тип бизнеса:</strong> {booking.business_type}</p>
                      {booking.cuisine_type && (
                        <p><strong>Тип кухни:</strong> {booking.cuisine_type}</p>
                      )}
                      <p><strong>Длительность аренды:</strong> {booking.lease_duration}</p>
                      {booking.lease_start_date && (
                        <p><strong>Желаемая дата начала:</strong> {format(new Date(booking.lease_start_date), "dd.MM.yyyy")}</p>
                      )}
                      <p><strong>Лицензия на продукты:</strong> {booking.has_food_license ? "Есть" : "Нет"}</p>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                {(booking.expected_revenue || booking.investment_budget) && (
                  <div>
                    <h4 className="font-semibold mb-2">Финансовая информация</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {booking.expected_revenue && (
                        <p><strong>Ожидаемая выручка:</strong> {booking.expected_revenue}</p>
                      )}
                      {booking.investment_budget && (
                        <p><strong>Инвестиционный бюджет:</strong> {booking.investment_budget}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h4 className="font-semibold mb-2">Описание концепции</h4>
                  <p className="text-sm bg-muted p-3 rounded-lg">{booking.description}</p>
                </div>

                {/* Additional Information */}
                {(booking.previous_experience || booking.special_requirements) && (
                  <div className="space-y-2">
                    {booking.previous_experience && (
                      <div>
                        <h4 className="font-semibold mb-1">Предыдущий опыт</h4>
                        <p className="text-sm bg-muted p-3 rounded-lg">{booking.previous_experience}</p>
                      </div>
                    )}
                    {booking.special_requirements && (
                      <div>
                        <h4 className="font-semibold mb-1">Особые требования</h4>
                        <p className="text-sm bg-muted p-3 rounded-lg">{booking.special_requirements}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Admin Notes */}
                {booking.admin_notes && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Заметки администратора
                    </h4>
                    <p className="text-sm bg-yellow-50 p-3 rounded-lg">{booking.admin_notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSelectedBooking(booking);
                          setAdminNotes(booking.admin_notes || "");
                        }}
                      >
                        Управление заявкой
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Управление заявкой</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Изменить статус</label>
                          <Select 
                            value={selectedBooking?.status} 
                            onValueChange={(value) => 
                              setSelectedBooking(prev => prev ? {...prev, status: value} : null)
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Ожидает</SelectItem>
                              <SelectItem value="reviewing">На рассмотрении</SelectItem>
                              <SelectItem value="approved">Одобрено</SelectItem>
                              <SelectItem value="rejected">Отклонено</SelectItem>
                              <SelectItem value="contract_signed">Договор подписан</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Заметки администратора</label>
                          <Textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Добавить заметки..."
                            className="mt-1"
                            rows={3}
                          />
                        </div>

                        <Button 
                          onClick={() => {
                            if (selectedBooking) {
                              updateBookingStatus(selectedBooking.id, selectedBooking.status);
                            }
                          }}
                          className="w-full"
                        >
                          Сохранить изменения
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline"
                    onClick={() => window.open(`mailto:${booking.email}`, '_blank')}
                  >
                    Написать email
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => window.open(`tel:${booking.phone}`, '_blank')}
                  >
                    Позвонить
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SpaceBookingsManagement;