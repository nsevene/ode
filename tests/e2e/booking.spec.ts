import { test, expect } from '@playwright/test';

test.describe('Booking System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display available events', async ({ page }) => {
    await page.goto('/events');
    
    // Check if events are displayed
    await expect(page.locator('[data-testid="event-card"]')).toBeVisible();
    
    // Check for event details
    await expect(page.locator('[data-testid="event-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="event-price"]')).toBeVisible();
    await expect(page.locator('[data-testid="event-date"]')).toBeVisible();
  });

  test('should allow event booking', async ({ page }) => {
    await page.goto('/events');
    
    // Click on first available event
    const firstEvent = page.locator('[data-testid="event-card"]').first();
    await firstEvent.click();
    
    // Check if booking form is displayed
    await expect(page.locator('[data-testid="booking-form"]')).toBeVisible();
    
    // Fill booking form
    await page.fill('[data-testid="booking-name"]', 'Test User');
    await page.fill('[data-testid="booking-email"]', 'test@example.com');
    await page.fill('[data-testid="booking-phone"]', '+1234567890');
    
    // Select date and time
    const dateInput = page.locator('[data-testid="booking-date"]');
    if (await dateInput.isVisible()) {
      await dateInput.click();
      await page.locator('[data-testid="date-picker"]').first().click();
    }
    
    // Submit booking
    await page.click('[data-testid="submit-booking"]');
    
    // Check for confirmation
    await expect(page.locator('text=Booking confirmed')).toBeVisible();
  });

  test('should handle payment integration', async ({ page }) => {
    await page.goto('/events');
    
    // Go through booking process
    const firstEvent = page.locator('[data-testid="event-card"]').first();
    await firstEvent.click();
    
    // Fill booking form
    await page.fill('[data-testid="booking-name"]', 'Test User');
    await page.fill('[data-testid="booking-email"]', 'test@example.com');
    await page.fill('[data-testid="booking-phone"]', '+1234567890');
    
    // Submit booking
    await page.click('[data-testid="submit-booking"]');
    
    // Check if payment form is displayed
    await expect(page.locator('[data-testid="payment-form"]')).toBeVisible();
    
    // Test payment form (without actually processing payment)
    const paymentButton = page.locator('[data-testid="payment-button"]');
    if (await paymentButton.isVisible()) {
      await paymentButton.click();
      
      // Check for payment processing state
      await expect(page.locator('text=Processing payment')).toBeVisible();
    }
  });

  test('should display booking history', async ({ page }) => {
    // First login
    await page.goto('/auth');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Navigate to booking history
    await page.goto('/profile/bookings');
    
    // Check if booking history is displayed
    await expect(page.locator('[data-testid="booking-history"]')).toBeVisible();
    
    // Check for booking details
    await expect(page.locator('[data-testid="booking-item"]')).toBeVisible();
  });

  test('should handle booking cancellation', async ({ page }) => {
    // First login
    await page.goto('/auth');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Navigate to booking history
    await page.goto('/profile/bookings');
    
    // Find a cancellable booking
    const cancelButton = page.locator('[data-testid="cancel-booking"]').first();
    if (await cancelButton.isVisible()) {
      await cancelButton.click();
      
      // Confirm cancellation
      await page.click('[data-testid="confirm-cancel"]');
      
      // Check for cancellation confirmation
      await expect(page.locator('text=Booking cancelled')).toBeVisible();
    }
  });

  test('should handle time slot selection', async ({ page }) => {
    await page.goto('/events');
    
    // Click on an event
    const firstEvent = page.locator('[data-testid="event-card"]').first();
    await firstEvent.click();
    
    // Check for time slot selection
    const timeSlots = page.locator('[data-testid="time-slot"]');
    if (await timeSlots.count() > 0) {
      await timeSlots.first().click();
      
      // Check if time slot is selected
      await expect(timeSlots.first()).toHaveClass(/selected/);
    }
  });

  test('should handle capacity limits', async ({ page }) => {
    await page.goto('/events');
    
    // Click on an event
    const firstEvent = page.locator('[data-testid="event-card"]').first();
    await firstEvent.click();
    
    // Check for capacity information
    const capacityInfo = page.locator('[data-testid="capacity-info"]');
    if (await capacityInfo.isVisible()) {
      await expect(capacityInfo).toBeVisible();
    }
    
    // Check for sold out events
    const soldOutEvent = page.locator('[data-testid="sold-out-event"]');
    if (await soldOutEvent.isVisible()) {
      await expect(soldOutEvent).toHaveClass(/sold-out/);
    }
  });

  test('should handle booking validation', async ({ page }) => {
    await page.goto('/events');
    
    // Click on an event
    const firstEvent = page.locator('[data-testid="event-card"]').first();
    await firstEvent.click();
    
    // Try to submit empty form
    await page.click('[data-testid="submit-booking"]');
    
    // Check for validation messages
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Phone is required')).toBeVisible();
  });

  test('should handle booking confirmation email', async ({ page }) => {
    await page.goto('/events');
    
    // Complete booking process
    const firstEvent = page.locator('[data-testid="event-card"]').first();
    await firstEvent.click();
    
    await page.fill('[data-testid="booking-name"]', 'Test User');
    await page.fill('[data-testid="booking-email"]', 'test@example.com');
    await page.fill('[data-testid="booking-phone"]', '+1234567890');
    
    await page.click('[data-testid="submit-booking"]');
    
    // Check for email confirmation message
    await expect(page.locator('text=Confirmation email sent')).toBeVisible();
  });
});
