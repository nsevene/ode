import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Star,
  ChefHat,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  AlertCircle,
  User,
  CreditCard,
} from 'lucide-react';
import { eventApi, bookingApi } from '@/lib/api-client';
import { Event, Booking } from '@/types/database';
import { LoadingSpinner } from '@/components/LoadingStates';
import { useAuthStore } from '@/store/authStore';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const { data, error } = await eventApi.getById(id!);

      if (error) {
        throw new Error(error.message);
      }

      setEvent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки события');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!event) return;

    try {
      setIsBooking(true);

      const bookingData = {
        event_id: event.id,
        user_id: user.id,
        status: 'confirmed' as const,
        booking_date: new Date().toISOString(),
        notes: '',
      };

      const { data, error } = await bookingApi.create(bookingData);

      if (error) {
        throw new Error(error.message);
      }

      setBookingSuccess(true);
    } catch (err) {
      console.error('Ошибка бронирования:', err);
      // Здесь можно добавить уведомление об ошибке
    } finally {
      setIsBooking(false);
    }
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      tasting: 'Дегустация',
      cooking: 'Мастер-класс',
      workshop: 'Воркшоп',
      seminar: 'Семинар',
      presentation: 'Презентация',
      meetup: 'Встреча',
      celebration: 'Празднование',
    };
    return labels[type] || type;
  };

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      tasting: 'bg-purple-100 text-purple-800',
      cooking: 'bg-orange-100 text-orange-800',
      workshop: 'bg-blue-100 text-blue-800',
      seminar: 'bg-green-100 text-green-800',
      presentation: 'bg-yellow-100 text-yellow-800',
      meetup: 'bg-pink-100 text-pink-800',
      celebration: 'bg-red-100 text-red-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy', { locale: ru });
  };

  const formatEventTime = (timeString: string) => {
    return timeString.substring(0, 5); // HH:MM format
  };

  const isEventFull = () => {
    if (!event) return false;
    return event.max_attendees <= 0; // Предполагаем, что у нас есть поле для подсчета забронированных мест
  };

  const isEventPast = () => {
    if (!event) return false;
    const eventDateTime = new Date(`${event.event_date}T${event.start_time}`);
    return eventDateTime < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error || 'Событие не найдено'}</p>
            <Button onClick={() => navigate('/events')}>
              Вернуться к событиям
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Бронирование подтверждено!
            </h2>
            <p className="text-gray-600 mb-4">
              Вы успешно забронировали место на событие "{event.title}"
            </p>
            <div className="space-y-2">
              <Button onClick={() => navigate('/events')} className="w-full">
                Вернуться к событиям
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/profile')}
                className="w-full"
              >
                Мой профиль
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/events')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {event.title}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="secondary"
                  className={getEventTypeColor(event.event_type)}
                >
                  {getEventTypeLabel(event.event_type)}
                </Badge>
                {event.is_featured && (
                  <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700"
                  >
                    Рекомендуемое
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Описание события</CardTitle>
              </CardHeader>
              <CardContent>
                {event.description && (
                  <p className="text-gray-600 mb-4">{event.description}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{formatEventDate(event.event_date)}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>
                      {formatEventTime(event.start_time)} -{' '}
                      {formatEventTime(event.end_time)}
                    </span>
                  </div>

                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{event.location}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span>До {event.max_attendees} участников</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Image */}
            {event.image_url && (
              <Card className="mb-6">
                <CardContent className="p-0">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
            )}

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle>Дополнительная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Что вас ждет:
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Профессиональное руководство</li>
                    <li>Все необходимые ингредиенты</li>
                    <li>Рецепты для домашнего приготовления</li>
                    <li>Дегустация готовых блюд</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Что принести:
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Хорошее настроение</li>
                    <li>Аппетит</li>
                    <li>Фартук (по желанию)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Бронирование</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {event.price > 0
                      ? `${event.price.toFixed(0)} ₽`
                      : 'Бесплатно'}
                  </div>
                  <p className="text-sm text-gray-600">за участника</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Дата:</span>
                    <span className="font-medium">
                      {formatEventDate(event.event_date)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Время:</span>
                    <span className="font-medium">
                      {formatEventTime(event.start_time)} -{' '}
                      {formatEventTime(event.end_time)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Место:</span>
                    <span className="font-medium">{event.location}</span>
                  </div>
                </div>

                <Separator />

                {isEventPast() ? (
                  <div className="text-center py-4">
                    <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Событие уже прошло</p>
                  </div>
                ) : isEventFull() ? (
                  <div className="text-center py-4">
                    <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                    <p className="text-red-600">Мест больше нет</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {!user ? (
                      <div className="text-center py-4">
                        <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 mb-3">
                          Войдите, чтобы забронировать
                        </p>
                        <Button
                          onClick={() => navigate('/auth')}
                          className="w-full"
                        >
                          Войти
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={handleBooking}
                        disabled={isBooking}
                        className="w-full bg-orange-600 hover:bg-orange-700"
                      >
                        {isBooking ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Бронируем...
                          </>
                        ) : (
                          <>
                            <Calendar className="h-4 w-4 mr-2" />
                            Забронировать место
                          </>
                        )}
                      </Button>
                    )}

                    {event.price > 0 && (
                      <div className="text-center">
                        <p className="text-xs text-gray-500">
                          Оплата при регистрации на событие
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
