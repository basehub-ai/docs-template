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
  async rewrites() {
    const res = await fetch('https://api.basehub.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-basehub-token': process.env.BASEHUB_TOKEN,
      },
      body: JSON.stringify({
        query: `
          query {
            pages(first: 1) {
              items {
                _slug
              }
            }
          }
        `,
      }),
    })

    if (!res.ok) throw new Error('Failed to fetch rewrites')

    const data = await res.json()
    const firstPage = data.data.pages.items[0]

    return {
      fallback: [
        {
          source: '/:path*',
          destination:
            process.env.NODE_ENV === 'development'
              ? `http://localhost:3000/${firstPage._slug}/:path*`
              : `/${firstPage._slug}/:path*`,
        },
      ],
    }
  },
}

export default nextConfig
