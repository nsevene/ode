-- Fix critical security vulnerability in support_chats and support_messages
-- Remove anonymous access to guest contact information

-- Drop existing insecure policies
DROP POLICY IF EXISTS "Users can view their own chats" ON public.support_chats;
DROP POLICY IF EXISTS "Users can view messages in their chats" ON public.support_messages;

-- Create secure policies for support_chats
CREATE POLICY "Authenticated users can view their own chats" 
ON public.support_chats 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Admins can view all chats" 
ON public.support_chats 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
));

-- Create secure policies for support_messages  
CREATE POLICY "Authenticated users can view messages in their chats" 
ON public.support_messages 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.support_chats sc 
  WHERE sc.id = support_messages.chat_id 
  AND auth.uid() IS NOT NULL 
  AND sc.user_id = auth.uid()
));

-- Update the existing admin policy to use user_roles instead of raw_user_meta_data
DROP POLICY IF EXISTS "Admins can view all chats" ON public.support_chats;
DROP POLICY IF EXISTS "Admins can manage all messages" ON public.support_messages;

CREATE POLICY "Admins can manage all chats" 
ON public.support_chats 
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
));

CREATE POLICY "Admins can manage all messages" 
ON public.support_messages 
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
));