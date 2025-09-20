// Progressive Web App functionality
export class PWAManager {
  private static instance: PWAManager;
  private deferredPrompt: any = null;

  static getInstance(): PWAManager {
    if (!PWAManager.instance) {
      PWAManager.instance = new PWAManager();
    }
    return PWAManager.instance;
  }

  // Initialize PWA
  init() {
    this.setupInstallPrompt();
    this.setupServiceWorker();
    this.setupOfflineHandling();
  }

  // Setup install prompt
  private setupInstallPrompt() {
    if (typeof window === 'undefined') return;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallBanner();
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      this.hideInstallBanner();
    });
  }

  // Setup service worker
  private setupServiceWorker() {
    if (typeof window === 'undefined') return;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }

  // Setup offline handling
  private setupOfflineHandling() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.showOnlineMessage();
    });

    window.addEventListener('offline', () => {
      this.showOfflineMessage();
    });
  }

  // Show install banner
  private showInstallBanner() {
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.innerHTML = `
      <div style="position: fixed; bottom: 0; left: 0; right: 0; background: #1a1a1a; color: white; padding: 16px; z-index: 1000; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong>Install ODE Food Hall App</strong>
          <p style="margin: 4px 0 0 0; font-size: 14px;">Get quick access to our food hall</p>
        </div>
        <div>
          <button id="pwa-install-btn" style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; margin-right: 8px;">Install</button>
          <button id="pwa-dismiss-btn" style="background: transparent; color: white; border: 1px solid white; padding: 8px 16px; border-radius: 4px;">Dismiss</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    // Add event listeners
    document
      .getElementById('pwa-install-btn')
      ?.addEventListener('click', () => {
        this.installApp();
      });

    document
      .getElementById('pwa-dismiss-btn')
      ?.addEventListener('click', () => {
        this.hideInstallBanner();
      });
  }

  // Hide install banner
  private hideInstallBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.remove();
    }
  }

  // Install app
  async installApp() {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    this.deferredPrompt = null;
    this.hideInstallBanner();
  }

  // Show online message
  private showOnlineMessage() {
    this.showToast('You are back online!', 'success');
  }

  // Show offline message
  private showOfflineMessage() {
    this.showToast('You are offline. Some features may be limited.', 'warning');
  }

  // Show toast message
  private showToast(message: string, type: 'success' | 'warning' | 'error') {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#4caf50' : type === 'warning' ? '#ff9800' : '#f44336'};
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      z-index: 1001;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // Check if app is installed
  isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches;
  }

  // Check if app can be installed
  canInstall(): boolean {
    return this.deferredPrompt !== null;
  }
}

// Export instance
export const pwaManager = PWAManager.getInstance();
