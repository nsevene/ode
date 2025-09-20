import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaChartLine, FaUsers, FaBuilding, FaHandshake, FaCode, FaGamepad, FaShieldAlt, FaRocket, FaStar } from 'react-icons/fa';

const HomePage: React.FC = () => {
  const { t } = useTranslation('common');
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'testing'>('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="ode-grid ode-grid-2">
            <div className="ode-text-center">
              <h2 className="ode-text-5xl ode-font-bold ode-text-charcoal ode-mb-2">
                Добро пожаловать в ODPortal
              </h2>
              <p className="ode-text-lg ode-text-gray" style={{ maxWidth: '768px', margin: '0 auto', lineHeight: '1.6' }}>
                Комплексная экосистема для управления коммерческой недвижимостью, 
                объединяющая арендаторов, инвесторов и управляющие компании в единой платформе.
              </p>
            </div>
            
            <div className="ode-grid ode-grid-2">
              <div className="ode-card">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: '#fef2f2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px' }}>
                    <FaBuilding style={{ width: '24px', height: '24px', color: '#8B0000' }} />
                  </div>
                  <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal">B2B Портал</h3>
                </div>
                <p className="ode-text-gray" style={{ lineHeight: '1.6' }}>
                  Управление заявками, пользователями, Data Room, геймификация для арендаторов и инвесторов. 
                  Полный контроль над бизнес-процессами.
                </p>
              </div>
              
              <div className="ode-card">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: '#fef3c7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px' }}>
                    <FaCode style={{ width: '24px', height: '24px', color: '#FFC107' }} />
                  </div>
                  <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal">B2C API</h3>
                </div>
                <p className="ode-text-gray" style={{ lineHeight: '1.6' }}>
                  Публичное меню, события, бронирования — готовые эндпоинты для интеграции 
                  с внешними B2C платформами и мобильными приложениями.
                </p>
              </div>
            </div>
          </div>
        );
      case 'features':
        return (
          <div>
            <div className="ode-text-center ode-mb-6">
              <h2 className="ode-text-5xl ode-font-bold ode-text-charcoal ode-mb-2">
                Основные возможности платформы
              </h2>
              <p className="ode-text-lg ode-text-gray" style={{ maxWidth: '512px', margin: '0 auto' }}>
                Мощные инструменты для эффективного управления коммерческой недвижимостью
              </p>
            </div>
            
            <div className="ode-grid ode-grid-3">
              {[
                { icon: FaUsers, title: 'Управление арендаторами', desc: 'Поиск, бронирование, управление договорами' },
                { icon: FaChartLine, title: 'Инвестиционные возможности', desc: 'Аналитика, портфельное управление, отчетность' },
                { icon: FaShieldAlt, title: 'Админ-панель', desc: 'Полный контроль над пользователями и контентом' },
                { icon: FaBuilding, title: 'Data Room', desc: 'Защищенное хранилище документов с гибкими правами' },
                { icon: FaGamepad, title: 'Геймификация', desc: 'Программы лояльности для вовлечения пользователей' },
                { icon: FaRocket, title: 'B2C API', desc: 'Готовые эндпоинты для интеграции с внешними платформами' }
              ].map((feature, index) => (
                <div key={index} className="ode-card ode-text-center">
                  <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#8B0000' }}>
                    <feature.icon style={{ width: '32px', height: '32px' }} />
                  </div>
                  <h4 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">{feature.title}</h4>
                  <p className="ode-text-sm ode-text-gray" style={{ lineHeight: '1.6' }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'testing':
        return (
          <div>
            <div className="ode-text-center ode-mb-6">
              <h2 className="ode-text-5xl ode-font-bold ode-text-charcoal ode-mb-2">
                Тестирование функционала
              </h2>
              <p className="ode-text-lg ode-text-gray" style={{ maxWidth: '512px', margin: '0 auto' }}>
                Интерактивные демо для проверки всех возможностей платформы
              </p>
            </div>
            
            <div className="ode-grid ode-grid-3">
              <Link to="/test-api" className="ode-card ode-text-center" style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ width: '64px', height: '64px', background: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#2563eb' }}>
                  <FaCode style={{ width: '32px', height: '32px' }} />
                </div>
                <h4 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">API Тестирование</h4>
                <p className="ode-text-gray ode-mb-3">Проверка B2C API (меню, события, бронирование)</p>
                <div className="ode-text-sm" style={{ color: '#2563eb', fontWeight: '500' }}>Перейти к тестированию →</div>
              </Link>
              
              <Link to="/test-gamification" className="ode-card ode-text-center" style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ width: '64px', height: '64px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#16a34a' }}>
                  <FaGamepad style={{ width: '32px', height: '32px' }} />
                </div>
                <h4 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Геймификация</h4>
                <p className="ode-text-gray ode-mb-3">Проверка Taste Alley, Compass, Passport</p>
                <div className="ode-text-sm" style={{ color: '#16a34a', fontWeight: '500' }}>Перейти к тестированию →</div>
              </Link>
              
              <Link to="/test-admin" className="ode-card ode-text-center" style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ width: '64px', height: '64px', background: '#f3e8ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#9333ea' }}>
                  <FaShieldAlt style={{ width: '32px', height: '32px' }} />
                </div>
                <h4 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Админ-панель</h4>
                <p className="ode-text-gray ode-mb-3">Проверка админ-панели и управления</p>
                <div className="ode-text-sm" style={{ color: '#9333ea', fontWeight: '500' }}>Перейти к тестированию →</div>
              </Link>
            </div>
            
            <div className="ode-card" style={{ background: '#fef3c7', border: '1px solid #fbbf24' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <FaStar style={{ width: '24px', height: '24px', color: '#f59e0b', marginRight: '12px', marginTop: '4px' }} />
                <div>
                  <h4 className="ode-font-semibold ode-text-charcoal ode-mb-1">Демо-режим</h4>
                  <p className="ode-text-gray ode-mb-2">
                    Для тестирования защищенных разделов используйте логин/регистрацию. 
                    Роли назначаются автоматически по email:
                  </p>
                  <ul className="ode-text-sm ode-text-gray" style={{ listStyle: 'none', padding: 0 }}>
                    <li className="ode-mb-1"><span className="ode-font-medium" style={{ color: '#8B0000' }}>admin@example.com</span> - Администратор</li>
                    <li className="ode-mb-1"><span className="ode-font-medium" style={{ color: '#8B0000' }}>tenant@example.com</span> - Арендатор</li>
                    <li><span className="ode-font-medium" style={{ color: '#8B0000' }}>investor@example.com</span> - Инвестор</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="ode-bg-gray" style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section className="ode-hero">
        <div className="ode-container">
          <div className="ode-hero-content">
            <h1 className="ode-text-6xl ode-font-bold ode-text-white ode-mb-3">{t('welcome')}</h1>
            <p className="ode-text-2xl ode-text-white ode-mb-2">{t('hero_subtitle')}</p>
            <p className="ode-text-lg ode-text-white" style={{ opacity: 0.9, marginBottom: '48px' }}>
              {t('hero_description')}
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                to="/test-api" 
                className="ode-btn ode-btn-primary ode-btn-lg"
                style={{
                  background: 'white !important',
                  color: '#8B0000 !important',
                  fontWeight: '600',
                  padding: '16px 32px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 15px -3px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  border: 'none',
                  position: 'relative',
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 20px -3px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
              >
                {t('test_api')}
              </Link>
              <Link 
                to="/test-gamification" 
                className="ode-btn ode-btn-outline ode-btn-lg"
                style={{
                  border: '2px solid white !important',
                  color: 'white !important',
                  background: 'transparent !important',
                  fontWeight: '600',
                  padding: '16px 32px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1) !important';
                  e.currentTarget.style.boxShadow = '0 8px 15px -3px rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'transparent !important';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {t('test_gamification')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="ode-section ode-bg-white">
        <div className="ode-container">
          <div className="ode-text-center ode-mb-6">
            <h2 className="ode-text-5xl ode-font-bold ode-text-charcoal ode-mb-2">Наши достижения</h2>
            <p className="ode-text-lg ode-text-gray">Цифры, которые говорят сами за себя</p>
          </div>
          <div className="ode-grid ode-grid-4">
            <div className="ode-card ode-text-center">
              <FaUsers style={{ width: '48px', height: '48px', color: '#8B0000', margin: '0 auto 16px' }} />
              <div className="ode-text-4xl ode-font-bold ode-text-primary ode-mb-1">500+</div>
              <div className="ode-text-sm ode-text-gray">Активных пользователей</div>
            </div>
            <div className="ode-card ode-text-center">
              <FaBuilding style={{ width: '48px', height: '48px', color: '#8B0000', margin: '0 auto 16px' }} />
              <div className="ode-text-4xl ode-font-bold ode-text-primary ode-mb-1">1000+</div>
              <div className="ode-text-sm ode-text-gray">Объектов недвижимости</div>
            </div>
            <div className="ode-card ode-text-center">
              <FaHandshake style={{ width: '48px', height: '48px', color: '#8B0000', margin: '0 auto 16px' }} />
              <div className="ode-text-4xl ode-font-bold ode-text-primary ode-mb-1">50+</div>
              <div className="ode-text-sm ode-text-gray">Партнеров</div>
            </div>
            <div className="ode-card ode-text-center">
              <FaChartLine style={{ width: '48px', height: '48px', color: '#8B0000', margin: '0 auto 16px' }} />
              <div className="ode-text-4xl ode-font-bold ode-text-primary ode-mb-1">95%</div>
              <div className="ode-text-sm ode-text-gray">Довольных клиентов</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Tabs Section */}
      <section className="ode-section ode-bg-gray">
        <div className="ode-container">
          <div className="ode-card ode-card-lg">
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '32px' }}>
              <button
                className={`ode-btn ${activeTab === 'overview' ? 'ode-btn-primary' : ''}`}
                onClick={() => setActiveTab('overview')}
                style={{ background: activeTab === 'overview' ? 'var(--ode-burgundy)' : 'transparent', color: activeTab === 'overview' ? 'white' : '#6b7280' }}
              >
                Обзор
              </button>
              <button
                className={`ode-btn ${activeTab === 'features' ? 'ode-btn-primary' : ''}`}
                onClick={() => setActiveTab('features')}
                style={{ background: activeTab === 'features' ? 'var(--ode-burgundy)' : 'transparent', color: activeTab === 'features' ? 'white' : '#6b7280' }}
              >
                Функции
              </button>
              <button
                className={`ode-btn ${activeTab === 'testing' ? 'ode-btn-primary' : ''}`}
                onClick={() => setActiveTab('testing')}
                style={{ background: activeTab === 'testing' ? 'var(--ode-burgundy)' : 'transparent', color: activeTab === 'testing' ? 'white' : '#6b7280' }}
              >
                Тестирование
              </button>
            </div>
            {renderTabContent()}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;