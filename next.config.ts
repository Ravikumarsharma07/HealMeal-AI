import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        {
          source: '/api/:path*',
          destination: 'https://healmeal-ai-backend.onrender.com/api/:path*', 
          // for development: 'http://localhost:5000/api/:path*',
          // for production: 'https://healmeal-ai-backend.onrender.com/api/:path*' 
        },
      ],
      fallback: [],
    };
  },
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
};

export default nextConfig;
