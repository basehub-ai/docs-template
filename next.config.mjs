/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'basehub.earth',
        port: '',
        pathname: '/**',
      },
    ],
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
