import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path((?!api|_next|_next/static|_next/image|favicon.ico).*)',
        destination: 'http://localhost:5173/:path',
      },
    ];
  },
};

export default nextConfig;
