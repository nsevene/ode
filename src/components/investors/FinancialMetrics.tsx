import React from 'react'
import { useTranslation } from 'react-i18next'
import type { FinancialMetrics as FinancialMetricsType } from '../../store/investorStore'
import { FaArrowUp, FaArrowDown, FaShieldAlt, FaChartPie } from 'react-icons/fa'

interface FinancialMetricsProps {
  metrics: FinancialMetricsType
}

const FinancialMetrics: React.FC<FinancialMetricsProps> = ({ metrics }) => {
  const { t } = useTranslation('common')

  const metricsData = [
    {
      title: t('investor.dashboard.total_value', 'Общая стоимость'),
      value: `$${metrics.totalPortfolioValue.toLocaleString()}`,
      change: metrics.totalReturn,
      changePercent: metrics.totalReturnPercent,
      icon: FaChartPie,
      color: 'ode-text-primary'
    },
    {
      title: t('investor.dashboard.monthly_return', 'Месячная доходность'),
      value: `$${metrics.monthlyReturn.toLocaleString()}`,
      change: metrics.monthlyReturn,
      changePercent: metrics.monthlyReturnPercent,
      icon: metrics.monthlyReturn >= 0 ? FaArrowUp : FaArrowDown,
      color: metrics.monthlyReturn >= 0 ? 'ode-text-success' : 'ode-text-danger'
    },
    {
      title: t('investor.dashboard.risk_score', 'Уровень риска'),
      value: `${metrics.riskScore.toFixed(1)}/10`,
      subtitle: t('investor.dashboard.risk_level', 'Средний риск'),
      icon: FaShieldAlt,
      color: metrics.riskScore <= 4 ? 'ode-text-success' : metrics.riskScore <= 7 ? 'ode-text-warning' : 'ode-text-danger'
    },
    {
      title: t('investor.dashboard.diversification', 'Диверсификация'),
      value: `${metrics.diversificationScore.toFixed(1)}/10`,
      subtitle: t('investor.dashboard.diversification_level', 'Хорошая диверсификация'),
      icon: FaChartPie,
      color: metrics.diversificationScore >= 7 ? 'ode-text-success' : metrics.diversificationScore >= 5 ? 'ode-text-warning' : 'ode-text-danger'
    }
  ]

  return (
    <div className="ode-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
      {metricsData.map((metric, index) => {
        const IconComponent = metric.icon
        return (
          <div key={index} className="ode-card">
            <div className="ode-flex ode-items-center ode-justify-between ode-mb-3">
              <div className="ode-flex ode-items-center ode-space-x-3">
                <div className={`ode-p-2 ode-rounded-lg ${metric.color}`} style={{ background: 'rgba(139, 0, 0, 0.1)' }}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="ode-text-sm ode-font-medium ode-text-gray">
                    {metric.title}
                  </h4>
                  {metric.subtitle && (
                    <p className="ode-text-xs ode-text-gray">{metric.subtitle}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="ode-space-y-2">
              <div className={`ode-text-2xl ode-font-bold ${metric.color}`}>
                {metric.value}
              </div>
              
              {metric.change !== undefined && (
                <div className="ode-flex ode-items-center ode-space-x-2">
                  <div className={`ode-flex ode-items-center ode-space-x-1 ${
                    metric.change >= 0 ? 'ode-text-success' : 'ode-text-danger'
                  }`}>
                    {metric.change >= 0 ? (
                      <FaArrowUp className="w-4 h-4" />
                    ) : (
                      <FaArrowDown className="w-4 h-4" />
                    )}
                    <span className="ode-text-sm ode-font-medium">
                      {metric.change >= 0 ? '+' : ''}{metric.changePercent.toFixed(2)}%
                    </span>
                  </div>
                  <span className="ode-text-xs ode-text-gray">
                    {t('investor.dashboard.vs_last_month', 'за месяц')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default FinancialMetrics
