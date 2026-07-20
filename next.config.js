/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8000/api/:path*',
        },
      ],
    };
  },

  images: {
    domains: ['localhost', 'lh3.googleusercontent.com', 'platform-lookaside.fbsbx.com', 'graph.facebook.com'],
  },
};

module.exports = nextConfig;
