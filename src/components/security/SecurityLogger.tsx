import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  event_type: string;
  user_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
}

export const SecurityLogger = () => {
  const { user } = useAuth();

  const logSecurityEvent = async (event: Omit<SecurityEvent, 'timestamp'>) => {
    try {
      const securityEvent: SecurityEvent = {
        ...event,
        timestamp: new Date().toISOString(),
        ip_address: 'client-side', // In production, get from server
        user_agent: navigator.userAgent,
      };

      console.log('Security Event:', securityEvent);
      
      // Send to security audit logging function
      try {
        await supabase.functions.invoke('security-audit-logger', {
          body: securityEvent
        });
      } catch (error) {
        console.error('Failed to send security event to audit logger:', error);
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  useEffect(() => {
    // Log authentication events
    if (user) {
      logSecurityEvent({
        event_type: 'user_authenticated',
        user_id: user.id,
        details: {
          email: user.email,
          last_sign_in: user.last_sign_in_at,
          app_metadata: user.app_metadata,
        }
      });
    }

    // Log page visibility changes (potential security concern)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && user) {
        logSecurityEvent({
          event_type: 'session_hidden',
          user_id: user.id,
          details: { visibility_state: document.visibilityState }
        });
      }
    };

    // Log before page unload
    const handleBeforeUnload = () => {
      if (user) {
        logSecurityEvent({
          event_type: 'session_ending',
          user_id: user.id,
          details: { reason: 'page_unload' }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]);

  // This component doesn't render anything
  return null;
};