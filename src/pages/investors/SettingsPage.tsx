import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Helmet>
        <title>{t('investor.settings.title')} - ODPortal B2B</title>
        <meta name="description" content={t('investor.settings.description')} />
      </Helmet>
      <div className="ode-bg-gray" style={{ minHeight: '100vh', padding: '32px 0' }}>
        <div className="ode-container">
          <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-4">
            {t('investor.settings.heading')}
          </h1>
          <p className="ode-text-gray">{t('investor.settings.welcome_message')}</p>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
