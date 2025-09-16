-- Enable realtime for user_notifications table
ALTER TABLE public.user_notifications REPLICA IDENTITY FULL;

-- Add the table to the realtime publication
-- This allows real-time subscriptions to work
SELECT
  pg_notify(
    'pgrst',
    json_build_object(
      'reload_schema', true
    )::text
  );

-- Insert a trigger to automatically send notifications when bookings are updated
CREATE OR REPLACE FUNCTION notify_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only send notification if status actually changed
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    -- Insert notification for the user
    INSERT INTO public.user_notifications (
      user_id,
      type,
      title,
      message,
      data
    ) VALUES (
      COALESCE(NEW.user_id, OLD.user_id),
      'booking',
      'Статус бронирования изменен',
      'Статус вашего бронирования #' || NEW.id || ' изменен на: ' || NEW.status,
      jsonb_build_object(
        'booking_id', NEW.id,
        'old_status', OLD.status,
        'new_status', NEW.status,
        'booking_date', NEW.booking_date,
        'time_slot', NEW.time_slot
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for booking status changes
DROP TRIGGER IF EXISTS booking_status_notification_trigger ON public.bookings;
CREATE TRIGGER booking_status_notification_trigger
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_booking_status_change();