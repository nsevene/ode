import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DemoModeNotificationProps {
  show: boolean;
  onClose: () => void;
  action?: string;
}

const DemoModeNotification: React.FC<DemoModeNotificationProps> = ({
  show,
  onClose,
  action = 'action'
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={cn(
        "bg-white rounded-xl shadow-elegant max-w-md w-full p-6",
        "border border-warning/20 animate-fade-in"
      )}>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-warning" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground mb-2">
              Demo Mode Active
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              This {action} is disabled in demo mode. This is a preview portal showcasing 
              the functionality without processing real transactions.
            </p>
            <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
              <div className="font-medium mb-1">Demo Mode Features:</div>
              <ul className="space-y-1">
                <li>• Test payments only</li>
                <li>• No real bookings</li>
                <li>• Disabled notifications</li>
                <li>• Preview functionality</li>
              </ul>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoModeNotification;