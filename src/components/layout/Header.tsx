import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { UserRole } from '../../types/auth'
import LanguageSelector from './LanguageSelector'

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="ode-header">
      {/* Top Level - Utilities */}
      <div className="ode-header-top">
        <div style={{ maxWidth: '99%', margin: '0 auto', padding: '0 16px' }}>
          <div className="ode-header-top-content">
            <div className="ode-header-top-left">
              <div className="ode-text-sm ode-text-gray">B2B Platform для управления коммерческой недвижимостью</div>
            </div>
            <div className="ode-header-top-right">
              <LanguageSelector />
              {isAuthenticated ? (
                <div className="ode-header-auth-info">
                  <span className="ode-text-gray ode-text-sm ode-font-medium">
                    {user?.email} ({user?.role})
                  </span>
                  <button
                    onClick={logout}
                    className="ode-btn ode-btn-sm ode-btn-secondary"
                  >
                    Выйти
                  </button>
                </div>
              ) : (
                <div className="ode-header-auth-buttons">
                  <Link to="/login" className="ode-btn ode-btn-sm" style={{ background: '#f9fafb', color: '#374151' }}>
                    Войти
                  </Link>
                  <Link to="/register" className="ode-btn ode-btn-sm ode-btn-primary">
                    Регистрация
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Level - Navigation */}
      <div className="ode-header-main">
        <div style={{ maxWidth: '99%', margin: '0 auto', padding: '0 16px' }}>
          <div className="ode-header-content">
            {/* Logo */}
            <Link to="/" className="ode-header-logo">
              <div className="ode-logo">
                <span>OD</span>
              </div>
              <div>
                <div className="ode-title">ODPortal</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="ode-header-nav">
              <Link to="/" className="ode-header-nav-link">Главная</Link>
              <Link to="/about" className="ode-header-nav-link">О портале</Link>
              <Link to="/tenant-opportunities" className="ode-header-nav-link">Для арендаторов</Link>
              <Link to="/apply" className="ode-header-nav-link">Подать заявку</Link>
              <Link to="/investor-opportunities" className="ode-header-nav-link">Для инвесторов</Link>
              <Link to="/demo" className="ode-header-nav-link">Демо</Link>
              
              <div className="ode-header-testing">
                <Link to="/test-api" className="ode-btn ode-btn-sm" style={{ background: '#f9fafb', color: '#374151' }}>
                  API
                </Link>
                <Link to="/test-gamification" className="ode-btn ode-btn-sm" style={{ background: '#f9fafb', color: '#374151' }}>
                  Геймификация
                </Link>
                <Link to="/test-admin" className="ode-btn ode-btn-sm" style={{ background: '#f9fafb', color: '#374151' }}>
                  Админ
                </Link>
              </div>
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="ode-header-cta">
              {isAuthenticated ? (
                <>
                  {user?.role === UserRole.Admin && (
                    <Link to="/admin/dashboard" className="ode-btn ode-btn-primary">
                      Админ панель
                    </Link>
                  )}
                  {user?.role === UserRole.Investor && (
                    <Link to="/investors/dashboard" className="ode-btn ode-btn-primary">
                      Мой кабинет
                    </Link>
                  )}
                  {user?.role === UserRole.Tenant && (
                    <Link to="/tenants/dashboard" className="ode-btn ode-btn-primary">
                      Мой кабинет
                    </Link>
                  )}
                  {(user?.role === UserRole.Tenant || user?.role === UserRole.Investor) && (
                    <Link to="/dataroom" className="ode-btn ode-btn-secondary">Data Room</Link>
                  )}
                </>
              ) : (
                <>
                  <Link to="/tenant-application" className="ode-btn ode-btn-secondary">
                    Стать арендатором
                  </Link>
                  <Link to="/investor-contact" className="ode-btn ode-btn-outline">
                    Запросить звонок
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="ode-header-mobile-menu"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="ode-header-mobile-nav">
            <nav className="ode-header-mobile-nav-content">
              <Link to="/" className="ode-header-mobile-nav-link">Главная</Link>
              <Link to="/about" className="ode-header-mobile-nav-link">О портале</Link>
              <Link to="/tenant-opportunities" className="ode-header-mobile-nav-link">Для арендаторов</Link>
              <Link to="/apply" className="ode-header-mobile-nav-link">Подать заявку</Link>
              <Link to="/investor-opportunities" className="ode-header-mobile-nav-link">Для инвесторов</Link>
              <Link to="/demo" className="ode-header-mobile-nav-link">Демо</Link>
              {user?.role === UserRole.Investor && (
                <div className="ode-header-mobile-section">
                  <Link to="/investors/dashboard" className="ode-header-mobile-nav-link">Мой кабинет</Link>
                </div>
              )}
              
              <div className="ode-header-mobile-section">
                <div className="ode-header-mobile-section-title">Тестирование</div>
                <Link to="/test-api" className="ode-header-mobile-nav-link">API Тестирование</Link>
                <Link to="/test-gamification" className="ode-header-mobile-nav-link">Геймификация</Link>
                <Link to="/test-admin" className="ode-header-mobile-nav-link">Админ-панель</Link>
              </div>
              
              <div className="ode-header-mobile-cta">
                <Link to="/tenant-application" className="ode-btn ode-btn-secondary ode-header-mobile-cta-link">
                  Стать арендатором
                </Link>
                <Link to="/investor-contact" className="ode-btn ode-btn-primary ode-header-mobile-cta-link">
                  Запросить звонок
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header