/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["basehub.earth"],
  },
  rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: '/index/:path*',
        },
      ],
    }
  },
}

export default nextConfig
