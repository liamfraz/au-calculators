import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/super-calculator",
        destination: "/calculators/super",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
