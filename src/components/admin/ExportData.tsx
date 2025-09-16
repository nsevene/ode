import React, { useState } from 'react';
import { Download, FileSpreadsheet, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DateRange } from 'react-day-picker';

const ExportData = () => {
  const { toast } = useToast();
  const [exportType, setExportType] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      let query = supabase
        .from('vendor_applications')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (exportType !== 'all') {
        query = query.eq('status', exportType);
      }

      if (dateRange?.from) {
        query = query.gte('created_at', dateRange.from.toISOString());
      }

      if (dateRange?.to) {
        query = query.lte('created_at', dateRange.to.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      // Convert to CSV
      if (!data || data.length === 0) {
        toast({
          title: "Нет данных",
          description: "Нет данных для экспорта с выбранными фильтрами",
          variant: "destructive"
        });
        return;
      }

      const headers = [
        'ID', 'Название компании', 'Контактное лицо', 'Email', 'Телефон',
        'Тип кухни', 'Предпочитаемый сектор', 'Опыт (лет)', 'Описание',
        'Ожидаемый доход', 'Инвестиционный бюджет', 'Статус',
        'Заметки администратора', 'Дата создания', 'Дата обновления'
      ];

      const csvContent = [
        headers.join(','),
        ...data.map(row => [
          row.id,
          `"${row.company_name}"`,
          `"${row.contact_person}"`,
          row.email,
          row.phone,
          `"${row.cuisine_type}"`,
          `"${row.preferred_sector}"`,
          row.experience_years || '',
          `"${row.description.replace(/"/g, '""')}"`,
          `"${row.expected_revenue || ''}"`,
          `"${row.investment_budget || ''}"`,
          row.status,
          `"${row.admin_notes || ''}"`,
          new Date(row.created_at).toLocaleDateString('ru-RU'),
          new Date(row.updated_at).toLocaleDateString('ru-RU')
        ].join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `vendor_applications_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Экспорт завершен",
        description: `Экспортировано ${data.length} заявок`,
      });

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось экспортировать данные",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5" />
          Экспорт данных
        </CardTitle>
        <CardDescription>
          Экспорт заявок арендаторов в CSV формате
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Тип заявок</label>
          <Select value={exportType} onValueChange={(value) => setExportType(value as 'all' | 'pending' | 'approved' | 'rejected')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все заявки</SelectItem>
              <SelectItem value="pending">Ожидающие</SelectItem>
              <SelectItem value="approved">Одобренные</SelectItem>
              <SelectItem value="rejected">Отклоненные</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Период</label>
          <DatePickerWithRange
            selected={dateRange}
            onSelect={setDateRange}
            className="w-full"
          />
        </div>

        <Button
          onClick={exportToCSV}
          disabled={isExporting}
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Экспортируем...' : 'Экспортировать в CSV'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExportData;