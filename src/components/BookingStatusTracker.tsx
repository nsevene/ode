import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, UtensilsCrossed, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingStatus {
  id: string;
  status: string;
  created_at: string;
  booking_date: string;
  time_slot: string;
  experience_type: string;
  guest_count: number;
  payment_amount?: number;
}

interface BookingStatusTrackerProps {
  booking: BookingStatus;
}

const statusStages = [
  {
    key: 'confirmed',
    label: 'Booking Accepted',
    icon: CheckCircle,
    description: 'Your reservation is confirmed'
  },
  {
    key: 'paid', 
    label: 'Payment Confirmed',
    icon: CheckCircle,
    description: 'Payment successfully processed'
  },
  {
    key: 'preparing',
    label: 'Preparing Table',
    icon: UtensilsCrossed,
    description: 'Team is preparing your table'
  },
  {
    key: 'ready',
    label: 'Ready',
    icon: PartyPopper,
    description: 'Everything is ready for your visit'
  }
];

const getStatusIndex = (status: string) => {
  const index = statusStages.findIndex(stage => stage.key === status);
  return index === -1 ? 0 : index;
};

const BookingStatusTracker: React.FC<BookingStatusTrackerProps> = ({ booking }) => {
  const currentStatusIndex = getStatusIndex(booking.status);

  const getStatusMessage = () => {
    switch (booking.status) {
      case 'confirmed':
        return 'Your booking is confirmed! Awaiting payment.';
      case 'paid':
        return 'Payment received! Preparing everything for your visit.';
      case 'preparing':
        return 'Our team is preparing your table. Everything will be ready soon!';
      case 'ready':
        return 'Everything is ready! We are waiting for you at ODE Food Hall.';
      case 'completed':
        return 'Thank you for your visit! We hope you enjoyed it.';
      default:
        return 'Processing your booking...';
    }
  };

  const getEstimatedTime = () => {
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.time_slot}`);
    const now = new Date();
    const diffHours = Math.ceil((bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffHours <= 0) {
      return 'Now';
    } else if (diffHours <= 2) {
      return `In ${diffHours} h.`;
    } else if (diffHours <= 24) {
      return `Today at ${booking.time_slot}`;
    } else {
      return bookingDateTime.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold text-primary">
          Booking Status
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {getEstimatedTime()} • {booking.guest_count} guests • {booking.experience_type}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Status Message */}
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="font-medium text-primary">{getStatusMessage()}</p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          {statusStages.map((stage, index) => {
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            const Icon = stage.icon;

            return (
              <div key={stage.key} className="flex items-start space-x-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : isCurrent
                        ? "bg-primary/10 border-primary text-primary animate-pulse"
                        : "bg-muted border-muted-foreground/30 text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  
                  {index < statusStages.length - 1 && (
                    <div
                      className={cn(
                        "w-0.5 h-8 mt-2 transition-colors duration-300",
                        index < currentStatusIndex
                          ? "bg-primary"
                          : "bg-muted-foreground/30"
                      )}
                    />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0 pb-4">
                  <div className="flex items-center space-x-2">
                    <h4
                      className={cn(
                        "font-medium transition-colors duration-300",
                        isCompleted
                          ? "text-primary"
                          : isCurrent
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      {stage.label}
                    </h4>
                    {isCompleted && (
                      <Badge variant="secondary" className="text-xs">
                        Done
                      </Badge>
                    )}
                    {isCurrent && booking.status !== 'completed' && (
                      <Badge variant="default" className="text-xs animate-pulse">
                        In Progress
                      </Badge>
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-sm mt-1 transition-colors duration-300",
                      isCompleted || isCurrent
                        ? "text-foreground/80"
                        : "text-muted-foreground"
                    )}
                  >
                    {stage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        {booking.status === 'ready' && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-primary mb-2">Important Information:</h4>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>• Address: ODE Food Hall, Jl. Raya Ubud, Ubud, Bali</li>
              <li>• We recommend arriving 10 minutes before your booking time</li>
              <li>• If delayed more than 15 minutes, your table may be given to other guests</li>
              <li>• Phone: +62 361 XXX XXXX</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingStatusTracker;