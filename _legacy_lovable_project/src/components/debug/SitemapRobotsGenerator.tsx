import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertTriangle, Globe } from 'lucide-react';

const SitemapRobotsGenerator = () => {
  const [domain, setDomain] = useState('ode-food-hall.lovable.app');
  const [generated, setGenerated] = useState(false);

  const pages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/chefs-table', priority: '0.9', changefreq: 'monthly' },
    { url: '/taste-compass', priority: '0.9', changefreq: 'monthly' },
    { url: '/wine-staircase', priority: '0.8', changefreq: 'monthly' },
    { url: '/events', priority: '0.8', changefreq: 'weekly' },
    { url: '/lounge', priority: '0.7', changefreq: 'monthly' },
    { url: '/photos', priority: '0.6', changefreq: 'monthly' },
    { url: '/vendors', priority: '0.7', changefreq: 'monthly' },
    { url: '/about', priority: '0.5', changefreq: 'monthly' },
    { url: '/contact', priority: '0.6', changefreq: 'monthly' },
  ];

  const generateSitemap = () => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>https://${domain}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    return sitemap;
  };

  const generateRobotsTxt = () => {
    return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /_templates/

# Sitemaps
Sitemap: https://${domain}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1`;
  };

  const downloadFile = (
    content: string,
    filename: string,
    contentType: string
  ) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGenerate = () => {
    setGenerated(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Sitemap & Robots.txt Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="domain">Domain</Label>
          <Input
            id="domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="ode-food-hall.lovable.app"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={handleGenerate} className="w-full">
            Generate Files
          </Button>

          {generated && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  downloadFile(
                    generateSitemap(),
                    'sitemap.xml',
                    'application/xml'
                  )
                }
                className="flex-1"
              >
                Download Sitemap
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  downloadFile(generateRobotsTxt(), 'robots.txt', 'text/plain')
                }
                className="flex-1"
              >
                Download Robots.txt
              </Button>
            </div>
          )}
        </div>

        {generated && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">
                  Files Generated Successfully
                </span>
              </div>
              <p className="text-sm text-green-700">
                Upload these files to your website's root directory for better
                SEO.
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Next Steps:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>1. Upload sitemap.xml to /public/sitemap.xml</li>
                <li>2. Upload robots.txt to /public/robots.txt</li>
                <li>3. Submit sitemap to Google Search Console</li>
                <li>4. Test robots.txt with Google's robots.txt tester</li>
              </ul>
            </div>

            <div className="overflow-x-auto">
              <h4 className="font-medium mb-2">
                Pages in Sitemap ({pages.length}):
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {pages.map((page) => (
                  <div
                    key={page.url}
                    className="flex justify-between p-2 bg-muted/50 rounded"
                  >
                    <span>{page.url}</span>
                    <span className="text-muted-foreground">
                      Priority: {page.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SitemapRobotsGenerator;
