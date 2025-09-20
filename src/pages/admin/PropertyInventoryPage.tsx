import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { 
  FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaPlus, FaCalendar, 
  FaUser, FaBuilding, FaDollarSign, FaFileAlt, FaEnvelope, FaPhone,
  FaMapMarkerAlt, FaDownload, FaSortAmountDown, FaSortAmountUp,
  FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaSpinner,
  FaClock, FaSignature, FaCopy, FaHistory, FaImages, FaVideo,
  FaRuler, FaBed, FaBath, FaCar, FaWifi, FaSwimmingPool, FaGym,
  FaParking, FaShield, FaKey, FaCamera, FaMap, FaGlobe
} from 'react-icons/fa'
import AdminNavigation from '../../components/admin/AdminNavigation'
import { adminApi, type AdminProperty } from '../../lib/api/admin'

const PropertyInventoryPage: React.FC = () => {
  const { t } = useTranslation('common')
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [properties, setProperties] = useState<AdminProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState<AdminProperty | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)

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
            price: 500000,
            status: 'available',
            amenities: ['Парковка', 'Конференц-зал', 'Кафе', 'WiFi', 'Охрана'],
            description: 'Современный бизнес-центр в центре Москвы с отличной транспортной доступностью',
            images: ['property1_1.jpg', 'property1_2.jpg', 'property1_3.jpg'],
            floor: 5,
            rooms: 12,
            bathrooms: 3,
            parking: 20,
            yearBuilt: 2020,
            features: ['Лифт', 'Кондиционер', 'Система безопасности'],
            location: {
              latitude: 55.7558,
              longitude: 37.6176,
              district: 'Центральный',
              metro: 'Тверская'
            },
            availability: {
              startDate: '2024-01-01',
              endDate: '2024-12-31',
              isAvailable: true
            },
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-12-20T10:00:00Z'
          },
          {
            id: '2',
            name: 'Торговый центр "Мега"',
            address: 'Москва, ул. Арбат, 25',
            type: 'retail',
            size: 1200,
            price: 200000,
            status: 'occupied',
            amenities: ['Парковка', 'Витрины', 'Склад', 'WiFi', 'Охрана'],
            description: 'Торговое помещение в историческом центре с высоким пешеходным трафиком',
            images: ['property2_1.jpg', 'property2_2.jpg'],
            floor: 1,
            rooms: 8,
            bathrooms: 2,
            parking: 15,
            yearBuilt: 2018,
            features: ['Витринные окна', 'Складское помещение', 'Погрузочная рампа'],
            location: {
              latitude: 55.7522,
              longitude: 37.5914,
              district: 'Центральный',
              metro: 'Арбатская'
            },
            availability: {
              startDate: '2024-03-01',
              endDate: '2025-03-01',
              isAvailable: false
            },
            createdAt: '2024-03-01T10:00:00Z',
            updatedAt: '2024-12-20T10:00:00Z'
          },
          {
            id: '3',
            name: 'Складской комплекс "Логистик"',
            address: 'Московская область, г. Химки',
            type: 'warehouse',
            size: 5000,
            price: 300000,
            status: 'maintenance',
            amenities: ['Парковка', 'Погрузочные рампы', 'Железнодорожная ветка', 'Охрана'],
            description: 'Современный складской комплекс с отличной логистической инфраструктурой',
            images: ['property3_1.jpg', 'property3_2.jpg', 'property3_3.jpg'],
            floor: 1,
            rooms: 1,
            bathrooms: 2,
            parking: 50,
            yearBuilt: 2019,
            features: ['Высокие потолки', 'Погрузочные рампы', 'Железнодорожная ветка'],
            location: {
              latitude: 55.8969,
              longitude: 37.4297,
              district: 'Химки',
              metro: 'Планерная'
            },
            availability: {
              startDate: '2024-06-01',
              endDate: '2027-06-01',
              isAvailable: false
            },
            createdAt: '2024-06-01T10:00:00Z',
            updatedAt: '2024-12-20T10:00:00Z'
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
                         property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || property.type === typeFilter
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter
    const matchesLocation = locationFilter === 'all' || property.location.district === locationFilter
    return matchesSearch && matchesType && matchesStatus && matchesLocation
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'price_high':
        return b.price - a.price
      case 'price_low':
        return a.price - b.price
      case 'size_high':
        return b.size - a.size
      case 'size_low':
        return a.size - b.size
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const handleViewDetails = (property: AdminProperty) => {
    setSelectedProperty(property)
    setShowDetails(true)
  }

  const handleEditProperty = (property: AdminProperty) => {
    setSelectedProperty(property)
    setShowDetails(true)
  }

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот объект недвижимости?')) return

    try {
      setProcessing(propertyId)
      await adminApi.deleteProperty(propertyId)
      setProperties(prev => prev.filter(property => property.id !== propertyId))
      alert('Объект недвижимости успешно удален')
    } catch (error) {
      console.error('Error deleting property:', error)
      alert('Ошибка при удалении объекта недвижимости')
    } finally {
      setProcessing(null)
    }
  }

  const handleToggleAvailability = async (propertyId: string) => {
    try {
      setProcessing(propertyId)
      const property = properties.find(p => p.id === propertyId)
      if (!property) return

      const newStatus = property.status === 'available' ? 'occupied' : 'available'
      await adminApi.updateProperty(propertyId, { status: newStatus })
      setProperties(prev => prev.map(prop => 
        prop.id === propertyId 
          ? { ...prop, status: newStatus, updatedAt: new Date().toISOString() }
          : prop
      ))
      alert(`Статус объекта изменен на "${newStatus === 'available' ? 'Доступен' : 'Занят'}"`)
    } catch (error) {
      console.error('Error toggling property availability:', error)
      alert('Ошибка при изменении статуса объекта')
    } finally {
      setProcessing(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#16a34a'
      case 'occupied': return '#dc2626'
      case 'maintenance': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Доступен'
      case 'occupied': return 'Занят'
      case 'maintenance': return 'На обслуживании'
      default: return 'Неизвестно'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'office': return 'Офисное'
      case 'retail': return 'Торговое'
      case 'warehouse': return 'Складское'
      case 'coworking': return 'Коворкинг'
      default: return type
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'парковка': return FaCar
      case 'wifi': return FaWifi
      case 'охрана': return FaShield
      case 'конференц-зал': return FaBuilding
      case 'кафе': return FaBuilding
      case 'витрины': return FaBuilding
      case 'склад': return FaBuilding
      case 'погрузочные рампы': return FaBuilding
      case 'железнодорожная ветка': return FaBuilding
      default: return FaBuilding
    }
  }

  return (
    <>
      <Helmet>
        <title>{t('admin.property_inventory.title', 'Управление недвижимостью')} - ODPortal B2B</title>
        <meta name="description" content={t('admin.property_inventory.description', 'Расширенное управление недвижимостью')} />
      </Helmet>
      
      <div className="ode-bg-gray" style={{ minHeight: '100vh', padding: '32px 0' }}>
        <div className="ode-container">
          <div className="ode-dashboard-layout">
            <AdminNavigation />
            
            <div className="ode-dashboard-content">
              <div className="ode-dashboard-header">
                <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-2">
                  {t('admin.property_inventory.heading', 'Управление недвижимостью')}
                </h1>
                <p className="ode-text-gray">
                  {t('admin.property_inventory.description', 'Расширенное управление недвижимостью')}
                </p>
              </div>

              {/* Filters and Search */}
              <div className="ode-card ode-mb-6">
                <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-lg-grid-5 ode-gap-4 ode-mb-4">
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Поиск</label>
                    <div className="ode-relative">
                      <FaSearch className="ode-absolute ode-left-3 ode-top-1/2 ode-transform ode--translate-y-1/2 ode-text-gray-400" />
                      <input
                        type="text"
                        placeholder="Название, адрес, описание..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="ode-w-full ode-pl-10 ode-pr-4 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary ode-focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Тип</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary"
                    >
                      <option value="all">Все типы</option>
                      <option value="office">Офисное</option>
                      <option value="retail">Торговое</option>
                      <option value="warehouse">Складское</option>
                      <option value="coworking">Коворкинг</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Статус</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary"
                    >
                      <option value="all">Все статусы</option>
                      <option value="available">Доступен</option>
                      <option value="occupied">Занят</option>
                      <option value="maintenance">На обслуживании</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Район</label>
                    <select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary"
                    >
                      <option value="all">Все районы</option>
                      <option value="Центральный">Центральный</option>
                      <option value="Химки">Химки</option>
                      <option value="САО">САО</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Сортировка</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary"
                    >
                      <option value="newest">Новые</option>
                      <option value="oldest">Старые</option>
                      <option value="price_high">Цена ↓</option>
                      <option value="price_low">Цена ↑</option>
                      <option value="size_high">Площадь ↓</option>
                      <option value="size_low">Площадь ↑</option>
                      <option value="name">По названию</option>
                    </select>
                  </div>
                </div>
                
                <div className="ode-flex ode-justify-between ode-items-center">
                  <div className="ode-flex ode-items-center ode-gap-4">
                    <span className="ode-text-sm ode-text-gray">
                      Найдено: {filteredProperties.length} объектов
                    </span>
                    <span className="ode-text-sm ode-text-gray">
                      Доступно: {properties.filter(prop => prop.status === 'available').length}
                    </span>
                    <span className="ode-text-sm ode-text-gray">
                      Занято: {properties.filter(prop => prop.status === 'occupied').length}
                    </span>
                  </div>
                  
                  <div className="ode-flex ode-items-center ode-gap-2">
                    <div className="ode-flex ode-items-center ode-gap-2">
                      <button
                        className={`ode-btn ode-btn-sm ${viewMode === 'grid' ? 'ode-btn-primary' : 'ode-btn-ghost'}`}
                        onClick={() => setViewMode('grid')}
                      >
                        <FaBuilding />
                      </button>
                      <button
                        className={`ode-btn ode-btn-sm ${viewMode === 'list' ? 'ode-btn-primary' : 'ode-btn-ghost'}`}
                        onClick={() => setViewMode('list')}
                      >
                        <FaList />
                      </button>
                    </div>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="ode-btn ode-btn-primary ode-btn-sm"
                    >
                      <FaPlus className="ode-mr-2" />
                      Добавить объект
                    </button>
                    <button className="ode-btn ode-btn-secondary ode-btn-sm">
                      <FaDownload className="ode-mr-2" />
                      Экспорт
                    </button>
                  </div>
                </div>
              </div>

              {/* Properties List */}
              <div className={viewMode === 'grid' ? 'ode-grid ode-grid-1 ode-md-grid-2 ode-lg-grid-3 ode-gap-6' : 'ode-space-y-4'}>
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="ode-card">
                      <div className="ode-animate-pulse">
                        <div className="ode-h-48 ode-bg-gray-200 ode-rounded-t-lg"></div>
                        <div className="ode-p-4">
                          <div className="ode-h-6 ode-bg-gray-200 ode-rounded ode-mb-2"></div>
                          <div className="ode-h-4 ode-bg-gray-200 ode-rounded ode-mb-4"></div>
                          <div className="ode-h-4 ode-bg-gray-200 ode-rounded ode-w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  filteredProperties.map((property) => (
                    <div key={property.id} className="ode-card ode-hover-shadow ode-transition">
                      {viewMode === 'grid' ? (
                        // Grid view
                        <>
                          {property.images && property.images.length > 0 && (
                            <div className="ode-relative">
                              <img 
                                src={`/images/properties/${property.images[0]}`} 
                                alt={property.name}
                                className="ode-w-full ode-h-48 ode-object-cover ode-rounded-t-lg"
                                onError={(e) => {
                                  e.currentTarget.src = '/images/placeholder-property.jpg'
                                }}
                              />
                              <div className="ode-absolute ode-top-4 ode-right-4">
                                <span 
                                  className="ode-badge"
                                  style={{
                                    backgroundColor: getStatusColor(property.status) + '20',
                                    color: getStatusColor(property.status)
                                  }}
                                >
                                  {getStatusText(property.status)}
                                </span>
                              </div>
                            </div>
                          )}
                          <div className="ode-p-4">
                            <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-2">
                              {property.name}
                            </h3>
                            <p className="ode-text-sm ode-text-gray ode-mb-2">{property.address}</p>
                            <p className="ode-text-sm ode-text-charcoal ode-line-clamp-2 ode-mb-4">
                              {property.description}
                            </p>
                            
                            <div className="ode-grid ode-grid-2 ode-gap-2 ode-mb-4">
                              <div className="ode-flex ode-items-center ode-gap-1">
                                <FaRuler className="ode-text-gray-400" />
                                <span className="ode-text-sm ode-text-gray">{property.size} м²</span>
                              </div>
                              <div className="ode-flex ode-items-center ode-gap-1">
                                <FaDollarSign className="ode-text-gray-400" />
                                <span className="ode-text-sm ode-text-gray">₽{property.price.toLocaleString()}/мес</span>
                              </div>
                              <div className="ode-flex ode-items-center ode-gap-1">
                                <FaBuilding className="ode-text-gray-400" />
                                <span className="ode-text-sm ode-text-gray">{getTypeText(property.type)}</span>
                              </div>
                              <div className="ode-flex ode-items-center ode-gap-1">
                                <FaMapMarkerAlt className="ode-text-gray-400" />
                                <span className="ode-text-sm ode-text-gray">{property.location.district}</span>
                              </div>
                            </div>
                            
                            <div className="ode-flex ode-items-center ode-justify-between">
                              <div className="ode-flex ode-items-center ode-gap-2">
                                {property.amenities.slice(0, 3).map((amenity, index) => {
                                  const Icon = getAmenityIcon(amenity)
                                  return (
                                    <div key={index} className="ode-flex ode-items-center ode-gap-1">
                                      <Icon className="ode-text-gray-400" />
                                      <span className="ode-text-xs ode-text-gray">{amenity}</span>
                                    </div>
                                  )
                                })}
                                {property.amenities.length > 3 && (
                                  <span className="ode-text-xs ode-text-gray">+{property.amenities.length - 3}</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="ode-flex ode-items-center ode-gap-2 ode-mt-4">
                              <button
                                onClick={() => handleViewDetails(property)}
                                className="ode-btn ode-btn-secondary ode-btn-sm ode-flex-1"
                              >
                                <FaEye />
                                Подробнее
                              </button>
                              <button
                                onClick={() => handleEditProperty(property)}
                                className="ode-btn ode-btn-primary ode-btn-sm"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleToggleAvailability(property.id)}
                                disabled={processing === property.id}
                                className="ode-btn ode-btn-success ode-btn-sm"
                              >
                                {processing === property.id ? (
                                  <FaSpinner className="ode-animate-spin" />
                                ) : (
                                  <FaKey />
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteProperty(property.id)}
                                disabled={processing === property.id}
                                className="ode-btn ode-btn-danger ode-btn-sm"
                              >
                                {processing === property.id ? (
                                  <FaSpinner className="ode-animate-spin" />
                                ) : (
                                  <FaTrash />
                                )}
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        // List view
                        <div className="ode-p-6">
                          <div className="ode-flex ode-items-start ode-justify-between ode-mb-4">
                            <div className="ode-flex ode-items-center ode-gap-4">
                              {property.images && property.images.length > 0 && (
                                <img 
                                  src={`/images/properties/${property.images[0]}`} 
                                  alt={property.name}
                                  className="ode-w-16 ode-h-16 ode-object-cover ode-rounded-lg"
                                  onError={(e) => {
                                    e.currentTarget.src = '/images/placeholder-property.jpg'
                                  }}
                                />
                              )}
                              <div>
                                <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal">
                                  {property.name}
                                </h3>
                                <p className="ode-text-sm ode-text-gray">{property.address}</p>
                                <div className="ode-flex ode-items-center ode-gap-2 ode-mt-1">
                                  <span 
                                    className="ode-badge"
                                    style={{
                                      backgroundColor: getStatusColor(property.status) + '20',
                                      color: getStatusColor(property.status)
                                    }}
                                  >
                                    {getStatusText(property.status)}
                                  </span>
                                  <span className="ode-badge ode-bg-blue-100 ode-text-blue-800">
                                    {getTypeText(property.type)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="ode-flex ode-items-center ode-gap-2">
                              <button
                                onClick={() => handleViewDetails(property)}
                                className="ode-btn ode-btn-secondary ode-btn-sm"
                              >
                                <FaEye />
                                Подробнее
                              </button>
                              <button
                                onClick={() => handleEditProperty(property)}
                                className="ode-btn ode-btn-primary ode-btn-sm"
                              >
                                <FaEdit />
                                Редактировать
                              </button>
                              <button
                                onClick={() => handleToggleAvailability(property.id)}
                                disabled={processing === property.id}
                                className="ode-btn ode-btn-success ode-btn-sm"
                              >
                                {processing === property.id ? (
                                  <FaSpinner className="ode-animate-spin" />
                                ) : (
                                  <FaKey />
                                )}
                                {property.status === 'available' ? 'Занять' : 'Освободить'}
                              </button>
                              <button
                                onClick={() => handleDeleteProperty(property.id)}
                                disabled={processing === property.id}
                                className="ode-btn ode-btn-danger ode-btn-sm"
                              >
                                {processing === property.id ? (
                                  <FaSpinner className="ode-animate-spin" />
                                ) : (
                                  <FaTrash />
                                )}
                                Удалить
                              </button>
                            </div>
                          </div>
                          
                          <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-lg-grid-4 ode-gap-4 ode-mb-4">
                            <div className="ode-flex ode-items-center ode-gap-2">
                              <FaRuler className="ode-text-gray-400" />
                              <span className="ode-text-sm ode-text-gray">{property.size} м²</span>
                            </div>
                            <div className="ode-flex ode-items-center ode-gap-2">
                              <FaDollarSign className="ode-text-gray-400" />
                              <span className="ode-text-sm ode-text-gray">₽{property.price.toLocaleString()}/мес</span>
                            </div>
                            <div className="ode-flex ode-items-center ode-gap-2">
                              <FaMapMarkerAlt className="ode-text-gray-400" />
                              <span className="ode-text-sm ode-text-gray">{property.location.district}</span>
                            </div>
                            <div className="ode-flex ode-items-center ode-gap-2">
                              <FaBuilding className="ode-text-gray-400" />
                              <span className="ode-text-sm ode-text-gray">{property.floor} этаж</span>
                            </div>
                          </div>
                          
                          <div className="ode-mb-4">
                            <span className="ode-text-xs ode-text-gray">Описание</span>
                            <p className="ode-text-sm ode-text-charcoal">
                              {property.description}
                            </p>
                          </div>
                          
                          <div className="ode-mb-4">
                            <span className="ode-text-xs ode-text-gray">Удобства</span>
                            <div className="ode-flex ode-flex-wrap ode-gap-2 ode-mt-1">
                              {property.amenities.map((amenity, index) => {
                                const Icon = getAmenityIcon(amenity)
                                return (
                                  <div key={index} className="ode-flex ode-items-center ode-gap-1 ode-bg-gray-100 ode-px-2 ode-py-1 ode-rounded">
                                    <Icon className="ode-text-gray-400" />
                                    <span className="ode-text-xs ode-text-gray">{amenity}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                          
                          <div className="ode-flex ode-items-center ode-justify-between">
                            <div className="ode-flex ode-items-center ode-gap-4">
                              <div className="ode-flex ode-items-center ode-gap-1">
                                <FaImages className="ode-text-gray-400" />
                                <span className="ode-text-sm ode-text-gray">
                                  {property.images.length} фото
                                </span>
                              </div>
                              <div className="ode-flex ode-items-center ode-gap-1">
                                <FaCalendar className="ode-text-gray-400" />
                                <span className="ode-text-sm ode-text-gray">
                                  {property.yearBuilt} г.
                                </span>
                              </div>
                            </div>
                            
                            <div className="ode-text-right">
                              <span className="ode-text-xs ode-text-gray">Обновлен</span>
                              <p className="ode-text-sm ode-font-medium ode-text-charcoal">
                                {formatDate(property.updatedAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {!loading && filteredProperties.length === 0 && (
                <div className="ode-text-center" style={{ padding: '48px 0' }}>
                  <FaBuilding className="ode-text-6xl ode-text-gray-300 ode-mb-4" />
                  <h3 className="ode-text-xl ode-font-semibold ode-text-gray ode-mb-2">
                    Объекты недвижимости не найдены
                  </h3>
                  <p className="ode-text-gray">
                    Попробуйте изменить параметры поиска или фильтры
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Property Details Modal */}
      {showDetails && selectedProperty && (
        <div className="ode-fixed ode-inset-0 ode-bg-black ode-bg-opacity-50 ode-flex ode-items-center ode-justify-center ode-z-50">
          <div className="ode-bg-white ode-rounded-lg ode-shadow-xl ode-max-w-6xl ode-w-full ode-mx-4 ode-max-h-[90vh] ode-overflow-hidden">
            <div className="ode-flex ode-items-center ode-justify-between ode-p-6 ode-border-b">
              <h2 className="ode-text-2xl ode-font-bold ode-text-charcoal">
                Детали объекта недвижимости
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                className="ode-text-gray-400 ode-hover:text-gray-600 ode-transition"
              >
                <FaTimes className="ode-text-xl" />
              </button>
            </div>
            
            <div className="ode-p-6 ode-overflow-y-auto ode-max-h-[calc(90vh-120px)]">
              <div className="ode-space-y-6">
                {/* Property Images */}
                {selectedProperty.images && selectedProperty.images.length > 0 && (
                  <div>
                    <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                      Фотографии
                    </h3>
                    <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-lg-grid-3 ode-gap-4">
                      {selectedProperty.images.map((image, index) => (
                        <div key={index} className="ode-relative">
                          <img 
                            src={`/images/properties/${image}`} 
                            alt={`${selectedProperty.name} - фото ${index + 1}`}
                            className="ode-w-full ode-h-48 ode-object-cover ode-rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = '/images/placeholder-property.jpg'
                            }}
                          />
                          <button className="ode-absolute ode-top-2 ode-right-2 ode-bg-black ode-bg-opacity-50 ode-text-white ode-p-2 ode-rounded-full">
                            <FaEye />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Basic Info */}
                <div>
                  <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                    Основная информация
                  </h3>
                  <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-gap-4">
                    <div>
                      <span className="ode-text-sm ode-text-gray">Название</span>
                      <p className="ode-text-charcoal">{selectedProperty.name}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Адрес</span>
                      <p className="ode-text-charcoal">{selectedProperty.address}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Тип</span>
                      <p className="ode-text-charcoal">{getTypeText(selectedProperty.type)}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Статус</span>
                      <p 
                        className="ode-font-medium"
                        style={{ color: getStatusColor(selectedProperty.status) }}
                      >
                        {getStatusText(selectedProperty.status)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div>
                  <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                    Характеристики
                  </h3>
                  <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-lg-grid-3 ode-gap-4">
                    <div>
                      <span className="ode-text-sm ode-text-gray">Площадь</span>
                      <p className="ode-text-charcoal">{selectedProperty.size} м²</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Цена</span>
                      <p className="ode-text-charcoal">₽{selectedProperty.price.toLocaleString()}/мес</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Этаж</span>
                      <p className="ode-text-charcoal">{selectedProperty.floor}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Комнаты</span>
                      <p className="ode-text-charcoal">{selectedProperty.rooms}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Санузлы</span>
                      <p className="ode-text-charcoal">{selectedProperty.bathrooms}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Парковка</span>
                      <p className="ode-text-charcoal">{selectedProperty.parking} мест</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Год постройки</span>
                      <p className="ode-text-charcoal">{selectedProperty.yearBuilt}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Район</span>
                      <p className="ode-text-charcoal">{selectedProperty.location.district}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Метро</span>
                      <p className="ode-text-charcoal">{selectedProperty.location.metro}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                    Описание
                  </h3>
                  <p className="ode-text-charcoal">{selectedProperty.description}</p>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                    Удобства
                  </h3>
                  <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-lg-grid-3 ode-gap-4">
                    {selectedProperty.amenities.map((amenity, index) => {
                      const Icon = getAmenityIcon(amenity)
                      return (
                        <div key={index} className="ode-flex ode-items-center ode-gap-2">
                          <Icon className="ode-text-gray-400" />
                          <span className="ode-text-sm ode-text-charcoal">{amenity}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Features */}
                {selectedProperty.features && selectedProperty.features.length > 0 && (
                  <div>
                    <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                      Особенности
                    </h3>
                    <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-lg-grid-3 ode-gap-4">
                      {selectedProperty.features.map((feature, index) => (
                        <div key={index} className="ode-flex ode-items-center ode-gap-2">
                          <FaCheckCircle className="ode-text-green-500" />
                          <span className="ode-text-sm ode-text-charcoal">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Availability */}
                <div>
                  <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                    Доступность
                  </h3>
                  <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-gap-4">
                    <div>
                      <span className="ode-text-sm ode-text-gray">Период доступности</span>
                      <p className="ode-text-charcoal">
                        {formatDate(selectedProperty.availability.startDate)} - {formatDate(selectedProperty.availability.endDate)}
                      </p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Статус доступности</span>
                      <p className="ode-text-charcoal">
                        {selectedProperty.availability.isAvailable ? 'Доступен' : 'Недоступен'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                    Расположение
                  </h3>
                  <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-gap-4">
                    <div>
                      <span className="ode-text-sm ode-text-gray">Координаты</span>
                      <p className="ode-text-charcoal">
                        {selectedProperty.location.latitude}, {selectedProperty.location.longitude}
                      </p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Ближайшее метро</span>
                      <p className="ode-text-charcoal">{selectedProperty.location.metro}</p>
                    </div>
                  </div>
                  <div className="ode-mt-4">
                    <button className="ode-btn ode-btn-secondary ode-btn-sm">
                      <FaMap className="ode-mr-2" />
                      Показать на карте
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PropertyInventoryPage
