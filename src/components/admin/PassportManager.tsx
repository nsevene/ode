import React, { useState } from 'react'

interface PassportLevel {
  id: string
  name: string
  description: string
  points_required: number
  benefits: string[]
  is_active: boolean
  order: number
  users_count: number
}

const PassportManager: React.FC = () => {
  const [levels, setLevels] = useState<PassportLevel[]>([
    {
      id: '1',
      name: 'Новичок',
      description: 'Первый уровень в системе лояльности',
      points_required: 0,
      benefits: ['Приветственный бонус 100 баллов', 'Скидка 5% на первый заказ'],
      is_active: true,
      order: 1,
      users_count: 156
    },
    {
      id: '2',
      name: 'Знаток',
      description: 'Для активных пользователей',
      points_required: 500,
      benefits: ['Скидка 10% на все заказы', 'Приоритетная поддержка', 'Эксклюзивные предложения'],
      is_active: true,
      order: 2,
      users_count: 89
    },
    {
      id: '3',
      name: 'Эксперт',
      description: 'Для постоянных клиентов',
      points_required: 1500,
      benefits: ['Скидка 15% на все заказы', 'Персональный менеджер', 'VIP-статус', 'Доступ к закрытым событиям'],
      is_active: true,
      order: 3,
      users_count: 34
    },
    {
      id: '4',
      name: 'Мастер',
      description: 'Высший уровень лояльности',
      points_required: 5000,
      benefits: ['Скидка 20% на все заказы', 'Персональные предложения', 'Участие в разработке меню', 'Годовой абонемент'],
      is_active: true,
      order: 4,
      users_count: 12
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingLevel, setEditingLevel] = useState<PassportLevel | null>(null)
  const [newBenefit, setNewBenefit] = useState('')

  const handleToggleActive = (id: string) => {
    setLevels(prev => 
      prev.map(level => 
        level.id === id ? { ...level, is_active: !level.is_active } : level
      )
    )
  }

  const handleDelete = (id: string) => {
    setLevels(prev => prev.filter(level => level.id !== id))
  }

  const handleReorder = (id: string, direction: 'up' | 'down') => {
    setLevels(prev => {
      const sorted = [...prev].sort((a, b) => a.order - b.order)
      const index = sorted.findIndex(level => level.id === id)
      
      if (direction === 'up' && index > 0) {
        [sorted[index], sorted[index - 1]] = [sorted[index - 1], sorted[index]]
      } else if (direction === 'down' && index < sorted.length - 1) {
        [sorted[index], sorted[index + 1]] = [sorted[index + 1], sorted[index]]
      }
      
      return sorted.map((level, i) => ({ ...level, order: i + 1 }))
    })
  }

  const addBenefit = (levelId: string) => {
    if (!newBenefit.trim()) return
    
    setLevels(prev => 
      prev.map(level => 
        level.id === levelId 
          ? { ...level, benefits: [...level.benefits, newBenefit.trim()] }
          : level
      )
    )
    setNewBenefit('')
  }

  const removeBenefit = (levelId: string, benefitIndex: number) => {
    setLevels(prev => 
      prev.map(level => 
        level.id === levelId 
          ? { ...level, benefits: level.benefits.filter((_, i) => i !== benefitIndex) }
          : level
      )
    )
  }

  const sortedLevels = [...levels].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Passport Levels</h2>
          <p className="text-gray-600">Управление уровнями лояльности</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          Добавить уровень
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">{levels.length}</div>
          <div className="text-sm text-gray-600">Всего уровней</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{levels.filter(l => l.is_active).length}</div>
          <div className="text-sm text-gray-600">Активных</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">
            {levels.reduce((acc, level) => acc + level.users_count, 0)}
          </div>
          <div className="text-sm text-gray-600">Пользователей</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Math.max(...levels.map(l => l.points_required))}
          </div>
          <div className="text-sm text-gray-600">Максимум баллов</div>
        </div>
      </div>

      {/* Levels List */}
      <div className="space-y-4">
        {sortedLevels.map((level, index) => (
          <div key={level.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-primary-600">#{level.order}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{level.name}</h3>
                      <p className="text-sm text-gray-600">{level.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Требуется:</span>
                    <span className="font-semibold text-primary-600">{level.points_required} баллов</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Пользователей:</span>
                    <span className="font-semibold text-gray-900">{level.users_count}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Преимущества:</h4>
                  <div className="space-y-2">
                    {level.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-gray-900">{benefit}</span>
                        </div>
                        <button
                          onClick={() => removeBenefit(level.id, benefitIndex)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newBenefit}
                        onChange={(e) => setNewBenefit(e.target.value)}
                        placeholder="Добавить преимущество"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        onKeyPress={(e) => e.key === 'Enter' && addBenefit(level.id)}
                      />
                      <button
                        onClick={() => addBenefit(level.id)}
                        className="btn-primary px-3 py-2"
                      >
                        Добавить
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 ml-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleReorder(level.id, 'up')}
                    disabled={index === 0}
                    className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleReorder(level.id, 'down')}
                    disabled={index === sortedLevels.length - 1}
                    className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                
                <button
                  onClick={() => setEditingLevel(level)}
                  className="p-2 text-primary-600 hover:text-primary-900"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                
                <button
                  onClick={() => handleToggleActive(level.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    level.is_active
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {level.is_active ? 'Активен' : 'Неактивен'}
                </button>
                
                <button
                  onClick={() => handleDelete(level.id)}
                  className="p-2 text-red-600 hover:text-red-900"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.996-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingLevel) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingLevel ? 'Редактировать уровень' : 'Добавить уровень'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingLevel(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Название уровня</label>
                <input
                  type="text"
                  defaultValue={editingLevel?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Название уровня"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                <textarea
                  defaultValue={editingLevel?.description || ''}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Описание уровня"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Требуемые баллы</label>
                <input
                  type="number"
                  defaultValue={editingLevel?.points_required || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="1000"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  defaultChecked={editingLevel?.is_active || false}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                  Активный уровень
                </label>
              </div>
            </form>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingLevel(null)
                }}
                className="btn-secondary"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingLevel(null)
                }}
                className="btn-primary"
              >
                {editingLevel ? 'Сохранить' : 'Добавить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PassportManager
