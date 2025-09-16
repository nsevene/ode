import { useAuthSecurity } from '@/hooks/useAuthSecurity';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Clock, User, AlertTriangle } from 'lucide-react';

export const SecurityStatus = () => {
  const { session, user } = useAuth();
  const { isAuthenticated, isSessionExpired } = useAuthSecurity();

  if (!user || !session) return null;

  const getSessionTimeRemaining = () => {
    if (!session.expires_at) return null;
    
    const expiresAt = session.expires_at * 1000;
    const now = Date.now();
    const remaining = expiresAt - now;
    
    if (remaining <= 0) return 'Истекла';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}ч ${minutes}м`;
    return `${minutes}м`;
  };

  const timeRemaining = getSessionTimeRemaining();
  const isExpiringSoon = session.expires_at && 
    (session.expires_at * 1000 - Date.now()) < 5 * 60 * 1000; // 5 minutes

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4" />
          Статус безопасности
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Аутентификация</span>
          <Badge variant={isAuthenticated ? "default" : "destructive"}>
            {isAuthenticated ? "Активна" : "Неактивна"}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Сессия</span>
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <Badge variant={isExpiringSoon ? "destructive" : "secondary"}>
              {timeRemaining || "Неизвестно"}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Пользователь</span>
          <div className="flex items-center gap-2">
            <User className="h-3 w-3" />
            <span className="text-xs font-mono">
              {user.email?.substring(0, 20)}...
            </span>
          </div>
        </div>

        {isExpiringSoon && (
          <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-md">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Сессия скоро истечет
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};