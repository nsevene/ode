import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  FaTachometerAlt, 
  FaChartLine, 
  FaBuilding, 
  FaCog, 
  FaDatabase,
  FaBars,
  FaTimes
} from 'react-icons/fa'

const InvestorNavigation: React.FC = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
      path: '/investors/data-room',
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

      {/* Desktop Navigation */}
      <ul className="ode-investor-nav-list ode-investor-nav-desktop">
        {navItems.map((item) => {
          const IconComponent = item.icon
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
          
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
                </div>
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Mobile Hamburger Button */}
      <button 
        className="ode-investor-hamburger"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="ode-investor-mobile-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <nav className="ode-investor-nav-mobile">
            <ul className="ode-investor-nav-mobile-list">
              {navItems.map((item) => {
                const IconComponent = item.icon
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`ode-investor-nav-mobile-link ${isActive ? 'ode-investor-nav-mobile-link-active' : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <IconComponent className="ode-investor-nav-mobile-icon" />
                      <span className="ode-investor-nav-mobile-text">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </>
      )}
    </nav>
  )
}

export default InvestorNavigation