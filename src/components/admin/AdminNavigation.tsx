import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FaChartLine, 
  FaUsers, 
  FaBuilding, 
  FaDollarSign, 
  FaFileAlt, 
  FaCog, 
  FaUserTie, 
  FaGamepad,
  FaTachometerAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';

interface AdminNavItem {
  path: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

const AdminNavigation: React.FC = () => {
  const { t } = useTranslation('common');
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: AdminNavItem[] = [
    {
      path: '/admin/dashboard',
      labelKey: 'admin.nav.dashboard',
      icon: FaTachometerAlt,
    },
    {
      path: '/admin/applications',
      labelKey: 'admin.nav.applications',
      icon: FaFileAlt,
    },
    {
      path: '/admin/users',
      labelKey: 'admin.nav.users',
      icon: FaUsers,
    },
    {
      path: '/admin/properties',
      labelKey: 'admin.nav.properties',
      icon: FaBuilding,
    },
    {
      path: '/admin/finance',
      labelKey: 'admin.nav.finance',
      icon: FaDollarSign,
    },
    {
      path: '/admin/analytics',
      labelKey: 'admin.nav.analytics',
      icon: FaChartLine,
    },
    {
      path: '/admin/documents',
      labelKey: 'admin.nav.documents',
      icon: FaFileAlt,
    },
    {
      path: '/admin/gamification',
      labelKey: 'admin.nav.gamification',
      icon: FaGamepad,
    },
    {
      path: '/admin/settings',
      labelKey: 'admin.nav.settings',
      icon: FaCog,
    },
  ];

  return (
    <div className="ode-admin-navigation">
      <div className="ode-admin-nav-header">
        <div className="ode-flex ode-items-center ode-gap-3">
          <div className="ode-admin-nav-icon">
            <FaUserTie className="ode-text-white" />
          </div>
          <div>
            <h3 className="ode-admin-nav-title">
              {t('admin.nav.title', 'Панель администратора')}
            </h3>
            <p className="ode-admin-nav-subtitle">
              {t('admin.nav.subtitle', 'Управление системой')}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="ode-admin-nav-menu ode-admin-nav-desktop">
        <ul className="ode-admin-nav-horizontal">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`ode-admin-nav-link ${isActive ? 'ode-admin-nav-link-active' : ''}`}
                >
                  <Icon className="ode-admin-nav-link-icon" />
                  <span className="ode-admin-nav-link-text">
                    {t(item.labelKey, item.labelKey.split('.').pop() || 'Menu')}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile Hamburger Button */}
      <button 
        className="ode-admin-hamburger"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="ode-admin-mobile-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <nav className="ode-admin-nav-mobile">
            <ul className="ode-admin-nav-mobile-list">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`ode-admin-nav-mobile-link ${isActive ? 'ode-admin-nav-mobile-link-active' : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="ode-admin-nav-mobile-icon" />
                      <span className="ode-admin-nav-mobile-text">
                        {t(item.labelKey, item.labelKey.split('.').pop() || 'Menu')}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
};

export default AdminNavigation;