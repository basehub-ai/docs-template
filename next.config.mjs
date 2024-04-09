/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites() {
    return {
      fallback: [
        {
          source: "/:path*", // Match all paths
          destination: "/index/overview",
        },
      ],
    };
  },
};

export default nextConfig;
