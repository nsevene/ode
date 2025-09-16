
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.odefoodhall.app',
  appName: 'ODE Food Hall',
  webDir: 'dist',
  server: {
    url: 'https://odefoodhall.com',
    cleartext: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#0A0908',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#8B1538',
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: 'launch_screen',
      useDialog: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0A0908',
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
    CapacitorNFC: {
      // NFC настройки будут добавлены при установке плагина
    },
    Geolocation: {
      permissions: ['fine', 'coarse']
    }
  },
  android: {
    permissions: [
      'android.permission.NFC',
      'android.permission.NFC_TRANSACTION_EVENT',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION'
    ]
  },
  ios: {
    infoPlist: {
      'NFCReaderUsageDescription': 'This app uses NFC to read Taste Compass sectors and passport data for culinary experiences',
      'com.apple.developer.nfc.readersession.formats': ['NDEF', 'TAG'],
      'NSLocationWhenInUseUsageDescription': 'This app uses location to show nearby food halls and experiences'
    }
  },
};

export default config;
