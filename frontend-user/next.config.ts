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
    const apiGateway = process.env.API_GATEWAY_URL || "http://api-gateway:6789";
    
    return [
      {
        source: "/api/:path*",
        destination: `${apiGateway}/:path*`,
      },
    ];
  },
};

export default nextConfig;
