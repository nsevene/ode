import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users,
  Star,
  Filter,
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import { eventApi } from '@/lib/api-client';
import { eventSchema } from '@/lib/validation';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  max_attendees: number;
  current_attendees: number;
  price: number;
  event_type: string;
  is_featured: boolean;
  is_active: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

interface EventFormData {
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  max_attendees: number;
  price: number;
  event_type: string;
  is_featured: boolean;
  is_active: boolean;
  image_url: string;
}

const EventsManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    event_date: '',
    start_time: '',
    end_time: '',
    location: '',
    max_attendees: 50,
    price: 0,
    event_type: '',
    is_featured: false,
    is_active: true,
    image_url: ''
  });
  const [formErrors, setFormErrors] = useState<z.ZodError | null>(null);

  const { toast } = useToast();

  const eventTypes = [
    'Workshop', 'Tasting', 'Cooking Class', 'Live Music', 
    'Wine Tasting', 'Chef Table', 'Special Event', 'Other'
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await eventApi.getAll();
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить события",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors(null);
    
    const result = eventSchema.safeParse(formData);
    if (!result.success) {
      setFormErrors(result.error);
      return;
    }

    try {
      if (editingEvent) {
        const { error } = await eventApi.update(editingEvent.id, result.data);
        if (error) throw error;
        toast({ title: "Событие обновлено" });
      } else {
        const { error } = await eventApi.create(result.data);
        if (error) throw error;
        toast({ title: "Событие создано" });
      }

      setIsDialogOpen(false);
      setEditingEvent(null);
      resetForm();
      loadEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить событие",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      start_time: event.start_time,
      end_time: event.end_time,
      location: event.location,
      max_attendees: event.max_attendees,
      price: event.price,
      event_type: event.event_type,
      is_featured: event.is_featured,
      is_active: event.is_active,
      image_url: event.image_url || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Вы уверены, что хотите удалить это событие?')) return;

    try {
      const { error } = await eventApi.delete(eventId);
      if (error) throw error;

      toast({
        title: "Событие удалено",
        description: "Событие успешно удалено"
      });

      loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить событие",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_date: '',
      start_time: '',
      end_time: '',
      location: '',
      max_attendees: 50,
      price: 0,
      event_type: '',
      is_featured: false,
      is_active: true,
      image_url: ''
    });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingEvent(null);
    resetForm();
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || event.event_type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Загрузка событий...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Управление событиями</h2>
          <p className="text-muted-foreground">
            Управляйте событиями и мероприятиями
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingEvent(null); resetForm(); }}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить событие
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Редактировать событие' : 'Добавить событие'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Название события *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                {formErrors?.formErrors.fieldErrors.title && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.formErrors.fieldErrors.title}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
                {formErrors?.formErrors.fieldErrors.description && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.formErrors.fieldErrors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event_date">Дата события *</Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    required
                  />
                  {formErrors?.formErrors.fieldErrors.event_date && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.formErrors.fieldErrors.event_date}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="event_type">Тип события *</Label>
                  <Select
                    value={formData.event_type}
                    onValueChange={(value) => setFormData({ ...formData, event_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип события" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors?.formErrors.fieldErrors.event_type && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.formErrors.fieldErrors.event_type}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_time">Время начала *</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    required
                  />
                  {formErrors?.formErrors.fieldErrors.start_time && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.formErrors.fieldErrors.start_time}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="end_time">Время окончания *</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    required
                  />
                  {formErrors?.formErrors.fieldErrors.end_time && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.formErrors.fieldErrors.end_time}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="location">Место проведения *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
                {formErrors?.formErrors.fieldErrors.location && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.formErrors.fieldErrors.location}</p>
                )}
                  </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max_attendees">Максимум участников</Label>
                  <Input
                    id="max_attendees"
                    type="number"
                    value={formData.max_attendees}
                    onChange={(e) => setFormData({ ...formData, max_attendees: parseInt(e.target.value) })}
                  />
                  {formErrors?.formErrors.fieldErrors.max_attendees && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.formErrors.fieldErrors.max_attendees}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="price">Цена (руб.)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  />
                  {formErrors?.formErrors.fieldErrors.price && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.formErrors.fieldErrors.price}</p>
                  )}
                </div>
                  </div>

              <div>
                <Label htmlFor="image_url">URL изображения</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
                {formErrors?.formErrors.fieldErrors.image_url && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.formErrors.fieldErrors.image_url}</p>
                )}
                  </div>

              <div className="space-y-2">
                <Label>Настройки</Label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                    />
                    <Label htmlFor="is_featured">Рекомендуемое</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Активное</Label>
                  </div>
                  </div>
                </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Отмена
                </Button>
                <Button type="submit">
                  {editingEvent ? 'Обновить' : 'Создать'}
                  </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Всего событий</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Рекомендуемых</p>
                <p className="text-2xl font-bold">
                  {events.filter(e => e.is_featured).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Общее кол-во участников</p>
                <p className="text-2xl font-bold">
                  {events.reduce((sum, e) => sum + e.current_attendees, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Типов событий</p>
                <p className="text-2xl font-bold">
                  {new Set(events.map(e => e.event_type)).size}
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
            <Input
              placeholder="Поиск по названию, описанию или месту..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="w-full sm:w-64">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Фильтр по типу" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Все типы</SelectItem>
              {eventTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Список событий</CardTitle>
          <CardDescription>
            Управляйте всеми событиями в системе
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Время</TableHead>
                <TableHead>Место</TableHead>
                <TableHead>Участники</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <span>{event.title}</span>
                      {event.is_featured && (
                        <Star className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(event.event_date), 'dd.MM.yyyy')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{event.start_time} - {event.end_time}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{event.current_attendees}/{event.max_attendees}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {event.price > 0 ? `₽${event.price}` : 'Бесплатно'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{event.event_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={event.is_active ? "default" : "secondary"}>
                      {event.is_active ? "Активное" : "Неактивное"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(event)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                <Button
                        variant="ghost"
                  size="sm"
                        onClick={() => handleDelete(event.id)}
                >
                        <Trash2 className="h-4 w-4" />
                </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
              </CardContent>
            </Card>
    </div>
  );
};

export default EventsManagement;