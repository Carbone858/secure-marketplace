/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  i18n: { locales: ['ar', 'en'], defaultLocale: 'ar' },
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' }
      ]
    }];
  }
};
module.exports = nextConfig;
