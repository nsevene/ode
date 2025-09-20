import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';

interface SecurityAuditEvent {
  event_type: string;
  user_id?: string;
  user_role?: string;
  page_path: string;
  details: Record<string, any>;
  timestamp: string;
  session_id?: string;
}

export const useSecurityAudit = () => {
  const { user, session } = useAuth();
  const { role } = useUserRole();

  const logAuditEvent = async (
    event: Omit<SecurityAuditEvent, 'timestamp' | 'user_id' | 'user_role'>
  ) => {
    const auditEvent: SecurityAuditEvent = {
      ...event,
      user_id: user?.id,
      user_role: role,
      timestamp: new Date().toISOString(),
      session_id: session?.access_token?.substring(0, 8), // First 8 chars for session tracking
    };

    try {
      // Log to console for development
      console.log('🔒 Security Audit:', auditEvent);

      // In production, send to logging service
      // await supabase.functions.invoke('security-audit-logger', {
      //   body: auditEvent
      // });
    } catch (error) {
      console.error('Failed to log security audit event:', error);
    }
  };

  // Auto-log page navigation for admin users
  useEffect(() => {
    if (role === 'admin') {
      logAuditEvent({
        event_type: 'admin_page_access',
        page_path: window.location.pathname,
        details: {
          referrer: document.referrer,
          user_agent: navigator.userAgent,
          timestamp: Date.now(),
        },
      });
    }
  }, [role]);

  return { logAuditEvent };
};
