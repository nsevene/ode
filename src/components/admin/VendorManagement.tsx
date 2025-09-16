import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CalendarIcon, MessageCircleIcon, MailIcon, PhoneIcon, UserIcon, PlusIcon, BuildingIcon } from "lucide-react";
import { format } from "date-fns";

interface VendorApplication {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  cuisine_type: string;
  preferred_sector: string;
  description: string;
  status: string;
  created_at: string;
  admin_notes?: string;
}

const VendorManagement = () => {
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<VendorApplication | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isWhatsAppDialogOpen, setIsWhatsAppDialogOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить заявки",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string, notes?: string) => {
    try {
      const updateData: any = { status };
      if (notes) updateData.admin_notes = notes;

      const { error } = await supabase
        .from('vendor_applications')
        .update(updateData)
        .eq('id', applicationId);

      if (error) throw error;

      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status, admin_notes: notes } : app
      ));
      
      toast({
        title: "Успех",
        description: "Статус заявки обновлен",
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус",
        variant: "destructive",
      });
    }
  };

  const sendEmail = async () => {
    if (!selectedApplication || !emailSubject || !emailContent) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('send-vendor-email', {
        body: {
          to: selectedApplication.email,
          subject: emailSubject,
          content: emailContent,
          vendor_name: selectedApplication.contact_person,
          company_name: selectedApplication.company_name
        }
      });

      if (error) throw error;
      
      toast({
        title: "Email отправлен",
        description: `Email отправлен ${selectedApplication.contact_person}`,
      });
      
      setEmailSubject("");
      setEmailContent("");
      setIsEmailDialogOpen(false);
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить email",
        variant: "destructive",
      });
    }
  };

  const sendWhatsApp = () => {
    if (!selectedApplication || !whatsappMessage) {
      toast({
        title: "Ошибка",
        description: "Введите сообщение",
        variant: "destructive",
      });
      return;
    }

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const phoneNumber = selectedApplication.phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp открыт",
      description: "Отправьте сообщение в WhatsApp",
    });
    
    setWhatsappMessage("");
    setIsWhatsAppDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'reviewing': return 'bg-blue-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'contacted': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает';
      case 'reviewing': return 'Рассматривается';
      case 'approved': return 'Одобрено';
      case 'rejected': return 'Отклонено';
      case 'contacted': return 'Связались';
      default: return status;
    }
  };

  const emailTemplates = {
    welcome: {
      subject: "Добро пожаловать в ODE Food Hall!",
      content: `Здравствуйте, {{vendor_name}}!

Спасибо за интерес к размещению {{company_name}} в ODE Food Hall.

Мы рассмотрели вашу заявку и хотели бы пригласить вас на встречу для обсуждения деталей сотрудничества.

Наш фуд-холл - это уникальное пространство, где собираются лучшие кулинарные концепции города. Мы предлагаем:

• Готовую инфраструктуру и оборудование
• Высокий трафик посетителей
• Маркетинговую поддержку
• Гибкие условия аренды

Когда вам будет удобно встретиться для обсуждения возможностей?

С уважением,
Команда ODE Food Hall`
    },
    meeting: {
      subject: "Приглашение на встречу - ODE Food Hall",
      content: `Здравствуйте, {{vendor_name}}!

Мы хотели бы пригласить вас на личную встречу в ODE Food Hall для обсуждения возможностей размещения {{company_name}}.

Предлагаем встретиться:
• Место: ODE Food Hall, Баку
• Удобное для вас время

На встрече мы покажем пространство, обсудим условия аренды и ответим на все ваши вопросы.

Пожалуйста, подтвердите удобное для вас время.

С уважением,
Команда ODE Food Hall`
    },
    proposal: {
      subject: "Коммерческое предложение - ODE Food Hall",
      content: `Здравствуйте, {{vendor_name}}!

Направляем вам индивидуальное коммерческое предложение для размещения {{company_name}} в ODE Food Hall.

Основные условия:
• Площадь: от 15 до 50 кв.м
• Аренда: от $50 за кв.м в месяц
• Коммунальные услуги включены
• Первый месяц - льготный период

Дополнительные преимущества:
• Готовое оборудование
• Маркетинговая поддержка
• Обучение персонала
• Техническая поддержка

Предложение действительно в течение 30 дней.

Готовы обсудить детали?

С уважением,
Команда ODE Food Hall`
    }
  };

  const useTemplate = (template: keyof typeof emailTemplates) => {
    const selectedTemplate = emailTemplates[template];
    setEmailSubject(selectedTemplate.subject);
    setEmailContent(
      selectedTemplate.content
        .replace(/{{vendor_name}}/g, selectedApplication?.contact_person || '')
        .replace(/{{company_name}}/g, selectedApplication?.company_name || '')
    );
  };

  if (loading) {
    return <div className="flex justify-center p-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление Арендаторами</h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-yellow-500/10">
            Ожидают: {applications.filter(a => a.status === 'pending').length}
          </Badge>
          <Badge variant="outline" className="bg-blue-500/10">
            Рассматриваются: {applications.filter(a => a.status === 'reviewing').length}
          </Badge>
          <Badge variant="outline" className="bg-green-500/10">
            Одобрены: {applications.filter(a => a.status === 'approved').length}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Все заявки</TabsTrigger>
          <TabsTrigger value="pending">Ожидают</TabsTrigger>
          <TabsTrigger value="reviewing">Рассматриваются</TabsTrigger>
          <TabsTrigger value="approved">Одобрены</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.map((application) => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BuildingIcon className="h-5 w-5" />
                      {application.company_name}
                    </CardTitle>
                    <Badge className={`${getStatusColor(application.status)} text-white`}>
                      {getStatusText(application.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{application.cuisine_type}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <UserIcon className="h-4 w-4" />
                    {application.contact_person}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MailIcon className="h-4 w-4" />
                    {application.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <PhoneIcon className="h-4 w-4" />
                    {application.phone}
                  </div>
                  
                  <div className="text-sm">
                    <p className="font-medium">Предпочтительный сектор:</p>
                    <p className="text-muted-foreground">{application.preferred_sector}</p>
                  </div>
                  
                  <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
                    {application.description}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Select onValueChange={(status) => updateApplicationStatus(application.id, status)}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Изменить статус" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Ожидает</SelectItem>
                        <SelectItem value="reviewing">Рассматривается</SelectItem>
                        <SelectItem value="contacted">Связались</SelectItem>
                        <SelectItem value="approved">Одобрено</SelectItem>
                        <SelectItem value="rejected">Отклонено</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-1 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedApplication(application);
                        setIsEmailDialogOpen(true);
                      }}
                    >
                      <MailIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedApplication(application);
                        setIsWhatsAppDialogOpen(true);
                      }}
                    >
                      <MessageCircleIcon className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {application.admin_notes && (
                    <div className="text-xs text-muted-foreground mt-2 p-2 bg-blue-50 rounded">
                      <strong>Заметки:</strong> {application.admin_notes}
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    Подано: {format(new Date(application.created_at), 'dd.MM.yyyy')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.filter(a => a.status === 'pending').map((application) => (
              <Card key={application.id}>
                {/* Same card content as above */}
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Отправить Email - {selectedApplication?.contact_person}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Шаблоны</Label>
              <div className="flex gap-2 mt-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => useTemplate('welcome')}
                >
                  Добро пожаловать
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => useTemplate('meeting')}
                >
                  Приглашение
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => useTemplate('proposal')}
                >
                  Предложение
                </Button>
              </div>
            </div>
            
            <div>
              <Label>Тема</Label>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Тема сообщения"
              />
            </div>
            
            <div>
              <Label>Сообщение</Label>
              <Textarea
                rows={12}
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Введите сообщение..."
              />
            </div>
            
            <Button onClick={sendEmail} className="w-full">
              <MailIcon className="h-4 w-4 mr-2" />
              Отправить Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* WhatsApp Dialog */}
      <Dialog open={isWhatsAppDialogOpen} onOpenChange={setIsWhatsAppDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              WhatsApp - {selectedApplication?.contact_person}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Быстрые сообщения</Label>
              <div className="flex flex-col gap-2 mt-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setWhatsappMessage("Добро пожаловать в ODE Food Hall! Мы рассмотрели вашу заявку. Когда удобно встретиться?")}
                >
                  Приглашение на встречу
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setWhatsappMessage("Спасибо за интерес! Отправили вам подробную информацию на email.")}
                >
                  Подтверждение
                </Button>
              </div>
            </div>
            
            <div>
              <Label>Сообщение</Label>
              <Textarea
                rows={4}
                value={whatsappMessage}
                onChange={(e) => setWhatsappMessage(e.target.value)}
                placeholder="Введите сообщение для WhatsApp..."
              />
            </div>
            
            <Button onClick={sendWhatsApp} className="w-full">
              <MessageCircleIcon className="h-4 w-4 mr-2" />
              Отправить в WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorManagement;