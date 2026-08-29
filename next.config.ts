import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/audit',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
