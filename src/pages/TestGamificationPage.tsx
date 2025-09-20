import React, { useState } from 'react'
import { FaGamepad, FaUtensils, FaCompass, FaIdCard, FaMedal, FaStar, FaCheck, FaLock, FaHome, FaGift, FaBullseye, FaCrown } from 'react-icons/fa'

const TestGamificationPage: React.FC = () => {
  const [userPoints, setUserPoints] = useState(1250)
  const [userLevel, setUserLevel] = useState('Знаток')
  const [activeTab, setActiveTab] = useState<'taste-alley' | 'compass' | 'passport'>('taste-alley')

  // Mock data for testing
  const tasteAlleyItems = [
    {
      id: '1',
      name: 'Эксклюзивный десерт',
      description: 'Специальный десерт от шеф-повара',
      category: 'Десерты',
      points_required: 100,
      is_unlocked: true
    },
    {
      id: '2',
      name: 'VIP-столик',
      description: 'Столик в VIP-зоне с персональным обслуживанием',
      category: 'Услуги',
      points_required: 250,
      is_unlocked: true
    },
    {
      id: '3',
      name: 'Мастер-класс по кулинарии',
      description: 'Участие в мастер-классе от шеф-повара',
      category: 'Обучение',
      points_required: 500,
      is_unlocked: false
    }
  ]

  const compassChallenges = [
    {
      id: '1',
      title: 'Новичок в районе',
      description: 'Посетите 5 разных заведений в районе',
      points_reward: 50,
      is_completed: false,
      progress: 3,
      target: 5
    },
    {
      id: '2',
      title: 'Гурман',
      description: 'Потратьте 10,000 рублей в ресторанах',
      points_reward: 100,
      is_completed: false,
      progress: 7500,
      target: 10000
    },
    {
      id: '3',
      title: 'Постоянный клиент',
      description: 'Посетите одно заведение 10 раз',
      points_reward: 75,
      is_completed: true,
      progress: 10,
      target: 10
    }
  ]

  const passportLevels = [
    {
      id: '1',
      name: 'Новичок',
      points_required: 0,
      benefits: ['Базовые скидки 5%'],
      is_current: false
    },
    {
      id: '2',
      name: 'Знаток',
      points_required: 1000,
      benefits: ['Скидки 10%', 'Приоритетное бронирование'],
      is_current: true
    },
    {
      id: '3',
      name: 'Эксперт',
      points_required: 2500,
      benefits: ['Скидки 15%', 'Эксклюзивные предложения', 'Персональный менеджер'],
      is_current: false
    },
    {
      id: '4',
      name: 'Мастер',
      points_required: 5000,
      benefits: ['Скидки 20%', 'VIP-услуги', 'Бесплатные дегустации'],
      is_current: false
    }
  ]

  const tabs = [
    { id: 'taste-alley', name: 'Taste Alley', icon: FaUtensils },
    { id: 'compass', name: 'Compass', icon: FaCompass },
    { id: 'passport', name: 'Passport', icon: FaIdCard }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'taste-alley':
        return (
          <div className="ode-space-y-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal">Taste Alley - Эксклюзивные предложения</h2>
              <div className="ode-text-sm ode-text-gray">
                Ваши баллы: <span className="ode-font-semibold ode-text-primary">{userPoints}</span>
              </div>
            </div>

            <div className="ode-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {tasteAlleyItems.map((item) => (
                <div key={item.id} className="ode-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal">{item.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaStar style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
                      <span className="ode-text-sm ode-font-semibold ode-text-primary">{item.points_required}</span>
                    </div>
                  </div>
                  <p className="ode-text-sm ode-text-gray ode-mb-2">{item.description}</p>
                  <div className="ode-text-xs ode-text-gray ode-mb-4">
                    <span className="badge" style={{ background: '#f3f4f6', color: '#374151', padding: '2px 8px', borderRadius: '4px' }}>
                      {item.category}
                    </span>
                  </div>
                  <button
                    className={`ode-btn ${item.is_unlocked ? 'ode-btn-primary' : ''}`}
                    style={{ 
                      width: '100%',
                      background: item.is_unlocked ? undefined : '#f3f4f6',
                      color: item.is_unlocked ? undefined : '#6b7280',
                      cursor: item.is_unlocked ? 'pointer' : 'not-allowed'
                    }}
                    disabled={!item.is_unlocked}
                  >
                    {item.is_unlocked ? (
                      <>
                        <FaGift style={{ marginRight: '8px' }} />
                        Получить
                      </>
                    ) : (
                      <>
                        <FaLock style={{ marginRight: '8px' }} />
                        Заблокировано
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )

      case 'compass':
        return (
          <div className="ode-space-y-6">
            <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal">Compass - Челленджи и задания</h2>

            <div className="ode-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px' }}>
              {compassChallenges.map((challenge) => (
                <div key={challenge.id} className="ode-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal">{challenge.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaMedal style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
                      <span className="ode-text-sm ode-font-semibold ode-text-primary">{challenge.points_reward}</span>
                    </div>
                  </div>
                  <p className="ode-text-sm ode-text-gray ode-mb-4">{challenge.description}</p>
                  
                  <div className="ode-mb-4">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="ode-text-sm ode-text-gray">Прогресс</span>
                      <span className="ode-text-sm ode-font-medium ode-text-charcoal">
                        {challenge.progress} / {challenge.target}
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${(challenge.progress / challenge.target) * 100}%`, 
                          height: '100%', 
                          background: challenge.is_completed ? '#16a34a' : '#8B0000',
                          transition: 'width 0.3s ease'
                        }}
                      ></div>
                    </div>
                  </div>

                  <button
                    className={`ode-btn ${challenge.is_completed ? 'ode-btn-secondary' : 'ode-btn-primary'}`}
                    style={{ width: '100%' }}
                    disabled={challenge.is_completed}
                  >
                    {challenge.is_completed ? (
                      <>
                        <FaCheck style={{ marginRight: '8px' }} />
                        Выполнено
                      </>
                    ) : (
                      <>
                        <FaBullseye style={{ marginRight: '8px' }} />
                        Выполнить
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )

      case 'passport':
        return (
          <div className="ode-space-y-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal">Passport - Уровни лояльности</h2>
              <div className="ode-text-sm ode-text-gray">
                Текущий уровень: <span className="ode-font-semibold ode-text-primary">{userLevel}</span>
              </div>
            </div>

            <div className="ode-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {passportLevels.map((level, index) => (
                <div key={level.id} className={`ode-card ${level.is_current ? 'ode-card-interactive' : ''}`} style={{ 
                  border: level.is_current ? '2px solid #8B0000' : undefined,
                  background: level.is_current ? '#fef2f2' : undefined
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal">{level.name}</h3>
                    {level.is_current && (
                      <FaCrown style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
                    )}
                  </div>
                  
                  <div className="ode-text-sm ode-text-gray ode-mb-4">
                    Требуется баллов: <span className="ode-font-semibold">{level.points_required}</span>
                  </div>

                  <div className="ode-mb-4">
                    <h4 className="ode-text-sm ode-font-semibold ode-text-charcoal ode-mb-2">Преимущества:</h4>
                    <ul className="ode-list-disc ode-list-inside ode-space-y-1">
                      {level.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="ode-text-sm ode-text-gray">{benefit}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="ode-text-xs ode-text-gray">
                      {index + 1} из {passportLevels.length}
                    </span>
                    {level.is_current && (
                      <span className="badge" style={{ background: '#8B0000', color: 'white', padding: '4px 8px', borderRadius: '4px' }}>
                        Текущий уровень
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="ode-bg-gray" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div className="ode-bg-white" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div className="ode-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0' }}>
            <div>
              <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal">Тестирование Геймификации</h1>
              <p className="ode-text-gray">Проверка системы лояльности и вовлечения пользователей</p>
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
        {/* Tabs */}
        <div className="tab-list">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
              >
                <tab.icon style={{ width: '16px', height: '16px' }} />
                {tab.name}
              </button>
            ))}
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  )
}

export default TestGamificationPage