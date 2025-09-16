-- Обновляем политику для гостевых бронирований
-- Убираем старую политику
DROP POLICY IF EXISTS "Guest bookings allowed" ON public.bookings;

-- Создаем новую политику, которая корректно обрабатывает гостевые бронирования
CREATE POLICY "Guest bookings allowed" 
ON public.bookings 
FOR INSERT 
WITH CHECK (
  (user_id IS NULL) 
  AND (guest_email IS NOT NULL) 
  AND (guest_name IS NOT NULL)
  AND (guest_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);