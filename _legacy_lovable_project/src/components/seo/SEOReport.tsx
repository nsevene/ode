import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface SEOCheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  priority: 'high' | 'medium' | 'low';
}

export const SEOReport = () => {
  const [checks, setChecks] = useState<SEOCheckResult[]>([]);

  useEffect(() => {
    const performSEOChecks = () => {
      const results: SEOCheckResult[] = [];

      // Проверка title
      const title = document.querySelector('title')?.textContent;
      results.push({
        name: 'Page Title',
        status:
          title && title.length > 10 && title.length < 60 ? 'pass' : 'warning',
        message: title ? `Длина: ${title.length} символов` : 'Отсутствует',
        priority: 'high',
      });

      // Проверка meta description
      const description = document
        .querySelector('meta[name="description"]')
        ?.getAttribute('content');
      results.push({
        name: 'Meta Description',
        status:
          description && description.length > 120 && description.length < 160
            ? 'pass'
            : 'warning',
        message: description
          ? `Длина: ${description.length} символов`
          : 'Отсутствует',
        priority: 'high',
      });

      // Проверка structured data
      const structuredData = document.querySelectorAll(
        'script[type="application/ld+json"]'
      );
      results.push({
        name: 'Structured Data',
        status: structuredData.length > 0 ? 'pass' : 'fail',
        message: `Найдено ${structuredData.length} JSON-LD схем`,
        priority: 'high',
      });

      // Проверка Open Graph
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector(
        'meta[property="og:description"]'
      );
      const ogImage = document.querySelector('meta[property="og:image"]');
      results.push({
        name: 'Open Graph Tags',
        status: ogTitle && ogDescription && ogImage ? 'pass' : 'warning',
        message: `Title: ${ogTitle ? '✓' : '✗'}, Description: ${ogDescription ? '✓' : '✗'}, Image: ${ogImage ? '✓' : '✗'}`,
        priority: 'medium',
      });

      // Проверка canonical URL
      const canonical = document.querySelector('link[rel="canonical"]');
      results.push({
        name: 'Canonical URL',
        status: canonical ? 'pass' : 'warning',
        message: canonical ? 'Установлен' : 'Отсутствует',
        priority: 'medium',
      });

      // Проверка H1
      const h1Elements = document.querySelectorAll('h1');
      results.push({
        name: 'H1 Heading',
        status:
          h1Elements.length === 1
            ? 'pass'
            : h1Elements.length > 1
              ? 'warning'
              : 'fail',
        message: `Найдено ${h1Elements.length} H1 элементов`,
        priority: 'high',
      });

      // Проверка alt текстов для изображений
      const images = document.querySelectorAll('img');
      const imagesWithoutAlt = Array.from(images).filter(
        (img) => !img.alt
      ).length;
      results.push({
        name: 'Image Alt Text',
        status: imagesWithoutAlt === 0 ? 'pass' : 'warning',
        message: `${imagesWithoutAlt} изображений без alt текста из ${images.length}`,
        priority: 'medium',
      });

      // Проверка robots meta
      const robots = document.querySelector('meta[name="robots"]');
      results.push({
        name: 'Robots Meta',
        status: robots ? 'pass' : 'warning',
        message: robots
          ? robots.getAttribute('content') || ''
          : 'Не установлен',
        priority: 'low',
      });

      // Проверка viewport
      const viewport = document.querySelector('meta[name="viewport"]');
      results.push({
        name: 'Viewport Meta',
        status: viewport ? 'pass' : 'fail',
        message: viewport ? 'Установлен' : 'Отсутствует',
        priority: 'high',
      });

      // Проверка hreflang
      const hreflang = document.querySelectorAll('link[hreflang]');
      results.push({
        name: 'Hreflang Links',
        status: hreflang.length > 0 ? 'pass' : 'warning',
        message: `Найдено ${hreflang.length} hreflang ссылок`,
        priority: 'low',
      });

      setChecks(results);
    };

    // Выполняем проверки с небольшой задержкой, чтобы дать время загрузиться всем элементам
    setTimeout(performSEOChecks, 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800';
      case 'fail':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const passCount = checks.filter((check) => check.status === 'pass').length;
  const totalChecks = checks.length;
  const score =
    totalChecks > 0 ? Math.round((passCount / totalChecks) * 100) : 0;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>SEO Отчет</span>
          <Badge
            variant={
              score >= 80
                ? 'default'
                : score >= 60
                  ? 'secondary'
                  : 'destructive'
            }
          >
            Оценка: {score}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {checks.map((check, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getPriorityColor(check.priority)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(check.status)}
                  <span className="font-medium">{check.name}</span>
                  <Badge
                    className={getStatusColor(check.status)}
                    variant="outline"
                  >
                    {check.status}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {check.priority}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {check.message}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            Рекомендации по улучшению:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Оптимизируйте длину заголовков страниц (50-60 символов)</li>
            <li>• Поддерживайте описания в пределах 150-160 символов</li>
            <li>• Добавьте alt текст ко всем изображениям</li>
            <li>• Убедитесь, что на каждой странице только один H1</li>
            <li>• Регулярно обновляйте structured data</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
