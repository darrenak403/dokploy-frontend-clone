import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com", "res.cloudinary.com"],
  },
  async rewrites() {
    const apiGateway =
      process.env.API_GATEWAY_URL || "http://host.docker.internal:6789";

    return [
      // IAM Service
      {
        source: "/api/iam/:path*",
        destination: `${apiGateway}/v1/api/iam/:path*`,
      },
      // Patient Service
      {
        source: "/api/patient/:path*",
        destination: `${apiGateway}/v1/api/patient/:path*`,
      },
      // Test Order Service
      {
        source: "/api/testorder/:path*",
        destination: `${apiGateway}/v1/api/testorder/:path*`,
      },
      // Instrument Service
      {
        source: "/api/instrument/:path*",
        destination: `${apiGateway}/v1/api/instrument/:path*`,
      },
      // Monitoring Service
      {
        source: "/api/monitoring/:path*",
        destination: `${apiGateway}/v1/api/monitoring/:path*`,
      },
      // Warehouse Service
      {
        source: "/api/warehouse/:path*",
        destination: `${apiGateway}/v1/api/warehouse/:path*`,
      },
    ];
  },
};

export default nextConfig;
