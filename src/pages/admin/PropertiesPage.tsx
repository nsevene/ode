import React, { useState, useEffect } from 'react'
import { 
  FaBuilding, FaMapMarkerAlt, FaDollarSign, FaUsers, FaCalendar, FaEdit, FaTrash, 
  FaPlus, FaSearch, FaFilter, FaEye, FaHome, FaChartLine, FaImage, FaPhone, FaEnvelope
} from 'react-icons/fa'
import AdminNavigation from '../../components/admin/AdminNavigation'
import { adminApi, type AdminProperty } from '../../lib/api/admin'

const PropertiesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProperty, setEditingProperty] = useState<any>(null)
  const [properties, setProperties] = useState<AdminProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [newProperty, setNewProperty] = useState({
    name: '',
    address: '',
    type: 'office' as 'office' | 'retail' | 'warehouse' | 'coworking',
    size: 0,
    price: 0,
    status: 'available' as 'available' | 'occupied' | 'maintenance',
    amenities: [] as string[]
  })

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await adminApi.getProperties()
        setProperties(data)
      } catch (error) {
        console.error('Error fetching properties:', error)
        // Fallback to mock data
        setProperties([
          {
            id: '1',
            name: 'Бизнес-центр "Солнечный"',
            address: 'Москва, ул. Тверская, 15',
            type: 'office',
            size: 2500,
            price: 150000,
            status: 'available',
            amenities: ['Парковка', 'Кондиционер', 'Лифт'],
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z'
          },
          {
            id: '2',
            name: 'Торговый центр "Мега"',
            address: 'Москва, ул. Арбат, 25',
            type: 'retail',
            size: 5000,
            price: 200000,
            status: 'maintenance',
            amenities: ['Парковка', 'Эскалаторы'],
            created_at: '2024-02-20T10:00:00Z',
            updated_at: '2024-02-20T10:00:00Z'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

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

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      await adminApi.deleteProperty(propertyId)
      setProperties(prev => prev.filter(p => p.id !== propertyId))
      alert('Объект успешно удален')
    } catch (error) {
      console.error('Error deleting property:', error)
      alert('Ошибка при удалении объекта')
    }
  }

  const handleAddProperty = async () => {
    try {
      const property = await adminApi.createProperty(newProperty)
      setProperties(prev => [property, ...prev])
      setNewProperty({
        name: '',
        address: '',
        type: 'office',
        size: 0,
        price: 0,
        status: 'available',
        amenities: []
      })
      setShowAddModal(false)
      alert('Объект успешно добавлен')
    } catch (error) {
      console.error('Error creating property:', error)
      alert('Ошибка при создании объекта')
    }
  }

  const handleUpdateProperty = async (propertyId: string, updates: Partial<AdminProperty>) => {
    try {
      const updatedProperty = await adminApi.updateProperty(propertyId, updates)
      setProperties(prev => prev.map(p => p.id === propertyId ? updatedProperty : p))
      setShowEditModal(false)
      alert('Объект успешно обновлен')
    } catch (error) {
      console.error('Error updating property:', error)
      alert('Ошибка при обновлении объекта')
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedProperties.length === 0) {
      alert('Выберите объекты для выполнения действия')
      return
    }
    
    try {
      switch (action) {
        case 'delete':
          if (confirm(`Удалить ${selectedProperties.length} объектов?`)) {
            await Promise.all(selectedProperties.map(id => adminApi.deleteProperty(id)))
            setProperties(prev => prev.filter(p => !selectedProperties.includes(p.id)))
            setSelectedProperties([])
            alert('Объекты успешно удалены')
          }
          break
        case 'export':
          alert(`Экспорт ${selectedProperties.length} объектов`)
          break
        case 'activate':
          await Promise.all(selectedProperties.map(id => 
            adminApi.updateProperty(id, { status: 'available' })
          ))
          setProperties(prev => prev.map(p => 
            selectedProperties.includes(p.id) ? { ...p, status: 'available' } : p
          ))
          setSelectedProperties([])
          alert('Объекты активированы')
          break
        default:
          alert(`Действие ${action} для ${selectedProperties.length} объектов`)
      }
    } catch (error) {
      console.error('Error performing bulk action:', error)
      alert('Ошибка при выполнении массового действия')
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
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="ode-card" style={{ padding: '20px' }}>
                  <div className="ode-animate-pulse">
                    <div className="ode-h-6 ode-bg-gray-200 ode-rounded ode-mb-2"></div>
                    <div className="ode-h-4 ode-bg-gray-200 ode-rounded ode-mb-4"></div>
                    <div className="ode-h-4 ode-bg-gray-200 ode-rounded ode-w-1/2"></div>
                  </div>
                </div>
              ))
            ) : (
              filteredProperties.map((property) => (
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                          <span className="ode-text-sm ode-text-gray">
                            <FaBuilding style={{ marginRight: '4px' }} />
                            {property.type === 'office' ? 'Офис' : 
                             property.type === 'retail' ? 'Торговля' : 
                             property.type === 'warehouse' ? 'Склад' : 'Коворкинг'}
                          </span>
                          <span className="ode-text-sm ode-text-gray">
                            <FaDollarSign style={{ marginRight: '4px' }} />
                            {property.price.toLocaleString()} ₽/мес
                          </span>
                          <span className="ode-text-sm ode-text-gray">
                            <FaHome style={{ marginRight: '4px' }} />
                            {property.size} м²
                          </span>
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
                        <p className="ode-text-sm ode-font-medium ode-text-charcoal">{property.size.toLocaleString()} м²</p>
                      </div>
                      <div>
                        <span className="ode-text-xs ode-text-gray">Стоимость:</span>
                        <p className="ode-text-sm ode-font-medium ode-text-charcoal">₽{property.price.toLocaleString()}/мес</p>
                      </div>
                      <div>
                        <span className="ode-text-xs ode-text-gray">Статус:</span>
                        <p className="ode-text-sm ode-font-medium ode-text-charcoal">
                          {property.status === 'available' ? 'Доступен' : 
                           property.status === 'occupied' ? 'Занят' : 'На обслуживании'}
                        </p>
                      </div>
                      <div>
                        <span className="ode-text-xs ode-text-gray">Удобства:</span>
                        <p className="ode-text-sm ode-font-medium ode-text-charcoal">{property.amenities.join(', ')}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FaCalendar style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                          <span className="ode-text-xs ode-text-gray">
                            Создан: {new Date(property.created_at).toLocaleDateString('ru-RU')}
                          </span>
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
              ))
            )}
          </div>

          {!loading && filteredProperties.length === 0 && (
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
