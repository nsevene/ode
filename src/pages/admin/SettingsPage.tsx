import React, { useState } from 'react'
import { 
  FaCog, FaUsers, FaShieldAlt, FaBell, FaPalette, FaDatabase, FaServer, 
  FaSave, FaUndo, FaCheck, FaTimes, FaEdit, FaPlus, FaTrash, FaEye
} from 'react-icons/fa'
import AdminNavigation from '../../components/admin/AdminNavigation'

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'users' | 'security' | 'notifications' | 'appearance' | 'system'>('general')
  const [settings, setSettings] = useState({
    general: {
      siteName: 'ODPortal',
      siteDescription: 'B2B платформа для управления недвижимостью',
      timezone: 'Europe/Moscow',
      language: 'ru',
      currency: 'RUB'
    },
    security: {
      passwordMinLength: 8,
      requireTwoFactor: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      lockoutDuration: 15
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      weeklyReports: true,
      monthlyReports: true
    },
    appearance: {
      theme: 'light',
      primaryColor: '#8B0000',
      secondaryColor: '#f59e0b',
      logoUrl: '/logo.png',
      faviconUrl: '/favicon.ico'
    }
  })

  const tabs = [
    { id: 'general', name: 'Общие', icon: FaCog },
    { id: 'users', name: 'Пользователи', icon: FaUsers },
    { id: 'security', name: 'Безопасность', icon: FaShieldAlt },
    { id: 'notifications', name: 'Уведомления', icon: FaBell },
    { id: 'appearance', name: 'Внешний вид', icon: FaPalette },
    { id: 'system', name: 'Система', icon: FaServer }
  ]

  const roles = [
    {
      id: 'admin',
      name: 'Администратор',
      description: 'Полный доступ ко всем функциям системы',
      permissions: ['all'],
      userCount: 3
    },
    {
      id: 'manager',
      name: 'Менеджер',
      description: 'Управление объектами и арендаторами',
      permissions: ['properties', 'tenants', 'applications'],
      userCount: 5
    },
    {
      id: 'tenant',
      name: 'Арендатор',
      description: 'Доступ к своим объектам и платежам',
      permissions: ['own_properties', 'payments'],
      userCount: 156
    },
    {
      id: 'investor',
      name: 'Инвестор',
      description: 'Доступ к инвестиционным возможностям',
      permissions: ['investments', 'reports'],
      userCount: 23
    }
  ]

  const systemInfo = [
    { name: 'Версия системы', value: '1.0.0', status: 'success' },
    { name: 'База данных', value: 'PostgreSQL 14.5', status: 'success' },
    { name: 'Веб-сервер', value: 'Nginx 1.20.1', status: 'success' },
    { name: 'PHP версия', value: '8.1.12', status: 'success' },
    { name: 'Свободное место', value: '45.2 GB', status: 'warning' },
    { name: 'Последнее обновление', value: '2024-12-19', status: 'success' }
  ]

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
  }

  const handleSave = () => {
    console.log('Saving settings:', settings)
    // Implement save logic here
  }

  const renderGeneral = () => (
    <div className="ode-space-y-6">
      <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal">Общие настройки</h2>
      
      <div className="ode-card">
        <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">Основная информация</h3>
        <div className="ode-space-y-4">
          <div>
            <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
              Название сайта
            </label>
            <input
              type="text"
              value={settings.general.siteName}
              onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
              Описание сайта
            </label>
            <textarea
              value={settings.general.siteDescription}
              onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
              className="form-textarea"
              rows={3}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
                Часовой пояс
              </label>
              <select
                value={settings.general.timezone}
                onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                className="form-select"
              >
                <option value="Europe/Moscow">Москва (UTC+3)</option>
                <option value="Europe/London">Лондон (UTC+0)</option>
                <option value="America/New_York">Нью-Йорк (UTC-5)</option>
              </select>
            </div>
            <div>
              <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
                Язык
              </label>
              <select
                value={settings.general.language}
                onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                className="form-select"
              >
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
                Валюта
              </label>
              <select
                value={settings.general.currency}
                onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
                className="form-select"
              >
                <option value="RUB">Рубль (₽)</option>
                <option value="USD">Доллар ($)</option>
                <option value="EUR">Евро (€)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderUsers = () => (
    <div className="ode-space-y-6">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal">Управление ролями</h2>
        <button className="ode-btn ode-btn-primary">
          <FaPlus style={{ marginRight: '8px' }} />
          Создать роль
        </button>
      </div>

      <div className="ode-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {roles.map((role) => (
            <div key={role.id} className="ode-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal">{role.name}</h3>
                    <span className="badge" style={{ 
                      background: '#f3f4f6',
                      color: '#374151',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {role.userCount} пользователей
                    </span>
                  </div>
                  <p className="ode-text-sm ode-text-gray ode-mb-3">{role.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {role.permissions.map((permission) => (
                      <span key={permission} className="badge" style={{ 
                        background: '#dbeafe',
                        color: '#2563eb',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="ode-btn ode-btn-sm" style={{ background: '#f9fafb', color: '#374151' }}>
                    <FaEye />
                  </button>
                  <button className="ode-btn ode-btn-sm" style={{ background: '#dbeafe', color: '#2563eb' }}>
                    <FaEdit />
                  </button>
                  <button className="ode-btn ode-btn-sm" style={{ background: '#fef2f2', color: '#dc2626' }}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSecurity = () => (
    <div className="ode-space-y-6">
      <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal">Настройки безопасности</h2>
      
      <div className="ode-card">
        <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">Пароли</h3>
        <div className="ode-space-y-4">
          <div>
            <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
              Минимальная длина пароля
            </label>
            <input
              type="number"
              value={settings.security.passwordMinLength}
              onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
              className="form-input"
              min="6"
              max="20"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={settings.security.requireTwoFactor}
              onChange={(e) => handleSettingChange('security', 'requireTwoFactor', e.target.checked)}
            />
            <label className="ode-text-sm ode-text-charcoal">Требовать двухфакторную аутентификацию</label>
          </div>
        </div>
      </div>

      <div className="ode-card">
        <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">Сессии</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
              Таймаут сессии (минуты)
            </label>
            <input
              type="number"
              value={settings.security.sessionTimeout}
              onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
              className="form-input"
              min="5"
              max="480"
            />
          </div>
          <div>
            <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
              Максимум попыток входа
            </label>
            <input
              type="number"
              value={settings.security.maxLoginAttempts}
              onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
              className="form-input"
              min="3"
              max="10"
            />
          </div>
          <div>
            <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
              Блокировка на (минуты)
            </label>
            <input
              type="number"
              value={settings.security.lockoutDuration}
              onChange={(e) => handleSettingChange('security', 'lockoutDuration', parseInt(e.target.value))}
              className="form-input"
              min="5"
              max="60"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotifications = () => (
    <div className="ode-space-y-6">
      <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal">Настройки уведомлений</h2>
      
      <div className="ode-card">
        <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">Каналы уведомлений</h3>
        <div className="ode-space-y-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={settings.notifications.emailNotifications}
              onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
            />
            <label className="ode-text-sm ode-text-charcoal">Email уведомления</label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={settings.notifications.smsNotifications}
              onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
            />
            <label className="ode-text-sm ode-text-charcoal">SMS уведомления</label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={settings.notifications.pushNotifications}
              onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
            />
            <label className="ode-text-sm ode-text-charcoal">Push уведомления</label>
          </div>
        </div>
      </div>

      <div className="ode-card">
        <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">Отчеты</h3>
        <div className="ode-space-y-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={settings.notifications.weeklyReports}
              onChange={(e) => handleSettingChange('notifications', 'weeklyReports', e.target.checked)}
            />
            <label className="ode-text-sm ode-text-charcoal">Еженедельные отчеты</label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={settings.notifications.monthlyReports}
              onChange={(e) => handleSettingChange('notifications', 'monthlyReports', e.target.checked)}
            />
            <label className="ode-text-sm ode-text-charcoal">Ежемесячные отчеты</label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSystem = () => (
    <div className="ode-space-y-6">
      <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal">Системная информация</h2>
      
      <div className="ode-card">
        <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">Статус системы</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {systemInfo.map((info) => (
            <div key={info.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
              <span className="ode-text-sm ode-font-medium ode-text-charcoal">{info.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="ode-text-sm ode-text-charcoal">{info.value}</span>
                <span className="badge" style={{ 
                  background: info.status === 'success' ? '#f0fdf4' : '#fef3c7',
                  color: info.status === 'success' ? '#16a34a' : '#f59e0b',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  {info.status === 'success' ? 'OK' : 'Warning'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
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
              <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-2">Настройки системы</h1>
              <p className="ode-text-gray">Конфигурация системы, роли и права доступа</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="ode-btn ode-btn-secondary">
                <FaUndo style={{ marginRight: '8px' }} />
                Сбросить
              </button>
              <button onClick={handleSave} className="ode-btn ode-btn-primary">
                <FaSave style={{ marginRight: '8px' }} />
                Сохранить
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
        {activeTab === 'general' && renderGeneral()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'security' && renderSecurity()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'appearance' && (
          <div className="ode-text-center" style={{ padding: '48px 0' }}>
            <FaPalette style={{ width: '48px', height: '48px', color: '#d1d5db', margin: '0 auto 16px' }} />
            <p className="ode-text-gray">Модуль внешнего вида в разработке</p>
          </div>
        )}
              {activeTab === 'system' && renderSystem()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
