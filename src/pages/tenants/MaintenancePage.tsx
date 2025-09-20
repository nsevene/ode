import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { tenantApi, type TenantMaintenanceRequest } from '../../lib/api/tenant'
import { 
  FaWrench, FaPlus, FaEye, FaEdit, FaTrash, FaClock, FaCheckCircle, 
  FaExclamationTriangle, FaUser, FaCalendar, FaBuilding
} from 'react-icons/fa'

const MaintenancePage: React.FC = () => {
  const { t } = useTranslation('common')
  const [requests, setRequests] = useState<TenantMaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  })

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Mock tenant ID - в реальном приложении получать из auth
        const tenantId = 'tenant-1'
        const data = await tenantApi.getMaintenanceRequests(tenantId)
        setRequests(data)
      } catch (error) {
        console.error('Error fetching maintenance requests:', error)
        // Fallback to mock data
        const mockRequests: TenantMaintenanceRequest[] = [
          {
            id: '1',
            tenant_id: 'tenant-1',
            property_id: 'prop-1',
            title: 'Ремонт кондиционера',
            description: 'Кондиционер в офисе не работает, требуется диагностика и ремонт',
            priority: 'high',
            status: 'in_progress',
            created_at: '2024-12-15T10:00:00Z',
            assigned_to: 'maintenance-team-1'
          },
          {
            id: '2',
            tenant_id: 'tenant-1',
            property_id: 'prop-1',
            title: 'Замена лампочки',
            description: 'Перегорела лампочка в коридоре',
            priority: 'low',
            status: 'completed',
            created_at: '2024-12-10T14:30:00Z',
            completed_at: '2024-12-12T16:00:00Z',
            assigned_to: 'maintenance-team-1'
          },
          {
            id: '3',
            tenant_id: 'tenant-1',
            property_id: 'prop-1',
            title: 'Протечка в туалете',
            description: 'Обнаружена протечка воды в туалете на 2 этаже',
            priority: 'urgent',
            status: 'open',
            created_at: '2024-12-18T09:15:00Z'
          }
        ]
        setRequests(mockRequests)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true
    return request.status === filter
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#dc2626'
      case 'high': return '#f59e0b'
      case 'medium': return '#2563eb'
      case 'low': return '#16a34a'
      default: return '#6b7280'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Срочно'
      case 'high': return 'Высокий'
      case 'medium': return 'Средний'
      case 'low': return 'Низкий'
      default: return priority
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#f59e0b'
      case 'in_progress': return '#2563eb'
      case 'completed': return '#16a34a'
      case 'cancelled': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Открыта'
      case 'in_progress': return 'В работе'
      case 'completed': return 'Завершена'
      case 'cancelled': return 'Отменена'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return FaClock
      case 'in_progress': return FaWrench
      case 'completed': return FaCheckCircle
      case 'cancelled': return FaExclamationTriangle
      default: return FaClock
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

  const handleCreateRequest = async () => {
    try {
      const request = await tenantApi.createMaintenanceRequest({
        tenant_id: 'tenant-1',
        property_id: 'prop-1',
        title: newRequest.title,
        description: newRequest.description,
        priority: newRequest.priority,
        status: 'open'
      })
      
      setRequests(prev => [request, ...prev])
      setNewRequest({ title: '', description: '', priority: 'medium' })
      setShowCreateModal(false)
      alert('Заявка успешно создана!')
    } catch (error) {
      console.error('Error creating maintenance request:', error)
      alert('Ошибка при создании заявки')
    }
  }

  const handleUpdateRequest = async (id: string, updates: Partial<TenantMaintenanceRequest>) => {
    try {
      await tenantApi.updateMaintenanceRequest(id, updates)
      setRequests(prev => prev.map(req => 
        req.id === id ? { ...req, ...updates } : req
      ))
    } catch (error) {
      console.error('Error updating maintenance request:', error)
      alert('Ошибка при обновлении заявки')
    }
  }

  return (
    <>
      <Helmet>
        <title>{t('tenant.maintenance.title', 'Обслуживание')} - ODPortal B2B</title>
        <meta name="description" content={t('tenant.maintenance.description', 'Заявки на обслуживание и ремонт')} />
      </Helmet>

      <div className="ode-bg-gray" style={{ minHeight: '100vh', padding: '32px 0' }}>
        <div className="ode-container">
          {/* Header */}
          <div className="ode-dashboard-header">
            <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-2">
              {t('tenant.maintenance.heading', 'Обслуживание')}
            </h1>
            <p className="ode-text-gray">
              {t('tenant.maintenance.description', 'Заявки на обслуживание и ремонт')}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="ode-grid ode-grid-cols-1 md:ode-grid-cols-4 ode-gap-6 ode-mb-8">
            <div className="ode-card">
              <div className="ode-flex ode-items-center ode-justify-between">
                <div>
                  <p className="ode-text-sm ode-font-medium ode-text-gray-600">Всего заявок</p>
                  <p className="ode-text-2xl ode-font-bold ode-text-charcoal">{requests.length}</p>
                </div>
                <FaWrench className="ode-text-2xl ode-text-primary" />
              </div>
            </div>
            <div className="ode-card">
              <div className="ode-flex ode-items-center ode-justify-between">
                <div>
                  <p className="ode-text-sm ode-font-medium ode-text-gray-600">Открытые</p>
                  <p className="ode-text-2xl ode-font-bold ode-text-warning">
                    {requests.filter(r => r.status === 'open').length}
                  </p>
                </div>
                <FaClock className="ode-text-2xl ode-text-warning" />
              </div>
            </div>
            <div className="ode-card">
              <div className="ode-flex ode-items-center ode-justify-between">
                <div>
                  <p className="ode-text-sm ode-font-medium ode-text-gray-600">В работе</p>
                  <p className="ode-text-2xl ode-font-bold ode-text-info">
                    {requests.filter(r => r.status === 'in_progress').length}
                  </p>
                </div>
                <FaWrench className="ode-text-2xl ode-text-info" />
              </div>
            </div>
            <div className="ode-card">
              <div className="ode-flex ode-items-center ode-justify-between">
                <div>
                  <p className="ode-text-sm ode-font-medium ode-text-gray-600">Завершенные</p>
                  <p className="ode-text-2xl ode-font-bold ode-text-success">
                    {requests.filter(r => r.status === 'completed').length}
                  </p>
                </div>
                <FaCheckCircle className="ode-text-2xl ode-text-success" />
              </div>
            </div>
          </div>

          {/* Actions and Filters */}
          <div className="ode-card ode-mb-6">
            <div className="ode-flex ode-items-center ode-justify-between">
              <h2 className="ode-text-xl ode-font-semibold ode-text-charcoal">
                {t('tenant.maintenance.requests', 'Заявки на обслуживание')}
              </h2>
              <div className="ode-flex ode-gap-4">
                <div className="ode-flex ode-gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`ode-btn ode-btn-sm ${filter === 'all' ? 'ode-btn-primary' : 'ode-btn-secondary'}`}
                  >
                    Все
                  </button>
                  <button
                    onClick={() => setFilter('open')}
                    className={`ode-btn ode-btn-sm ${filter === 'open' ? 'ode-btn-primary' : 'ode-btn-secondary'}`}
                  >
                    Открытые
                  </button>
                  <button
                    onClick={() => setFilter('in_progress')}
                    className={`ode-btn ode-btn-sm ${filter === 'in_progress' ? 'ode-btn-primary' : 'ode-btn-secondary'}`}
                  >
                    В работе
                  </button>
                  <button
                    onClick={() => setFilter('completed')}
                    className={`ode-btn ode-btn-sm ${filter === 'completed' ? 'ode-btn-primary' : 'ode-btn-secondary'}`}
                  >
                    Завершенные
                  </button>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="ode-btn ode-btn-primary"
                >
                  <FaPlus className="ode-mr-2" />
                  Новая заявка
                </button>
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="ode-card">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="ode-animate-pulse ode-p-6 ode-border-b">
                  <div className="ode-h-4 ode-bg-gray-200 ode-rounded ode-mb-2"></div>
                  <div className="ode-h-6 ode-bg-gray-200 ode-rounded ode-mb-4"></div>
                  <div className="ode-h-4 ode-bg-gray-200 ode-rounded ode-w-1/2"></div>
                </div>
              ))
            ) : (
              <div className="ode-space-y-0">
                {filteredRequests.map((request) => {
                  const StatusIcon = getStatusIcon(request.status)
                  return (
                    <div key={request.id} className="ode-p-6 ode-border-b last:ode-border-b-0">
                      <div className="ode-flex ode-items-start ode-justify-between">
                        <div className="ode-flex ode-items-start ode-gap-4">
                          <div 
                            className="ode-p-2 ode-rounded-full"
                            style={{ backgroundColor: `${getStatusColor(request.status)}20` }}
                          >
                            <StatusIcon 
                              className="ode-text-lg"
                              style={{ color: getStatusColor(request.status) }}
                            />
                          </div>
                          <div className="ode-flex-1">
                            <div className="ode-flex ode-items-center ode-gap-3 ode-mb-2">
                              <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal">
                                {request.title}
                              </h3>
                              <span 
                                className="ode-px-2 ode-py-1 ode-text-xs ode-font-medium ode-rounded"
                                style={{ 
                                  backgroundColor: `${getPriorityColor(request.priority)}20`,
                                  color: getPriorityColor(request.priority)
                                }}
                              >
                                {getPriorityText(request.priority)}
                              </span>
                              <span 
                                className="ode-px-2 ode-py-1 ode-text-xs ode-font-medium ode-rounded"
                                style={{ 
                                  backgroundColor: `${getStatusColor(request.status)}20`,
                                  color: getStatusColor(request.status)
                                }}
                              >
                                {getStatusText(request.status)}
                              </span>
                            </div>
                            <p className="ode-text-gray ode-mb-3">{request.description}</p>
                            <div className="ode-flex ode-items-center ode-gap-4 ode-text-sm ode-text-gray">
                              <span>
                                <FaCalendar className="ode-inline ode-mr-1" />
                                Создана: {formatDate(request.created_at)}
                              </span>
                              {request.assigned_to && (
                                <span>
                                  <FaUser className="ode-inline ode-mr-1" />
                                  Исполнитель: {request.assigned_to}
                                </span>
                              )}
                              {request.completed_at && (
                                <span>
                                  <FaCheckCircle className="ode-inline ode-mr-1" />
                                  Завершена: {formatDate(request.completed_at)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="ode-flex ode-gap-2">
                          <button className="ode-btn ode-btn-secondary ode-btn-sm">
                            <FaEye className="ode-mr-1" />
                            Подробнее
                          </button>
                          {request.status === 'open' && (
                            <button 
                              onClick={() => handleUpdateRequest(request.id, { status: 'cancelled' })}
                              className="ode-btn ode-btn-danger ode-btn-sm"
                            >
                              <FaTrash className="ode-mr-1" />
                              Отменить
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {!loading && filteredRequests.length === 0 && (
              <div className="ode-text-center ode-p-12">
                <FaWrench className="ode-text-4xl ode-text-gray-300 ode-mx-auto ode-mb-4" />
                <p className="ode-text-gray">Заявки не найдены</p>
              </div>
            )}
          </div>
        </div>

        {/* Create Request Modal */}
        {showCreateModal && (
          <div className="ode-fixed ode-inset-0 ode-bg-black ode-bg-opacity-50 ode-flex ode-items-center ode-justify-center ode-z-50">
            <div className="ode-bg-white ode-rounded-lg ode-p-6 ode-w-full ode-max-w-md ode-mx-4">
              <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                Новая заявка на обслуживание
              </h3>
              <div className="ode-space-y-4">
                <div>
                  <label className="ode-block ode-text-sm ode-font-medium ode-text-gray-700 ode-mb-1">
                    Заголовок
                  </label>
                  <input
                    type="text"
                    value={newRequest.title}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
                    className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-md"
                    placeholder="Краткое описание проблемы"
                  />
                </div>
                <div>
                  <label className="ode-block ode-text-sm ode-font-medium ode-text-gray-700 ode-mb-1">
                    Описание
                  </label>
                  <textarea
                    value={newRequest.description}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                    className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-md"
                    rows={3}
                    placeholder="Подробное описание проблемы"
                  />
                </div>
                <div>
                  <label className="ode-block ode-text-sm ode-font-medium ode-text-gray-700 ode-mb-1">
                    Приоритет
                  </label>
                  <select
                    value={newRequest.priority}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-md"
                  >
                    <option value="low">Низкий</option>
                    <option value="medium">Средний</option>
                    <option value="high">Высокий</option>
                    <option value="urgent">Срочно</option>
                  </select>
                </div>
              </div>
              <div className="ode-flex ode-gap-3 ode-mt-6">
                <button
                  onClick={handleCreateRequest}
                  className="ode-btn ode-btn-primary ode-flex-1"
                  disabled={!newRequest.title || !newRequest.description}
                >
                  Создать заявку
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="ode-btn ode-btn-secondary ode-flex-1"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default MaintenancePage
