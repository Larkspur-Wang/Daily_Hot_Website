const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/serve-html/:path*',
        destination: '/api/serve-html/:path*',
      },
      {
        source: '/img/:path*',
        destination: '/api/serve-static/img/:path*',
      }
    ];
  },
  serverRuntimeConfig: {
    PROJECT_ROOT: process.cwd()
  },
  publicRuntimeConfig: {
    staticFolder: '/website',
  },
};

module.exports = nextConfig;
