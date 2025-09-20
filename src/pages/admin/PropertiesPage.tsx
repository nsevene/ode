import React, { useState } from 'react'
import { 
  FaBuilding, FaMapMarkerAlt, FaDollarSign, FaUsers, FaCalendar, FaEdit, FaTrash, 
  FaPlus, FaSearch, FaFilter, FaEye, FaHome, FaChartLine, FaImage, FaPhone, FaEnvelope
} from 'react-icons/fa'
import AdminNavigation from '../../components/admin/AdminNavigation'

const PropertiesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProperty, setEditingProperty] = useState<any>(null)

  const properties = [
    {
      id: 1,
      name: 'Бизнес-центр "Солнечный"',
      address: 'Москва, ул. Тверская, 15',
      type: 'office',
      status: 'active',
      area: 2500,
      price: 150000,
      occupancy: 95,
      tenants: 12,
      created: '2024-01-15',
      image: '/api/placeholder/300/200',
      description: 'Современный бизнес-центр в центре Москвы с отличной транспортной доступностью'
    },
    {
      id: 2,
      name: 'Торговый центр "Мега"',
      address: 'Москва, ул. Арбат, 25',
      type: 'retail',
      status: 'renovation',
      area: 5000,
      price: 200000,
      occupancy: 0,
      tenants: 0,
      created: '2024-02-20',
      image: '/api/placeholder/300/200',
      description: 'Крупный торговый центр на стадии реконструкции'
    },
    {
      id: 3,
      name: 'Складской комплекс "Логистик"',
      address: 'Московская область, г. Химки',
      type: 'warehouse',
      status: 'active',
      area: 10000,
      price: 80000,
      occupancy: 100,
      tenants: 3,
      created: '2024-03-10',
      image: '/api/placeholder/300/200',
      description: 'Современный складской комплекс с развитой логистической инфраструктурой'
    }
  ]

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus
    const matchesType = filterType === 'all' || property.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  // Функции для работы с недвижимостью
  const handlePropertySelect = (propertyId: string) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    )
  }

  const handleViewProperty = (property: any) => {
    console.log('Просмотр объекта:', property)
    // Здесь будет открытие модального окна с детальной информацией
    alert(`Просмотр объекта: ${property.name}`)
  }

  const handleEditProperty = (property: any) => {
    console.log('Редактирование объекта:', property)
    setEditingProperty(property)
    setShowEditModal(true)
  }

  const handleDeleteProperty = (propertyId: string) => {
    console.log('Удаление объекта:', propertyId)
    if (confirm('Вы уверены, что хотите удалить этот объект?')) {
      // Здесь будет логика удаления
      alert('Объект удален')
    }
  }

  const handleAddProperty = () => {
    console.log('Добавление нового объекта')
    setShowAddModal(true)
  }

  const handleBulkAction = (action: string) => {
    console.log('Массовое действие:', action, 'для объектов:', selectedProperties)
    if (selectedProperties.length === 0) {
      alert('Выберите объекты для выполнения действия')
      return
    }
    
    switch (action) {
      case 'delete':
        if (confirm(`Удалить ${selectedProperties.length} объектов?`)) {
          alert('Объекты удалены')
          setSelectedProperties([])
        }
        break
      case 'export':
        alert(`Экспорт ${selectedProperties.length} объектов`)
        break
      case 'activate':
        alert(`Активация ${selectedProperties.length} объектов`)
        break
      default:
        alert(`Действие ${action} для ${selectedProperties.length} объектов`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#16a34a'
      case 'renovation': return '#f59e0b'
      case 'inactive': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активен'
      case 'renovation': return 'На ремонте'
      case 'inactive': return 'Неактивен'
      default: return status
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'office': return 'Офис'
      case 'retail': return 'Торговля'
      case 'warehouse': return 'Склад'
      case 'residential': return 'Жилье'
      default: return type
    }
  }

  return (
    <div className="ode-bg-gray" style={{ minHeight: '100vh', padding: '32px 0' }}>
      <div className="ode-container">
        <div className="ode-dashboard-layout">
          <AdminNavigation />
          <div className="ode-dashboard-content">
            {/* Header */}
            <div className="ode-dashboard-header">
              <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-2">Управление недвижимостью</h1>
              <p className="ode-text-gray">Добавление, редактирование и управление объектами недвижимости</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleAddProperty} className="ode-btn ode-btn-primary">
                <FaPlus style={{ marginRight: '8px' }} />
                Добавить объект
              </button>
              <button className="ode-btn ode-btn-secondary">
                <FaChartLine style={{ marginRight: '8px' }} />
                Аналитика
              </button>
            </div>

            <div style={{ marginTop: '32px' }}>
        {/* Filters */}
        <div className="ode-card ode-mb-4">
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
              <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', width: '16px', height: '16px' }} />
              <input
                type="text"
                placeholder="Поиск по названию или адресу..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-select"
              >
                <option value="all">Все статусы</option>
                <option value="active">Активные</option>
                <option value="renovation">На ремонте</option>
                <option value="inactive">Неактивные</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="form-select"
              >
                <option value="all">Все типы</option>
                <option value="office">Офисы</option>
                <option value="retail">Торговля</option>
                <option value="warehouse">Склады</option>
                <option value="residential">Жилье</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="ode-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="ode-text-xl ode-font-semibold ode-text-charcoal">
              Объекты недвижимости ({filteredProperties.length})
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              {selectedProperties.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', marginRight: '16px' }}>
                  <button 
                    onClick={() => handleBulkAction('export')}
                    className="ode-btn ode-btn-sm" 
                    style={{ background: '#dbeafe', color: '#2563eb' }}
                  >
                    Экспорт ({selectedProperties.length})
                  </button>
                  <button 
                    onClick={() => handleBulkAction('activate')}
                    className="ode-btn ode-btn-sm" 
                    style={{ background: '#f0fdf4', color: '#16a34a' }}
                  >
                    Активировать ({selectedProperties.length})
                  </button>
                  <button 
                    onClick={() => handleBulkAction('delete')}
                    className="ode-btn ode-btn-sm" 
                    style={{ background: '#fef2f2', color: '#dc2626' }}
                  >
                    Удалить ({selectedProperties.length})
                  </button>
                </div>
              )}
              <button className="ode-btn ode-btn-sm" style={{ background: '#f9fafb', color: '#374151' }}>
                <FaFilter style={{ marginRight: '4px' }} />
                Фильтры
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredProperties.map((property) => (
              <div 
                key={property.id} 
                className={`ode-card ${selectedProperties.includes(property.id.toString()) ? 'ode-card-interactive' : ''}`} 
                style={{ 
                  padding: '20px',
                  border: selectedProperties.includes(property.id.toString()) ? '2px solid #8B0000' : undefined,
                  background: selectedProperties.includes(property.id.toString()) ? '#fef2f2' : undefined
                }}
                onClick={() => handlePropertySelect(property.id.toString())}
              >
                <div style={{ display: 'flex', gap: '16px' }}>
                  {/* Checkbox */}
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                    <input
                      type="checkbox"
                      checked={selectedProperties.includes(property.id.toString())}
                      onChange={() => handlePropertySelect(property.id.toString())}
                      onClick={(e) => e.stopPropagation()}
                      style={{ width: '16px', height: '16px' }}
                    />
                  </div>
                  
                  {/* Image */}
                  <div style={{ width: '120px', height: '80px', background: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FaImage style={{ width: '24px', height: '24px', color: '#9ca3af' }} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal">{property.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <FaMapMarkerAlt style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                          <span className="ode-text-sm ode-text-gray">{property.address}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge" style={{ 
                          background: getStatusColor(property.status) + '20',
                          color: getStatusColor(property.status),
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          {getStatusText(property.status)}
                        </span>
                        <span className="badge" style={{ 
                          background: '#f3f4f6',
                          color: '#374151',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          {getTypeText(property.type)}
                        </span>
                      </div>
                    </div>

                    <p className="ode-text-sm ode-text-gray ode-mb-4">{property.description}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <span className="ode-text-xs ode-text-gray">Площадь:</span>
                        <p className="ode-text-sm ode-font-medium ode-text-charcoal">{property.area.toLocaleString()} м²</p>
                      </div>
                      <div>
                        <span className="ode-text-xs ode-text-gray">Стоимость:</span>
                        <p className="ode-text-sm ode-font-medium ode-text-charcoal">₽{property.price.toLocaleString()}/мес</p>
                      </div>
                      <div>
                        <span className="ode-text-xs ode-text-gray">Заполняемость:</span>
                        <p className="ode-text-sm ode-font-medium ode-text-charcoal">{property.occupancy}%</p>
                      </div>
                      <div>
                        <span className="ode-text-xs ode-text-gray">Арендаторов:</span>
                        <p className="ode-text-sm ode-font-medium ode-text-charcoal">{property.tenants}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FaCalendar style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                          <span className="ode-text-xs ode-text-gray">Создан: {property.created}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewProperty(property)
                          }}
                          className="ode-btn ode-btn-sm" 
                          style={{ background: '#f9fafb', color: '#374151' }}
                        >
                          <FaEye style={{ marginRight: '4px' }} />
                          Просмотр
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditProperty(property)
                          }}
                          className="ode-btn ode-btn-sm" 
                          style={{ background: '#dbeafe', color: '#2563eb' }}
                        >
                          <FaEdit style={{ marginRight: '4px' }} />
                          Редактировать
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteProperty(property.id.toString())
                          }}
                          className="ode-btn ode-btn-sm" 
                          style={{ background: '#fef2f2', color: '#dc2626' }}
                        >
                          <FaTrash style={{ marginRight: '4px' }} />
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="ode-text-center" style={{ padding: '48px 0' }}>
              <FaBuilding style={{ width: '48px', height: '48px', color: '#d1d5db', margin: '0 auto 16px' }} />
              <p className="ode-text-gray">Объекты не найдены</p>
            </div>
          )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertiesPage
