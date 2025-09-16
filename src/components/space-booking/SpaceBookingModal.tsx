import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { MapPin, Users, CalendarIcon, Clock } from "lucide-react";

interface SpaceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  space: {
    id: number;
    name: string;
    area: string;
    floor: number;
    note?: string;
  } | null;
}

const SpaceBookingModal = ({ isOpen, onClose, space }: SpaceBookingModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    business_type: "",
    cuisine_type: "",
    description: "",
    expected_revenue: "",
    investment_budget: "",
    lease_start_date: undefined as Date | undefined,
    lease_duration: "",
    preferred_contact_method: "email",
    best_contact_time: "",
    has_food_license: false,
    previous_experience: "",
    special_requirements: "",
  });

  const businessTypes = [
    "Ресторан",
    "Кафе", 
    "Фаст-фуд",
    "Пекарня",
    "Десерты",
    "Напитки",
    "Другое"
  ];

  const leaseDurations = [
    "3 месяца",
    "6 месяцев", 
    "1 год",
    "2 года",
    "3 года",
    "Долгосрочная аренда"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!space) return;

    setIsSubmitting(true);

    try {
      const submitData = {
        space_id: space.id,
        space_name: space.name,
        space_area: parseFloat(space.area),
        floor_number: space.floor,
        ...formData,
        lease_start_date: formData.lease_start_date?.toISOString().split('T')[0] || null,
      };

      const { error } = await supabase
        .from('space_bookings')
        .insert(submitData);

      if (error) throw error;

      toast({
        title: "Заявка отправлена!",
        description: "Мы свяжемся с вами в ближайшее время для обсуждения деталей.",
      });

      onClose();
      setFormData({
        company_name: "",
        contact_person: "",
        email: "",
        phone: "",
        business_type: "",
        cuisine_type: "",
        description: "",
        expected_revenue: "",
        investment_budget: "",
        lease_start_date: undefined,
        lease_duration: "",
        preferred_contact_method: "email",
        best_contact_time: "",
        has_food_license: false,
        previous_experience: "",
        special_requirements: "",
      });
    } catch (error) {
      console.error('Error submitting space booking:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте еще раз.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!space) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            Заявка на аренду площади
          </DialogTitle>
          
          {/* Space Info Card */}
          <div className="bg-muted rounded-lg p-4 mb-6">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">{space.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{space.area} м²</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{space.floor} этаж</span>
              </div>
            </div>
            {space.note && (
              <p className="text-xs text-muted-foreground mt-2">{space.note}</p>
            )}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Информация о компании</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company_name">Название компании *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="contact_person">Контактное лицо *</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Телефон *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Детали бизнеса</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="business_type">Тип бизнеса *</Label>
                <Select value={formData.business_type} onValueChange={(value) => setFormData({...formData, business_type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип бизнеса" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="cuisine_type">Тип кухни</Label>
                <Input
                  id="cuisine_type"
                  value={formData.cuisine_type}
                  onChange={(e) => setFormData({...formData, cuisine_type: e.target.value})}
                  placeholder="Например: Азиатская, Европейская..."
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Описание концепции *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Опишите вашу бизнес-концепцию..."
                rows={4}
                required
              />
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Финансовая информация</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expected_revenue">Ожидаемая выручка (мес.)</Label>
                <Input
                  id="expected_revenue"
                  value={formData.expected_revenue}
                  onChange={(e) => setFormData({...formData, expected_revenue: e.target.value})}
                  placeholder="Например: $5,000-10,000"
                />
              </div>
              
              <div>
                <Label htmlFor="investment_budget">Инвестиционный бюджет</Label>
                <Input
                  id="investment_budget"
                  value={formData.investment_budget}
                  onChange={(e) => setFormData({...formData, investment_budget: e.target.value})}
                  placeholder="Например: $20,000-50,000"
                />
              </div>
            </div>
          </div>

          {/* Lease Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Детали аренды</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lease_start_date">Желаемая дата начала</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.lease_start_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.lease_start_date ? (
                        format(formData.lease_start_date, "PPP")
                      ) : (
                        <span>Выберите дату</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.lease_start_date}
                      onSelect={(date) => setFormData({...formData, lease_start_date: date})}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="lease_duration">Срок аренды *</Label>
                <Select value={formData.lease_duration} onValueChange={(value) => setFormData({...formData, lease_duration: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите срок аренды" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaseDurations.map((duration) => (
                      <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Contact Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Предпочтения по связи</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preferred_contact_method">Предпочтительный способ связи</Label>
                <Select value={formData.preferred_contact_method} onValueChange={(value) => setFormData({...formData, preferred_contact_method: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Телефон</SelectItem>
                    <SelectItem value="both">Оба</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="best_contact_time">Удобное время для связи</Label>
                <Input
                  id="best_contact_time"
                  value={formData.best_contact_time}
                  onChange={(e) => setFormData({...formData, best_contact_time: e.target.value})}
                  placeholder="Например: 10:00-18:00"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Дополнительная информация</h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="has_food_license"
                checked={formData.has_food_license}
                onCheckedChange={(checked) => setFormData({...formData, has_food_license: checked as boolean})}
              />
              <Label htmlFor="has_food_license">
                У нас есть лицензия на торговлю продуктами питания
              </Label>
            </div>

            <div>
              <Label htmlFor="previous_experience">Предыдущий опыт в сфере общепита</Label>
              <Textarea
                id="previous_experience"
                value={formData.previous_experience}
                onChange={(e) => setFormData({...formData, previous_experience: e.target.value})}
                placeholder="Расскажите о вашем опыте..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="special_requirements">Особые требования</Label>
              <Textarea
                id="special_requirements"
                value={formData.special_requirements}
                onChange={(e) => setFormData({...formData, special_requirements: e.target.value})}
                placeholder="Любые особые требования к помещению..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Отправка..." : "Отправить заявку"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SpaceBookingModal;