import React, { useState } from 'react'
import TasteAlleyManager from '../../components/admin/TasteAlleyManager'
import CompassManager from '../../components/admin/CompassManager'
import PassportManager from '../../components/admin/PassportManager'
import AdminNavigation from '../../components/admin/AdminNavigation'

const GamificationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'taste-alley' | 'compass' | 'passport'>('taste-alley')

  const tabs = [
    { id: 'taste-alley', name: 'Taste Alley', icon: '🍽️' },
    { id: 'compass', name: 'Compass', icon: '🧭' },
    { id: 'passport', name: 'Passport', icon: '🎫' }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'taste-alley':
        return <TasteAlleyManager />
      case 'compass':
        return <CompassManager />
      case 'passport':
        return <PassportManager />
      default:
        return <TasteAlleyManager />
    }
  }

  return (
    <div className="ode-bg-gray" style={{ minHeight: '100vh', padding: '32px 0' }}>
      <div className="ode-container">
        <div className="ode-dashboard-layout">
          <AdminNavigation />
          <div className="ode-dashboard-content">
            {/* Header */}
            <div className="ode-dashboard-header">
              <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-2">Управление геймификацией</h1>
              <p className="ode-text-gray">Настройка системы лояльности и вовлечения пользователей</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="ode-btn ode-btn-secondary">
                Экспорт данных
              </button>
              <button className="ode-btn ode-btn-primary">
                Настройки системы
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
                <span style={{ fontSize: '16px' }}>{tab.icon}</span>
                {tab.name}
              </button>
            ))}
        </div>

              {/* Content */}
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GamificationPage
