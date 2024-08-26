let siteHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || 'docs.basehub.com'
let siteUrl = `https://${siteHost}`

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
}
