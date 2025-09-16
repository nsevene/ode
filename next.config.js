/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Redirect legacy URLs to guest demo
      {
        source: '/order',
        destination: '/guest-demo',
        permanent: true,
      },
      {
        source: '/order-now',
        destination: '/guest-demo',
        permanent: true,
      },
      {
        source: '/book',
        destination: '/guest-demo',
        permanent: true,
      },
      {
        source: '/book-table',
        destination: '/guest-demo',
        permanent: true,
      },
      {
        source: '/checkout',
        destination: '/guest-demo',
        permanent: true,
      },
      {
        source: '/menu',
        destination: '/guest-demo',
        permanent: true,
      },
      {
        source: '/pwa',
        destination: '/guest-demo',
        permanent: true,
      },
      {
        source: '/download-app',
        destination: '/guest-demo',
        permanent: true,
      },
      {
        source: '/order/payment',
        destination: '/guest-demo',
        permanent: true,
      },
      {
        source: '/passport',
        destination: '/guest-demo',
        permanent: true,
      },
      {
        source: '/compass',
        destination: '/guest-demo',
        permanent: true,
      },
      {
        source: '/taste-passport',
        destination: '/guest-demo',
        permanent: true,
      },
      {
        source: '/taste-compass',
        destination: '/guest-demo',
        permanent: true,
      },
      {
        source: '/ode-by-night',
        destination: '/guest-demo',
        permanent: true,
      },
    ];
  },
  images: {
    domains: ['images.unsplash.com', 'plus.unsplash.com'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = nextConfig;