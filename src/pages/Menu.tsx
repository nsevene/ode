import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '@/components/seo/SEOHead';
import { useSEO } from '@/hooks/useSEO';
import { BreadcrumbSchema, BreadcrumbNavigation } from '@/components/seo/BreadcrumbSchema';
import { ArrowLeft, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import MenuTable from '@/components/MenuTable';
import PolicyBadges from '@/components/PolicyBadges';

const Menu = () => {
  const { t } = useTranslation();
  const { getPageData } = useSEO();
  const pageData = getPageData('/menu');

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={pageData.title}
        description={pageData.description}
        keywords={pageData.keywords}
        image={pageData.image}
        type={pageData.type}
      />
      <BreadcrumbSchema />

      <ImprovedNavigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <BreadcrumbNavigation />
          
          {/* Header */}
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                На главную
              </Button>
            </Link>
            
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <ChefHat className="w-8 h-8 text-primary" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-burgundy-primary to-gold-accent bg-clip-text text-transparent">
                  Меню Food Hall
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Исследуйте вкусы всего мира в нашем гастрономическом зале. 
                От традиционной балийской кухни до современных интерпретаций классических блюд.
              </p>
            </div>

            {/* Policy Information */}
            <div className="bg-muted/50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold mb-4">Политика зонирования и сервиса:</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">1F — AC Зона (Halal):</h4>
                  <PolicyBadges acHalal serviceFee5 noBYO noRetail />
                </div>
                <div>
                  <h4 className="font-medium mb-2">2F — Alcohol Lounge:</h4>
                  <PolicyBadges alcoholAllowed age21 serviceFee5 noBYO />
                </div>
              </div>
            </div>
          </div>

          {/* Menu Content */}
          <MenuTable />
        </div>
      </div>
    </div>
  );
};

export default Menu;