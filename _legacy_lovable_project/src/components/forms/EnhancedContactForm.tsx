import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  useFormValidation,
  FormErrorDisplay,
  FormSuccessDisplay,
  validationRules,
} from './FormValidation';
import { supabase } from '@/integrations/supabase/client';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface EnhancedContactFormProps {
  onSuccess?: () => void;
  className?: string;
}

const EnhancedContactForm: React.FC<EnhancedContactFormProps> = ({
  onSuccess,
  className = '',
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const { toast } = useToast();

  const {
    errors,
    isSubmitting,
    setIsSubmitting,
    validateForm,
    validateSingleField,
    clearErrors,
  } = useFormValidation();

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Real-time validation
    const rules = {
      name: validationRules.name,
      email: validationRules.email,
      phone: validationRules.phone,
      message: validationRules.message,
    }[field];

    if (rules) {
      validateSingleField(field, value, rules);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous success message
    setSuccessMessage('');

    // Validate all fields
    const fieldsToValidate = [
      { name: 'name', value: formData.name, rules: validationRules.name },
      { name: 'email', value: formData.email, rules: validationRules.email },
      { name: 'phone', value: formData.phone, rules: validationRules.phone },
      {
        name: 'message',
        value: formData.message,
        rules: validationRules.message,
      },
    ];

    if (!validateForm(fieldsToValidate)) {
      toast({
        title: 'Ошибка валидации',
        description: 'Пожалуйста, исправьте ошибки в форме',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a simple object to send to edge function
      const contactData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      };

      // Submit contact message via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke(
        'submit-contact',
        {
          body: contactData,
        }
      );

      if (error) {
        throw new Error(error.message || 'Failed to send message');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Success
      setSuccessMessage(
        'Сообщение отправлено! Мы свяжемся с вами в ближайшее время.'
      );
      setFormData({ name: '', email: '', phone: '', message: '' });
      clearErrors();

      toast({
        title: 'Сообщение отправлено!',
        description: 'Спасибо за обращение. Мы ответим в течение 24 часов.',
      });

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Ошибка отправки',
        description:
          error.message || 'Не удалось отправить сообщение. Попробуйте позже.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Имя *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ваше имя"
                className={errors.name ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              <FormErrorDisplay error={errors.name} />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                className={errors.email ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              <FormErrorDisplay error={errors.email} />
            </div>
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+62 (819) 432-863-95"
              className={errors.phone ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            <FormErrorDisplay error={errors.phone} />
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="message">Сообщение *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Расскажите, чем можем помочь..."
              rows={4}
              className={errors.message ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            <FormErrorDisplay error={errors.message} />
          </div>

          {/* Success Message */}
          <FormSuccessDisplay message={successMessage} />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedContactForm;
