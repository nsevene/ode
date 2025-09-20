import React from 'react'
import { Link } from 'react-router-dom'
import { FaChartLine, FaBuilding, FaShieldAlt, FaUsers, FaHandshake, FaArrowUp, FaDollarSign, FaGlobe } from 'react-icons/fa'

const InvestorOpportunitiesPage: React.FC = () => {
  return (
    <div className="ode-bg-white">
      {/* Hero Section */}
      <section className="ode-hero">
        <div className="ode-container">
          <div className="ode-text-center">
            <h1 className="ode-text-5xl ode-font-bold ode-text-white ode-mb-3">
              Возможности для инвесторов
            </h1>
            <p className="ode-text-xl ode-text-white" style={{ opacity: 0.9 }}>
              Инвестируйте в коммерческую недвижимость с максимальной прибылью и минимальными рисками
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="ode-section">
        <div className="ode-container">
          <div className="ode-text-center ode-mb-6">
            <h2 className="ode-text-4xl ode-font-bold ode-text-charcoal ode-mb-2">
              Инвестиционные возможности
            </h2>
            <p className="ode-text-xl ode-text-gray" style={{ maxWidth: '512px', margin: '0 auto' }}>
              Профессиональные инструменты для анализа и управления инвестициями в недвижимость
            </p>
          </div>

          <div className="ode-grid ode-grid-3">
            <div className="ode-card ode-text-center">
              <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <FaChartLine style={{ width: '32px', height: '32px', color: '#8B0000' }} />
              </div>
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Аналитика рынка</h3>
              <p className="ode-text-gray">
                Глубокий анализ рынка недвижимости, трендов и прогнозов 
                для принятия обоснованных решений
              </p>
            </div>

            <div className="ode-card ode-text-center">
              <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <FaBuilding style={{ width: '32px', height: '32px', color: '#8B0000' }} />
              </div>
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Портфель объектов</h3>
              <p className="ode-text-gray">
                Доступ к эксклюзивным инвестиционным объектам 
                с высокой доходностью и низкими рисками
              </p>
            </div>

            <div className="ode-card ode-text-center">
              <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <FaShieldAlt style={{ width: '32px', height: '32px', color: '#8B0000' }} />
              </div>
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Управление рисками</h3>
              <p className="ode-text-gray">
                Комплексная оценка рисков и инструменты 
                для их минимизации
              </p>
            </div>

            <div className="ode-card ode-text-center">
              <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <FaUsers style={{ width: '32px', height: '32px', color: '#8B0000' }} />
              </div>
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Экспертная поддержка</h3>
              <p className="ode-text-gray">
                Команда профессионалов поможет в выборе 
                и управлении инвестициями
              </p>
            </div>

            <div className="ode-card ode-text-center">
              <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <FaArrowUp style={{ width: '32px', height: '32px', color: '#8B0000' }} />
              </div>
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Мониторинг доходности</h3>
              <p className="ode-text-gray">
                Отслеживание доходности портфеля в реальном времени 
                с детальной отчетностью
              </p>
            </div>

            <div className="ode-card ode-text-center">
              <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <FaHandshake style={{ width: '32px', height: '32px', color: '#8B0000' }} />
              </div>
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">Синдикаты</h3>
              <p className="ode-text-gray">
                Возможность участия в инвестиционных синдикатах 
                для крупных проектов
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Types Section */}
      <section className="ode-section ode-bg-gray">
        <div className="ode-container">
          <div className="ode-text-center ode-mb-6">
            <h2 className="ode-text-4xl ode-font-bold ode-text-charcoal ode-mb-2">
              Типы инвестиций
            </h2>
            <p className="ode-text-xl ode-text-gray" style={{ maxWidth: '512px', margin: '0 auto' }}>
              Разнообразные возможности для инвестирования в недвижимость
            </p>
          </div>

          <div className="ode-grid ode-grid-3">
            <div className="ode-card">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: '#fef2f2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px' }}>
                  <FaBuilding style={{ width: '24px', height: '24px', color: '#8B0000' }} />
                </div>
                <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal">Прямые инвестиции</h3>
              </div>
              <p className="ode-text-gray ode-mb-3">
                Покупка коммерческой недвижимости для получения арендного дохода
              </p>
              <ul className="ode-text-sm ode-text-gray" style={{ listStyle: 'disc', paddingLeft: '20px' }}>
                <li>Офисные здания</li>
                <li>Торговые центры</li>
                <li>Складские комплексы</li>
                <li>Производственные помещения</li>
              </ul>
            </div>

            <div className="ode-card">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: '#fef2f2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px' }}>
                  <FaDollarSign style={{ width: '24px', height: '24px', color: '#8B0000' }} />
                </div>
                <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal">REIT</h3>
              </div>
              <p className="ode-text-gray ode-mb-3">
                Инвестиции в фонды недвижимости для диверсификации портфеля
              </p>
              <ul className="ode-text-sm ode-text-gray" style={{ listStyle: 'disc', paddingLeft: '20px' }}>
                <li>Публичные REIT</li>
                <li>Частные фонды</li>
                <li>Краудфандинг</li>
                <li>Синдикаты</li>
              </ul>
            </div>

            <div className="ode-card">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: '#fef2f2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px' }}>
                  <FaGlobe style={{ width: '24px', height: '24px', color: '#8B0000' }} />
                </div>
                <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal">Международные</h3>
              </div>
              <p className="ode-text-gray ode-mb-3">
                Глобальные инвестиционные возможности в недвижимость
              </p>
              <ul className="ode-text-sm ode-text-gray" style={{ listStyle: 'disc', paddingLeft: '20px' }}>
                <li>Европейские рынки</li>
                <li>Азиатские проекты</li>
                <li>Американская недвижимость</li>
                <li>Экзотические рынки</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Section */}
      <section className="ode-section">
        <div className="ode-container">
          <div className="ode-grid ode-grid-2">
            <div>
              <h2 className="ode-text-4xl ode-font-bold ode-text-charcoal ode-mb-4">
                Результаты наших инвесторов
              </h2>
              <p className="ode-text-lg ode-text-gray ode-mb-6">
                За последние 5 лет наши клиенты показали выдающиеся результаты 
                в инвестициях в коммерческую недвижимость
              </p>
              <div className="ode-grid" style={{ gap: '24px' }}>
                <div>
                  <div className="ode-text-3xl ode-font-bold ode-text-primary ode-mb-1">12.5%</div>
                  <div className="ode-text-sm ode-text-gray">Средняя годовая доходность</div>
                </div>
                <div>
                  <div className="ode-text-3xl ode-font-bold ode-text-primary ode-mb-1">85%</div>
                  <div className="ode-text-sm ode-text-gray">Инвесторов превысили рынок</div>
                </div>
                <div>
                  <div className="ode-text-3xl ode-font-bold ode-text-primary ode-mb-1">€2.5B</div>
                  <div className="ode-text-sm ode-text-gray">Объем управляемых активов</div>
                </div>
              </div>
            </div>
            <div className="ode-card">
              <h3 className="ode-text-2xl ode-font-semibold ode-text-charcoal ode-mb-4">Почему выбирают нас</h3>
              <div className="ode-grid" style={{ gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', background: '#8B0000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                    ✓
                  </div>
                  <span className="ode-text-gray">Проверенная команда экспертов</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', background: '#8B0000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                    ✓
                  </div>
                  <span className="ode-text-gray">Прозрачная отчетность</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', background: '#8B0000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                    ✓
                  </div>
                  <span className="ode-text-gray">Диверсификация рисков</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', background: '#8B0000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                    ✓
                  </div>
                  <span className="ode-text-gray">Персональный подход</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', background: '#8B0000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                    ✓
                  </div>
                  <span className="ode-text-gray">Глобальные возможности</span>
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
              Начните инвестировать уже сегодня
            </h2>
            <p className="ode-text-xl ode-text-white ode-mb-6" style={{ opacity: 0.9 }}>
              Присоединяйтесь к успешным инвесторам и получайте стабильный доход
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/investor-contact" className="ode-btn" style={{ background: 'white', color: '#8B0000' }}>
                Запросить консультацию
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

export default InvestorOpportunitiesPage