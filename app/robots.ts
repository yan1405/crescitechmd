import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/faq', '/contact', '/terms', '/privacy', '/login', '/signup'],
        disallow: ['/dashboard', '/admin', '/api', '/convert', '/history', '/settings', '/referral'],
      },
    ],
    sitemap: 'https://crescitechmd.com/sitemap.xml',
  }
}
