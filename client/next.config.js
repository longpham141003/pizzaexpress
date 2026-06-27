/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.pizzaexpress.vn' }
    ]
  },
  async redirects() {
    return [
      {
        source: '/admin/:path*',
        destination: 'http://localhost:5290/admin/:path*',
        permanent: false,
      },
    ];
  }
};

module.exports = nextConfig;
