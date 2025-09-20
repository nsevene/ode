import React, { useState } from 'react'

interface CompassChallenge {
  id: string
  title: string
  description: string
  points_reward: number
  is_active: boolean
  start_date: string
  end_date: string
  requirements: {
    type: 'visit_count' | 'spend_amount' | 'event_attendance'
    target: number
  }
  participants_count: number
  completion_rate: number
}

const CompassManager: React.FC = () => {
  const [challenges, setChallenges] = useState<CompassChallenge[]>([
    {
      id: '1',
      title: 'Новичок в районе',
      description: 'Посетите 5 разных заведений в районе',
      points_reward: 50,
      is_active: true,
      start_date: '2024-12-01',
      end_date: '2024-12-31',
      requirements: {
        type: 'visit_count',
        target: 5
      },
      participants_count: 23,
      completion_rate: 65
    },
    {
      id: '2',
      title: 'Гурман',
      description: 'Потратьте 10,000 рублей в ресторанах',
      points_reward: 100,
      is_active: true,
      start_date: '2024-12-01',
      end_date: '2024-12-31',
      requirements: {
        type: 'spend_amount',
        target: 10000
      },
      participants_count: 15,
      completion_rate: 40
    },
    {
      id: '3',
      title: 'Событийный эксперт',
      description: 'Посетите 3 мероприятия',
      points_reward: 75,
      is_active: false,
      start_date: '2024-11-01',
      end_date: '2024-11-30',
      requirements: {
        type: 'event_attendance',
        target: 3
      },
      participants_count: 8,
      completion_rate: 87
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<CompassChallenge | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

  const filteredChallenges = challenges.filter(challenge => {
    if (filter === 'active') return challenge.is_active
    if (filter === 'inactive') return !challenge.is_active
    return true
  })

  const handleToggleActive = (id: string) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === id ? { ...challenge, is_active: !challenge.is_active } : challenge
      )
    )
  }

  const handleDelete = (id: string) => {
    setChallenges(prev => prev.filter(challenge => challenge.id !== id))
  }

  const getRequirementLabel = (type: string) => {
    switch (type) {
      case 'visit_count': return 'Количество посещений'
      case 'spend_amount': return 'Сумма трат'
      case 'event_attendance': return 'Посещение событий'
      default: return type
    }
  }

  const getRequirementIcon = (type: string) => {
    switch (type) {
      case 'visit_count':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      case 'spend_amount':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        )
      case 'event_attendance':
        return (
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Compass Challenges</h2>
          <p className="text-gray-600">Управление челленджами и заданиями</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          Создать челлендж
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">{challenges.length}</div>
          <div className="text-sm text-gray-600">Всего челленджей</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{challenges.filter(c => c.is_active).length}</div>
          <div className="text-sm text-gray-600">Активных</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(challenges.reduce((acc, c) => acc + c.completion_rate, 0) / challenges.length)}%
          </div>
          <div className="text-sm text-gray-600">Средняя завершенность</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">
            {challenges.reduce((acc, c) => acc + c.participants_count, 0)}
          </div>
          <div className="text-sm text-gray-600">Участников</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">Все челленджи</option>
          <option value="active">Активные</option>
          <option value="inactive">Неактивные</option>
        </select>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((challenge) => (
          <div key={challenge.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
                <p className="text-sm text-gray-600">{challenge.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingChallenge(challenge)}
                  className="text-primary-600 hover:text-primary-900"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(challenge.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.996-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                {getRequirementIcon(challenge.requirements.type)}
                <span className="text-sm text-gray-600">
                  {getRequirementLabel(challenge.requirements.type)}: {challenge.requirements.target}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Награда:</span>
                <span className="font-semibold text-primary-600">{challenge.points_reward} баллов</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Участников:</span>
                <span className="font-semibold text-gray-900">{challenge.participants_count}</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Завершенность</span>
                  <span className="font-semibold">{challenge.completion_rate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${challenge.completion_rate}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Период:</span>
                <span className="text-sm text-gray-900">
                  {new Date(challenge.start_date).toLocaleDateString('ru-RU')} - {new Date(challenge.end_date).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <button
                onClick={() => handleToggleActive(challenge.id)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  challenge.is_active
                    ? 'bg-red-100 text-red-800 hover:bg-red-200'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                {challenge.is_active ? 'Деактивировать' : 'Активировать'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingChallenge) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingChallenge ? 'Редактировать челлендж' : 'Создать челлендж'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingChallenge(null)
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Название</label>
                <input
                  type="text"
                  defaultValue={editingChallenge?.title || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Название челленджа"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                <textarea
                  defaultValue={editingChallenge?.description || ''}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Описание челленджа"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Тип задания</label>
                  <select
                    defaultValue={editingChallenge?.requirements.type || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="visit_count">Количество посещений</option>
                    <option value="spend_amount">Сумма трат</option>
                    <option value="event_attendance">Посещение событий</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Целевое значение</label>
                  <input
                    type="number"
                    defaultValue={editingChallenge?.requirements.target || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="5"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Награда (баллы)</label>
                <input
                  type="number"
                  defaultValue={editingChallenge?.points_reward || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="100"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Дата начала</label>
                  <input
                    type="date"
                    defaultValue={editingChallenge?.start_date || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Дата окончания</label>
                  <input
                    type="date"
                    defaultValue={editingChallenge?.end_date || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  defaultChecked={editingChallenge?.is_active || false}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                  Активный челлендж
                </label>
              </div>
            </form>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingChallenge(null)
                }}
                className="btn-secondary"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingChallenge(null)
                }}
                className="btn-primary"
              >
                {editingChallenge ? 'Сохранить' : 'Создать'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CompassManager
