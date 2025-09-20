import React, { useState } from 'react'
import TasteAlleyManager from '../../components/admin/TasteAlleyManager'
import CompassManager from '../../components/admin/CompassManager'
import PassportManager from '../../components/admin/PassportManager'

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
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Управление геймификацией</h1>
              <p className="text-gray-600">Настройка системы лояльности и вовлечения пользователей</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn-secondary">
                Экспорт данных
              </button>
              <button className="btn-primary">
                Настройки системы
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
  )
}

export default GamificationPage
