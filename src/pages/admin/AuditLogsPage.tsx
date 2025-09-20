import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { 
  FaSearch, FaFilter, FaEye, FaDownload, FaCalendar, 
  FaUser, FaDatabase, FaExclamationTriangle, FaCheckCircle, 
  FaTimesCircle, FaSpinner, FaClock, FaFileAlt, FaTrash,
  FaSortAmountDown, FaSortAmountUp, FaRefresh, FaHistory,
  FaShield, FaKey, FaEdit, FaPlus, FaMinus, FaArrowRight
} from 'react-icons/fa'
import AdminNavigation from '../../components/admin/AdminNavigation'
import { adminApi, type AdminAuditLog } from '../../lib/api/admin'

const AuditLogsPage: React.FC = () => {
  const { t } = useTranslation('common')
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [userFilter, setUserFilter] = useState('all')
  const [tableFilter, setTableFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [logs, setLogs] = useState<AdminAuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLog, setSelectedLog] = useState<AdminAuditLog | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await adminApi.getAuditLogs()
        setLogs(data)
      } catch (error) {
        console.error('Error fetching audit logs:', error)
        // Fallback to mock data
        setLogs([
          {
            id: '1',
            tableName: 'users',
            recordId: 'user_123',
            action: 'INSERT',
            oldData: null,
            newData: {
              id: 'user_123',
              email: 'newuser@example.com',
              full_name: 'Новый Пользователь',
              role: 'tenant'
            },
            changedBy: 'admin@example.com',
            timestamp: '2024-12-20T10:30:00Z',
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            severity: 'low',
            description: 'Создан новый пользователь',
            metadata: {
              source: 'admin_panel',
              session_id: 'sess_123456'
            }
          },
          {
            id: '2',
            tableName: 'properties',
            recordId: 'prop_456',
            action: 'UPDATE',
            oldData: {
              status: 'available',
              price: 500000
            },
            newData: {
              status: 'occupied',
              price: 550000
            },
            changedBy: 'admin@example.com',
            timestamp: '2024-12-20T09:15:00Z',
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            severity: 'medium',
            description: 'Обновлен объект недвижимости',
            metadata: {
              source: 'admin_panel',
              session_id: 'sess_123456'
            }
          },
          {
            id: '3',
            tableName: 'tenant_applications',
            recordId: 'app_789',
            action: 'UPDATE',
            oldData: {
              status: 'pending'
            },
            newData: {
              status: 'approved',
              reviewed_at: '2024-12-20T08:45:00Z',
              reviewed_by: 'admin@example.com'
            },
            changedBy: 'admin@example.com',
            timestamp: '2024-12-20T08:45:00Z',
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            severity: 'medium',
            description: 'Одобрена заявка арендатора',
            metadata: {
              source: 'admin_panel',
              session_id: 'sess_123456'
            }
          },
          {
            id: '4',
            tableName: 'security_events',
            recordId: 'sec_101',
            action: 'INSERT',
            oldData: null,
            newData: {
              event_type: 'failed_login',
              user_id: 'user_456',
              ip_address: '192.168.1.200',
              description: 'Неудачная попытка входа'
            },
            changedBy: 'system',
            timestamp: '2024-12-20T07:30:00Z',
            ipAddress: '192.168.1.200',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            severity: 'high',
            description: 'Неудачная попытка входа в систему',
            metadata: {
              source: 'auth_system',
              session_id: null
            }
          },
          {
            id: '5',
            tableName: 'leases',
            recordId: 'lease_321',
            action: 'DELETE',
            oldData: {
              id: 'lease_321',
              tenant_name: 'Старый Арендатор',
              status: 'active'
            },
            newData: null,
            changedBy: 'admin@example.com',
            timestamp: '2024-12-19T16:20:00Z',
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            severity: 'high',
            description: 'Удален договор аренды',
            metadata: {
              source: 'admin_panel',
              session_id: 'sess_123456'
            }
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.tableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.changedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.recordId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = actionFilter === 'all' || log.action === actionFilter
    const matchesUser = userFilter === 'all' || log.changedBy === userFilter
    const matchesTable = tableFilter === 'all' || log.tableName === tableFilter
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter
    const matchesDate = dateRange === 'all' || {
      'today': () => {
        const today = new Date().toDateString()
        return new Date(log.timestamp).toDateString() === today
      },
      'week': () => {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        return new Date(log.timestamp) >= weekAgo
      },
      'month': () => {
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        return new Date(log.timestamp) >= monthAgo
      }
    }[dateRange]?.() ?? true
    return matchesSearch && matchesAction && matchesUser && matchesTable && matchesSeverity && matchesDate
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      case 'oldest':
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      case 'severity':
        const severityOrder = { high: 3, medium: 2, low: 1 }
        return severityOrder[b.severity] - severityOrder[a.severity]
      case 'table':
        return a.tableName.localeCompare(b.tableName)
      case 'action':
        return a.action.localeCompare(b.action)
      default:
        return 0
    }
  })

  const handleViewDetails = (log: AdminAuditLog) => {
    setSelectedLog(log)
    setShowDetails(true)
  }

  const handleExportLogs = async () => {
    try {
      setProcessing('export')
      await adminApi.exportAuditLogs(filteredLogs)
      alert('Журнал аудита успешно экспортирован')
    } catch (error) {
      console.error('Error exporting audit logs:', error)
      alert('Ошибка при экспорте журнала аудита')
    } finally {
      setProcessing(null)
    }
  }

  const handleClearLogs = async () => {
    if (!confirm('Вы уверены, что хотите очистить журнал аудита? Это действие нельзя отменить.')) return

    try {
      setProcessing('clear')
      await adminApi.clearAuditLogs()
      setLogs([])
      alert('Журнал аудита успешно очищен')
    } catch (error) {
      console.error('Error clearing audit logs:', error)
      alert('Ошибка при очистке журнала аудита')
    } finally {
      setProcessing(null)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#dc2626'
      case 'medium': return '#f59e0b'
      case 'low': return '#16a34a'
      default: return '#6b7280'
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return 'Высокий'
      case 'medium': return 'Средний'
      case 'low': return 'Низкий'
      default: return 'Неизвестно'
    }
  }

  const getActionText = (action: string) => {
    switch (action) {
      case 'INSERT': return 'Создание'
      case 'UPDATE': return 'Обновление'
      case 'DELETE': return 'Удаление'
      case 'SELECT': return 'Просмотр'
      default: return action
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'INSERT': return FaPlus
      case 'UPDATE': return FaEdit
      case 'DELETE': return FaTrash
      case 'SELECT': return FaEye
      default: return FaDatabase
    }
  }

  const getTableText = (tableName: string) => {
    switch (tableName) {
      case 'users': return 'Пользователи'
      case 'properties': return 'Недвижимость'
      case 'tenant_applications': return 'Заявки арендаторов'
      case 'leases': return 'Договоры аренды'
      case 'security_events': return 'События безопасности'
      case 'audit_log': return 'Журнал аудита'
      default: return tableName
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatJsonData = (data: any) => {
    if (!data) return 'Нет данных'
    return JSON.stringify(data, null, 2)
  }

  const getUniqueUsers = () => {
    return [...new Set(logs.map(log => log.changedBy))].sort()
  }

  const getUniqueTables = () => {
    return [...new Set(logs.map(log => log.tableName))].sort()
  }

  const getStats = () => {
    const total = logs.length
    const high = logs.filter(log => log.severity === 'high').length
    const medium = logs.filter(log => log.severity === 'medium').length
    const low = logs.filter(log => log.severity === 'low').length
    const today = logs.filter(log => {
      const today = new Date().toDateString()
      return new Date(log.timestamp).toDateString() === today
    }).length

    return { total, high, medium, low, today }
  }

  const stats = getStats()

  return (
    <>
      <Helmet>
        <title>{t('admin.audit_logs.title', 'Журнал аудита')} - ODPortal B2B</title>
        <meta name="description" content={t('admin.audit_logs.description', 'Журнал всех действий пользователей')} />
      </Helmet>
      
      <div className="ode-bg-gray" style={{ minHeight: '100vh', padding: '32px 0' }}>
        <div className="ode-container">
          <div className="ode-dashboard-layout">
            <AdminNavigation />
            
            <div className="ode-dashboard-content">
              <div className="ode-dashboard-header">
                <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-2">
                  {t('admin.audit_logs.heading', 'Журнал аудита')}
                </h1>
                <p className="ode-text-gray">
                  {t('admin.audit_logs.description', 'Журнал всех действий пользователей')}
                </p>
              </div>

              {/* Stats Cards */}
              <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-lg-grid-5 ode-gap-4 ode-mb-6">
                <div className="ode-card">
                  <div className="ode-p-4">
                    <div className="ode-flex ode-items-center ode-justify-between">
                      <div>
                        <p className="ode-text-sm ode-text-gray">Всего записей</p>
                        <p className="ode-text-2xl ode-font-bold ode-text-charcoal">{stats.total}</p>
                      </div>
                      <FaHistory className="ode-text-3xl ode-text-blue-500" />
                    </div>
                  </div>
                </div>
                
                <div className="ode-card">
                  <div className="ode-p-4">
                    <div className="ode-flex ode-items-center ode-justify-between">
                      <div>
                        <p className="ode-text-sm ode-text-gray">Сегодня</p>
                        <p className="ode-text-2xl ode-font-bold ode-text-charcoal">{stats.today}</p>
                      </div>
                      <FaClock className="ode-text-3xl ode-text-green-500" />
                    </div>
                  </div>
                </div>
                
                <div className="ode-card">
                  <div className="ode-p-4">
                    <div className="ode-flex ode-items-center ode-justify-between">
                      <div>
                        <p className="ode-text-sm ode-text-gray">Высокий риск</p>
                        <p className="ode-text-2xl ode-font-bold ode-text-red-500">{stats.high}</p>
                      </div>
                      <FaExclamationTriangle className="ode-text-3xl ode-text-red-500" />
                    </div>
                  </div>
                </div>
                
                <div className="ode-card">
                  <div className="ode-p-4">
                    <div className="ode-flex ode-items-center ode-justify-between">
                      <div>
                        <p className="ode-text-sm ode-text-gray">Средний риск</p>
                        <p className="ode-text-2xl ode-font-bold ode-text-yellow-500">{stats.medium}</p>
                      </div>
                      <FaShield className="ode-text-3xl ode-text-yellow-500" />
                    </div>
                  </div>
                </div>
                
                <div className="ode-card">
                  <div className="ode-p-4">
                    <div className="ode-flex ode-items-center ode-justify-between">
                      <div>
                        <p className="ode-text-sm ode-text-gray">Низкий риск</p>
                        <p className="ode-text-2xl ode-font-bold ode-text-green-500">{stats.low}</p>
                      </div>
                      <FaCheckCircle className="ode-text-3xl ode-text-green-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters and Search */}
              <div className="ode-card ode-mb-6">
                <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-lg-grid-6 ode-gap-4 ode-mb-4">
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Поиск</label>
                    <div className="ode-relative">
                      <FaSearch className="ode-absolute ode-left-3 ode-top-1/2 ode-transform ode--translate-y-1/2 ode-text-gray-400" />
                      <input
                        type="text"
                        placeholder="Описание, таблица, пользователь..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="ode-w-full ode-pl-10 ode-pr-4 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary ode-focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Действие</label>
                    <select
                      value={actionFilter}
                      onChange={(e) => setActionFilter(e.target.value)}
                      className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary"
                    >
                      <option value="all">Все действия</option>
                      <option value="INSERT">Создание</option>
                      <option value="UPDATE">Обновление</option>
                      <option value="DELETE">Удаление</option>
                      <option value="SELECT">Просмотр</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Пользователь</label>
                    <select
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                      className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary"
                    >
                      <option value="all">Все пользователи</option>
                      {getUniqueUsers().map(user => (
                        <option key={user} value={user}>{user}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Таблица</label>
                    <select
                      value={tableFilter}
                      onChange={(e) => setTableFilter(e.target.value)}
                      className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary"
                    >
                      <option value="all">Все таблицы</option>
                      {getUniqueTables().map(table => (
                        <option key={table} value={table}>{getTableText(table)}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Уровень риска</label>
                    <select
                      value={severityFilter}
                      onChange={(e) => setSeverityFilter(e.target.value)}
                      className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary"
                    >
                      <option value="all">Все уровни</option>
                      <option value="high">Высокий</option>
                      <option value="medium">Средний</option>
                      <option value="low">Низкий</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Период</label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary"
                    >
                      <option value="all">Все время</option>
                      <option value="today">Сегодня</option>
                      <option value="week">Неделя</option>
                      <option value="month">Месяц</option>
                    </select>
                  </div>
                </div>
                
                <div className="ode-flex ode-justify-between ode-items-center">
                  <div className="ode-flex ode-items-center ode-gap-4">
                    <span className="ode-text-sm ode-text-gray">
                      Найдено: {filteredLogs.length} записей
                    </span>
                    <span className="ode-text-sm ode-text-gray">
                      Высокий риск: {filteredLogs.filter(log => log.severity === 'high').length}
                    </span>
                  </div>
                  
                  <div className="ode-flex ode-items-center ode-gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary"
                    >
                      <option value="newest">Новые</option>
                      <option value="oldest">Старые</option>
                      <option value="severity">По уровню риска</option>
                      <option value="table">По таблице</option>
                      <option value="action">По действию</option>
                    </select>
                    <button
                      onClick={handleExportLogs}
                      disabled={processing === 'export'}
                      className="ode-btn ode-btn-secondary ode-btn-sm"
                    >
                      {processing === 'export' ? (
                        <FaSpinner className="ode-animate-spin" />
                      ) : (
                        <FaDownload />
                      )}
                      Экспорт
                    </button>
                    <button
                      onClick={handleClearLogs}
                      disabled={processing === 'clear'}
                      className="ode-btn ode-btn-danger ode-btn-sm"
                    >
                      {processing === 'clear' ? (
                        <FaSpinner className="ode-animate-spin" />
                      ) : (
                        <FaTrash />
                      )}
                      Очистить
                    </button>
                  </div>
                </div>
              </div>

              {/* Audit Logs List */}
              <div className="ode-space-y-4">
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="ode-card">
                      <div className="ode-animate-pulse">
                        <div className="ode-h-6 ode-bg-gray-200 ode-rounded ode-mb-2"></div>
                        <div className="ode-h-4 ode-bg-gray-200 ode-rounded ode-mb-4"></div>
                        <div className="ode-h-4 ode-bg-gray-200 ode-rounded ode-w-1/2"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  filteredLogs.map((log) => {
                    const ActionIcon = getActionIcon(log.action)
                    
                    return (
                      <div key={log.id} className="ode-card ode-hover-shadow ode-transition">
                        <div className="ode-p-6">
                          <div className="ode-flex ode-items-start ode-justify-between ode-mb-4">
                            <div className="ode-flex ode-items-center ode-gap-4">
                              <div className="ode-w-12 ode-h-12 ode-bg-primary ode-rounded-full ode-flex ode-items-center ode-justify-center">
                                <ActionIcon className="ode-text-white ode-text-xl" />
                              </div>
                              <div>
                                <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal">
                                  {log.description}
                                </h3>
                                <p className="ode-text-sm ode-text-gray">{getTableText(log.tableName)} • {getActionText(log.action)}</p>
                                <div className="ode-flex ode-items-center ode-gap-2 ode-mt-1">
                                  <span 
                                    className="ode-badge"
                                    style={{
                                      backgroundColor: getSeverityColor(log.severity) + '20',
                                      color: getSeverityColor(log.severity)
                                    }}
                                  >
                                    {getSeverityText(log.severity)}
                                  </span>
                                  <span className="ode-badge ode-bg-blue-100 ode-text-blue-800">
                                    {log.action}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="ode-flex ode-items-center ode-gap-2">
                              <button
                                onClick={() => handleViewDetails(log)}
                                className="ode-btn ode-btn-secondary ode-btn-sm"
                              >
                                <FaEye />
                                Подробнее
                              </button>
                            </div>
                          </div>
                          
                          <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-lg-grid-4 ode-gap-4 ode-mb-4">
                            <div className="ode-flex ode-items-center ode-gap-2">
                              <FaUser className="ode-text-gray-400" />
                              <span className="ode-text-sm ode-text-gray">{log.changedBy}</span>
                            </div>
                            <div className="ode-flex ode-items-center ode-gap-2">
                              <FaDatabase className="ode-text-gray-400" />
                              <span className="ode-text-sm ode-text-gray">{log.recordId}</span>
                            </div>
                            <div className="ode-flex ode-items-center ode-gap-2">
                              <FaClock className="ode-text-gray-400" />
                              <span className="ode-text-sm ode-text-gray">{formatDate(log.timestamp)}</span>
                            </div>
                            <div className="ode-flex ode-items-center ode-gap-2">
                              <FaShield className="ode-text-gray-400" />
                              <span className="ode-text-sm ode-text-gray">{log.ipAddress}</span>
                            </div>
                          </div>
                          
                          <div className="ode-mb-4">
                            <span className="ode-text-xs ode-text-gray">User Agent</span>
                            <p className="ode-text-sm ode-text-charcoal ode-line-clamp-1">
                              {log.userAgent}
                            </p>
                          </div>
                          
                          <div className="ode-flex ode-items-center ode-justify-between">
                            <div className="ode-flex ode-items-center ode-gap-4">
                              <div className="ode-flex ode-items-center ode-gap-1">
                                <FaFileAlt className="ode-text-gray-400" />
                                <span className="ode-text-sm ode-text-gray">
                                  {log.metadata?.source || 'Неизвестно'}
                                </span>
                              </div>
                              {log.metadata?.session_id && (
                                <div className="ode-flex ode-items-center ode-gap-1">
                                  <FaKey className="ode-text-gray-400" />
                                  <span className="ode-text-sm ode-text-gray">
                                    {log.metadata.session_id}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="ode-text-right">
                              <span className="ode-text-xs ode-text-gray">ID записи</span>
                              <p className="ode-text-sm ode-font-medium ode-text-charcoal">
                                {log.id}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {!loading && filteredLogs.length === 0 && (
                <div className="ode-text-center" style={{ padding: '48px 0' }}>
                  <FaHistory className="ode-text-6xl ode-text-gray-300 ode-mb-4" />
                  <h3 className="ode-text-xl ode-font-semibold ode-text-gray ode-mb-2">
                    Записи аудита не найдены
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

      {/* Audit Log Details Modal */}
      {showDetails && selectedLog && (
        <div className="ode-fixed ode-inset-0 ode-bg-black ode-bg-opacity-50 ode-flex ode-items-center ode-justify-center ode-z-50">
          <div className="ode-bg-white ode-rounded-lg ode-shadow-xl ode-max-w-6xl ode-w-full ode-mx-4 ode-max-h-[90vh] ode-overflow-hidden">
            <div className="ode-flex ode-items-center ode-justify-between ode-p-6 ode-border-b">
              <h2 className="ode-text-2xl ode-font-bold ode-text-charcoal">
                Детали записи аудита
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
                {/* Basic Info */}
                <div>
                  <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                    Основная информация
                  </h3>
                  <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-gap-4">
                    <div>
                      <span className="ode-text-sm ode-text-gray">Описание</span>
                      <p className="ode-text-charcoal">{selectedLog.description}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Действие</span>
                      <p className="ode-text-charcoal">{getActionText(selectedLog.action)}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Таблица</span>
                      <p className="ode-text-charcoal">{getTableText(selectedLog.tableName)}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">ID записи</span>
                      <p className="ode-text-charcoal">{selectedLog.recordId}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Пользователь</span>
                      <p className="ode-text-charcoal">{selectedLog.changedBy}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Время</span>
                      <p className="ode-text-charcoal">{formatDate(selectedLog.timestamp)}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">IP адрес</span>
                      <p className="ode-text-charcoal">{selectedLog.ipAddress}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Уровень риска</span>
                      <p 
                        className="ode-font-medium"
                        style={{ color: getSeverityColor(selectedLog.severity) }}
                      >
                        {getSeverityText(selectedLog.severity)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* User Agent */}
                <div>
                  <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                    User Agent
                  </h3>
                  <p className="ode-text-charcoal ode-bg-gray-50 ode-p-3 ode-rounded-lg">
                    {selectedLog.userAgent}
                  </p>
                </div>

                {/* Metadata */}
                <div>
                  <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                    Метаданные
                  </h3>
                  <div className="ode-bg-gray-50 ode-p-3 ode-rounded-lg">
                    <pre className="ode-text-sm ode-text-charcoal">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Old Data */}
                {selectedLog.oldData && (
                  <div>
                    <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                      Предыдущие данные
                    </h3>
                    <div className="ode-bg-red-50 ode-p-3 ode-rounded-lg">
                      <pre className="ode-text-sm ode-text-charcoal">
                        {formatJsonData(selectedLog.oldData)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* New Data */}
                {selectedLog.newData && (
                  <div>
                    <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                      Новые данные
                    </h3>
                    <div className="ode-bg-green-50 ode-p-3 ode-rounded-lg">
                      <pre className="ode-text-sm ode-text-charcoal">
                        {formatJsonData(selectedLog.newData)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Changes Summary */}
                {selectedLog.oldData && selectedLog.newData && (
                  <div>
                    <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                      Сводка изменений
                    </h3>
                    <div className="ode-space-y-2">
                      {Object.keys(selectedLog.newData).map(key => {
                        const oldValue = selectedLog.oldData?.[key]
                        const newValue = selectedLog.newData[key]
                        const hasChanged = oldValue !== newValue
                        
                        if (!hasChanged) return null
                        
                        return (
                          <div key={key} className="ode-flex ode-items-center ode-gap-2 ode-p-2 ode-bg-gray-50 ode-rounded">
                            <span className="ode-text-sm ode-font-medium ode-text-charcoal">{key}:</span>
                            <span className="ode-text-sm ode-text-red-500">{JSON.stringify(oldValue)}</span>
                            <FaArrowRight className="ode-text-gray-400" />
                            <span className="ode-text-sm ode-text-green-500">{JSON.stringify(newValue)}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AuditLogsPage
