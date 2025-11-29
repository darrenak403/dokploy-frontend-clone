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
    const apiGateway = process.env.API_GATEWAY_URL || "http://host.docker.internal:6789";
    
    return [
      // IAM Service
      {
        source: "/api/iam/:path*",
        destination: `${apiGateway}/IAM-SERVICE/v1/api/:path*`,
      },
      // Patient Service
      {
        source: "/api/patient/:path*",
        destination: `${apiGateway}/PATIENT-SERVICE/v1/api/:path*`,
      },
      // Test Order Service
      {
        source: "/api/orders/:path*",
        destination: `${apiGateway}/TESTORDER-SERVICE/v1/api/:path*`,
      },
      {
        source: "/api/test-order/:path*",
        destination: `${apiGateway}/TESTORDER-SERVICE/v1/api/:path*`,
      },
      // Instrument Service
      {
        source: "/api/instrument/:path*",
        destination: `${apiGateway}/INSTRUMENT-SERVICE/v1/api/:path*`,
      },
      // Monitoring Service
      {
        source: "/api/monitoring/:path*",
        destination: `${apiGateway}/MONITORING-SERVICE/v1/api/:path*`,
      },
      // Warehouse Service
      {
        source: "/api/warehouse/:path*",
        destination: `${apiGateway}/WAREHOUSE-SERVICE/v1/api/:path*`,
      },
    ];
  },
};

// Bundle analyzer configuration
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
