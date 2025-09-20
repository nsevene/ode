import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { 
  FaSearch, FaFilter, FaEye, FaCheck, FaTimes, FaClock, FaUser, 
  FaBuilding, FaCalendar, FaDollarSign, FaFileAlt, FaEnvelope,
  FaPhone, FaMapMarkerAlt, FaDownload, FaSortAmountDown, FaSortAmountUp,
  FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaSpinner
} from 'react-icons/fa'
import AdminNavigation from '../../components/admin/AdminNavigation'
import { adminApi, type AdminTenantApplication } from '../../lib/api/admin'

const TenantApplicationsPage: React.FC = () => {
  const { t } = useTranslation('common')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [applications, setApplications] = useState<AdminTenantApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<AdminTenantApplication | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await adminApi.getTenantApplications()
        setApplications(data)
      } catch (error) {
        console.error('Error fetching tenant applications:', error)
        // Fallback to mock data
        setApplications([
          {
            id: '1',
            fullName: 'Александр Иванов',
            email: 'ivanov@example.com',
            phone: '+7 (999) 123-45-67',
            companyName: 'ООО "ТехноИнновации"',
            businessType: 'IT',
            desiredArea: 150,
            budget: 500000,
            leaseTerm: 24,
            businessDescription: 'Разработка программного обеспечения для корпоративных клиентов',
            additionalRequirements: 'Парковка для 10 автомобилей, конференц-зал',
            status: 'pending',
            priority: 'medium',
            submittedAt: '2024-12-20T10:00:00Z',
            reviewedAt: null,
            reviewedBy: null,
            notes: '',
            documents: ['business_plan.pdf', 'financial_statements.pdf'],
            propertyPreferences: ['office', 'retail'],
            locationPreferences: ['Москва, центр', 'Москва, САО']
          },
          {
            id: '2',
            fullName: 'Мария Петрова',
            email: 'petrova@example.com',
            phone: '+7 (999) 234-56-78',
            companyName: 'ИП Петрова М.А.',
            businessType: 'retail',
            desiredArea: 80,
            budget: 200000,
            leaseTerm: 12,
            businessDescription: 'Продажа экологически чистых продуктов',
            additionalRequirements: 'Витринные окна, складское помещение',
            status: 'approved',
            priority: 'high',
            submittedAt: '2024-12-19T14:30:00Z',
            reviewedAt: '2024-12-19T16:45:00Z',
            reviewedBy: 'admin@example.com',
            notes: 'Отличная заявка, соответствует нашим требованиям',
            documents: ['business_plan.pdf', 'certificates.pdf'],
            propertyPreferences: ['retail'],
            locationPreferences: ['Москва, центр']
          },
          {
            id: '3',
            fullName: 'Дмитрий Сидоров',
            email: 'sidorov@example.com',
            phone: '+7 (999) 345-67-89',
            companyName: 'ООО "ЛогистикПро"',
            businessType: 'warehouse',
            desiredArea: 500,
            budget: 300000,
            leaseTerm: 36,
            businessDescription: 'Логистические услуги и складское хранение',
            additionalRequirements: 'Железнодорожная ветка, погрузочные рампы',
            status: 'rejected',
            priority: 'low',
            submittedAt: '2024-12-18T09:15:00Z',
            reviewedAt: '2024-12-18T11:20:00Z',
            reviewedBy: 'admin@example.com',
            notes: 'Не подходит по требованиям безопасности',
            documents: ['business_plan.pdf'],
            propertyPreferences: ['warehouse'],
            locationPreferences: ['Московская область']
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    const matchesType = typeFilter === 'all' || app.businessType === typeFilter
    return matchesSearch && matchesStatus && matchesType
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      case 'oldest':
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case 'status':
        return a.status.localeCompare(b.status)
      default:
        return 0
    }
  })

  const handleApprove = async (applicationId: string) => {
    try {
      setProcessing(applicationId)
      await adminApi.approveTenantApplication(applicationId, 'Заявка одобрена администратором')
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: 'approved', reviewedAt: new Date().toISOString(), reviewedBy: 'current_admin' }
          : app
      ))
      alert('Заявка успешно одобрена')
    } catch (error) {
      console.error('Error approving application:', error)
      alert('Ошибка при одобрении заявки')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (applicationId: string) => {
    const reason = prompt('Укажите причину отклонения:')
    if (!reason) return

    try {
      setProcessing(applicationId)
      await adminApi.rejectTenantApplication(applicationId, reason)
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: 'rejected', reviewedAt: new Date().toISOString(), reviewedBy: 'current_admin', notes: reason }
          : app
      ))
      alert('Заявка отклонена')
    } catch (error) {
      console.error('Error rejecting application:', error)
      alert('Ошибка при отклонении заявки')
    } finally {
      setProcessing(null)
    }
  }

  const handleViewDetails = (application: AdminTenantApplication) => {
    setSelectedApplication(application)
    setShowDetails(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b'
      case 'approved': return '#16a34a'
      case 'rejected': return '#dc2626'
      case 'under_review': return '#2563eb'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает рассмотрения'
      case 'approved': return 'Одобрена'
      case 'rejected': return 'Отклонена'
      case 'under_review': return 'На рассмотрении'
      default: return 'Неизвестно'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#dc2626'
      case 'medium': return '#f59e0b'
      case 'low': return '#16a34a'
      default: return '#6b7280'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Высокий'
      case 'medium': return 'Средний'
      case 'low': return 'Низкий'
      default: return 'Неизвестно'
    }
  }

  const getBusinessTypeText = (type: string) => {
    switch (type) {
      case 'IT': return 'IT'
      case 'retail': return 'Розничная торговля'
      case 'warehouse': return 'Складское хозяйство'
      case 'office': return 'Офисные услуги'
      case 'restaurant': return 'Ресторанный бизнес'
      default: return type
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      <Helmet>
        <title>{t('admin.tenant_applications.title', 'Управление заявками арендаторов')} - ODPortal B2B</title>
        <meta name="description" content={t('admin.tenant_applications.description', 'Управление заявками арендаторов на аренду недвижимости')} />
      </Helmet>
      
      <div className="ode-bg-gray" style={{ minHeight: '100vh', padding: '32px 0' }}>
        <div className="ode-container">
          <div className="ode-dashboard-layout">
            <AdminNavigation />
            
            <div className="ode-dashboard-content">
              <div className="ode-dashboard-header">
                <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-2">
                  {t('admin.tenant_applications.heading', 'Управление заявками арендаторов')}
                </h1>
                <p className="ode-text-gray">
                  {t('admin.tenant_applications.description', 'Рассмотрение и управление заявками на аренду недвижимости')}
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
                        placeholder="Имя, email, компания..."
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
                      <option value="pending">Ожидает рассмотрения</option>
                      <option value="under_review">На рассмотрении</option>
                      <option value="approved">Одобрена</option>
                      <option value="rejected">Отклонена</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Тип бизнеса</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary"
                    >
                      <option value="all">Все типы</option>
                      <option value="IT">IT</option>
                      <option value="retail">Розничная торговля</option>
                      <option value="warehouse">Складское хозяйство</option>
                      <option value="office">Офисные услуги</option>
                      <option value="restaurant">Ресторанный бизнес</option>
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
                      <option value="priority">По приоритету</option>
                      <option value="status">По статусу</option>
                    </select>
                  </div>
                </div>
                
                <div className="ode-flex ode-justify-between ode-items-center">
                  <div className="ode-flex ode-items-center ode-gap-4">
                    <span className="ode-text-sm ode-text-gray">
                      Найдено: {filteredApplications.length} заявок
                    </span>
                    <span className="ode-text-sm ode-text-gray">
                      Ожидают: {applications.filter(app => app.status === 'pending').length}
                    </span>
                  </div>
                  
                  <div className="ode-flex ode-items-center ode-gap-2">
                    <button className="ode-btn ode-btn-secondary ode-btn-sm">
                      <FaDownload className="ode-mr-2" />
                      Экспорт
                    </button>
                  </div>
                </div>
              </div>

              {/* Applications List */}
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
                  filteredApplications.map((application) => (
                    <div key={application.id} className="ode-card ode-hover-shadow ode-transition">
                      <div className="ode-p-6">
                        <div className="ode-flex ode-items-start ode-justify-between ode-mb-4">
                          <div className="ode-flex ode-items-center ode-gap-4">
                            <div className="ode-w-12 ode-h-12 ode-bg-primary ode-rounded-full ode-flex ode-items-center ode-justify-center">
                              <FaUser className="ode-text-white ode-text-xl" />
                            </div>
                            <div>
                              <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal">
                                {application.fullName}
                              </h3>
                              <p className="ode-text-sm ode-text-gray">{application.companyName}</p>
                              <div className="ode-flex ode-items-center ode-gap-2 ode-mt-1">
                                <span 
                                  className="ode-badge"
                                  style={{
                                    backgroundColor: getStatusColor(application.status) + '20',
                                    color: getStatusColor(application.status)
                                  }}
                                >
                                  {getStatusText(application.status)}
                                </span>
                                <span 
                                  className="ode-badge"
                                  style={{
                                    backgroundColor: getPriorityColor(application.priority) + '20',
                                    color: getPriorityColor(application.priority)
                                  }}
                                >
                                  {getPriorityText(application.priority)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="ode-flex ode-items-center ode-gap-2">
                            {application.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(application.id)}
                                  disabled={processing === application.id}
                                  className="ode-btn ode-btn-success ode-btn-sm"
                                >
                                  {processing === application.id ? (
                                    <FaSpinner className="ode-animate-spin" />
                                  ) : (
                                    <FaCheck />
                                  )}
                                  Одобрить
                                </button>
                                <button
                                  onClick={() => handleReject(application.id)}
                                  disabled={processing === application.id}
                                  className="ode-btn ode-btn-danger ode-btn-sm"
                                >
                                  <FaTimes />
                                  Отклонить
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleViewDetails(application)}
                              className="ode-btn ode-btn-secondary ode-btn-sm"
                            >
                              <FaEye />
                              Подробнее
                            </button>
                          </div>
                        </div>
                        
                        <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-lg-grid-4 ode-gap-4 ode-mb-4">
                          <div className="ode-flex ode-items-center ode-gap-2">
                            <FaEnvelope className="ode-text-gray-400" />
                            <span className="ode-text-sm ode-text-gray">{application.email}</span>
                          </div>
                          <div className="ode-flex ode-items-center ode-gap-2">
                            <FaPhone className="ode-text-gray-400" />
                            <span className="ode-text-sm ode-text-gray">{application.phone}</span>
                          </div>
                          <div className="ode-flex ode-items-center ode-gap-2">
                            <FaBuilding className="ode-text-gray-400" />
                            <span className="ode-text-sm ode-text-gray">{getBusinessTypeText(application.businessType)}</span>
                          </div>
                          <div className="ode-flex ode-items-center ode-gap-2">
                            <FaDollarSign className="ode-text-gray-400" />
                            <span className="ode-text-sm ode-text-gray">₽{application.budget.toLocaleString()}/мес</span>
                          </div>
                        </div>
                        
                        <div className="ode-grid ode-grid-1 ode-md-grid-3 ode-gap-4 ode-mb-4">
                          <div>
                            <span className="ode-text-xs ode-text-gray">Желаемая площадь</span>
                            <p className="ode-text-sm ode-font-medium ode-text-charcoal">
                              {application.desiredArea} м²
                            </p>
                          </div>
                          <div>
                            <span className="ode-text-xs ode-text-gray">Срок аренды</span>
                            <p className="ode-text-sm ode-font-medium ode-text-charcoal">
                              {application.leaseTerm} мес.
                            </p>
                          </div>
                          <div>
                            <span className="ode-text-xs ode-text-gray">Подана</span>
                            <p className="ode-text-sm ode-font-medium ode-text-charcoal">
                              {formatDate(application.submittedAt)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="ode-mb-4">
                          <span className="ode-text-xs ode-text-gray">Описание бизнеса</span>
                          <p className="ode-text-sm ode-text-charcoal ode-line-clamp-2">
                            {application.businessDescription}
                          </p>
                        </div>
                        
                        {application.additionalRequirements && (
                          <div className="ode-mb-4">
                            <span className="ode-text-xs ode-text-gray">Дополнительные требования</span>
                            <p className="ode-text-sm ode-text-charcoal">
                              {application.additionalRequirements}
                            </p>
                          </div>
                        )}
                        
                        <div className="ode-flex ode-items-center ode-justify-between">
                          <div className="ode-flex ode-items-center ode-gap-4">
                            <div className="ode-flex ode-items-center ode-gap-1">
                              <FaFileAlt className="ode-text-gray-400" />
                              <span className="ode-text-sm ode-text-gray">
                                {application.documents.length} документов
                              </span>
                            </div>
                            <div className="ode-flex ode-items-center ode-gap-1">
                              <FaMapMarkerAlt className="ode-text-gray-400" />
                              <span className="ode-text-sm ode-text-gray">
                                {application.locationPreferences.join(', ')}
                              </span>
                            </div>
                          </div>
                          
                          {application.reviewedAt && (
                            <div className="ode-text-right">
                              <span className="ode-text-xs ode-text-gray">Рассмотрена</span>
                              <p className="ode-text-sm ode-font-medium ode-text-charcoal">
                                {formatDate(application.reviewedAt)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {!loading && filteredApplications.length === 0 && (
                <div className="ode-text-center" style={{ padding: '48px 0' }}>
                  <FaFileAlt className="ode-text-6xl ode-text-gray-300 ode-mb-4" />
                  <h3 className="ode-text-xl ode-font-semibold ode-text-gray ode-mb-2">
                    Заявки не найдены
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

      {/* Application Details Modal */}
      {showDetails && selectedApplication && (
        <div className="ode-fixed ode-inset-0 ode-bg-black ode-bg-opacity-50 ode-flex ode-items-center ode-justify-center ode-z-50">
          <div className="ode-bg-white ode-rounded-lg ode-shadow-xl ode-max-w-4xl ode-w-full ode-mx-4 ode-max-h-[90vh] ode-overflow-hidden">
            <div className="ode-flex ode-items-center ode-justify-between ode-p-6 ode-border-b">
              <h2 className="ode-text-2xl ode-font-bold ode-text-charcoal">
                Детали заявки
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
                {/* Applicant Info */}
                <div>
                  <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                    Информация о заявителе
                  </h3>
                  <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-gap-4">
                    <div>
                      <span className="ode-text-sm ode-text-gray">Полное имя</span>
                      <p className="ode-text-charcoal">{selectedApplication.fullName}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Email</span>
                      <p className="ode-text-charcoal">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Телефон</span>
                      <p className="ode-text-charcoal">{selectedApplication.phone}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Компания</span>
                      <p className="ode-text-charcoal">{selectedApplication.companyName}</p>
                    </div>
                  </div>
                </div>

                {/* Business Info */}
                <div>
                  <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                    Информация о бизнесе
                  </h3>
                  <div className="ode-space-y-4">
                    <div>
                      <span className="ode-text-sm ode-text-gray">Тип бизнеса</span>
                      <p className="ode-text-charcoal">{getBusinessTypeText(selectedApplication.businessType)}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Описание бизнеса</span>
                      <p className="ode-text-charcoal">{selectedApplication.businessDescription}</p>
                    </div>
                    {selectedApplication.additionalRequirements && (
                      <div>
                        <span className="ode-text-sm ode-text-gray">Дополнительные требования</span>
                        <p className="ode-text-charcoal">{selectedApplication.additionalRequirements}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                    Требования к недвижимости
                  </h3>
                  <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-gap-4">
                    <div>
                      <span className="ode-text-sm ode-text-gray">Желаемая площадь</span>
                      <p className="ode-text-charcoal">{selectedApplication.desiredArea} м²</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Бюджет</span>
                      <p className="ode-text-charcoal">₽{selectedApplication.budget.toLocaleString()}/мес</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Срок аренды</span>
                      <p className="ode-text-charcoal">{selectedApplication.leaseTerm} мес.</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Предпочтения по типу</span>
                      <p className="ode-text-charcoal">{selectedApplication.propertyPreferences.join(', ')}</p>
                    </div>
                  </div>
                  <div className="ode-mt-4">
                    <span className="ode-text-sm ode-text-gray">Предпочтения по локации</span>
                    <p className="ode-text-charcoal">{selectedApplication.locationPreferences.join(', ')}</p>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                    Документы
                  </h3>
                  <div className="ode-space-y-2">
                    {selectedApplication.documents.map((doc, index) => (
                      <div key={index} className="ode-flex ode-items-center ode-justify-between ode-p-3 ode-bg-gray-50 ode-rounded-lg">
                        <div className="ode-flex ode-items-center ode-gap-2">
                          <FaFileAlt className="ode-text-gray-400" />
                          <span className="ode-text-sm ode-text-charcoal">{doc}</span>
                        </div>
                        <button className="ode-btn ode-btn-secondary ode-btn-sm">
                          <FaDownload />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status and Notes */}
                <div>
                  <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                    Статус и заметки
                  </h3>
                  <div className="ode-space-y-4">
                    <div>
                      <span className="ode-text-sm ode-text-gray">Статус</span>
                      <p 
                        className="ode-font-medium"
                        style={{ color: getStatusColor(selectedApplication.status) }}
                      >
                        {getStatusText(selectedApplication.status)}
                      </p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Приоритет</span>
                      <p 
                        className="ode-font-medium"
                        style={{ color: getPriorityColor(selectedApplication.priority) }}
                      >
                        {getPriorityText(selectedApplication.priority)}
                      </p>
                    </div>
                    {selectedApplication.reviewedAt && (
                      <div>
                        <span className="ode-text-sm ode-text-gray">Рассмотрена</span>
                        <p className="ode-text-charcoal">{formatDate(selectedApplication.reviewedAt)}</p>
                      </div>
                    )}
                    {selectedApplication.reviewedBy && (
                      <div>
                        <span className="ode-text-sm ode-text-gray">Рассмотрена кем</span>
                        <p className="ode-text-charcoal">{selectedApplication.reviewedBy}</p>
                      </div>
                    )}
                    {selectedApplication.notes && (
                      <div>
                        <span className="ode-text-sm ode-text-gray">Заметки</span>
                        <p className="ode-text-charcoal">{selectedApplication.notes}</p>
                      </div>
                    )}
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

export default TenantApplicationsPage
