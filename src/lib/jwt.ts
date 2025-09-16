// JWT токены должны обрабатываться только на сервере
// Этот файл удален из соображений безопасности - JWT секреты 
// не должны находиться в клиентском коде

import { supabase } from '@/integrations/supabase/client';

export async function signDeepLink(payload: Record<string, any>): Promise<string> {
  const { data, error } = await supabase.functions.invoke('sign-deeplink', {
    body: payload
  });
  
  if (error) throw new Error(`Failed to sign deeplink: ${error.message}`);
  return data.token;
}

export async function verifyDeepLink(token: string): Promise<any> {
  const { data, error } = await supabase.functions.invoke('verify-deeplink', {
    body: { token }
  });
  
  if (error) throw new Error(`Failed to verify deeplink: ${error.message}`);
  return data;
}