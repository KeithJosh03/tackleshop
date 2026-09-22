/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        // Exclude /api/auth so NextAuth stays local, proxy everything else to Laravel
        source: '/api/:path((?!auth).*)',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },

  images: {
    domains: ['localhost', 'lh3.googleusercontent.com', 'platform-lookaside.fbsbx.com', 'graph.facebook.com'],
  },
};

module.exports = nextConfig;