import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

const PortfolioPage: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Helmet>
        <title>{t('investor.portfolio.title')} - ODPortal B2B</title>
        <meta name="description" content={t('investor.portfolio.description')} />
      </Helmet>
      <div className="ode-bg-gray" style={{ minHeight: '100vh', padding: '32px 0' }}>
        <div className="ode-container">
          <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-4">
            {t('investor.portfolio.heading')}
          </h1>
          <p className="ode-text-gray">{t('investor.portfolio.welcome_message')}</p>
        </div>
      </div>
    </>
  );
};

export default PortfolioPage;
