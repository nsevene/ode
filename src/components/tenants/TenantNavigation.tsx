import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, Link } from 'react-router-dom'
import { FaHome, FaCreditCard, FaWrench, FaFileAlt, FaUser, FaBell, FaSignOutAlt } from 'react-icons/fa'

const TenantNavigation: React.FC = () => {
  const { t } = useTranslation('common')
  const location = useLocation()

  const navigationItems = [
    {
      name: t('tenant.navigation.dashboard', 'Дашборд'),
      href: '/tenants/dashboard',
      icon: FaHome,
      current: location.pathname === '/tenants/dashboard'
    },
    {
      name: t('tenant.navigation.payments', 'Платежи'),
      href: '/tenants/payments',
      icon: FaCreditCard,
      current: location.pathname === '/tenants/payments'
    },
    {
      name: t('tenant.navigation.maintenance', 'Техническое обслуживание'),
      href: '/tenants/maintenance',
      icon: FaWrench,
      current: location.pathname === '/tenants/maintenance'
    },
    {
      name: t('tenant.navigation.application_status', 'Статус заявки'),
      href: '/tenants/application-status',
      icon: FaFileAlt,
      current: location.pathname === '/tenants/application-status'
    }
  ]

  return (
    <div className="ode-bg-white ode-shadow-sm ode-rounded-lg ode-p-6 ode-h-fit">
      {/* User Info */}
      <div className="ode-flex ode-items-center ode-mb-6">
        <div className="ode-avatar ode-placeholder">
          <div className="ode-bg-primary ode-text-primary-content ode-rounded-full ode-w-12">
            <FaUser />
          </div>
        </div>
        <div className="ode-ml-3">
          <p className="ode-text-sm ode-font-medium ode-text-gray-900">Арендатор</p>
          <p className="ode-text-xs ode-text-gray-500">tenant@example.com</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="ode-space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`ode-flex ode-items-center ode-px-3 ode-py-2 ode-text-sm ode-font-medium ode-rounded-md ode-transition-colors ${
                item.current
                  ? 'ode-bg-primary ode-text-primary-content'
                  : 'ode-text-gray-600 hover:ode-bg-gray-100 hover:ode-text-gray-900'
              }`}
            >
              <Icon className="ode-mr-3 ode-h-5 ode-w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Quick Stats */}
      <div className="ode-mt-6 ode-pt-6 ode-border-t ode-border-gray-200">
        <h3 className="ode-text-sm ode-font-medium ode-text-gray-900 ode-mb-3">
          {t('tenant.navigation.quick_stats', 'Быстрая статистика')}
        </h3>
        <div className="ode-space-y-2">
          <div className="ode-flex ode-justify-between ode-text-sm">
            <span className="ode-text-gray-600">Активные договоры</span>
            <span className="ode-font-medium">2</span>
          </div>
          <div className="ode-flex ode-justify-between ode-text-sm">
            <span className="ode-text-gray-600">Ожидающие платежи</span>
            <span className="ode-font-medium">$1,200</span>
          </div>
          <div className="ode-flex ode-justify-between ode-text-sm">
            <span className="ode-text-gray-600">Открытые заявки</span>
            <span className="ode-font-medium">1</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="ode-mt-6 ode-pt-6 ode-border-t ode-border-gray-200">
        <div className="ode-flex ode-items-center ode-justify-between ode-mb-3">
          <h3 className="ode-text-sm ode-font-medium ode-text-gray-900">
            {t('tenant.navigation.notifications', 'Уведомления')}
          </h3>
          <span className="ode-badge ode-badge-sm ode-badge-primary">3</span>
        </div>
        <div className="ode-space-y-2">
          <div className="ode-text-xs ode-text-gray-600">
            Новое уведомление о платеже
          </div>
          <div className="ode-text-xs ode-text-gray-600">
            Обновление статуса заявки
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="ode-mt-6 ode-pt-6 ode-border-t ode-border-gray-200">
        <button className="ode-flex ode-items-center ode-w-full ode-px-3 ode-py-2 ode-text-sm ode-font-medium ode-text-gray-600 hover:ode-bg-gray-100 hover:ode-text-gray-900 ode-rounded-md ode-transition-colors">
          <FaSignOutAlt className="ode-mr-3 ode-h-5 ode-w-5" />
          {t('tenant.navigation.logout', 'Выйти')}
        </button>
      </div>
    </div>
  )
}

export default TenantNavigation
