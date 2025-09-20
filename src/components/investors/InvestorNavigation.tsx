import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  FaTachometerAlt, 
  FaChartLine, 
  FaBuilding, 
  FaCog, 
  FaDatabase 
} from 'react-icons/fa'

const InvestorNavigation: React.FC = () => {
  const location = useLocation()

  const navItems = [
    {
      path: '/investors/dashboard',
      icon: FaTachometerAlt,
      label: 'Дашборд',
      description: 'Обзор инвестиций'
    },
    {
      path: '/investors/portfolio',
      icon: FaChartLine,
      label: 'Портфель',
      description: 'Управление портфелем'
    },
    {
      path: '/investors/market-analysis',
      icon: FaBuilding,
      label: 'Анализ рынка',
      description: 'Рыночная аналитика'
    },
    {
      path: '/dataroom',
      icon: FaDatabase,
      label: 'Data Room',
      description: 'Документы и данные'
    },
    {
      path: '/investors/settings',
      icon: FaCog,
      label: 'Настройки',
      description: 'Персональные настройки'
    }
  ]

  return (
    <nav className="ode-investor-navigation">
      <div className="ode-investor-nav-header">
        <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal">
          Кабинет инвестора
        </h3>
        <p className="ode-text-sm ode-text-gray">
          Управление инвестиционным портфелем
        </p>
      </div>

      <ul className="ode-investor-nav-list">
        {navItems.map((item) => {
          const IconComponent = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`ode-investor-nav-item ${isActive ? 'ode-investor-nav-item-active' : ''}`}
              >
                <div className="ode-investor-nav-icon">
                  <IconComponent />
                </div>
                <div className="ode-investor-nav-content">
                  <div className="ode-investor-nav-label">{item.label}</div>
                  <div className="ode-investor-nav-description">{item.description}</div>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default InvestorNavigation