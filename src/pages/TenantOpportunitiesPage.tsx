import React from 'react'
import { Link } from 'react-router-dom'
import { FaSearch, FaBuilding, FaChartLine, FaShieldAlt, FaUsers, FaHandshake, FaClock, FaCheckCircle } from 'react-icons/fa'

const TenantOpportunitiesPage: React.FC = () => {
  return (
    <div className="ode-bg-white">
      {/* Hero Section */}
      <section className="ode-hero">
        <div className="ode-container">
          <div className="ode-text-center">
            <h1 className="ode-text-5xl ode-font-bold ode-text-white ode-mb-3">
              Возможности для арендаторов
            </h1>
            <p className="ode-text-xl ode-text-white" style={{ opacity: 0.9 }}>
              Найдите идеальное помещение для вашего бизнеса и управляйте арендой эффективно
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="ode-section">
        <div className="ode-container">
          <div className="ode-text-center ode-mb-6">
            <h2 className="ode-text-4xl ode-font-bold ode-text-charcoal ode-mb-2">
              Что получают арендаторы
            </h2>
            <p className="ode-text-xl ode-text-gray" style={{ maxWidth: '512px', margin: '0 auto' }}>
              Комплексные решения для поиска и управления арендой коммерческих помещений
            </p>
          </div>

          <div className="ode-grid ode-grid-3">
            <div className="ode-card ode-text-center">
              <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <FaSearch style={{ width: '32px', height: '32px', color: '#8B0000' }} />
              </div>
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Умный поиск</h3>
              <p className="ode-text-gray">
                Интеллектуальная система поиска помещений с учетом ваших требований, 
                бюджета и местоположения
              </p>
            </div>

            <div className="ode-card ode-text-center">
              <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <FaBuilding style={{ width: '32px', height: '32px', color: '#8B0000' }} />
              </div>
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Широкий выбор</h3>
              <p className="ode-text-gray">
                Доступ к тысячам коммерческих помещений различных типов и размеров 
                по всей России
              </p>
            </div>

            <div className="ode-card ode-text-center">
              <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <FaChartLine style={{ width: '32px', height: '32px', color: '#8B0000' }} />
              </div>
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Аналитика</h3>
              <p className="ode-text-gray">
                Детальная аналитика рынка аренды, сравнение цен и прогнозы 
                для принятия обоснованных решений
              </p>
            </div>

            <div className="ode-card ode-text-center">
              <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <FaShieldAlt style={{ width: '32px', height: '32px', color: '#8B0000' }} />
              </div>
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Безопасность</h3>
              <p className="ode-text-gray">
                Проверенные арендодатели, прозрачные условия аренды и 
                защита ваших интересов
              </p>
            </div>

            <div className="ode-card ode-text-center">
              <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <FaUsers style={{ width: '32px', height: '32px', color: '#8B0000' }} />
              </div>
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Поддержка</h3>
              <p className="ode-text-gray">
                Персональный менеджер и круглосуточная поддержка на всех 
                этапах работы с недвижимостью
              </p>
            </div>

            <div className="ode-card ode-text-center">
              <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <FaHandshake style={{ width: '32px', height: '32px', color: '#8B0000' }} />
              </div>
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Сделки</h3>
              <p className="ode-text-gray">
                Упрощенное оформление документов и быстрые сделки 
                с минимальными формальностями
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="ode-section ode-bg-gray">
        <div className="ode-container">
          <div className="ode-text-center ode-mb-6">
            <h2 className="ode-text-4xl ode-font-bold ode-text-charcoal ode-mb-2">
              Как это работает
            </h2>
            <p className="ode-text-xl ode-text-gray" style={{ maxWidth: '512px', margin: '0 auto' }}>
              Простой процесс поиска и аренды помещений в несколько шагов
            </p>
          </div>

          <div className="ode-grid ode-grid-4">
            <div className="ode-text-center">
              <div style={{ width: '64px', height: '64px', background: '#8B0000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                1
              </div>
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Регистрация</h3>
              <p className="ode-text-gray">Создайте аккаунт и укажите ваши требования к помещению</p>
            </div>

            <div className="ode-text-center">
              <div style={{ width: '64px', height: '64px', background: '#8B0000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                2
              </div>
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Поиск</h3>
              <p className="ode-text-gray">Наша система найдет подходящие варианты для вас</p>
            </div>

            <div className="ode-text-center">
              <div style={{ width: '64px', height: '64px', background: '#8B0000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                3
              </div>
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Просмотр</h3>
              <p className="ode-text-gray">Организуем просмотры выбранных помещений</p>
            </div>

            <div className="ode-text-center">
              <div style={{ width: '64px', height: '64px', background: '#8B0000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                4
              </div>
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Сделка</h3>
              <p className="ode-text-gray">Поможем оформить аренду быстро и безопасно</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="ode-section">
        <div className="ode-container">
          <div className="ode-grid ode-grid-2">
            <div>
              <h2 className="ode-text-4xl ode-font-bold ode-text-charcoal ode-mb-4">
                Преимущества для арендаторов
              </h2>
              <div className="ode-grid" style={{ gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <FaCheckCircle style={{ width: '24px', height: '24px', color: '#8B0000', marginTop: '4px', flexShrink: 0 }} />
                  <div>
                    <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-1">Экономия времени</h3>
                    <p className="ode-text-gray">Находите подходящие помещения в разы быстрее</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <FaCheckCircle style={{ width: '24px', height: '24px', color: '#8B0000', marginTop: '4px', flexShrink: 0 }} />
                  <div>
                    <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-1">Лучшие условия</h3>
                    <p className="ode-text-gray">Доступ к эксклюзивным предложениям и скидкам</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <FaCheckCircle style={{ width: '24px', height: '24px', color: '#8B0000', marginTop: '4px', flexShrink: 0 }} />
                  <div>
                    <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-1">Прозрачность</h3>
                    <p className="ode-text-gray">Полная информация о помещении и условиях аренды</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <FaCheckCircle style={{ width: '24px', height: '24px', color: '#8B0000', marginTop: '4px', flexShrink: 0 }} />
                  <div>
                    <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-1">Поддержка</h3>
                    <p className="ode-text-gray">Помощь на всех этапах работы с недвижимостью</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="ode-card">
              <h3 className="ode-text-2xl ode-font-semibold ode-text-charcoal ode-mb-4">Статистика успеха</h3>
              <div className="ode-grid" style={{ gap: '24px' }}>
                <div className="ode-text-center">
                  <div className="ode-text-4xl ode-font-bold ode-text-primary ode-mb-1">95%</div>
                  <div className="ode-text-sm ode-text-gray">Находят подходящее помещение</div>
                </div>
                <div className="ode-text-center">
                  <div className="ode-text-4xl ode-font-bold ode-text-primary ode-mb-1">30%</div>
                  <div className="ode-text-sm ode-text-gray">Экономят на аренде</div>
                </div>
                <div className="ode-text-center">
                  <div className="ode-text-4xl ode-font-bold ode-text-primary ode-mb-1">7 дней</div>
                  <div className="ode-text-sm ode-text-gray">Средний срок поиска</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="ode-section ode-bg-primary">
        <div className="ode-container" style={{ maxWidth: '768px' }}>
          <div className="ode-text-center">
            <h2 className="ode-text-4xl ode-font-bold ode-text-white ode-mb-3">
              Готовы найти идеальное помещение?
            </h2>
            <p className="ode-text-xl ode-text-white ode-mb-6" style={{ opacity: 0.9 }}>
              Присоединяйтесь к тысячам успешных арендаторов уже сегодня
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/tenant-application" className="ode-btn" style={{ background: 'white', color: '#8B0000' }}>
                Подать заявку
              </Link>
              <Link to="/demo" className="ode-btn ode-btn-outline" style={{ borderColor: 'white', color: 'white' }}>
                Посмотреть демо
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TenantOpportunitiesPage