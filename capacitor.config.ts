import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.securemarketplace.app',
  appName: 'Secure Marketplace',
  webDir: 'out',
  server: {
    // Replace with your actual production URL when ready
    url: 'https://secure-marketplace.com',
    cleartext: true
  }
};

export default config;
