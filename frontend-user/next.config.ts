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
    const apiGateway = process.env.API_GATEWAY_URL || "http://host.docker.internal:6789";
    
    return [
      // IAM Service
      {
        source: "/api/iam/:path*",
        destination: `${apiGateway}/IAM-SERVICE/v1/api/iam/:path*`,
      },
      // Patient Service
      {
        source: "/api/patient/:path*",
        destination: `${apiGateway}/PATIENT-SERVICE/v1/api/patient/:path*`,
      },
      // Test Order Service
      {
        source: "/api/orders/:path*",
        destination: `${apiGateway}/TESTORDER-SERVICE/v1/api/orders/:path*`,
      },
      {
        source: "/api/test-order/:path*",
        destination: `${apiGateway}/TESTORDER-SERVICE/v1/api/test-order/:path*`,
      },
      // Instrument Service
      {
        source: "/api/instrument/:path*",
        destination: `${apiGateway}/INSTRUMENT-SERVICE/v1/api/instrument/:path*`,
      },
      // Monitoring Service
      {
        source: "/api/monitoring/:path*",
        destination: `${apiGateway}/MONITORING-SERVICE/v1/api/monitoring/:path*`,
      },
      // Warehouse Service
      {
        source: "/api/warehouse/:path*",
        destination: `${apiGateway}/WAREHOUSE-SERVICE/v1/api/warehouse/:path*`,
      },
    ];
  },
};

export default nextConfig;
