import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.securemarketplace.app',
  appName: 'Secure Marketplace',
  webDir: 'out',
  server: {
    // Points to the live production site
    url: 'https://www.wassitt.com',
    cleartext: true
  }
};

export default config;
