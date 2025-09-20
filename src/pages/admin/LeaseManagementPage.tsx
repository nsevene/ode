import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { 
  FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaPlus, FaCalendar, 
  FaUser, FaBuilding, FaDollarSign, FaFileAlt, FaEnvelope, FaPhone,
  FaMapMarkerAlt, FaDownload, FaSortAmountDown, FaSortAmountUp,
  FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaSpinner,
  FaClock, FaSignature, FaCopy, FaHistory
} from 'react-icons/fa'
import AdminNavigation from '../../components/admin/AdminNavigation'
import { adminApi, type AdminLease } from '../../lib/api/admin'

const LeaseManagementPage: React.FC = () => {
  const { t } = useTranslation('common')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [propertyFilter, setPropertyFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [leases, setLeases] = useState<AdminLease[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLease, setSelectedLease] = useState<AdminLease | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeases = async () => {
      try {
        const data = await adminApi.getLeases()
        setLeases(data)
      } catch (error) {
        console.error('Error fetching leases:', error)
        // Fallback to mock data
        setLeases([
          {
            id: '1',
            tenantName: 'Александр Иванов',
            tenantEmail: 'ivanov@example.com',
            tenantPhone: '+7 (999) 123-45-67',
            propertyName: 'Бизнес-центр "Солнечный"',
            propertyAddress: 'Москва, ул. Тверская, 15',
            startDate: '2024-01-01',
            endDate: '2026-01-01',
            monthlyRent: 500000,
            deposit: 1000000,
            status: 'active',
            leaseType: 'commercial',
            area: 150,
            terms: 'Стандартный договор аренды офисного помещения',
            specialConditions: 'Парковка для 5 автомобилей включена',
            documents: ['lease_agreement.pdf', 'insurance_certificate.pdf'],
            paymentHistory: [
              { date: '2024-12-01', amount: 500000, status: 'paid' },
              { date: '2024-11-01', amount: 500000, status: 'paid' },
              { date: '2024-10-01', amount: 500000, status: 'paid' }
            ],
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-12-20T10:00:00Z'
          },
          {
            id: '2',
            tenantName: 'Мария Петрова',
            tenantEmail: 'petrova@example.com',
            tenantPhone: '+7 (999) 234-56-78',
            propertyName: 'Торговый центр "Мега"',
            propertyAddress: 'Москва, ул. Арбат, 25',
            startDate: '2024-03-01',
            endDate: '2025-03-01',
            monthlyRent: 200000,
            deposit: 400000,
            status: 'active',
            leaseType: 'retail',
            area: 80,
            terms: 'Договор аренды торгового помещения',
            specialConditions: 'Витринные окна, складское помещение',
            documents: ['lease_agreement.pdf', 'business_license.pdf'],
            paymentHistory: [
              { date: '2024-12-01', amount: 200000, status: 'paid' },
              { date: '2024-11-01', amount: 200000, status: 'paid' },
              { date: '2024-10-01', amount: 200000, status: 'paid' }
            ],
            createdAt: '2024-03-01T10:00:00Z',
            updatedAt: '2024-12-20T10:00:00Z'
          },
          {
            id: '3',
            tenantName: 'Дмитрий Сидоров',
            tenantEmail: 'sidorov@example.com',
            tenantPhone: '+7 (999) 345-67-89',
            propertyName: 'Складской комплекс "Логистик"',
            propertyAddress: 'Московская область, г. Химки',
            startDate: '2024-06-01',
            endDate: '2027-06-01',
            monthlyRent: 300000,
            deposit: 600000,
            status: 'expired',
            leaseType: 'warehouse',
            area: 500,
            terms: 'Договор аренды складского помещения',
            specialConditions: 'Железнодорожная ветка, погрузочные рампы',
            documents: ['lease_agreement.pdf', 'safety_certificate.pdf'],
            paymentHistory: [
              { date: '2024-11-01', amount: 300000, status: 'paid' },
              { date: '2024-10-01', amount: 300000, status: 'paid' },
              { date: '2024-09-01', amount: 300000, status: 'overdue' }
            ],
            createdAt: '2024-06-01T10:00:00Z',
            updatedAt: '2024-12-20T10:00:00Z'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchLeases()
  }, [])

  const filteredLeases = leases.filter(lease => {
    const matchesSearch = lease.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lease.tenantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lease.propertyName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || lease.status === statusFilter
    const matchesProperty = propertyFilter === 'all' || lease.propertyName === propertyFilter
    return matchesSearch && matchesStatus && matchesProperty
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'rent_high':
        return b.monthlyRent - a.monthlyRent
      case 'rent_low':
        return a.monthlyRent - b.monthlyRent
      case 'end_date':
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      default:
        return 0
    }
  })

  const handleViewDetails = (lease: AdminLease) => {
    setSelectedLease(lease)
    setShowDetails(true)
  }

  const handleEditLease = (lease: AdminLease) => {
    setSelectedLease(lease)
    setShowDetails(true)
  }

  const handleDeleteLease = async (leaseId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот договор аренды?')) return

    try {
      setProcessing(leaseId)
      await adminApi.deleteLease(leaseId)
      setLeases(prev => prev.filter(lease => lease.id !== leaseId))
      alert('Договор аренды успешно удален')
    } catch (error) {
      console.error('Error deleting lease:', error)
      alert('Ошибка при удалении договора аренды')
    } finally {
      setProcessing(null)
    }
  }

  const handleRenewLease = async (leaseId: string) => {
    const newEndDate = prompt('Введите новую дату окончания (YYYY-MM-DD):')
    if (!newEndDate) return

    try {
      setProcessing(leaseId)
      await adminApi.renewLease(leaseId, newEndDate)
      setLeases(prev => prev.map(lease => 
        lease.id === leaseId 
          ? { ...lease, endDate: newEndDate, status: 'active', updatedAt: new Date().toISOString() }
          : lease
      ))
      alert('Договор аренды успешно продлен')
    } catch (error) {
      console.error('Error renewing lease:', error)
      alert('Ошибка при продлении договора аренды')
    } finally {
      setProcessing(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#16a34a'
      case 'expired': return '#dc2626'
      case 'terminated': return '#6b7280'
      case 'pending': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активный'
      case 'expired': return 'Истек'
      case 'terminated': return 'Расторгнут'
      case 'pending': return 'Ожидает подписания'
      default: return 'Неизвестно'
    }
  }

  const getLeaseTypeText = (type: string) => {
    switch (type) {
      case 'commercial': return 'Коммерческая'
      case 'retail': return 'Торговая'
      case 'warehouse': return 'Складская'
      case 'office': return 'Офисная'
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

  const getDaysUntilExpiry = (endDate: string) => {
    const today = new Date()
    const expiry = new Date(endDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#16a34a'
      case 'overdue': return '#dc2626'
      case 'pending': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Оплачено'
      case 'overdue': return 'Просрочено'
      case 'pending': return 'Ожидает оплаты'
      default: return 'Неизвестно'
    }
  }

  return (
    <>
      <Helmet>
        <title>{t('admin.lease_management.title', 'Управление договорами аренды')} - ODPortal B2B</title>
        <meta name="description" content={t('admin.lease_management.description', 'Управление договорами аренды недвижимости')} />
      </Helmet>
      
      <div className="ode-bg-gray" style={{ minHeight: '100vh', padding: '32px 0' }}>
        <div className="ode-container">
          <div className="ode-dashboard-layout">
            <AdminNavigation />
            
            <div className="ode-dashboard-content">
              <div className="ode-dashboard-header">
                <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-2">
                  {t('admin.lease_management.heading', 'Управление договорами аренды')}
                </h1>
                <p className="ode-text-gray">
                  {t('admin.lease_management.description', 'Управление договорами аренды недвижимости')}
                </p>
              </div>

              {/* Filters and Search */}
              <div className="ode-card ode-mb-6">
                <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-lg-grid-4 ode-gap-4 ode-mb-4">
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Поиск</label>
                    <div className="ode-relative">
                      <FaSearch className="ode-absolute ode-left-3 ode-top-1/2 ode-transform ode--translate-y-1/2 ode-text-gray-400" />
                      <input
                        type="text"
                        placeholder="Арендатор, email, объект..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="ode-w-full ode-pl-10 ode-pr-4 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary ode-focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Статус</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary"
                    >
                      <option value="all">Все статусы</option>
                      <option value="active">Активные</option>
                      <option value="expired">Истекшие</option>
                      <option value="terminated">Расторгнутые</option>
                      <option value="pending">Ожидают подписания</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Объект</label>
                    <select
                      value={propertyFilter}
                      onChange={(e) => setPropertyFilter(e.target.value)}
                      className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary"
                    >
                      <option value="all">Все объекты</option>
                      {leases.map(lease => (
                        <option key={lease.id} value={lease.propertyName}>
                          {lease.propertyName}
                        </option>
                      ))}
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
                      <option value="rent_high">Аренда ↓</option>
                      <option value="rent_low">Аренда ↑</option>
                      <option value="end_date">По дате окончания</option>
                    </select>
                  </div>
                </div>
                
                <div className="ode-flex ode-justify-between ode-items-center">
                  <div className="ode-flex ode-items-center ode-gap-4">
                    <span className="ode-text-sm ode-text-gray">
                      Найдено: {filteredLeases.length} договоров
                    </span>
                    <span className="ode-text-sm ode-text-gray">
                      Активных: {leases.filter(lease => lease.status === 'active').length}
                    </span>
                    <span className="ode-text-sm ode-text-gray">
                      Истекающих: {leases.filter(lease => {
                        const days = getDaysUntilExpiry(lease.endDate)
                        return days <= 30 && days > 0
                      }).length}
                    </span>
                  </div>
                  
                  <div className="ode-flex ode-items-center ode-gap-2">
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="ode-btn ode-btn-primary ode-btn-sm"
                    >
                      <FaPlus className="ode-mr-2" />
                      Создать договор
                    </button>
                    <button className="ode-btn ode-btn-secondary ode-btn-sm">
                      <FaDownload className="ode-mr-2" />
                      Экспорт
                    </button>
                  </div>
                </div>
              </div>

              {/* Leases List */}
              <div className="ode-space-y-4">
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="ode-card">
                      <div className="ode-animate-pulse">
                        <div className="ode-h-6 ode-bg-gray-200 ode-rounded ode-mb-2"></div>
                        <div className="ode-h-4 ode-bg-gray-200 ode-rounded ode-mb-4"></div>
                        <div className="ode-h-4 ode-bg-gray-200 ode-rounded ode-w-1/2"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  filteredLeases.map((lease) => {
                    const daysUntilExpiry = getDaysUntilExpiry(lease.endDate)
                    const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0
                    
                    return (
                      <div key={lease.id} className="ode-card ode-hover-shadow ode-transition">
                        <div className="ode-p-6">
                          <div className="ode-flex ode-items-start ode-justify-between ode-mb-4">
                            <div className="ode-flex ode-items-center ode-gap-4">
                              <div className="ode-w-12 ode-h-12 ode-bg-primary ode-rounded-full ode-flex ode-items-center ode-justify-center">
                                <FaFileAlt className="ode-text-white ode-text-xl" />
                              </div>
                              <div>
                                <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal">
                                  {lease.tenantName}
                                </h3>
                                <p className="ode-text-sm ode-text-gray">{lease.propertyName}</p>
                                <div className="ode-flex ode-items-center ode-gap-2 ode-mt-1">
                                  <span 
                                    className="ode-badge"
                                    style={{
                                      backgroundColor: getStatusColor(lease.status) + '20',
                                      color: getStatusColor(lease.status)
                                    }}
                                  >
                                    {getStatusText(lease.status)}
                                  </span>
                                  <span className="ode-badge ode-bg-blue-100 ode-text-blue-800">
                                    {getLeaseTypeText(lease.leaseType)}
                                  </span>
                                  {isExpiringSoon && (
                                    <span className="ode-badge ode-bg-warning ode-text-white">
                                      Истекает через {daysUntilExpiry} дн.
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="ode-flex ode-items-center ode-gap-2">
                              <button
                                onClick={() => handleViewDetails(lease)}
                                className="ode-btn ode-btn-secondary ode-btn-sm"
                              >
                                <FaEye />
                                Подробнее
                              </button>
                              <button
                                onClick={() => handleEditLease(lease)}
                                className="ode-btn ode-btn-primary ode-btn-sm"
                              >
                                <FaEdit />
                                Редактировать
                              </button>
                              {lease.status === 'active' && (
                                <button
                                  onClick={() => handleRenewLease(lease.id)}
                                  disabled={processing === lease.id}
                                  className="ode-btn ode-btn-success ode-btn-sm"
                                >
                                  {processing === lease.id ? (
                                    <FaSpinner className="ode-animate-spin" />
                                  ) : (
                                    <FaClock />
                                  )}
                                  Продлить
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteLease(lease.id)}
                                disabled={processing === lease.id}
                                className="ode-btn ode-btn-danger ode-btn-sm"
                              >
                                {processing === lease.id ? (
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
                              <FaEnvelope className="ode-text-gray-400" />
                              <span className="ode-text-sm ode-text-gray">{lease.tenantEmail}</span>
                            </div>
                            <div className="ode-flex ode-items-center ode-gap-2">
                              <FaPhone className="ode-text-gray-400" />
                              <span className="ode-text-sm ode-text-gray">{lease.tenantPhone}</span>
                            </div>
                            <div className="ode-flex ode-items-center ode-gap-2">
                              <FaMapMarkerAlt className="ode-text-gray-400" />
                              <span className="ode-text-sm ode-text-gray">{lease.propertyAddress}</span>
                            </div>
                            <div className="ode-flex ode-items-center ode-gap-2">
                              <FaDollarSign className="ode-text-gray-400" />
                              <span className="ode-text-sm ode-text-gray">₽{lease.monthlyRent.toLocaleString()}/мес</span>
                            </div>
                          </div>
                          
                          <div className="ode-grid ode-grid-1 ode-md-grid-3 ode-gap-4 ode-mb-4">
                            <div>
                              <span className="ode-text-xs ode-text-gray">Площадь</span>
                              <p className="ode-text-sm ode-font-medium ode-text-charcoal">
                                {lease.area} м²
                              </p>
                            </div>
                            <div>
                              <span className="ode-text-xs ode-text-gray">Период аренды</span>
                              <p className="ode-text-sm ode-font-medium ode-text-charcoal">
                                {formatDate(lease.startDate)} - {formatDate(lease.endDate)}
                              </p>
                            </div>
                            <div>
                              <span className="ode-text-xs ode-text-gray">Залог</span>
                              <p className="ode-text-sm ode-font-medium ode-text-charcoal">
                                ₽{lease.deposit.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="ode-mb-4">
                            <span className="ode-text-xs ode-text-gray">Условия договора</span>
                            <p className="ode-text-sm ode-text-charcoal ode-line-clamp-2">
                              {lease.terms}
                            </p>
                          </div>
                          
                          {lease.specialConditions && (
                            <div className="ode-mb-4">
                              <span className="ode-text-xs ode-text-gray">Особые условия</span>
                              <p className="ode-text-sm ode-text-charcoal">
                                {lease.specialConditions}
                              </p>
                            </div>
                          )}
                          
                          <div className="ode-flex ode-items-center ode-justify-between">
                            <div className="ode-flex ode-items-center ode-gap-4">
                              <div className="ode-flex ode-items-center ode-gap-1">
                                <FaFileAlt className="ode-text-gray-400" />
                                <span className="ode-text-sm ode-text-gray">
                                  {lease.documents.length} документов
                                </span>
                              </div>
                              <div className="ode-flex ode-items-center ode-gap-1">
                                <FaHistory className="ode-text-gray-400" />
                                <span className="ode-text-sm ode-text-gray">
                                  {lease.paymentHistory.length} платежей
                                </span>
                              </div>
                            </div>
                            
                            <div className="ode-text-right">
                              <span className="ode-text-xs ode-text-gray">Обновлен</span>
                              <p className="ode-text-sm ode-font-medium ode-text-charcoal">
                                {formatDate(lease.updatedAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {!loading && filteredLeases.length === 0 && (
                <div className="ode-text-center" style={{ padding: '48px 0' }}>
                  <FaFileAlt className="ode-text-6xl ode-text-gray-300 ode-mb-4" />
                  <h3 className="ode-text-xl ode-font-semibold ode-text-gray ode-mb-2">
                    Договоры аренды не найдены
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

      {/* Lease Details Modal */}
      {showDetails && selectedLease && (
        <div className="ode-fixed ode-inset-0 ode-bg-black ode-bg-opacity-50 ode-flex ode-items-center ode-justify-center ode-z-50">
          <div className="ode-bg-white ode-rounded-lg ode-shadow-xl ode-max-w-6xl ode-w-full ode-mx-4 ode-max-h-[90vh] ode-overflow-hidden">
            <div className="ode-flex ode-items-center ode-justify-between ode-p-6 ode-border-b">
              <h2 className="ode-text-2xl ode-font-bold ode-text-charcoal">
                Детали договора аренды
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
                {/* Tenant Info */}
                <div>
                  <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                    Информация об арендаторе
                  </h3>
                  <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-gap-4">
                    <div>
                      <span className="ode-text-sm ode-text-gray">Имя</span>
                      <p className="ode-text-charcoal">{selectedLease.tenantName}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Email</span>
                      <p className="ode-text-charcoal">{selectedLease.tenantEmail}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Телефон</span>
                      <p className="ode-text-charcoal">{selectedLease.tenantPhone}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Статус</span>
                      <p 
                        className="ode-font-medium"
                        style={{ color: getStatusColor(selectedLease.status) }}
                      >
                        {getStatusText(selectedLease.status)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Property Info */}
                <div>
                  <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                    Информация об объекте
                  </h3>
                  <div className="ode-space-y-4">
                    <div>
                      <span className="ode-text-sm ode-text-gray">Название объекта</span>
                      <p className="ode-text-charcoal">{selectedLease.propertyName}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Адрес</span>
                      <p className="ode-text-charcoal">{selectedLease.propertyAddress}</p>
                    </div>
                    <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-gap-4">
                      <div>
                        <span className="ode-text-sm ode-text-gray">Площадь</span>
                        <p className="ode-text-charcoal">{selectedLease.area} м²</p>
                      </div>
                      <div>
                        <span className="ode-text-sm ode-text-gray">Тип аренды</span>
                        <p className="ode-text-charcoal">{getLeaseTypeText(selectedLease.leaseType)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lease Terms */}
                <div>
                  <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                    Условия договора
                  </h3>
                  <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-gap-4">
                    <div>
                      <span className="ode-text-sm ode-text-gray">Дата начала</span>
                      <p className="ode-text-charcoal">{formatDate(selectedLease.startDate)}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Дата окончания</span>
                      <p className="ode-text-charcoal">{formatDate(selectedLease.endDate)}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Ежемесячная аренда</span>
                      <p className="ode-text-charcoal">₽{selectedLease.monthlyRent.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Залог</span>
                      <p className="ode-text-charcoal">₽{selectedLease.deposit.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="ode-mt-4">
                    <span className="ode-text-sm ode-text-gray">Условия договора</span>
                    <p className="ode-text-charcoal">{selectedLease.terms}</p>
                  </div>
                  {selectedLease.specialConditions && (
                    <div className="ode-mt-4">
                      <span className="ode-text-sm ode-text-gray">Особые условия</span>
                      <p className="ode-text-charcoal">{selectedLease.specialConditions}</p>
                    </div>
                  )}
                </div>

                {/* Payment History */}
                <div>
                  <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                    История платежей
                  </h3>
                  <div className="ode-space-y-2">
                    {selectedLease.paymentHistory.map((payment, index) => (
                      <div key={index} className="ode-flex ode-items-center ode-justify-between ode-p-3 ode-bg-gray-50 ode-rounded-lg">
                        <div className="ode-flex ode-items-center ode-gap-3">
                          <FaCalendar className="ode-text-gray-400" />
                          <span className="ode-text-sm ode-text-charcoal">{formatDate(payment.date)}</span>
                          <span className="ode-text-sm ode-font-medium ode-text-charcoal">
                            ₽{payment.amount.toLocaleString()}
                          </span>
                        </div>
                        <span 
                          className="ode-badge"
                          style={{
                            backgroundColor: getPaymentStatusColor(payment.status) + '20',
                            color: getPaymentStatusColor(payment.status)
                          }}
                        >
                          {getPaymentStatusText(payment.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                    Документы
                  </h3>
                  <div className="ode-space-y-2">
                    {selectedLease.documents.map((doc, index) => (
                      <div key={index} className="ode-flex ode-items-center ode-justify-between ode-p-3 ode-bg-gray-50 ode-rounded-lg">
                        <div className="ode-flex ode-items-center ode-gap-2">
                          <FaFileAlt className="ode-text-gray-400" />
                          <span className="ode-text-sm ode-text-charcoal">{doc}</span>
                        </div>
                        <div className="ode-flex ode-items-center ode-gap-2">
                          <button className="ode-btn ode-btn-secondary ode-btn-sm">
                            <FaDownload />
                          </button>
                          <button className="ode-btn ode-btn-secondary ode-btn-sm">
                            <FaCopy />
                          </button>
                        </div>
                      </div>
                    ))}
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

export default LeaseManagementPage
