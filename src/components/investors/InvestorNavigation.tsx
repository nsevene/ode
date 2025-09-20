import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  FaHome, FaChartLine, FaBuilding, FaCog, FaWallet, FaStar,
  FaUser, FaSignOutAlt, FaBell, FaSearch
} from 'react-icons/fa'
import { useAuthStore } from '../../store/authStore'

const InvestorNavigation: React.FC = () => {
  const { t } = useTranslation('common')
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const navigationItems = [
    {
      name: t('investor.navigation.dashboard', 'Дашборд'),
      href: '/investors/dashboard',
      icon: FaHome,
      current: location.pathname === '/investors/dashboard'
    },
    {
      name: t('investor.navigation.marketplace', 'Маркетплейс'),
      href: '/investors/marketplace',
      icon: FaBuilding,
      current: location.pathname === '/investors/marketplace'
    },
    {
      name: t('investor.navigation.portfolio', 'Портфель'),
      href: '/investors/portfolio',
      icon: FaChartLine,
      current: location.pathname === '/investors/portfolio'
    },
    {
      name: t('investor.navigation.market_analysis', 'Анализ рынка'),
      href: '/investors/market-analysis',
      icon: FaSearch,
      current: location.pathname === '/investors/market-analysis'
    },
    {
      name: t('investor.navigation.kyc', 'KYC Верификация'),
      href: '/investors/kyc',
      icon: FaUser,
      current: location.pathname === '/investors/kyc'
    },
    {
      name: t('investor.navigation.commitments', 'Управление инвестициями'),
      href: '/investors/commitments',
      icon: FaFileAlt,
      current: location.pathname === '/investors/commitments'
    },
    {
      name: t('investor.navigation.document_signing', 'Подписание документов'),
      href: '/investors/document-signing',
      icon: FaSignature,
      current: location.pathname === '/investors/document-signing'
    },
    {
      name: t('investor.navigation.settings', 'Настройки'),
      href: '/investors/settings',
      icon: FaCog,
      current: location.pathname === '/investors/settings'
    }
  ]

  return (
    <div className="ode-bg-white ode-shadow-sm ode-rounded-lg ode-p-6 ode-h-fit">
      {/* User Info */}
      <div className="ode-flex ode-items-center ode-mb-6">
        <div className="ode-w-12 ode-h-12 ode-bg-primary ode-rounded-full ode-flex ode-items-center ode-justify-center ode-mr-3">
          <FaUser className="ode-text-white ode-text-xl" />
        </div>
        <div>
          <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal">
            {user?.full_name || 'Инвестор'}
          </h3>
          <p className="ode-text-sm ode-text-gray">Инвестор</p>
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
              className={`ode-flex ode-items-center ode-px-3 ode-py-2 ode-rounded-lg ode-transition ${
                item.current
                  ? 'ode-bg-primary ode-text-white'
                  : 'ode-text-gray-600 ode-hover:bg-gray-100'
              }`}
            >
              <Icon className="ode-mr-3 ode-text-lg" />
              <span className="ode-font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Quick Stats */}
      <div className="ode-mt-8 ode-p-4 ode-bg-gray-50 ode-rounded-lg">
        <h4 className="ode-text-sm ode-font-semibold ode-text-gray ode-mb-3">
          {t('investor.navigation.quick_stats', 'Быстрая статистика')}
        </h4>
        <div className="ode-space-y-2">
          <div className="ode-flex ode-justify-between">
            <span className="ode-text-xs ode-text-gray">Портфель</span>
            <span className="ode-text-xs ode-font-semibold ode-text-charcoal">₽2.5М</span>
          </div>
          <div className="ode-flex ode-justify-between">
            <span className="ode-text-xs ode-text-gray">Доходность</span>
            <span className="ode-text-xs ode-font-semibold ode-text-success">+12.5%</span>
          </div>
          <div className="ode-flex ode-justify-between">
            <span className="ode-text-xs ode-text-gray">Активных сделок</span>
            <span className="ode-text-xs ode-font-semibold ode-text-charcoal">3</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="ode-mt-6">
        <button className="ode-w-full ode-flex ode-items-center ode-justify-center ode-px-3 ode-py-2 ode-bg-gray-100 ode-text-gray-600 ode-rounded-lg ode-hover:bg-gray-200 ode-transition">
          <FaBell className="ode-mr-2" />
          <span className="ode-text-sm ode-font-medium">
            {t('investor.navigation.notifications', 'Уведомления')}
          </span>
        </button>
      </div>

      {/* Logout */}
      <div className="ode-mt-6">
        <button
          onClick={logout}
          className="ode-w-full ode-flex ode-items-center ode-justify-center ode-px-3 ode-py-2 ode-bg-red-50 ode-text-red-600 ode-rounded-lg ode-hover:bg-red-100 ode-transition"
        >
          <FaSignOutAlt className="ode-mr-2" />
          <span className="ode-text-sm ode-font-medium">
            {t('investor.navigation.logout', 'Выйти')}
          </span>
        </button>
      </div>
    </div>
  )
}

export default InvestorNavigation