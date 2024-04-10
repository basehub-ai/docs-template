/** @type {import('next').NextConfig} */
const nextConfig = {
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
