import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar,
  Clock,
  Users,
  MapPin,
  CreditCard,
  Check,
  ArrowLeft,
  ArrowRight,
  User,
  Mail,
  Phone,
  MessageSquare,
  Star,
  Gift,
  Shield
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";

interface BookingData {
  date: string;
  timeSlot: string;
  guestCount: number;
  experienceType: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests: string;
  tablePreference?: string;
  dietaryRestrictions?: string;
  celebrationType?: string;
}

interface EnhancedBookingFlowProps {
  maxGuests?: number;
  availableExperiences?: string[];
  onBookingComplete?: (data: BookingData) => void;
}

const BOOKING_STEPS = [
  { id: 1, title: "Выбор даты и времени", icon: Calendar },
  { id: 2, title: "Детали бронирования", icon: Users },
  { id: 3, title: "Контактная информация", icon: User },
  { id: 4, title: "Подтверждение", icon: Check }
];

const EXPERIENCE_TYPES = [
  { 
    id: "standard", 
    name: "Стандартное посещение", 
    description: "Обычный визит в фуд-холл",
    price: 0,
    duration: "2 часа"
  },
  { 
    id: "tasting", 
    name: "Дегустационное меню", 
    description: "Авторские блюда от шеф-поваров",
    price: 2500,
    duration: "1.5 часа"
  },
  { 
    id: "wine", 
    name: "Винная дегустация", 
    description: "Дегустация вин с сомелье",
    price: 3500,
    duration: "2 часа"
  },
  { 
    id: "private", 
    name: "Приватный ужин", 
    description: "Эксклюзивный опыт для особых случаев",
    price: 8000,
    duration: "3 часа"
  }
];

const TIME_SLOTS = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
  "21:00", "21:30"
];

