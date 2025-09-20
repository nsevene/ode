import React, { useState, useEffect } from 'react'
import { FaSearch, FaFilter, FaEye, FaCheck, FaTimes, FaUser, FaBuilding, FaCalendar, FaPlus } from 'react-icons/fa'
import AdminNavigation from '../../components/admin/AdminNavigation'
import { adminApi, type AdminApplication } from '../../lib/api/admin'

const ApplicationsPage: React.FC = () => {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedApplications, setSelectedApplications] = useState<string[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingApplication, setEditingApplication] = useState<any>(null)
  const [applications, setApplications] = useState<AdminApplication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await adminApi.getApplications()
        setApplications(data)
      } catch (error) {
        console.error('Error fetching applications:', error)
        // Fallback to mock data
        setApplications([
          {
            id: '1',
            tenant_id: 'tenant-1',
            property_id: 'prop-1',
            full_name: 'Иван Петров',
            brand_name: 'ООО "ТехноИнновации"',
            email: 'ivan@techinnov.ru',
            phone_number: '+7 (495) 123-45-67',
            concept_description: 'IT-компания, разработка мобильных приложений',
            status: 'pending',
            created_at: '2024-12-19T10:00:00Z'
          },
          {
            id: '2',
            tenant_id: 'tenant-2',
            property_id: 'prop-2',
            full_name: 'Александр Сидоров',
            brand_name: 'ИП Сидоров А.А.',
            email: 'sidorov@example.com',
            phone_number: '+7 (495) 987-65-43',
            concept_description: 'Логистическая компания',
            status: 'approved',
            created_at: '2024-12-18T14:30:00Z'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter
    const matchesSearch = app.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

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
    try {
      await adminApi.updateApplicationStatus(applicationId, 'approved', 'Заявка одобрена администратором')
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: 'approved' } : app
      ))
      alert('Заявка одобрена')
    } catch (error) {
      console.error('Error approving application:', error)
      alert('Ошибка при одобрении заявки')
    }
  }

  const handleRejectApplication = async (applicationId: string) => {
    try {
      await adminApi.updateApplicationStatus(applicationId, 'rejected', 'Заявка отклонена администратором')
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: 'rejected' } : app
      ))
      alert('Заявка отклонена')
    } catch (error) {
      console.error('Error rejecting application:', error)
      alert('Ошибка при отклонении заявки')
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
              Заявки ({filteredApplications.length})
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
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
                    <div className="ode-h-4 ode-bg-gray-200 ode-rounded ode-w-3/4"></div>
                  </div>
                </div>
              ))
            ) : (
              filteredApplications.map((app) => (
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
                        <span className="ode-text-sm ode-text-gray">{app.concept_description}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaCalendar style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                        <span className="ode-text-sm ode-text-gray">
                          {new Date(app.created_at).toLocaleDateString('ru-RU')}
                        </span>
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
                          onClick={() => handleApproveApplication(app.id.toString())}
                          className="ode-btn ode-btn-sm ode-btn-primary"
                        >
                          <FaCheck style={{ marginRight: '4px' }} />
                          Одобрить
                        </button>
                        <button 
                          onClick={() => handleRejectApplication(app.id.toString())}
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                  <div>
                    <span className="ode-text-xs ode-text-gray">Email:</span>
                    <p className="ode-text-sm ode-text-charcoal">{app.email}</p>
                  </div>
                  <div>
                    <span className="ode-text-xs ode-text-gray">Телефон:</span>
                    <p className="ode-text-sm ode-text-charcoal">{app.phone_number}</p>
                  </div>
                  <div>
                    <span className="ode-text-xs ode-text-gray">Описание:</span>
                    <p className="ode-text-sm ode-text-charcoal">{app.concept_description}</p>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>

          {!loading && filteredApplications.length === 0 && (
            <div className="ode-text-center" style={{ padding: '48px 0' }}>
              <p className="ode-text-gray">Заявки не найдены</p>
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