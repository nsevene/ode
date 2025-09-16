-- Create support chat tables
CREATE TABLE public.support_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  guest_email TEXT,
  guest_name TEXT,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'normal',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE,
  admin_user_id UUID REFERENCES auth.users(id),
  CONSTRAINT valid_user_or_guest CHECK (
    (user_id IS NOT NULL AND guest_email IS NULL AND guest_name IS NULL) OR
    (user_id IS NULL AND guest_email IS NOT NULL AND guest_name IS NOT NULL)
  )
);

CREATE TABLE public.support_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID NOT NULL REFERENCES public.support_chats(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'admin', 'system')),
  sender_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.support_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for support_chats
CREATE POLICY "Users can view their own chats" 
ON public.support_chats 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (auth.uid() IS NULL AND guest_email IS NOT NULL)
);

CREATE POLICY "Users can create their own chats" 
ON public.support_chats 
FOR INSERT 
WITH CHECK (
  (auth.uid() IS NOT NULL AND user_id = auth.uid() AND guest_email IS NULL) OR
  (user_id IS NULL AND guest_email IS NOT NULL AND guest_name IS NOT NULL)
);

CREATE POLICY "Admins can view all chats" 
ON public.support_chats 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  )
);

-- RLS Policies for support_messages
CREATE POLICY "Users can view messages in their chats" 
ON public.support_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.support_chats sc 
    WHERE sc.id = chat_id AND (
      (auth.uid() IS NOT NULL AND sc.user_id = auth.uid()) OR
      (auth.uid() IS NULL AND sc.guest_email IS NOT NULL)
    )
  )
);

CREATE POLICY "Users can send messages in their chats" 
ON public.support_messages 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.support_chats sc 
    WHERE sc.id = chat_id AND (
      (auth.uid() IS NOT NULL AND sc.user_id = auth.uid()) OR
      (auth.uid() IS NULL AND sc.guest_email IS NOT NULL)
    )
  )
);

CREATE POLICY "Admins can manage all messages" 
ON public.support_messages 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  )
);

-- Add realtime for real-time chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_chats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;

-- Trigger to update updated_at
CREATE TRIGGER update_support_chats_updated_at
  BEFORE UPDATE ON public.support_chats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();