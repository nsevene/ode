-- Create table for space booking comments
CREATE TABLE public.space_booking_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.space_bookings(id) ON DELETE CASCADE,
  admin_user_id UUID NOT NULL,
  comment TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.space_booking_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for space booking comments
CREATE POLICY "Admins can manage all comments"
ON public.space_booking_comments
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  )
);

-- Create trigger for automatic updated_at
CREATE TRIGGER update_space_booking_comments_updated_at
  BEFORE UPDATE ON public.space_booking_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column_secure();

-- Add admin_notes_count to space_bookings for quick reference
ALTER TABLE public.space_bookings 
ADD COLUMN admin_notes_count INTEGER DEFAULT 0;

-- Function to update comment count
CREATE OR REPLACE FUNCTION public.update_booking_comment_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.space_bookings 
    SET admin_notes_count = admin_notes_count + 1
    WHERE id = NEW.booking_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.space_bookings 
    SET admin_notes_count = GREATEST(0, admin_notes_count - 1)
    WHERE id = OLD.booking_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create triggers for comment count
CREATE TRIGGER space_booking_comments_insert_count
  AFTER INSERT ON public.space_booking_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_booking_comment_count();

CREATE TRIGGER space_booking_comments_delete_count
  AFTER DELETE ON public.space_booking_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_booking_comment_count();