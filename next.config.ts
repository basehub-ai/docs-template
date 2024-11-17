import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'basehub.earth',
      },
      {
        protocol: 'https',
        hostname: 'assets.basehub.com',
      },
    ],
  },
  async rewrites() {
    const res = await fetch('https://api.basehub.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-basehub-token': process.env.BASEHUB_TOKEN!,
      },
      body: JSON.stringify({
        query: `
          query {
            pages(first: 1) {
              items {
                _slug
                articles {
                  items {
                    _slug
                  }
                }
              }
            }
          }
        `,
      }),
    })

    if (!res.ok) throw new Error('Failed to fetch rewrites')

    const { data } = (await res.json()) as {
      data: {
        pages: {
          items: { _slug: string; articles: { items: { _slug: string }[] } }[]
        }
      }
    }
    const firstPage = data.pages.items[0]
    if (!firstPage) return []

    return firstPage.articles.items.map((article) => {
      return {
        source: `/${article._slug}/:path*`,
        destination: `/${firstPage._slug}/${article._slug}/:path*`,
      }
    })
  },
}

export default nextConfig
