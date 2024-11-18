import nextConfig from '@/next.config'

export const origin =
  process.env.NODE_ENV === 'production'
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000'

export const originPlusBasePath = origin + (nextConfig.basePath || '')
