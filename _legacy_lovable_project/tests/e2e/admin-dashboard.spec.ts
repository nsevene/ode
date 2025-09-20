import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the login page
    await page.goto('/'); 
    
    // Use environment variables for credentials
    await page.fill('input[name="email"]', process.env.TEST_ADMIN_EMAIL || 'just0aguest@gmail.com');
    await page.fill('input[name="password"]', process.env.TEST_ADMIN_PASSWORD || '14Akb0001!');
    await page.click('button[type="submit"]');

    // Wait for successful login and navigation to the dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('should display key statistics cards', async ({ page }) => {
    // Wait for the dashboard to load data
    await expect(page.locator('h1:has-text("Admin Dashboard")')).toBeVisible();

    // Verify that the main statistics cards are present
    await expect(page.locator('div:has-text("Total Users")')).toBeVisible();
    await expect(page.locator('div:has-text("Tenants")')).toBeVisible();
    await expect(page.locator('div:has-text("Applications")')).toBeVisible();
    await expect(page.locator('div:has-text("Active Bookings")')).toBeVisible();
  });
  
  test('should navigate between tabs', async ({ page }) => {
    // Click on the Users tab and verify content
    await page.click('button[role="tab"]:has-text("Users")');
    await expect(page.locator('h2:has-text("User Management")')).toBeVisible();
    
    // Click on the Analytics tab and verify content
    await page.click('button[role="tab"]:has-text("Analytics")');
    await expect(page.locator('h3:has-text("Analytics Coming Soon")')).toBeVisible();

    // Click on the Settings tab and verify content
    await page.click('button[role="tab"]:has-text("Settings")');
    await expect(page.locator('h3:has-text("Settings Coming Soon")')).toBeVisible();
  });

  test('should show recent activity', async ({ page }) => {
     await expect(page.locator('h2:has-text("Recent Activity")')).toBeVisible();
     
     // Check for at least one activity item
     const activityItems = await page.locator('div:has-text("New user registered")').count();
     expect(activityItems).toBeGreaterThan(0);
  });

});
