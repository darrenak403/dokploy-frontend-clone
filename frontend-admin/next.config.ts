import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    qualities: [75, 90, 100],
  },
  async rewrites() {
    const apiGateway = process.env.API_GATEWAY_URL || "http://api-gateway:6789";
    
    return [
      {
        source: "/api/:path*",
        destination: `${apiGateway}/:path*`,
      },
    ];
  },
};

// Bundle analyzer configuration
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
