import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      
{
        protocol: 'https',
        hostname: 'api.dicebear.com', // ✅ Authorized for DiceBear
      },
      {
        protocol: 'https',
        hostname: 'avatar.iran.liara.run', // ✅ Authorized for your other provider
      },
    ],
  },
};

export default nextConfig;
