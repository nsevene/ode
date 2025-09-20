import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Send, Building2, CheckCircle } from 'lucide-react';

interface TenantApplicationFormProps {
  onSuccess?: () => void;
}

const TenantApplicationForm: React.FC<TenantApplicationFormProps> = ({
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    // Company Information
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',

    // Business Details
    business_type: '',
    cuisine_type: '',
    description: '',
    previous_experience: '',

    // Financial Information
    expected_revenue: '',
    investment_budget: '',
    lease_duration: '',

    // Space Preferences
    space_id: 1,
    floor_number: 1,
    space_name: '',
    space_area: 25,

    // Requirements
    has_food_license: false,
    special_requirements: '',

    // Contact Preferences
    preferred_contact_method: 'email' as 'email' | 'phone',
    best_contact_time: '',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      const requiredFields = [
        'company_name',
        'contact_person',
        'email',
        'phone',
        'business_type',
        'description',
      ];
      const missingFields = requiredFields.filter(
        (field) => !formData[field as keyof typeof formData]
      );

      if (missingFields.length > 0) {
        toast({
          title: 'Заполните обязательные поля',
          description: 'Пожалуйста, заполните все обязательные поля формы',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.from('space_bookings').insert([
        {
          company_name: formData.company_name,
          contact_person: formData.contact_person,
          email: formData.email,
          phone: formData.phone,
          business_type: formData.business_type,
          cuisine_type: formData.cuisine_type || null,
          description: formData.description,
          previous_experience: formData.previous_experience || null,
          expected_revenue: formData.expected_revenue || null,
          investment_budget: formData.investment_budget || null,
          lease_duration: formData.lease_duration,
          space_id: formData.space_id,
          floor_number: formData.floor_number,
          space_name: formData.space_name || `Space ${formData.space_id}`,
          space_area: formData.space_area,
          has_food_license: formData.has_food_license,
          special_requirements: formData.special_requirements || null,
          preferred_contact_method: formData.preferred_contact_method,
          best_contact_time: formData.best_contact_time || null,
          status: 'pending',
        },
      ]);

      // Send notification email for new applications
      try {
        await supabase.functions.invoke('send-tenant-notification', {
          body: {
            booking_id: formData.company_name + '-' + Date.now(), // Temporary ID for new applications
            status: 'pending',
            notify_admins: true,
          },
        });
      } catch (emailError) {
        console.error('Error sending notification email:', emailError);
        // Don't throw here - application succeeded
      }

      setIsSubmitted(true);
      toast({
        title: 'Заявка отправлена успешно!',
        description:
          'Мы свяжемся с вами в ближайшее время для обсуждения деталей.',
      });

      onSuccess?.();
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Ошибка при отправке заявки',
        description: error.message || 'Попробуйте еще раз позже',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6 text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Заявка отправлена успешно!
            </h2>
            <p className="text-muted-foreground">
              Спасибо за интерес к ODE Food Hall. Наша команда рассмотрит вашу
              заявку и свяжется с вами в течение 2-3 рабочих дней.
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <p>
              <strong>Номер заявки:</strong> #{Date.now().toString().slice(-6)}
            </p>
            <p>
              <strong>Email для связи:</strong> {formData.email}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Заявка на аренду помещения
        </CardTitle>
        <CardDescription>
          Заполните форму ниже, чтобы подать заявку на аренду помещения в ODE
          Food Hall
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                  onChange={(e) =>
                    handleInputChange('company_name', e.target.value)
                  }
                  placeholder="ООО Вкусная еда"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact_person">Контактное лицо *</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) =>
                    handleInputChange('contact_person', e.target.value)
                  }
                  placeholder="Иван Иванов"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="contact@company.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Телефон *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+7 (999) 123-45-67"
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
                <Select
                  value={formData.business_type}
                  onValueChange={(value) =>
                    handleInputChange('business_type', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип бизнеса" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">Ресторан</SelectItem>
                    <SelectItem value="cafe">Кафе</SelectItem>
                    <SelectItem value="bar">Бар</SelectItem>
                    <SelectItem value="bakery">Пекарня</SelectItem>
                    <SelectItem value="street_food">Стрит-фуд</SelectItem>
                    <SelectItem value="desserts">Десерты</SelectItem>
                    <SelectItem value="other">Другое</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cuisine_type">Тип кухни</Label>
                <Input
                  id="cuisine_type"
                  value={formData.cuisine_type}
                  onChange={(e) =>
                    handleInputChange('cuisine_type', e.target.value)
                  }
                  placeholder="Итальянская, Азиатская, Русская"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Описание концепции *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                placeholder="Расскажите о вашей концепции, меню и целевой аудитории"
                rows={4}
                required
              />
            </div>
            <div>
              <Label htmlFor="previous_experience">Предыдущий опыт</Label>
              <Textarea
                id="previous_experience"
                value={formData.previous_experience}
                onChange={(e) =>
                  handleInputChange('previous_experience', e.target.value)
                }
                placeholder="Расскажите о вашем опыте в ресторанном бизнесе"
                rows={3}
              />
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Финансовая информация</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="expected_revenue">
                  Ожидаемый оборот в месяц
                </Label>
                <Select
                  value={formData.expected_revenue}
                  onValueChange={(value) =>
                    handleInputChange('expected_revenue', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите диапазон" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_500k">До 500,000 ₽</SelectItem>
                    <SelectItem value="500k_1m">
                      500,000 - 1,000,000 ₽
                    </SelectItem>
                    <SelectItem value="1m_2m">
                      1,000,000 - 2,000,000 ₽
                    </SelectItem>
                    <SelectItem value="2m_5m">
                      2,000,000 - 5,000,000 ₽
                    </SelectItem>
                    <SelectItem value="over_5m">Свыше 5,000,000 ₽</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="investment_budget">Инвестиционный бюджет</Label>
                <Select
                  value={formData.investment_budget}
                  onValueChange={(value) =>
                    handleInputChange('investment_budget', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите диапазон" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_1m">До 1,000,000 ₽</SelectItem>
                    <SelectItem value="1m_3m">
                      1,000,000 - 3,000,000 ₽
                    </SelectItem>
                    <SelectItem value="3m_5m">
                      3,000,000 - 5,000,000 ₽
                    </SelectItem>
                    <SelectItem value="5m_10m">
                      5,000,000 - 10,000,000 ₽
                    </SelectItem>
                    <SelectItem value="over_10m">Свыше 10,000,000 ₽</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="lease_duration">Срок аренды *</Label>
                <Select
                  value={formData.lease_duration}
                  onValueChange={(value) =>
                    handleInputChange('lease_duration', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите срок" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12_months">12 месяцев</SelectItem>
                    <SelectItem value="24_months">24 месяца</SelectItem>
                    <SelectItem value="36_months">36 месяцев</SelectItem>
                    <SelectItem value="60_months">60 месяцев</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Space Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Предпочтения по помещению</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="floor_number">Этаж</Label>
                <Select
                  value={formData.floor_number.toString()}
                  onValueChange={(value) =>
                    handleInputChange('floor_number', parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите этаж" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1-й этаж</SelectItem>
                    <SelectItem value="2">2-й этаж</SelectItem>
                    <SelectItem value="0">Без предпочтений</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="space_area">Желаемая площадь (м²)</Label>
                <Select
                  value={formData.space_area.toString()}
                  onValueChange={(value) =>
                    handleInputChange('space_area', parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите площадь" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15-20 м²</SelectItem>
                    <SelectItem value="25">25-30 м²</SelectItem>
                    <SelectItem value="35">35-40 м²</SelectItem>
                    <SelectItem value="50">50+ м²</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="preferred_contact_method">
                  Предпочитаемый способ связи
                </Label>
                <Select
                  value={formData.preferred_contact_method}
                  onValueChange={(value) =>
                    handleInputChange('preferred_contact_method', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Способ связи" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Телефон</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Дополнительные требования</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="has_food_license"
                checked={formData.has_food_license}
                onCheckedChange={(checked) =>
                  handleInputChange('has_food_license', checked)
                }
              />
              <Label htmlFor="has_food_license">
                У меня есть лицензия на пищевую деятельность
              </Label>
            </div>
            <div>
              <Label htmlFor="special_requirements">Особые требования</Label>
              <Textarea
                id="special_requirements"
                value={formData.special_requirements}
                onChange={(e) =>
                  handleInputChange('special_requirements', e.target.value)
                }
                placeholder="Укажите любые особые требования к помещению или оборудованию"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="best_contact_time">Удобное время для связи</Label>
              <Input
                id="best_contact_time"
                value={formData.best_contact_time}
                onChange={(e) =>
                  handleInputChange('best_contact_time', e.target.value)
                }
                placeholder="Например: будние дни с 9:00 до 18:00"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="w-full"
          >
            {isLoading ? (
              'Отправляем заявку...'
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Отправить заявку
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TenantApplicationForm;
