import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Login with test credentials
   */
  async login(email: string = 'test@example.com', password: string = 'password123') {
    await this.page.goto('/auth');
    await this.page.fill('input[type="email"]', email);
    await this.page.fill('input[type="password"]', password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForURL(/dashboard/);
  }

  /**
   * Logout user
   */
  async logout() {
    const logoutButton = this.page.locator('text=Logout');
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await this.page.waitForURL(/auth/);
    }
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('main', { timeout: 10000 });
  }

  /**
   * Mock NFC functionality
   */
  async mockNFCRead(data: any) {
    await this.page.evaluate((nfcData) => {
      window.dispatchEvent(new CustomEvent('nfcRead', { detail: nfcData }));
    }, data);
  }

  /**
   * Mock geolocation
   */
  async mockGeolocation(lat: number = 55.7558, lng: number = 37.6176) {
    await this.page.addInitScript(({ latitude, longitude }) => {
      navigator.geolocation = {
        getCurrentPosition: (success) => {
          success({
            coords: { latitude, longitude, accuracy: 10 },
            timestamp: Date.now()
          });
        },
        watchPosition: () => {},
        clearWatch: () => {}
      } as any;
    }, { latitude: lat, longitude: lng });
  }

  /**
   * Mock push notifications
   */
  async mockPushNotifications() {
    await this.page.addInitScript(() => {
      Object.defineProperty(Notification, 'permission', {
        value: 'granted',
        writable: true
      });
      
      window.Notification = class extends Notification {
        constructor(title: string, options?: NotificationOptions) {
          super(title, options);
        }
      } as any;
    });
  }

  /**
   * Take screenshot for debugging
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `test-results/${name}.png` });
  }

  /**
   * Check for accessibility issues
   */
  async checkAccessibility() {
    // Check for proper heading structure
    const h1Count = await this.page.locator('h1').count();
    expect(h1Count).toBe(1);

    // Check for alt text on images
    const images = this.page.locator('img');
    const imageCount = await images.count();
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }

    // Check for proper form labels
    const inputs = this.page.locator('input[type="text"], input[type="email"], input[type="password"]');
    const inputCount = await inputs.count();
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      if (id) {
        const label = this.page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      }
    }
  }

  /**
   * Check for performance issues
   */
  async checkPerformance() {
    const metrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    });

    // Check if load time is reasonable (less than 3 seconds)
    expect(metrics.loadTime).toBeLessThan(3000);
    expect(metrics.domContentLoaded).toBeLessThan(2000);
  }

  /**
   * Check for console errors
   */
  async checkConsoleErrors() {
    const errors: string[] = [];
    
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    return errors;
  }

  /**
   * Wait for element to be visible with timeout
   */
  async waitForElement(selector: string, timeout: number = 10000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Fill form with data
   */
  async fillForm(formData: Record<string, string>) {
    for (const [field, value] of Object.entries(formData)) {
      const input = this.page.locator(`[data-testid="${field}"], input[name="${field}"], input[id="${field}"]`);
      if (await input.isVisible()) {
        await input.fill(value);
      }
    }
  }

  /**
   * Check if element exists
   */
  async elementExists(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get element text content
   */
  async getElementText(selector: string): Promise<string> {
    const element = this.page.locator(selector);
    return await element.textContent() || '';
  }

  /**
   * Check if page has proper SEO
   */
  async checkSEO() {
    // Check for title
    const title = await this.page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);

    // Check for meta description
    const metaDescription = await this.page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription!.length).toBeGreaterThan(50);

    // Check for canonical URL
    const canonical = await this.page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBeTruthy();
  }
}
