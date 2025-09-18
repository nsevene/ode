import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show login form', async ({ page }) => {
    // Navigate to auth page
    await page.goto('/auth');
    
    // Check if login form is visible
    await expect(page.locator('form')).toBeVisible();
    
    // Check for email and password fields
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    // Check for submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should validate form inputs', async ({ page }) => {
    await page.goto('/auth');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation messages
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should handle login with valid credentials', async ({ page }) => {
    await page.goto('/auth');
    
    // Fill in valid credentials (you might need to adjust these)
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Check for success or redirect
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should handle login with invalid credentials', async ({ page }) => {
    await page.goto('/auth');
    
    // Fill in invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Check for error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('should allow user registration', async ({ page }) => {
    await page.goto('/auth');
    
    // Switch to registration tab if available
    const registerTab = page.locator('text=Register');
    if (await registerTab.isVisible()) {
      await registerTab.click();
      
      // Fill registration form
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'newuser@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.fill('input[name="confirmPassword"]', 'password123');
      
      // Submit registration
      await page.click('button[type="submit"]');
      
      // Check for success message
      await expect(page.locator('text=Registration successful')).toBeVisible();
    }
  });

  test('should handle password reset', async ({ page }) => {
    await page.goto('/auth');
    
    // Look for forgot password link
    const forgotPasswordLink = page.locator('text=Forgot password');
    if (await forgotPasswordLink.isVisible()) {
      await forgotPasswordLink.click();
      
      // Fill email for password reset
      await page.fill('input[type="email"]', 'test@example.com');
      await page.click('button[type="submit"]');
      
      // Check for success message
      await expect(page.locator('text=Password reset email sent')).toBeVisible();
    }
  });

  test('should handle logout', async ({ page }) => {
    // First login
    await page.goto('/auth');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for login to complete
    await page.waitForURL(/dashboard/);
    
    // Look for logout button
    const logoutButton = page.locator('text=Logout');
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      
      // Check if redirected to login page
      await expect(page).toHaveURL(/auth/);
    }
  });
});
