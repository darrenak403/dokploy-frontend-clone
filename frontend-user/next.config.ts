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
    return [
      {
        source: "/api/:path*",
        destination: "http://api-gateway:6789/:path*",
      },
      {
        source: "/iam/:path*",
        destination: "http://iam-service:8081/:path*",
      },
      {
        source: "/patient/:path*",
        destination: "http://patient-service:8082/:path*",
      },
      {
        source: "/test-order/:path*",
        destination: "http://testorder-service:8083/:path*",
      },
      {
        source: "/instrument/:path*",
        destination: "http://instrument-service:8085/:path*",
      },
      {
        source: "/monitoring/:path*",
        destination: "http://monitoring-service:8088/:path*",
      },
      {
        source: "/warehouse/:path*",
        destination: "http://warehouse-service:8084/:path*",
      },
    ];
  },
};

export default nextConfig;
