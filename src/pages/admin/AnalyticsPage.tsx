import React, { useState } from 'react'
import { 
  FaChartLine, FaUsers, FaBuilding, FaDollarSign, 
  FaDownload, FaArrowUp, FaArrowDown
} from 'react-icons/fa'
import AdminNavigation from '../../components/admin/AdminNavigation'

const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'occupancy' | 'tenants'>('overview')
  const [dateRange, setDateRange] = useState('month')

  const overviewStats = [
    {
      title: 'Общий доход',
      value: '₽2,450,000',
      change: '+12.5%',
      changeType: 'positive',
      icon: FaDollarSign,
      color: '#16a34a'
    },
    {
      title: 'Средняя заполняемость',
      value: '87%',
      change: '+3.2%',
      changeType: 'positive',
      icon: FaBuilding,
      color: '#2563eb'
    },
    {
      title: 'Активные арендаторы',
      value: '156',
      change: '+8.1%',
      changeType: 'positive',
      icon: FaUsers,
      color: '#8B5CF6'
    },
    {
      title: 'Средний чек',
      value: '₽15,700',
      change: '-1.2%',
      changeType: 'negative',
      icon: FaChartLine,
      color: '#f59e0b'
    }
  ]

  const revenueData = [
    { month: 'Янв', revenue: 1800000, occupancy: 85 },
    { month: 'Фев', revenue: 1950000, occupancy: 88 },
    { month: 'Мар', revenue: 2100000, occupancy: 90 },
    { month: 'Апр', revenue: 2050000, occupancy: 87 },
    { month: 'Май', revenue: 2200000, occupancy: 92 },
    { month: 'Июн', revenue: 2350000, occupancy: 89 },
    { month: 'Июл', revenue: 2400000, occupancy: 91 },
    { month: 'Авг', revenue: 2300000, occupancy: 88 },
    { month: 'Сен', revenue: 2450000, occupancy: 93 },
    { month: 'Окт', revenue: 2500000, occupancy: 95 },
    { month: 'Ноя', revenue: 2400000, occupancy: 92 },
    { month: 'Дек', revenue: 2450000, occupancy: 87 }
  ]

  const occupancyData = [
    { property: 'БЦ "Солнечный"', occupancy: 95, revenue: 150000 },
    { property: 'ТЦ "Мега"', occupancy: 0, revenue: 0 },
    { property: 'Склад "Логистик"', occupancy: 100, revenue: 80000 },
    { property: 'Офис "Центр"', occupancy: 88, revenue: 120000 },
    { property: 'ТЦ "Плаза"', occupancy: 92, revenue: 180000 }
  ]

  const tenantAnalytics = [
    {
      category: 'По типу бизнеса',
      data: [
        { name: 'IT-компании', count: 45, percentage: 28.8 },
        { name: 'Торговля', count: 38, percentage: 24.4 },
        { name: 'Услуги', count: 32, percentage: 20.5 },
        { name: 'Производство', count: 25, percentage: 16.0 },
        { name: 'Другое', count: 16, percentage: 10.3 }
      ]
    },
    {
      category: 'По размеру',
      data: [
        { name: 'Малый бизнес (1-10 чел)', count: 78, percentage: 50.0 },
        { name: 'Средний бизнес (11-50 чел)', count: 52, percentage: 33.3 },
        { name: 'Крупный бизнес (50+ чел)', count: 26, percentage: 16.7 }
      ]
    }
  ]

  const tabs = [
    { id: 'overview', name: 'Обзор', icon: FaChartLine },
    { id: 'revenue', name: 'Доходы', icon: FaDollarSign },
    { id: 'occupancy', name: 'Заполняемость', icon: FaBuilding },
    { id: 'tenants', name: 'Арендаторы', icon: FaUsers }
  ]

  const renderOverview = () => (
    <div className="ode-space-y-6">
      <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal">Аналитический обзор</h2>
      
      {/* Stats */}
      <div className="ode-grid ode-grid-4">
        {overviewStats.map((stat) => (
          <div key={stat.title} className="ode-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <p className="ode-text-sm ode-font-medium ode-text-gray ode-mb-1">{stat.title}</p>
                <p className="ode-text-2xl ode-font-bold" style={{ color: stat.color }}>{stat.value}</p>
              </div>
              <stat.icon style={{ width: '24px', height: '24px', color: stat.color }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {stat.changeType === 'positive' ? (
                <FaArrowUp style={{ width: '12px', height: '12px', color: '#16a34a' }} />
              ) : (
                <FaArrowDown style={{ width: '12px', height: '12px', color: '#dc2626' }} />
              )}
              <span className={`ode-text-sm ode-font-medium ${
                stat.changeType === 'positive' ? 'ode-text-success' : 'ode-text-error'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="ode-grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="ode-card">
          <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">Динамика доходов</h3>
          <div style={{ height: '300px', background: '#f9fafb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="ode-text-gray">График доходов по месяцам</span>
          </div>
        </div>
        <div className="ode-card">
          <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">Распределение доходов</h3>
          <div style={{ height: '300px', background: '#f9fafb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="ode-text-gray">Круговая диаграмма</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderRevenue = () => (
    <div className="ode-space-y-6">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal">Аналитика доходов</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="form-select">
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="quarter">Квартал</option>
            <option value="year">Год</option>
          </select>
          <button className="ode-btn ode-btn-secondary">
            <FaDownload style={{ marginRight: '8px' }} />
            Экспорт
          </button>
        </div>
      </div>

      <div className="ode-card">
        <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">Доходы по месяцам</h3>
        <div style={{ height: '400px', background: '#f9fafb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="ode-text-gray">График доходов</span>
        </div>
      </div>

      <div className="ode-card">
        <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">Детальная статистика</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {revenueData.slice(-6).map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
              <span className="ode-text-sm ode-font-medium ode-text-charcoal">{item.month}</span>
              <div style={{ display: 'flex', gap: '24px' }}>
                <span className="ode-text-sm ode-text-gray">Доход: ₽{item.revenue.toLocaleString()}</span>
                <span className="ode-text-sm ode-text-gray">Заполняемость: {item.occupancy}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderOccupancy = () => (
    <div className="ode-space-y-6">
      <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal">Аналитика заполняемости</h2>

      <div className="ode-card">
        <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">Заполняемость по объектам</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {occupancyData.map((item, index) => (
            <div key={index} className="ode-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 className="ode-text-md ode-font-semibold ode-text-charcoal">{item.property}</h4>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span className="ode-text-sm ode-text-gray">Доход: ₽{item.revenue.toLocaleString()}</span>
                  <span className="ode-text-sm ode-font-semibold ode-text-charcoal">{item.occupancy}%</span>
                </div>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${item.occupancy}%`, 
                    height: '100%', 
                    background: item.occupancy >= 90 ? '#16a34a' : item.occupancy >= 70 ? '#f59e0b' : '#dc2626',
                    transition: 'width 0.3s ease'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderTenants = () => (
    <div className="ode-space-y-6">
      <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal">Аналитика арендаторов</h2>

      {tenantAnalytics.map((category, categoryIndex) => (
        <div key={categoryIndex} className="ode-card">
          <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">{category.category}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {category.data.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="ode-text-sm ode-font-medium ode-text-charcoal">{item.name}</span>
                  <span className="ode-text-sm ode-text-gray">({item.count} арендаторов)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '100px', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${item.percentage}%`, 
                        height: '100%', 
                        background: '#8B0000',
                        transition: 'width 0.3s ease'
                      }}
                    ></div>
                  </div>
                  <span className="ode-text-sm ode-font-semibold ode-text-charcoal">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="ode-bg-gray" style={{ minHeight: '100vh', padding: '32px 0' }}>
      <div className="ode-container">
        <div className="ode-dashboard-layout">
          <AdminNavigation />
          <div className="ode-dashboard-content">
            {/* Header */}
            <div className="ode-dashboard-header">
              <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-2">Аналитика и отчеты</h1>
              <p className="ode-text-gray">Детальная аналитика по всем аспектам бизнеса</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="ode-btn ode-btn-primary">
                <FaDownload style={{ marginRight: '8px' }} />
                Экспорт отчета
              </button>
            </div>

            <div style={{ marginTop: '32px' }}>
          {/* Tabs */}
          <div className="tab-list">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <tab.icon style={{ width: '16px', height: '16px' }} />
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Content */}
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'revenue' && renderRevenue()}
            {activeTab === 'occupancy' && renderOccupancy()}
            {activeTab === 'tenants' && renderTenants()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
