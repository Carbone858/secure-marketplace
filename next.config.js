/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  },
  
  images: {
    domains: ['localhost', '*.github.dev', '*.app.github.dev'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
  },
  
  output: 'standalone',
  poweredByHeader: false,
  
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
    localeDetection: true,
  },
};

module.exports = nextConfig;
