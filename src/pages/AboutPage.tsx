import React from 'react'
import { FaRocket, FaShieldAlt, FaUsers, FaLightbulb, FaAward, FaHandshake } from 'react-icons/fa'

const AboutPage: React.FC = () => {
  return (
    <div className="ode-bg-white">
      {/* Hero Section */}
      <section className="ode-hero">
        <div className="ode-container">
          <div className="ode-text-center">
            <h1 className="ode-text-5xl ode-font-bold ode-text-white ode-mb-3">
              О портале ODPortal
            </h1>
            <p className="ode-text-xl ode-text-white" style={{ opacity: 0.9 }}>
              Инновационная B2B-платформа для управления коммерческой недвижимостью
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="ode-section">
        <div className="ode-container">
          <div className="ode-grid ode-grid-2">
            <div>
              <h2 className="ode-text-4xl ode-font-bold ode-text-charcoal ode-mb-4">
                Наша миссия
              </h2>
              <p className="ode-text-lg ode-text-gray ode-mb-4">
                Мы создаем единую экосистему для всех участников рынка коммерческой недвижимости, 
                обеспечивая прозрачность, эффективность и рост для каждого участника.
              </p>
              <p className="ode-text-lg ode-text-gray ode-mb-6">
                Наша платформа объединяет арендаторов, инвесторов и управляющих компаний, 
                предоставляя инструменты для успешного ведения бизнеса в сфере недвижимости.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <button className="ode-btn ode-btn-primary">Узнать больше</button>
                <button className="ode-btn ode-btn-secondary">Связаться с нами</button>
              </div>
            </div>
            <div className="ode-card">
              <div className="ode-grid" style={{ gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: '#fef2f2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FaRocket style={{ width: '24px', height: '24px', color: '#8B0000' }} />
                  </div>
                  <div>
                    <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Инновации</h3>
                    <p className="ode-text-gray">Используем передовые технологии для решения задач недвижимости</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: '#fef2f2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FaShieldAlt style={{ width: '24px', height: '24px', color: '#8B0000' }} />
                  </div>
                  <div>
                    <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Надежность</h3>
                    <p className="ode-text-gray">Обеспечиваем безопасность и стабильность работы платформы</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: '#fef2f2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FaUsers style={{ width: '24px', height: '24px', color: '#8B0000' }} />
                  </div>
                  <div>
                    <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Сообщество</h3>
                    <p className="ode-text-gray">Объединяем профессионалов отрасли в едином пространстве</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="ode-section ode-bg-gray">
        <div className="ode-container">
          <div className="ode-text-center ode-mb-6">
            <h2 className="ode-text-4xl ode-font-bold ode-text-charcoal ode-mb-2">
              Наши ценности
            </h2>
            <p className="ode-text-xl ode-text-gray" style={{ maxWidth: '512px', margin: '0 auto' }}>
              Принципы, которыми мы руководствуемся в работе
            </p>
          </div>

          <div className="ode-grid ode-grid-4">
            <div className="ode-text-center">
              <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <FaShieldAlt style={{ width: '32px', height: '32px', color: '#8B0000' }} />
              </div>
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Прозрачность</h3>
              <p className="ode-text-gray">Открытость во всех процессах и решениях</p>
            </div>

            <div className="ode-text-center">
              <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <FaLightbulb style={{ width: '32px', height: '32px', color: '#8B0000' }} />
              </div>
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Инновации</h3>
              <p className="ode-text-gray">Постоянное развитие и внедрение новых технологий</p>
            </div>

            <div className="ode-text-center">
              <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <FaAward style={{ width: '32px', height: '32px', color: '#8B0000' }} />
              </div>
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Качество</h3>
              <p className="ode-text-gray">Высокие стандарты во всех аспектах работы</p>
            </div>

            <div className="ode-text-center">
              <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <FaHandshake style={{ width: '32px', height: '32px', color: '#8B0000' }} />
              </div>
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Партнерство</h3>
              <p className="ode-text-gray">Взаимовыгодное сотрудничество с клиентами</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="ode-section">
        <div className="ode-container">
          <div className="ode-text-center ode-mb-6">
            <h2 className="ode-text-4xl ode-font-bold ode-text-charcoal ode-mb-2">
              Наша команда
            </h2>
            <p className="ode-text-xl ode-text-gray" style={{ maxWidth: '512px', margin: '0 auto' }}>
              Профессионалы с многолетним опытом в сфере недвижимости и технологий
            </p>
          </div>

          <div className="ode-grid ode-grid-3">
            <div className="ode-text-center">
              <div style={{ width: '128px', height: '128px', background: '#e5e7eb', borderRadius: '50%', margin: '0 auto 24px' }}></div>
              <h3 className="ode-text-2xl ode-font-semibold ode-text-charcoal ode-mb-2">Александр Иванов</h3>
              <p className="ode-text-primary ode-mb-2">CEO & Основатель</p>
              <p className="ode-text-gray">
                15+ лет опыта в сфере коммерческой недвижимости. 
                Эксперт по управлению портфелем недвижимости.
              </p>
            </div>

            <div className="ode-text-center">
              <div style={{ width: '128px', height: '128px', background: '#e5e7eb', borderRadius: '50%', margin: '0 auto 24px' }}></div>
              <h3 className="ode-text-2xl ode-font-semibold ode-text-charcoal ode-mb-2">Мария Петрова</h3>
              <p className="ode-text-primary ode-mb-2">CTO</p>
              <p className="ode-text-gray">
                Технический директор с опытом разработки B2B-платформ. 
                Специалист по масштабированию IT-решений.
              </p>
            </div>

            <div className="ode-text-center">
              <div style={{ width: '128px', height: '128px', background: '#e5e7eb', borderRadius: '50%', margin: '0 auto 24px' }}></div>
              <h3 className="ode-text-2xl ode-font-semibold ode-text-charcoal ode-mb-2">Дмитрий Сидоров</h3>
              <p className="ode-text-primary ode-mb-2">Head of Sales</p>
              <p className="ode-text-gray">
                Руководитель отдела продаж с глубоким пониманием 
                потребностей клиентов в сфере недвижимости.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="ode-section ode-bg-primary">
        <div className="ode-container" style={{ maxWidth: '768px' }}>
          <div className="ode-text-center">
            <h2 className="ode-text-4xl ode-font-bold ode-text-white ode-mb-3">
              Готовы присоединиться к нам?
            </h2>
            <p className="ode-text-xl ode-text-white ode-mb-6" style={{ opacity: 0.9 }}>
              Станьте частью инновационной экосистемы управления недвижимостью
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="ode-btn" style={{ background: 'white', color: '#8B0000' }}>
                Подать заявку
              </button>
              <button className="ode-btn ode-btn-outline" style={{ borderColor: 'white', color: 'white' }}>
                Связаться с нами
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage