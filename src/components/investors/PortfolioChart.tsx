import React from 'react'
import { useTranslation } from 'react-i18next'
import type { DashboardData } from '../../store/investorStore'

interface PortfolioChartProps {
  data: DashboardData
}

const PortfolioChart: React.FC<PortfolioChartProps> = ({ data }) => {
  const { t } = useTranslation('common')

  // Простой график на основе CSS (в реальном проекте можно использовать Chart.js или D3)
  const maxValue = Math.max(...data.marketTrends.map(point => point.value))
  const minValue = Math.min(...data.marketTrends.map(point => point.value))
  const range = maxValue - minValue

  return (
    <div className="ode-card">
      <div className="ode-flex ode-justify-between ode-items-center ode-mb-4">
        <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal">
          {t('investor.dashboard.portfolio_chart_title', 'Динамика портфеля')}
        </h3>
        <div className="ode-text-sm ode-text-gray">
          {data.marketTrends.length} {t('investor.dashboard.days', 'дней')}
        </div>
      </div>

      {/* Простой линейный график */}
      <div className="ode-relative" style={{ height: '200px', marginBottom: '16px' }}>
        <svg width="100%" height="100%" className="ode-absolute ode-inset-0">
          <defs>
            <linearGradient id="portfolioGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B0000" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8B0000" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Область под графиком */}
          <path
            d={`M 0,${200 - ((data.marketTrends[0]?.value - minValue) / range) * 200} ${data.marketTrends.map((point, index) => 
              `L ${(index / (data.marketTrends.length - 1)) * 100}%,${200 - ((point.value - minValue) / range) * 200}`
            ).join(' ')} L 100%,200 L 0,200 Z`}
            fill="url(#portfolioGradient)"
          />
          
          {/* Линия графика */}
          <path
            d={`M 0,${200 - ((data.marketTrends[0]?.value - minValue) / range) * 200} ${data.marketTrends.map((point, index) => 
              `L ${(index / (data.marketTrends.length - 1)) * 100}%,${200 - ((point.value - minValue) / range) * 200}`
            ).join(' ')}`}
            stroke="#8B0000"
            strokeWidth="2"
            fill="none"
          />
          
          {/* Точки данных */}
          {data.marketTrends.map((point, index) => (
            <circle
              key={index}
              cx={`${(index / (data.marketTrends.length - 1)) * 100}%`}
              cy={200 - ((point.value - minValue) / range) * 200}
              r="3"
              fill="#8B0000"
            />
          ))}
        </svg>
      </div>

      {/* Информация о текущем значении */}
      <div className="ode-flex ode-justify-between ode-items-center">
        <div>
          <div className="ode-text-sm ode-text-gray">
            {t('investor.dashboard.current_value', 'Текущая стоимость')}
          </div>
          <div className="ode-text-lg ode-font-bold ode-text-charcoal">
            ${data.metrics.totalPortfolioValue.toLocaleString()}
          </div>
        </div>
        <div className="ode-text-right">
          <div className="ode-text-sm ode-text-gray">
            {t('investor.dashboard.change', 'Изменение')}
          </div>
          <div className={`ode-text-lg ode-font-bold ${
            data.metrics.totalReturn >= 0 ? 'ode-text-success' : 'ode-text-danger'
          }`}>
            {data.metrics.totalReturn >= 0 ? '+' : ''}${data.metrics.totalReturn.toLocaleString()}
            <span className="ode-text-sm"> ({data.metrics.totalReturnPercent.toFixed(2)}%)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioChart
