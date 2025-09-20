import React, { useState } from 'react'
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaHome, FaChartLine, FaBuilding, FaUsers, FaCog, FaArrowRight, FaArrowLeft } from 'react-icons/fa'

const DemoPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const demoSteps = [
    {
      title: "Главная панель",
      description: "Обзор ключевых метрик и быстрый доступ к основным функциям",
      content: (
        <div className="ode-card">
          <div className="ode-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            <div className="ode-card" style={{ background: '#fef2f2', padding: '16px' }}>
              <div className="ode-text-2xl ode-font-bold ode-text-primary ode-mb-2">₽2.5М</div>
              <div className="ode-text-sm ode-text-gray">Общий доход</div>
            </div>
            <div className="ode-card" style={{ background: '#f0fdf4', padding: '16px' }}>
              <div className="ode-text-2xl ode-font-bold ode-text-success ode-mb-2">95%</div>
              <div className="ode-text-sm ode-text-gray">Заполняемость</div>
            </div>
            <div className="ode-card" style={{ background: '#dbeafe', padding: '16px' }}>
              <div className="ode-text-2xl ode-font-bold ode-text-accent ode-mb-2">12</div>
              <div className="ode-text-sm ode-text-gray">Активных объектов</div>
            </div>
          </div>
          <div className="ode-space-y-3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
              <span className="ode-font-medium">Новые заявки</span>
              <span className="badge" style={{ background: '#fef2f2', color: '#8B0000', padding: '4px 8px', borderRadius: '4px' }}>3</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
              <span className="ode-font-medium">Требуют внимания</span>
              <span className="badge" style={{ background: '#fef3c7', color: '#f59e0b', padding: '4px 8px', borderRadius: '4px' }}>2</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
              <span className="ode-font-medium">Завершенные сделки</span>
              <span className="badge" style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 8px', borderRadius: '4px' }}>5</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Управление объектами",
      description: "Полный контроль над портфелем недвижимости",
      content: (
        <div className="ode-card">
          <div className="ode-mb-6">
            <h3 className="ode-text-lg ode-font-semibold ode-mb-4">Мои объекты</h3>
            <div className="ode-space-y-3">
              <div className="ode-card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 className="ode-text-md ode-font-semibold ode-text-charcoal">Бизнес-центр "Солнечный"</h4>
                  <span className="badge" style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 8px', borderRadius: '4px' }}>Активен</span>
                </div>
                <p className="ode-text-sm ode-text-gray ode-mb-2">Москва, ул. Тверская, 15</p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span className="ode-text-sm ode-text-gray">Площадь: 2,500 м²</span>
                  <span className="ode-text-sm ode-text-gray">Доход: ₽150,000/мес</span>
                </div>
              </div>
              <div className="ode-card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 className="ode-text-md ode-font-semibold ode-text-charcoal">Торговый центр "Мега"</h4>
                  <span className="badge" style={{ background: '#fef3c7', color: '#f59e0b', padding: '4px 8px', borderRadius: '4px' }}>На ремонте</span>
                </div>
                <p className="ode-text-sm ode-text-gray ode-mb-2">Москва, ул. Арбат, 25</p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span className="ode-text-sm ode-text-gray">Площадь: 5,000 м²</span>
                  <span className="ode-text-sm ode-text-gray">Доход: ₽0/мес</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Управление пользователями",
      description: "Контроль доступа и управление ролями",
      content: (
        <div className="ode-card">
          <h3 className="ode-text-lg ode-font-semibold ode-mb-4">Пользователи системы</h3>
          <div className="ode-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div className="ode-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 className="ode-text-md ode-font-semibold ode-text-charcoal">Александр Иванов</h4>
                <span className="badge" style={{ background: '#fef2f2', color: '#dc2626', padding: '4px 8px', borderRadius: '4px' }}>Админ</span>
              </div>
              <p className="ode-text-sm ode-text-gray ode-mb-2">admin@odportal.com</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="ode-btn ode-btn-sm" style={{ background: '#f9fafb', color: '#374151' }}>Редактировать</button>
                <button className="ode-btn ode-btn-sm" style={{ background: '#fef2f2', color: '#dc2626' }}>Заблокировать</button>
              </div>
            </div>
            <div className="ode-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 className="ode-text-md ode-font-semibold ode-text-charcoal">Мария Петрова</h4>
                <span className="badge" style={{ background: '#fef3c7', color: '#f59e0b', padding: '4px 8px', borderRadius: '4px' }}>Арендатор</span>
              </div>
              <p className="ode-text-sm ode-text-gray ode-mb-2">petrova@example.com</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="ode-btn ode-btn-sm" style={{ background: '#f9fafb', color: '#374151' }}>Редактировать</button>
                <button className="ode-btn ode-btn-sm" style={{ background: '#fef2f2', color: '#dc2626' }}>Заблокировать</button>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Аналитика и отчеты",
      description: "Детальная аналитика по всем аспектам бизнеса",
      content: (
        <div className="ode-card">
          <h3 className="ode-text-lg ode-font-semibold ode-mb-4">Ключевые показатели</h3>
          <div className="ode-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div className="ode-card ode-text-center" style={{ padding: '16px' }}>
              <div className="ode-text-2xl ode-font-bold ode-text-primary">₽2.5М</div>
              <div className="ode-text-sm ode-text-gray">Общий доход</div>
            </div>
            <div className="ode-card ode-text-center" style={{ padding: '16px' }}>
              <div className="ode-text-2xl ode-font-bold ode-text-success">95%</div>
              <div className="ode-text-sm ode-text-gray">Заполняемость</div>
            </div>
            <div className="ode-card ode-text-center" style={{ padding: '16px' }}>
              <div className="ode-text-2xl ode-font-bold ode-text-accent">12</div>
              <div className="ode-text-sm ode-text-gray">Активных объектов</div>
            </div>
            <div className="ode-card ode-text-center" style={{ padding: '16px' }}>
              <div className="ode-text-2xl ode-font-bold" style={{ color: '#8B5CF6' }}>156</div>
              <div className="ode-text-sm ode-text-gray">Арендаторов</div>
            </div>
          </div>
          <div className="ode-card" style={{ padding: '16px' }}>
            <h4 className="ode-text-md ode-font-semibold ode-text-charcoal ode-mb-2">Тренды доходности</h4>
            <div style={{ height: '200px', background: '#f9fafb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="ode-text-gray">График доходности</span>
            </div>
          </div>
        </div>
      )
    }
  ]

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= demoSteps.length - 1) {
            clearInterval(interval)
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 3000)
    }
  }

  return (
    <div className="ode-bg-gray" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div className="ode-bg-white" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div className="ode-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0' }}>
            <div>
              <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal">Интерактивное демо</h1>
              <p className="ode-text-gray">Пошаговое знакомство с возможностями платформы</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => window.location.href = '/'}
                className="ode-btn ode-btn-secondary"
              >
                <FaHome style={{ marginRight: '8px' }} />
                На главную
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="ode-container" style={{ padding: '32px 0' }}>
        {/* Progress */}
        <div className="ode-mb-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="ode-text-sm ode-text-gray">
              Шаг {currentStep + 1} из {demoSteps.length}
            </span>
            <span className="ode-text-sm ode-text-gray">
              {Math.round(((currentStep + 1) / demoSteps.length) * 100)}%
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${((currentStep + 1) / demoSteps.length) * 100}%`, 
                height: '100%', 
                background: '#8B0000',
                transition: 'width 0.3s ease'
              }}
            ></div>
          </div>
        </div>

        {/* Demo Content */}
        <div className="ode-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal">{demoSteps[currentStep].title}</h2>
              <p className="ode-text-gray">{demoSteps[currentStep].description}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={togglePlay}
                className="ode-btn ode-btn-secondary"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
            </div>
          </div>

          {demoSteps[currentStep].content}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="ode-btn ode-btn-secondary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              opacity: currentStep === 0 ? 0.5 : 1,
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <FaStepBackward />
            Предыдущий
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            {demoSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`ode-btn ode-btn-sm ${currentStep === index ? 'ode-btn-primary' : ''}`}
                style={{ 
                  background: currentStep === index ? undefined : '#f9fafb', 
                  color: currentStep === index ? undefined : '#374151' 
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={nextStep}
            disabled={currentStep === demoSteps.length - 1}
            className="ode-btn ode-btn-primary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              opacity: currentStep === demoSteps.length - 1 ? 0.5 : 1,
              cursor: currentStep === demoSteps.length - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Следующий
            <FaStepForward />
          </button>
        </div>
      </div>
    </div>
  )
}

export default DemoPage