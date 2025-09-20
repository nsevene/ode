import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useInvestorStore } from '../../store/investorStore';
import PortfolioChart from '../../components/investors/PortfolioChart';
import FinancialMetrics from '../../components/investors/FinancialMetrics';

const InvestorDashboardPage: React.FC = () => {
  const { t } = useTranslation('common');
  const { dashboardData, isLoading, error, fetchDashboardData } = useInvestorStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
    return (
      <div className="ode-bg-gray" style={{ minHeight: '100vh', padding: '32px 0' }}>
        <div className="ode-container">
          <div className="ode-text-center">
            <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
            <p className="ode-text-gray">{t('investor.dashboard.loading', 'Загрузка данных...')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ode-bg-gray" style={{ minHeight: '100vh', padding: '32px 0' }}>
        <div className="ode-container">
          <div className="ode-card ode-text-center">
            <div className="ode-text-danger ode-text-6xl ode-mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="ode-text-xl ode-font-bold ode-text-charcoal ode-mb-2">
              {t('investor.dashboard.error_title', 'Ошибка загрузки')}
            </h2>
            <p className="ode-text-gray ode-mb-4">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="ode-btn ode-btn-primary"
            >
              {t('investor.dashboard.retry', 'Попробовать снова')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="ode-bg-gray" style={{ minHeight: '100vh', padding: '32px 0' }}>
        <div className="ode-container">
          <div className="ode-text-center">
            <p className="ode-text-gray">{t('investor.dashboard.no_data', 'Нет данных для отображения')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('investor.dashboard.title')} - ODPortal B2B</title>
        <meta name="description" content={t('investor.dashboard.description')} />
      </Helmet>
      <div className="ode-bg-gray" style={{ minHeight: '100vh', padding: '32px 0' }}>
        <div className="ode-container">
          {/* Заголовок */}
          <div className="ode-mb-8">
            <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-2">
              {t('investor.dashboard.heading', 'Панель управления инвестора')}
            </h1>
            <p className="ode-text-gray">
              {t('investor.dashboard.welcome_message', 'Добро пожаловать на ваш дашборд инвестора!')}
            </p>
          </div>

          {/* Ключевые метрики */}
          <div className="ode-mb-8">
            <h2 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-4">
              {t('investor.dashboard.key_metrics', 'Ключевые показатели')}
            </h2>
            <FinancialMetrics metrics={dashboardData.metrics} />
          </div>

          {/* График портфеля */}
          <div className="ode-mb-8">
            <PortfolioChart data={dashboardData} />
          </div>

          {/* Последние транзакции */}
          <div className="ode-mb-8">
            <h2 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-4">
              {t('investor.dashboard.recent_transactions', 'Последние транзакции')}
            </h2>
            <div className="ode-card">
              <div className="ode-space-y-3">
                {dashboardData.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="ode-card" style={{ marginBottom: '12px', padding: '16px' }}>
                    <div className="ode-flex ode-items-center ode-justify-between">
                      <div className="ode-flex ode-items-center" style={{ gap: '12px' }}>
                        <div className={`ode-p-2 ode-rounded-full ${
                          transaction.type === 'buy' ? 'ode-bg-success' : 
                          transaction.type === 'sell' ? 'ode-bg-danger' : 'ode-bg-primary'
                        }`} style={{ minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg className="w-4 h-4 ode-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {transaction.type === 'buy' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            ) : transaction.type === 'sell' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            )}
                          </svg>
                        </div>
                        <div>
                          <div className="ode-font-medium ode-text-charcoal" style={{ fontSize: '16px', marginBottom: '4px' }}>
                            {transaction.asset}
                          </div>
                          <div className="ode-text-sm ode-text-gray">
                            {new Date(transaction.date).toLocaleDateString('ru-RU', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="ode-text-right">
                        <div className={`ode-font-semibold ${
                          transaction.type === 'buy' ? 'ode-text-success' : 
                          transaction.type === 'sell' ? 'ode-text-danger' : 'ode-text-primary'
                        }`} style={{ fontSize: '16px', marginBottom: '4px' }}>
                          {transaction.type === 'buy' ? '+' : transaction.type === 'sell' ? '-' : '+'}${transaction.amount.toLocaleString()}
                        </div>
                        <div className="ode-text-sm ode-text-gray">
                          {t(`investor.dashboard.transaction_${transaction.type}`, transaction.type)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestorDashboardPage;