export const EnhancedBookingFlow = ({ 
  maxGuests = 8, 
  availableExperiences = ["standard", "tasting", "wine"],
  onBookingComplete 
}: EnhancedBookingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    date: "",
    timeSlot: "",
    guestCount: 2,
    experienceType: "standard",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    specialRequests: "",
    tablePreference: "",
    dietaryRestrictions: "",
    celebrationType: ""
  });
  
  const isMobile = useIsMobile();
  const progress = (currentStep / BOOKING_STEPS.length) * 100;
  const selectedExperience = EXPERIENCE_TYPES.find(exp => exp.id === bookingData.experienceType);

  const updateBookingData = (field: keyof BookingData, value: any) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < BOOKING_STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return bookingData.date && bookingData.timeSlot;
      case 2:
        return bookingData.guestCount > 0 && bookingData.experienceType;
      case 3:
        return bookingData.guestName && bookingData.guestEmail;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleBookingSubmit = () => {
    toast({
      title: "Бронирование отправлено!",
      description: "Мы свяжемся с вами в ближайшее время для подтверждения.",
    });
    onBookingComplete?.(bookingData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-lg font-semibold">Выберите дату</Label>
              <Input
                type="date"
                value={bookingData.date}
                onChange={(e) => updateBookingData("date", e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={isMobile ? "h-14 text-lg" : "h-12"}
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-lg font-semibold">Время</Label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {TIME_SLOTS.map((time) => (
                  <Button
                    key={time}
                    variant={bookingData.timeSlot === time ? "default" : "outline"}
                    onClick={() => updateBookingData("timeSlot", time)}
                    className={isMobile ? "h-12" : "h-10"}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Количество гостей
              </Label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {Array.from({ length: maxGuests }, (_, i) => i + 1).map((num) => (
                  <Button
                    key={num}
                    variant={bookingData.guestCount === num ? "default" : "outline"}
                    onClick={() => updateBookingData("guestCount", num)}
                    className={isMobile ? "h-12 text-lg" : "h-10"}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-lg font-semibold">Тип посещения</Label>
              <div className="grid gap-3">
                {EXPERIENCE_TYPES.filter(exp => availableExperiences.includes(exp.id)).map((exp) => (
                  <Card 
                    key={exp.id}
                    className={`cursor-pointer transition-all ${
                      bookingData.experienceType === exp.id 
                        ? "ring-2 ring-primary border-primary bg-primary/5" 
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => updateBookingData("experienceType", exp.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{exp.name}</h4>
                          <p className="text-muted-foreground text-sm">{exp.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {exp.duration}
                            </Badge>
                            {exp.id !== "standard" && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-primary" />
                                Премиум
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {exp.price > 0 ? (
                            <span className="text-lg font-bold">{exp.price.toLocaleString()} ₽</span>
                          ) : (
                            <span className="text-lg font-bold text-primary">Бесплатно</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="table-preference">Предпочтения по столу (опционально)</Label>
              <Select value={bookingData.tablePreference} onValueChange={(value) => updateBookingData("tablePreference", value)}>
                <SelectTrigger className={isMobile ? "h-14 text-lg" : "h-12"}>
                  <SelectValue placeholder="Выберите предпочтение" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="window">У окна</SelectItem>
                  <SelectItem value="quiet">Тихое место</SelectItem>
                  <SelectItem value="center">В центре зала</SelectItem>
                  <SelectItem value="terrace">На террасе</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="guest-name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Имя и фамилия *
              </Label>
              <Input
                id="guest-name"
                value={bookingData.guestName}
                onChange={(e) => updateBookingData("guestName", e.target.value)}
                placeholder="Ваше полное имя"
                className={isMobile ? "h-14 text-lg" : "h-12"}
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="guest-email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email *
              </Label>
              <Input
                id="guest-email"
                type="email"
                value={bookingData.guestEmail}
                onChange={(e) => updateBookingData("guestEmail", e.target.value)}
                placeholder="your@email.com"
                className={isMobile ? "h-14 text-lg" : "h-12"}
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="guest-phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Телефон
              </Label>
              <Input
                id="guest-phone"
                type="tel"
                value={bookingData.guestPhone}
                onChange={(e) => updateBookingData("guestPhone", e.target.value)}
                placeholder="+62 (819) 432-863-95"
                className={isMobile ? "h-14 text-lg" : "h-12"}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="dietary-restrictions">Диетические ограничения</Label>
              <Textarea
                id="dietary-restrictions"
                value={bookingData.dietaryRestrictions}
                onChange={(e) => updateBookingData("dietaryRestrictions", e.target.value)}
                placeholder="Аллергии, вегетарианство, халяль..."
                className={isMobile ? "min-h-[100px] text-lg" : "min-h-[80px]"}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="special-requests" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Особые пожелания
              </Label>
              <Textarea
                id="special-requests"
                value={bookingData.specialRequests}
                onChange={(e) => updateBookingData("specialRequests", e.target.value)}
                placeholder="День рождения, годовщина, корпоратив..."
                className={isMobile ? "min-h-[100px] text-lg" : "min-h-[80px]"}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Check className="w-5 h-5" />
                  Детали бронирования
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{new Date(bookingData.date).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{bookingData.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{bookingData.guestCount} {bookingData.guestCount === 1 ? 'гость' : 'гостя'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedExperience?.name}</span>
                  </div>
                </div>
                
                {selectedExperience && selectedExperience.price > 0 && (
                  <Separator />
                )}
                
                {selectedExperience && selectedExperience.price > 0 && (
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Итого:</span>
                    <span className="text-primary">{(selectedExperience.price * bookingData.guestCount).toLocaleString()} ₽</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Контактная информация
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Имя:</strong> {bookingData.guestName}</p>
                <p><strong>Email:</strong> {bookingData.guestEmail}</p>
                {bookingData.guestPhone && <p><strong>Телефон:</strong> {bookingData.guestPhone}</p>}
                {bookingData.specialRequests && <p><strong>Особые пожелания:</strong> {bookingData.specialRequests}</p>}
                {bookingData.dietaryRestrictions && <p><strong>Диетические ограничения:</strong> {bookingData.dietaryRestrictions}</p>}
              </CardContent>
            </Card>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">Гарантия качества</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                Мы гарантируем высокое качество обслуживания и соблюдение всех санитарных норм.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Бронирование столика</CardTitle>
          <Badge variant="outline">{currentStep} из {BOOKING_STEPS.length}</Badge>
        </div>
        
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            {BOOKING_STEPS.map((step) => (
              <span 
                key={step.id}
                className={`flex items-center gap-1 ${
                  currentStep >= step.id ? 'text-primary font-medium' : ''
                }`}
              >
                <step.icon className="w-3 h-3" />
                {!isMobile && step.title}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">
            {BOOKING_STEPS[currentStep - 1]?.title}
          </h3>
        </div>

        {renderStepContent()}

        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </Button>
          
          {currentStep < BOOKING_STEPS.length ? (
            <Button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="flex items-center gap-2"
            >
              Далее
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleBookingSubmit}
              disabled={!isStepValid()}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90"
            >
              Подтвердить бронирование
              <Check className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};