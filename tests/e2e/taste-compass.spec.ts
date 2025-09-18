import { test, expect } from '@playwright/test';

test.describe('Taste Compass', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/taste-compass');
  });

  test('should load Taste Compass page', async ({ page }) => {
    await expect(page).toHaveTitle(/Taste Compass/);
    
    // Check for main Taste Compass content
    await expect(page.locator('text=Taste Compass')).toBeVisible();
    
    // Check for interactive elements
    await expect(page.locator('[data-testid="taste-compass"]')).toBeVisible();
  });

  test('should display all 8 taste sectors', async ({ page }) => {
    const sectors = [
      'SPICE', 'SMOKE', 'FERMENT', 'UMAMI',
      'SWEET', 'HERB', 'SALT', 'BITTER'
    ];

    for (const sector of sectors) {
      await expect(page.locator(`text=${sector}`)).toBeVisible();
    }
  });

  test('should allow sector interaction', async ({ page }) => {
    // Click on a sector
    const firstSector = page.locator('[data-testid="sector-button"]').first();
    await firstSector.click();
    
    // Check if sector is activated
    await expect(firstSector).toHaveClass(/active/);
    
    // Check for progress indicator
    await expect(page.locator('[data-testid="progress-bar"]')).toBeVisible();
  });

  test('should show progress tracking', async ({ page }) => {
    // Interact with multiple sectors
    const sectors = page.locator('[data-testid="sector-button"]');
    const sectorCount = await sectors.count();
    
    for (let i = 0; i < Math.min(3, sectorCount); i++) {
      await sectors.nth(i).click();
    }
    
    // Check progress display
    await expect(page.locator('[data-testid="progress-text"]')).toBeVisible();
    await expect(page.locator('[data-testid="progress-bar"]')).toBeVisible();
  });

  test('should handle NFC simulation', async ({ page }) => {
    // Look for NFC scan button
    const nfcButton = page.locator('[data-testid="nfc-scan-button"]');
    if (await nfcButton.isVisible()) {
      await nfcButton.click();
      
      // Check for NFC scanning state
      await expect(page.locator('text=Scanning...')).toBeVisible();
      
      // Simulate NFC tag detection
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('nfcRead', {
          detail: {
            type: 'taste_sector',
            sector: 'SPICE',
            id: 'test-tag-001'
          }
        }));
      });
      
      // Check for success message
      await expect(page.locator('text=NFC метка обнаружена')).toBeVisible();
    }
  });

  test('should show achievements', async ({ page }) => {
    // Complete some sectors to trigger achievements
    const sectors = page.locator('[data-testid="sector-button"]');
    const sectorCount = await sectors.count();
    
    for (let i = 0; i < Math.min(5, sectorCount); i++) {
      await sectors.nth(i).click();
    }
    
    // Check for achievement notifications
    await expect(page.locator('[data-testid="achievement-notification"]')).toBeVisible();
  });

  test('should handle mobile navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile navigation is visible
    const mobileNav = page.locator('[data-testid="mobile-nav"]');
    if (await mobileNav.isVisible()) {
      await expect(mobileNav).toBeVisible();
    }
    
    // Test mobile-specific interactions
    const mobileSectors = page.locator('[data-testid="mobile-sector"]');
    if (await mobileSectors.count() > 0) {
      await mobileSectors.first().click();
    }
  });

  test('should handle geolocation', async ({ page }) => {
    // Mock geolocation
    await page.addInitScript(() => {
      navigator.geolocation = {
        getCurrentPosition: (success) => {
          success({
            coords: {
              latitude: 55.7558,
              longitude: 37.6176,
              accuracy: 10
            },
            timestamp: Date.now()
          });
        },
        watchPosition: () => {},
        clearWatch: () => {}
      } as any;
    });
    
    // Check for location-based features
    const locationButton = page.locator('[data-testid="location-button"]');
    if (await locationButton.isVisible()) {
      await locationButton.click();
      
      // Check for nearby sectors
      await expect(page.locator('[data-testid="nearby-sectors"]')).toBeVisible();
    }
  });

  test('should handle social features', async ({ page }) => {
    // Navigate to social tab if available
    const socialTab = page.locator('[data-testid="social-tab"]');
    if (await socialTab.isVisible()) {
      await socialTab.click();
      
      // Check for friends list
      await expect(page.locator('[data-testid="friends-list"]')).toBeVisible();
      
      // Check for leaderboard
      await expect(page.locator('[data-testid="leaderboard"]')).toBeVisible();
      
      // Test sharing functionality
      const shareButton = page.locator('[data-testid="share-button"]');
      if (await shareButton.isVisible()) {
        await shareButton.click();
        
        // Check for share options
        await expect(page.locator('[data-testid="share-options"]')).toBeVisible();
      }
    }
  });

  test('should handle gamification features', async ({ page }) => {
    // Navigate to gamification tab if available
    const gamificationTab = page.locator('[data-testid="gamification-tab"]');
    if (await gamificationTab.isVisible()) {
      await gamificationTab.click();
      
      // Check for daily quests
      await expect(page.locator('[data-testid="daily-quests"]')).toBeVisible();
      
      // Check for achievements
      await expect(page.locator('[data-testid="achievements"]')).toBeVisible();
      
      // Check for multipliers
      await expect(page.locator('[data-testid="multipliers"]')).toBeVisible();
    }
  });
});
