import React, { useState, useEffect } from 'react'
import { FaSearch, FaFilter, FaEye, FaCheck, FaTimes, FaUser, FaBuilding, FaCalendar, FaPlus, FaSpinner } from 'react-icons/fa'
import AdminNavigation from '../../components/admin/AdminNavigation'
import { fetchTenantApplications, updateTenantApplicationStatus } from '../../lib/tenant-api'
import { useAuthStore } from '../../store/authStore'

const ApplicationsPage: React.FC = () => {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedApplications, setSelectedApplications] = useState<string[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingApplication, setEditingApplication] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })
  
  const { accessToken } = useAuthStore()

  // Fetch applications from backend
  const loadApplications = async () => {
    if (!accessToken) {
      setError('Необходимо авторизоваться')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const result = await fetchTenantApplications(accessToken, {
        page: pagination.page,
        limit: pagination.limit,
        status: filter,
        search: searchTerm || undefined
      })
      
      setApplications(result.applications)
      setPagination(result.pagination)
    } catch (err) {
      console.error('Error loading applications:', err)
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке заявок')
    } finally {
      setLoading(false)
    }
  }

  // Load applications on mount and when dependencies change
  useEffect(() => {
    loadApplications()
  }, [accessToken, filter, searchTerm, pagination.page])

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination(prev => ({ ...prev, page: 1 }))
      } else {
        loadApplications()
      }
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Applications are already filtered by backend
  const filteredApplications = applications

  // Функции для работы с заявками
  const handleApplicationSelect = (applicationId: string) => {
    setSelectedApplications(prev => 
      prev.includes(applicationId) 
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    )
  }

  const handleViewApplication = (application: any) => {
    console.log('Просмотр заявки:', application)
    alert(`Просмотр заявки: ${application.company}`)
  }

  const handleEditApplication = (application: any) => {
    console.log('Редактирование заявки:', application)
    setEditingApplication(application)
    setShowEditModal(true)
  }

  const handleApproveApplication = async (applicationId: string) => {
    if (!accessToken) return
    
    const notes = prompt('Комментарий к одобрению (опционально):') || ''
    
    try {
      await updateTenantApplicationStatus(applicationId, 'approved', notes, accessToken)
      alert('Заявка одобрена!')
      loadApplications() // Reload to reflect changes
    } catch (error) {
      alert('Ошибка при одобрении заявки')
      console.error(error)
    }
  }

  const handleRejectApplication = async (applicationId: string) => {
    if (!accessToken) return
    
    const notes = prompt('Причина отклонения (обязательно):') || ''
    
    if (!notes.trim()) {
      alert('Необходимо указать причину отклонения')
      return
    }
    
    try {
      await updateTenantApplicationStatus(applicationId, 'rejected', notes, accessToken)
      alert('Заявка отклонена!')
      loadApplications() // Reload to reflect changes
    } catch (error) {
      alert('Ошибка при отклонении заявки')
      console.error(error)
    }
  }

  const handleAddApplication = () => {
    console.log('Добавление новой заявки')
    setShowAddModal(true)
  }

  const handleBulkApplicationAction = (action: string) => {
    console.log('Массовое действие:', action, 'для заявок:', selectedApplications)
    if (selectedApplications.length === 0) {
      alert('Выберите заявки для выполнения действия')
      return
    }
    
    switch (action) {
      case 'approve':
        if (confirm(`Одобрить ${selectedApplications.length} заявок?`)) {
          alert('Заявки одобрены')
          setSelectedApplications([])
        }
        break
      case 'reject':
        if (confirm(`Отклонить ${selectedApplications.length} заявок?`)) {
          alert('Заявки отклонены')
          setSelectedApplications([])
        }
        break
      case 'export':
        alert(`Экспорт ${selectedApplications.length} заявок`)
        break
      default:
        alert(`Действие ${action} для ${selectedApplications.length} заявок`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b'
      case 'approved': return '#16a34a'
      case 'review': return '#2563eb'
      case 'rejected': return '#dc2626'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'На рассмотрении'
      case 'approved': return 'Одобрена'
      case 'review': return 'На проверке'
      case 'rejected': return 'Отклонена'
      default: return status
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
              <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-2">Управление заявками</h1>
              <p className="ode-text-gray">Просмотр и обработка заявок от арендаторов и инвесторов</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleAddApplication} className="ode-btn ode-btn-primary">
                <FaPlus style={{ marginRight: '8px' }} />
                Новая заявка
              </button>
              <button className="ode-btn ode-btn-secondary">
                Экспорт
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
                placeholder="Поиск по компании или контакту..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setFilter('all')}
                className={`ode-btn ode-btn-sm ${filter === 'all' ? 'ode-btn-primary' : ''}`}
                style={{ background: filter === 'all' ? undefined : '#f9fafb', color: filter === 'all' ? undefined : '#374151' }}
              >
                Все
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`ode-btn ode-btn-sm ${filter === 'pending' ? 'ode-btn-primary' : ''}`}
                style={{ background: filter === 'pending' ? undefined : '#f9fafb', color: filter === 'pending' ? undefined : '#374151' }}
              >
                На рассмотрении
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`ode-btn ode-btn-sm ${filter === 'approved' ? 'ode-btn-primary' : ''}`}
                style={{ background: filter === 'approved' ? undefined : '#f9fafb', color: filter === 'approved' ? undefined : '#374151' }}
              >
                Одобренные
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`ode-btn ode-btn-sm ${filter === 'rejected' ? 'ode-btn-primary' : ''}`}
                style={{ background: filter === 'rejected' ? undefined : '#f9fafb', color: filter === 'rejected' ? undefined : '#374151' }}
              >
                Отклоненные
              </button>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="ode-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="ode-text-xl ode-font-semibold ode-text-charcoal">
              {loading ? 'Загрузка...' : `Заявки (${pagination.total || 0})`}
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="ode-btn ode-btn-sm" style={{ background: '#f9fafb', color: '#374151' }}>
                <FaFilter style={{ marginRight: '4px' }} />
                Фильтры
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="ode-text-center" style={{ padding: '48px 0' }}>
              <FaSpinner className="animate-spin" style={{ fontSize: '24px', color: '#6b7280', marginBottom: '16px' }} />
              <p className="ode-text-gray">Загрузка заявок...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="alert alert-error" style={{ marginBottom: '24px' }}>
              <FaTimes style={{ marginRight: '8px' }} />
              {error}
              <button 
                onClick={loadApplications} 
                className="ode-btn ode-btn-sm" 
                style={{ marginLeft: '16px' }}
              >
                Повторить
              </button>
            </div>
          )}

          {/* Applications List */}
          {!loading && !error && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredApplications.map((app) => {
                const formattedDate = new Date(app.created_at).toLocaleDateString('ru-RU')
                
                return (
                  <div key={app.id} className="ode-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal">{app.brand_name}</h3>
                          <span 
                            className="badge"
                            style={{ 
                              background: getStatusColor(app.status) + '20',
                              color: getStatusColor(app.status),
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}
                          >
                            {getStatusText(app.status)}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaUser style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                            <span className="ode-text-sm ode-text-gray">{app.full_name}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaBuilding style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                            <span className="ode-text-sm ode-text-gray">{app.organization_name || 'ODE Portal'}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaCalendar style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                            <span className="ode-text-sm ode-text-gray">{formattedDate}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleViewApplication(app)}
                          className="ode-btn ode-btn-sm" 
                          style={{ background: '#f9fafb', color: '#374151' }}
                        >
                          <FaEye style={{ marginRight: '4px' }} />
                          Просмотр
                        </button>
                        {app.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApproveApplication(app.id)}
                              className="ode-btn ode-btn-sm ode-btn-primary"
                            >
                              <FaCheck style={{ marginRight: '4px' }} />
                              Одобрить
                            </button>
                            <button 
                              onClick={() => handleRejectApplication(app.id)}
                              className="ode-btn ode-btn-sm" 
                              style={{ background: '#fef2f2', color: '#dc2626' }}
                            >
                              <FaTimes style={{ marginRight: '4px' }} />
                              Отклонить
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minWidth(200px, 1fr))', gap: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                      <div>
                        <span className="ode-text-xs ode-text-gray">Email:</span>
                        <p className="ode-text-sm ode-text-charcoal">{app.email}</p>
                      </div>
                      <div>
                        <span className="ode-text-xs ode-text-gray">Телефон:</span>
                        <p className="ode-text-sm ode-text-charcoal">{app.phone_number}</p>
                      </div>
                      {app.concept_description && (
                        <div>
                          <span className="ode-text-xs ode-text-gray">Концепция:</span>
                          <p className="ode-text-sm ode-text-charcoal">{app.concept_description.substring(0, 100)}...</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* No Results State */}
          {!loading && !error && filteredApplications.length === 0 && (
            <div className="ode-text-center" style={{ padding: '48px 0' }}>
              <p className="ode-text-gray">
                {searchTerm || filter !== 'all' ? 'Заявки не найдены по заданным критериям' : 'Заявок пока нет'}
              </p>
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

export default ApplicationsPage