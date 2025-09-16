-- Create vendor meetings table
CREATE TABLE public.vendor_meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_application_id UUID NOT NULL REFERENCES public.vendor_applications(id),
  meeting_date DATE NOT NULL,
  meeting_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  meeting_type TEXT NOT NULL DEFAULT 'in_person',
  status TEXT NOT NULL DEFAULT 'scheduled',
  admin_notes TEXT,
  vendor_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendor communications table
CREATE TABLE public.vendor_communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_application_id UUID NOT NULL REFERENCES public.vendor_applications(id),
  communication_type TEXT NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  admin_user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email templates table
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  template_type TEXT NOT NULL DEFAULT 'vendor',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.vendor_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies for vendor_meetings
CREATE POLICY "Only admins can manage vendor meetings"
ON public.vendor_meetings
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- RLS policies for vendor_communications
CREATE POLICY "Only admins can manage vendor communications"
ON public.vendor_communications
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- RLS policies for email_templates
CREATE POLICY "Only admins can manage email templates"
ON public.email_templates
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Create trigger for updated_at columns
CREATE TRIGGER update_vendor_meetings_updated_at
  BEFORE UPDATE ON public.vendor_meetings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default email templates
INSERT INTO public.email_templates (name, subject, content, template_type) VALUES
('welcome', 'Добро пожаловать в ODE Food Hall!', 'Здравствуйте, {{company_name}}!\n\nБлагодарим за интерес к работе в ODE Food Hall. Мы рассмотрели вашу заявку и хотели бы обсудить возможности сотрудничества.\n\nС уважением,\nКоманда ODE Food Hall', 'vendor'),
('meeting_invitation', 'Приглашение на встречу - ODE Food Hall', 'Здравствуйте, {{contact_person}}!\n\nМы хотели бы пригласить вас на встречу для обсуждения вашей заявки на размещение в ODE Food Hall.\n\nПредлагаемое время: {{meeting_time}}\nМесто: {{meeting_location}}\n\nПожалуйста, подтвердите ваше участие.\n\nС уважением,\nКоманда ODE Food Hall', 'vendor'),
('proposal_request', 'Запрос коммерческого предложения', 'Здравствуйте, {{contact_person}}!\n\nПросим вас подготовить коммерческое предложение для размещения {{cuisine_type}} в секторе {{preferred_sector}}.\n\nНеобходимые документы:\n- Бизнес-план\n- Финансовые показатели\n- Меню и ценовая политика\n\nСрок подачи: {{deadline}}\n\nС уважением,\nКоманда ODE Food Hall', 'vendor');