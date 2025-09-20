import React, { useState } from 'react'
import { FaChartLine, FaFileAlt, FaUsers, FaFolder, FaGamepad, FaHome, FaEye, FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa'

const TestAdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'applications' | 'users' | 'dataroom' | 'gamification'>('dashboard')

  const tabs = [
    { id: 'dashboard', name: 'Дашборд', icon: FaChartLine },
    { id: 'applications', name: 'Заявки', icon: FaFileAlt },
    { id: 'users', name: 'Пользователи', icon: FaUsers },
    { id: 'dataroom', name: 'Data Room', icon: FaFolder },
    { id: 'gamification', name: 'Геймификация', icon: FaGamepad }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="ode-space-y-6">
            <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal">Админ Дашборд</h2>
            <div className="ode-grid ode-grid-4">
              <div className="ode-card ode-text-center">
                <div className="ode-text-3xl ode-font-bold ode-text-primary">1,234</div>
                <div className="ode-text-sm ode-text-gray">Всего пользователей</div>
              </div>
              <div className="ode-card ode-text-center">
                <div className="ode-text-3xl ode-font-bold ode-text-success">23</div>
                <div className="ode-text-sm ode-text-gray">Новые заявки</div>
              </div>
              <div className="ode-card ode-text-center">
                <div className="ode-text-3xl ode-font-bold ode-text-accent">156</div>
                <div className="ode-text-sm ode-text-gray">Активных объектов</div>
              </div>
              <div className="ode-card ode-text-center">
                <div className="ode-text-3xl ode-font-bold" style={{ color: '#8B5CF6' }}>₽2.5М</div>
                <div className="ode-text-sm ode-text-gray">Доход за месяц</div>
              </div>
            </div>
          </div>
        )
      case 'applications':
        return (
          <div className="ode-space-y-6">
            <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal">Управление заявками</h2>
            <div className="ode-card">
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th className="ode-text-xs ode-font-medium ode-text-gray ode-uppercase">Компания</th>
                      <th className="ode-text-xs ode-font-medium ode-text-gray ode-uppercase">Контакт</th>
                      <th className="ode-text-xs ode-font-medium ode-text-gray ode-uppercase">Статус</th>
                      <th className="ode-text-xs ode-font-medium ode-text-gray ode-uppercase">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="ode-text-sm ode-font-medium ode-text-charcoal">ООО "ТехноИнновации"</td>
                      <td className="ode-text-sm ode-text-gray">ivan@company.com</td>
                      <td>
                        <span className="badge" style={{ background: '#fef3c7', color: '#f59e0b' }}>На рассмотрении</span>
                      </td>
                      <td className="ode-text-sm ode-font-medium">
                        <button className="ode-btn ode-btn-sm" style={{ background: '#f9fafb', color: '#374151', marginRight: '8px' }}>
                          <FaEye style={{ marginRight: '4px' }} />
                          Просмотр
                        </button>
                        <button className="ode-btn ode-btn-sm ode-btn-primary" style={{ marginRight: '8px' }}>
                          <FaCheck style={{ marginRight: '4px' }} />
                          Одобрить
                        </button>
                        <button className="ode-btn ode-btn-sm" style={{ background: '#fef2f2', color: '#dc2626' }}>
                          <FaTimes style={{ marginRight: '4px' }} />
                          Отклонить
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      case 'users':
        return (
          <div className="ode-space-y-6">
            <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal">Управление пользователями</h2>
            <div className="ode-card">
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th className="ode-text-xs ode-font-medium ode-text-gray ode-uppercase">Email</th>
                      <th className="ode-text-xs ode-font-medium ode-text-gray ode-uppercase">Роль</th>
                      <th className="ode-text-xs ode-font-medium ode-text-gray ode-uppercase">Статус</th>
                      <th className="ode-text-xs ode-font-medium ode-text-gray ode-uppercase">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="ode-text-sm ode-font-medium ode-text-charcoal">admin@odportal.com</td>
                      <td>
                        <span className="badge" style={{ background: '#fef2f2', color: '#dc2626' }}>Администратор</span>
                      </td>
                      <td>
                        <span className="badge" style={{ background: '#f0fdf4', color: '#16a34a' }}>Активен</span>
                      </td>
                      <td className="ode-text-sm ode-font-medium">
                        <button className="ode-btn ode-btn-sm" style={{ background: '#f9fafb', color: '#374151', marginRight: '8px' }}>
                          <FaEdit style={{ marginRight: '4px' }} />
                          Редактировать
                        </button>
                        <button className="ode-btn ode-btn-sm" style={{ background: '#fef2f2', color: '#dc2626' }}>
                          <FaTrash style={{ marginRight: '4px' }} />
                          Деактивировать
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      case 'dataroom':
        return (
          <div className="ode-space-y-6">
            <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal">Data Room</h2>
            <div className="ode-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div className="ode-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', background: '#dbeafe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaFolder style={{ width: '16px', height: '16px', color: '#2563eb' }} />
                  </div>
                  <div>
                    <div className="ode-font-medium ode-text-charcoal">Финансовые отчеты</div>
                    <div className="ode-text-sm ode-text-gray">12 файлов</div>
                  </div>
                </div>
              </div>
              <div className="ode-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', background: '#f0fdf4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaFileAlt style={{ width: '16px', height: '16px', color: '#16a34a' }} />
                  </div>
                  <div>
                    <div className="ode-font-medium ode-text-charcoal">Юридические документы</div>
                    <div className="ode-text-sm ode-text-gray">8 файлов</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'gamification':
        return (
          <div className="ode-space-y-6">
            <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal">Управление геймификацией</h2>
            <div className="ode-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              <div className="ode-card ode-text-center">
                <div className="ode-text-4xl ode-mb-2">🍽️</div>
                <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-2">Taste Alley</h3>
                <p className="ode-text-sm ode-text-gray ode-mb-4">Эксклюзивные предложения</p>
                <button className="ode-btn ode-btn-primary" style={{ width: '100%' }}>Управлять</button>
              </div>
              <div className="ode-card ode-text-center">
                <div className="ode-text-4xl ode-mb-2">🧭</div>
                <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-2">Compass</h3>
                <p className="ode-text-sm ode-text-gray ode-mb-4">Челленджи и задания</p>
                <button className="ode-btn ode-btn-primary" style={{ width: '100%' }}>Управлять</button>
              </div>
              <div className="ode-card ode-text-center">
                <div className="ode-text-4xl ode-mb-2">🎫</div>
                <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-2">Passport</h3>
                <p className="ode-text-sm ode-text-gray ode-mb-4">Уровни лояльности</p>
                <button className="ode-btn ode-btn-primary" style={{ width: '100%' }}>Управлять</button>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="ode-bg-gray" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div className="ode-bg-white" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div className="ode-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0' }}>
            <div>
              <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal">Админ Панель - Тестирование</h1>
              <p className="ode-text-gray">Интерфейс для тестирования админ-функций</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => window.location.href = '/'}
                className="ode-btn ode-btn-secondary"
              >
                <FaHome style={{ marginRight: '8px' }} />
                На главную
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="ode-container" style={{ padding: '32px 0' }}>
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
        {renderContent()}
      </div>
    </div>
  )
}

export default TestAdminPage
