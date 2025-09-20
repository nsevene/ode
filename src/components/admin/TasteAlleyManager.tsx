import React, { useState } from 'react'

interface TasteAlleyItem {
  id: string
  name: string
  description: string
  category: string
  points_required: number
  is_unlocked: boolean
  image_url?: string
}

const TasteAlleyManager: React.FC = () => {
  const [items, setItems] = useState<TasteAlleyItem[]>([
    {
      id: '1',
      name: 'Эксклюзивный десерт',
      description: 'Специальный десерт от шеф-повара',
      category: 'Десерты',
      points_required: 100,
      is_unlocked: false
    },
    {
      id: '2',
      name: 'VIP-столик',
      description: 'Столик в VIP-зоне с персональным обслуживанием',
      category: 'Услуги',
      points_required: 250,
      is_unlocked: false
    },
    {
      id: '3',
      name: 'Мастер-класс по кулинарии',
      description: 'Участие в мастер-классе от шеф-повара',
      category: 'Обучение',
      points_required: 500,
      is_unlocked: false
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<TasteAlleyItem | null>(null)
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all')

  const filteredItems = items.filter(item => {
    if (filter === 'unlocked') return item.is_unlocked
    if (filter === 'locked') return !item.is_unlocked
    return true
  })

  const handleToggleUnlock = (id: string) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, is_unlocked: !item.is_unlocked } : item
      )
    )
  }

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const categories = ['Все', 'Десерты', 'Услуги', 'Обучение', 'Развлечения']

  return (
    <div className="ode-space-y-6">
      {/* Header */}
      <div className="ode-flex ode-justify-between ode-items-center">
        <div>
          <h2 className="ode-text-2xl ode-font-bold ode-text-charcoal">Taste Alley</h2>
          <p className="ode-text-gray">Управление эксклюзивными предложениями</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="ode-btn ode-btn-primary"
        >
          Добавить предложение
        </button>
      </div>

      {/* Stats */}
      <div className="ode-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="ode-card ode-text-center">
          <div className="ode-text-2xl ode-font-bold ode-text-primary">{items.length}</div>
          <div className="ode-text-sm ode-text-gray">Всего предложений</div>
        </div>
        <div className="ode-card ode-text-center">
          <div className="ode-text-2xl ode-font-bold ode-text-success">{items.filter(i => i.is_unlocked).length}</div>
          <div className="ode-text-sm ode-text-gray">Активных</div>
        </div>
        <div className="ode-card ode-text-center">
          <div className="ode-text-2xl ode-font-bold ode-text-warning">{items.filter(i => !i.is_unlocked).length}</div>
          <div className="ode-text-sm ode-text-gray">Заблокированных</div>
        </div>
        <div className="ode-card ode-text-center">
          <div className="ode-text-2xl ode-font-bold ode-text-primary">
            {Math.round(items.reduce((acc, item) => acc + item.points_required, 0) / items.length)}
          </div>
          <div className="ode-text-sm ode-text-gray">Средняя стоимость</div>
        </div>
      </div>

      {/* Filters */}
      <div className="ode-flex ode-space-x-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="form-select"
        >
          <option value="all">Все предложения</option>
          <option value="unlocked">Активные</option>
          <option value="locked">Заблокированные</option>
        </select>
        
        <select className="form-select">
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Items Grid */}
      <div className="ode-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {filteredItems.map((item) => (
          <div key={item.id} className="ode-card">
            <div className="ode-flex ode-justify-between ode-items-start ode-mb-4">
              <div>
                <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal">{item.name}</h3>
                <p className="ode-text-sm ode-text-gray">{item.category}</p>
              </div>
              <div className="ode-flex ode-space-x-2">
                <button
                  onClick={() => setEditingItem(item)}
                  className="ode-btn ode-btn-sm"
                  style={{ background: '#f3f4f6', color: '#374151' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="ode-btn ode-btn-sm"
                  style={{ background: '#fef2f2', color: '#dc2626' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.996-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            
            <p className="ode-text-gray ode-mb-4">{item.description}</p>
            
            <div className="ode-flex ode-items-center ode-justify-between">
              <div className="ode-flex ode-items-center ode-space-x-2">
                <span className="ode-text-sm ode-text-gray">Стоимость:</span>
                <span className="ode-font-semibold ode-text-primary">{item.points_required} баллов</span>
              </div>
              <button
                onClick={() => handleToggleUnlock(item.id)}
                className={`ode-btn ode-btn-sm ${
                  item.is_unlocked
                    ? 'ode-btn-success'
                    : 'ode-btn-secondary'
                }`}
              >
                {item.is_unlocked ? 'Активно' : 'Заблокировано'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <div className="modal">
          <div className="ode-card" style={{ maxWidth: '500px', margin: '80px auto' }}>
            <div className="ode-flex ode-justify-between ode-items-center ode-mb-4">
              <h3 className="ode-text-lg ode-font-bold ode-text-charcoal">
                {editingItem ? 'Редактировать предложение' : 'Добавить предложение'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingItem(null)
                }}
                className="ode-btn ode-btn-sm"
                style={{ background: '#f3f4f6', color: '#374151' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form className="ode-space-y-4">
              <div>
                <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>Название</label>
                <input
                  type="text"
                  defaultValue={editingItem?.name || ''}
                  className="form-input"
                  placeholder="Название предложения"
                />
              </div>
              
              <div>
                <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>Описание</label>
                <textarea
                  defaultValue={editingItem?.description || ''}
                  rows={3}
                  className="form-input"
                  placeholder="Описание предложения"
                />
              </div>
              
              <div>
                <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>Категория</label>
                <select
                  defaultValue={editingItem?.category || ''}
                  className="form-select"
                >
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>Стоимость в баллах</label>
                <input
                  type="number"
                  defaultValue={editingItem?.points_required || ''}
                  className="form-input"
                  placeholder="100"
                />
              </div>
              
              <div className="ode-flex ode-items-center">
                <input
                  type="checkbox"
                  id="is_unlocked"
                  defaultChecked={editingItem?.is_unlocked || false}
                  className="form-checkbox"
                />
                <label htmlFor="is_unlocked" className="ode-ml-2 ode-text-sm ode-text-charcoal" style={{ display: 'block' }}>
                  Активно (доступно для пользователей)
                </label>
              </div>
            </form>
            
            <div className="ode-flex ode-justify-end ode-space-x-3 ode-mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingItem(null)
                }}
                className="ode-btn ode-btn-secondary"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingItem(null)
                }}
                className="ode-btn ode-btn-primary"
              >
                {editingItem ? 'Сохранить' : 'Добавить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TasteAlleyManager
