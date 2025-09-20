import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

const MarketAnalysisPage: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Helmet>
        <title>{t('investor.market_analysis.title')} - ODPortal B2B</title>
        <meta name="description" content={t('investor.market_analysis.description')} />
      </Helmet>
      <div className="ode-bg-gray" style={{ minHeight: '100vh', padding: '32px 0' }}>
        <div className="ode-container">
          <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-4">
            {t('investor.market_analysis.heading')}
          </h1>
          <p className="ode-text-gray">{t('investor.market_analysis.welcome_message')}</p>
        </div>
      </div>
    </>
  );
};

export default MarketAnalysisPage;
