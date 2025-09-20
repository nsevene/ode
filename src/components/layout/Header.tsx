import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { UserRole } from '../../types/auth'

const Header: React.FC = () => {
  const { i18n, t } = useTranslation('common');
  const { isAuthenticated, user, logout } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="ode-header">
      <div style={{ maxWidth: '99%', margin: '0 auto', padding: '0 16px' }}>
        <div className="ode-header-content">
          {/* Logo */}
          <Link to="/" className="ode-header-logo">
            <div className="ode-logo">
              <span>OD</span>
            </div>
            <div>
              <div className="ode-title">ODPortal</div>
              <div className="ode-text-sm ode-text-gray" style={{ marginLeft: '16px', marginTop: '-4px' }}>B2B Platform</div>
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

          <div className="flex items-center space-x-2">
            <button onClick={() => changeLanguage('ru')} className={`ode-btn ode-btn-sm ${i18n.language === 'ru' ? 'ode-btn-primary' : 'ode-btn-secondary'}`}>RU</button>
            <button onClick={() => changeLanguage('en')} className={`ode-btn ode-btn-sm ${i18n.language === 'en' ? 'ode-btn-primary' : 'ode-btn-secondary'}`}>EN</button>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="ode-header-cta">
            {isAuthenticated ? (
              <>
                <span className="ode-text-gray ode-text-sm ode-font-medium">
                  Привет, {user?.email} ({user?.role})
                </span>
                <button
                  onClick={logout}
                  className="ode-btn ode-btn-secondary"
                >
                  Выйти
                </button>
                {user?.role === UserRole.Admin && (
                  <Link to="/admin/dashboard" className="ode-btn ode-btn-primary">
                    Админ
                  </Link>
                )}
                {(user?.role === UserRole.Tenant || user?.role === UserRole.Investor) && (
                  <Link to="/dataroom" className="ode-header-nav-link">Data Room</Link>
                )}
                {user?.role === UserRole.Investor && (
                  <>
                    <Link to="/investors/dashboard" className="ode-header-nav-link">{t('investor_dashboard')}</Link>
                    <Link to="/investors/portfolio" className="ode-header-nav-link">{t('investor_portfolio')}</Link>
                    <Link to="/investors/market-analysis" className="ode-header-nav-link">{t('investor_market_analysis')}</Link>
                    <Link to="/investors/settings" className="ode-header-nav-link">{t('investor_settings')}</Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="ode-btn" style={{ background: '#f9fafb', color: '#374151' }}>
                  Войти
                </Link>
                <Link to="/register" className="ode-btn ode-btn-primary">
                  Регистрация
                </Link>
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
                  <div className="ode-header-mobile-section-title">{t('investor_dashboard')}</div>
                  <Link to="/investors/dashboard" className="ode-header-mobile-nav-link">{t('investor_dashboard')}</Link>
                  <Link to="/investors/portfolio" className="ode-header-mobile-nav-link">{t('investor_portfolio')}</Link>
                  <Link to="/investors/market-analysis" className="ode-header-mobile-nav-link">{t('investor_market_analysis')}</Link>
                  <Link to="/investors/settings" className="ode-header-mobile-nav-link">{t('investor_settings')}</Link>
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