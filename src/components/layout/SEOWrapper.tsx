
import { SEOHead } from "@/components/seo/SEOHead";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { MenuSchema } from "@/components/seo/MenuSchema";
import { EventSchema } from "@/components/seo/EventSchema";
import { SEOOptimizations, WebVitalsTracking } from "@/components/seo/SEOOptimizations";
import { SitemapGenerator } from "@/components/seo/SitemapGenerator";
import { useSEO } from "@/hooks/useSEO";
import { menuItems, upcomingEvents } from "@/data/seoData";

const SEOWrapper = () => {
  const { currentPageData } = useSEO();

  return (
    <>
      
      <SEOHead {...currentPageData} />
      <LocalBusinessSchema />
      <BreadcrumbSchema />
      <MenuSchema menuItems={menuItems} />
      <EventSchema events={upcomingEvents} />
      <SEOOptimizations />
      <SitemapGenerator />
      <WebVitalsTracking />
    </>
  );
};

export default SEOWrapper;