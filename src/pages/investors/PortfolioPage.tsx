import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import InvestorNavigation from '../../components/investors/InvestorNavigation';

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
          <div className="ode-dashboard-layout">
            <InvestorNavigation />
            <div className="ode-dashboard-content">
              <div className="ode-dashboard-header">
                <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-2">
                  {t('investor.portfolio.heading', 'Мой портфель')}
                </h1>
                <p className="ode-text-gray">
                  {t('investor.portfolio.welcome_message', 'Управляйте своими инвестициями и отслеживайте результаты')}
                </p>
              </div>
              
              {/* Основной контент страницы */}
              <div className="ode-dashboard-section">
                <p className="ode-text-gray">
                  {t('investor.portfolio.content_placeholder', 'Здесь будет размещена информация о вашем портфеле')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PortfolioPage;
