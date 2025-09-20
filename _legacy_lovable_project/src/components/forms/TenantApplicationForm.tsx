import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function TenantApplicationForm() {
  const [form, setForm] = useState({
    brand: '',
    cuisine: '',
    format: 'long-term', // long-term | popup
    preferred_corner: '',
    instagram: '',
    expected_revenue: '',
    notes: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('tenant_applications').insert({
        brand: form.brand,
        cuisine: form.cuisine,
        format: form.format,
        preferred_corner: form.preferred_corner || null,
        instagram: form.instagram || null,
        expected_revenue: form.expected_revenue || null,
        notes: form.notes || null,
        contact_name: form.contact_name,
        contact_email: form.contact_email,
        contact_phone: form.contact_phone || null,
      });

      if (error) {
        console.error('Error submitting application:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось отправить заявку. Попробуйте еще раз.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Заявка отправлена!',
        description: 'Мы свяжемся с вами в течение 24 часов.',
      });

      // Reset form
      setForm({
        brand: '',
        cuisine: '',
        format: 'long-term',
        preferred_corner: '',
        instagram: '',
        expected_revenue: '',
        notes: '',
        contact_name: '',
        contact_email: '',
        contact_phone: '',
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Ошибка',
        description: 'Произошла неожиданная ошибка. Попробуйте еще раз.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-4">
      <Input
        label="Контактное лицо"
        value={form.contact_name}
        onChange={(v) => setForm({ ...form, contact_name: v })}
        required
      />
      <Input
        label="Email"
        type="email"
        value={form.contact_email}
        onChange={(v) => setForm({ ...form, contact_email: v })}
        required
      />
      <Input
        label="Телефон"
        value={form.contact_phone}
        onChange={(v) => setForm({ ...form, contact_phone: v })}
        placeholder="+62 812-3456-7890"
      />

      <Input
        label="Бренд / проект"
        value={form.brand}
        onChange={(v) => setForm({ ...form, brand: v })}
        required
      />
      <Input
        label="Кухня / концепция"
        value={form.cuisine}
        onChange={(v) => setForm({ ...form, cuisine: v })}
        required
      />

      <div className="rounded-xl border p-4">
        <div className="text-xs uppercase text-muted-foreground mb-2">
          Формат
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="format"
              checked={form.format === 'long-term'}
              onChange={() => setForm({ ...form, format: 'long-term' })}
            />
            <span>Долгосрочный резидент</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="format"
              checked={form.format === 'popup'}
              onChange={() => setForm({ ...form, format: 'popup' })}
            />
            <span>Pop-Up Open Kitchen</span>
          </label>
        </div>
      </div>

      <Input
        label="Предпочтительный корнер (опционально)"
        value={form.preferred_corner}
        onChange={(v) => setForm({ ...form, preferred_corner: v })}
        placeholder="Pizza / Burger&BBQ / Sushi / Gelato&Retail / …"
      />
      <Input
        label="Instagram"
        value={form.instagram}
        onChange={(v) => setForm({ ...form, instagram: v })}
        placeholder="@brand"
      />
      <Input
        label="Ожидаемый оборот (IDR/мес)"
        value={form.expected_revenue}
        onChange={(v) => setForm({ ...form, expected_revenue: v })}
      />
      <Textarea
        label="Комментарий"
        value={form.notes}
        onChange={(v) => setForm({ ...form, notes: v })}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg border px-4 py-2 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Отправляем...' : 'Отправить заявку'}
      </button>
    </form>
  );
}

function Input({
  label,
  value,
  onChange,
  required = false,
  placeholder = '',
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-sm">
        {label}
        {required && <span className="text-red-500">*</span>}
      </div>
      <input
        className="w-full rounded-lg border px-3 py-2"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-sm">{label}</div>
      <textarea
        className="w-full rounded-lg border px-3 py-2 min-h-[120px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
