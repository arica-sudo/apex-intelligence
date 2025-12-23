import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppress warnings for heavy 3D libs and potential server-side issues
  logging: {
    fetches: {
      fullUrl: true,
    },
  },


};

export default nextConfig;
