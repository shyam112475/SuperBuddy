import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.superbuddy.app',
  appName: 'SuperBuddy',
  webDir: 'dist',
  server: {
    // Required for local/LAN API development over http:// from Android.
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
