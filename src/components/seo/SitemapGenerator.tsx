import { useEffect } from 'react';

interface SitemapPage {
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

const staticPages: SitemapPage[] = [
  {
    url: '/',
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: 1.0
  },
  {
    url: '/chefs-table',
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.9
  },
  {
    url: '/taste-compass',
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.9
  },
  {
    url: '/wine-staircase',
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8
  },
  {
    url: '/events',
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: 0.8
  },
  {
    url: '/photos',
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7
  },
  {
    url: '/lounge',
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.6
  }
];

export const SitemapGenerator = () => {
  useEffect(() => {
    const generateSitemap = () => {
      const baseUrl = window.location.origin;
      
      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      // Создаем robots.txt
      const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /auth/
Disallow: /my-bookings/
Disallow: /performance/

Sitemap: ${baseUrl}/sitemap.xml

# Specific crawl delays for different bots
User-agent: Googlebot
Crawl-delay: 1

User-agent: Bingbot
Crawl-delay: 2

# Allow social media crawlers
User-agent: facebookexternalhit/*
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /`;

      // In a real application this should be saved on server
      // Here we just add to localStorage for demonstration
      localStorage.setItem('sitemap.xml', sitemapXml);
      localStorage.setItem('robots.txt', robotsTxt);

      console.log('Sitemap and robots.txt generated:', {
        sitemap: sitemapXml,
        robots: robotsTxt
      });
    };

    generateSitemap();
  }, []);

  return null;
};