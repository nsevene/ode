import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaTimesCircle,
  FaBell, FaEye, FaLock, FaUser, FaClock, FaGlobe, FaDatabase,
  FaTrash, FaArchive, FaFilter, FaDownload, FaRefresh
} from 'react-icons/fa'
import { securityLogger, type SecurityEvent, type SecurityLogFilter } from '../../lib/logging/security-logger'

interface SecurityNotificationsProps {
  isOpen: boolean
  onClose: () => void
}

const SecurityNotifications: React.FC<SecurityNotificationsProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('common')
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<SecurityEvent[]>([])
  const [filter, setFilter] = useState<SecurityLogFilter>({})
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadSecurityEvents()
    }
  }, [isOpen])

  useEffect(() => {
    applyFilters()
  }, [events, filter])

  const loadSecurityEvents = () => {
    try {
      setLoading(true)
      const securityEvents = securityLogger.getEvents()
      setEvents(securityEvents)
    } catch (error) {
      console.error('Error loading security events:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...events]

    if (filter.eventType) {
      filtered = filtered.filter(e => e.eventType === filter.eventType)
    }
    if (filter.severity) {
      filtered = filtered.filter(e => e.severity === filter.severity)
    }
    if (filter.userId) {
      filtered = filtered.filter(e => e.userId === filter.userId)
    }
    if (filter.dateFrom) {
      filtered = filtered.filter(e => e.timestamp >= filter.dateFrom!)
    }
    if (filter.dateTo) {
      filtered = filtered.filter(e => e.timestamp <= filter.dateTo!)
    }
    if (filter.resolved !== undefined) {
      filtered = filtered.filter(e => e.resolved === filter.resolved)
    }

    setFilteredEvents(filtered)
  }

  const handleResolveEvent = (eventId: string) => {
    securityLogger.resolveEvent(eventId)
    loadSecurityEvents()
  }

  const handleExportEvents = () => {
    const exportData = securityLogger.exportEvents('json')
    const blob = new Blob([exportData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `security-events-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getEventIcon = (eventType: SecurityEvent['eventType']) => {
    switch (eventType) {
      case 'authentication': return <FaUser />
      case 'authorization': return <FaLock />
      case 'data_access': return <FaDatabase />
      case 'data_modification': return <FaDatabase />
      case 'security_violation': return <FaExclamationTriangle />
      case 'suspicious_activity': return <FaExclamationTriangle />
      case 'system_error': return <FaTimesCircle />
      case 'configuration_change': return <FaShieldAlt />
      case 'user_management': return <FaUser />
      case 'api_access': return <FaGlobe />
      default: return <FaBell />
    }
  }

  const getSeverityColor = (severity: SecurityEvent['severity']) => {
    switch (severity) {
      case 'low': return '#16a34a'
      case 'medium': return '#f59e0b'
      case 'high': return '#dc2626'
      case 'critical': return '#991b1b'
      default: return '#6b7280'
    }
  }

  const getSeverityBgColor = (severity: SecurityEvent['severity']) => {
    switch (severity) {
      case 'low': return '#dcfce7'
      case 'medium': return '#fef3c7'
      case 'high': return '#fee2e2'
      case 'critical': return '#fecaca'
      default: return '#f3f4f6'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getEventTypeText = (eventType: SecurityEvent['eventType']) => {
    switch (eventType) {
      case 'authentication': return 'Аутентификация'
      case 'authorization': return 'Авторизация'
      case 'data_access': return 'Доступ к данным'
      case 'data_modification': return 'Изменение данных'
      case 'security_violation': return 'Нарушение безопасности'
      case 'suspicious_activity': return 'Подозрительная активность'
      case 'system_error': return 'Системная ошибка'
      case 'configuration_change': return 'Изменение конфигурации'
      case 'user_management': return 'Управление пользователями'
      case 'api_access': return 'Доступ к API'
      default: return 'Неизвестно'
    }
  }

  const getSeverityText = (severity: SecurityEvent['severity']) => {
    switch (severity) {
      case 'low': return 'Низкий'
      case 'medium': return 'Средний'
      case 'high': return 'Высокий'
      case 'critical': return 'Критический'
      default: return 'Неизвестно'
    }
  }

  if (!isOpen) return null

  return (
    <div className="ode-fixed ode-inset-0 ode-bg-black ode-bg-opacity-50 ode-flex ode-items-center ode-justify-center ode-z-50">
      <div className="ode-bg-white ode-rounded-lg ode-shadow-xl ode-max-w-7xl ode-w-full ode-mx-4 ode-max-h-[90vh] ode-overflow-hidden">
        {/* Header */}
        <div className="ode-flex ode-items-center ode-justify-between ode-p-6 ode-border-b">
          <div className="ode-flex ode-items-center ode-gap-3">
            <FaShieldAlt className="ode-text-2xl ode-text-primary" />
            <h2 className="ode-text-2xl ode-font-bold ode-text-charcoal">
              {t('security.notifications.title', 'Security Notifications')}
            </h2>
          </div>
          <div className="ode-flex ode-items-center ode-gap-2">
            <button
              onClick={handleExportEvents}
              className="ode-btn ode-btn-secondary ode-btn-sm"
            >
              <FaDownload className="ode-mr-2" />
              Export
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="ode-btn ode-btn-secondary ode-btn-sm"
            >
              <FaFilter className="ode-mr-2" />
              Filters
            </button>
            <button
              onClick={loadSecurityEvents}
              className="ode-btn ode-btn-secondary ode-btn-sm"
            >
              <FaRefresh className="ode-mr-2" />
              Refresh
            </button>
            <button
              onClick={onClose}
              className="ode-text-gray-400 ode-hover:text-gray-600 ode-transition"
            >
              <FaTimesCircle className="ode-text-xl" />
            </button>
          </div>
        </div>

        <div className="ode-flex ode-h-[calc(90vh-120px)]">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="ode-w-80 ode-bg-gray-50 ode-p-4 ode-border-r">
              <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                Filters
              </h3>
              
              <div className="ode-space-y-4">
                <div>
                  <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Event Type</label>
                  <select
                    value={filter.eventType || ''}
                    onChange={(e) => setFilter({ ...filter, eventType: e.target.value as any || undefined })}
                    className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg"
                  >
                    <option value="">All Types</option>
                    <option value="authentication">Authentication</option>
                    <option value="authorization">Authorization</option>
                    <option value="data_access">Data Access</option>
                    <option value="security_violation">Security Violation</option>
                    <option value="suspicious_activity">Suspicious Activity</option>
                    <option value="system_error">System Error</option>
                  </select>
                </div>

                <div>
                  <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Severity</label>
                  <select
                    value={filter.severity || ''}
                    onChange={(e) => setFilter({ ...filter, severity: e.target.value as any || undefined })}
                    className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg"
                  >
                    <option value="">All Severities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">User ID</label>
                  <input
                    type="text"
                    value={filter.userId || ''}
                    onChange={(e) => setFilter({ ...filter, userId: e.target.value || undefined })}
                    placeholder="Enter user ID"
                    className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg"
                  />
                </div>

                <div>
                  <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">From Date</label>
                  <input
                    type="datetime-local"
                    value={filter.dateFrom || ''}
                    onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value || undefined })}
                    className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg"
                  />
                </div>

                <div>
                  <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">To Date</label>
                  <input
                    type="datetime-local"
                    value={filter.dateTo || ''}
                    onChange={(e) => setFilter({ ...filter, dateTo: e.target.value || undefined })}
                    className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg"
                  />
                </div>

                <div>
                  <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Status</label>
                  <select
                    value={filter.resolved === undefined ? '' : filter.resolved.toString()}
                    onChange={(e) => setFilter({ 
                      ...filter, 
                      resolved: e.target.value === '' ? undefined : e.target.value === 'true' 
                    })}
                    className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg"
                  >
                    <option value="">All</option>
                    <option value="false">Unresolved</option>
                    <option value="true">Resolved</option>
                  </select>
                </div>

                <button
                  onClick={() => setFilter({})}
                  className="ode-w-full ode-btn ode-btn-secondary ode-btn-sm"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="ode-flex-1 ode-flex ode-flex-col">
            {/* Events List */}
            <div className="ode-flex-1 ode-overflow-y-auto ode-p-4">
              {loading ? (
                <div className="ode-flex ode-items-center ode-justify-center ode-py-12">
                  <div className="ode-animate-spin ode-rounded-full ode-h-8 ode-w-8 ode-border-b-2 ode-border-primary"></div>
                </div>
              ) : (
                <div className="ode-space-y-3">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`ode-card ode-cursor-pointer ode-hover-shadow ode-transition ${
                        selectedEvent?.id === event.id ? 'ode-ring-2 ode-ring-primary' : ''
                      }`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="ode-flex ode-items-center ode-justify-between ode-p-4">
                        <div className="ode-flex ode-items-center ode-gap-4">
                          <div 
                            className="ode-p-3 ode-rounded-full"
                            style={{ 
                              backgroundColor: getSeverityBgColor(event.severity),
                              color: getSeverityColor(event.severity)
                            }}
                          >
                            {getEventIcon(event.eventType)}
                          </div>
                          
                          <div>
                            <div className="ode-flex ode-items-center ode-gap-2 ode-mb-1">
                              <h4 className="ode-font-semibold ode-text-charcoal">
                                {getEventTypeText(event.eventType)}
                              </h4>
                              <span 
                                className="ode-badge"
                                style={{
                                  backgroundColor: getSeverityColor(event.severity) + '20',
                                  color: getSeverityColor(event.severity)
                                }}
                              >
                                {getSeverityText(event.severity)}
                              </span>
                              {!event.resolved && (
                                <span className="ode-badge ode-bg-warning ode-text-white">
                                  Unresolved
                                </span>
                              )}
                            </div>
                            
                            <div className="ode-flex ode-items-center ode-gap-4 ode-text-sm ode-text-gray">
                              <div className="ode-flex ode-items-center ode-gap-1">
                                <FaClock />
                                <span>{formatTimestamp(event.timestamp)}</span>
                              </div>
                              {event.userId && (
                                <div className="ode-flex ode-items-center ode-gap-1">
                                  <FaUser />
                                  <span>{event.userId}</span>
                                </div>
                              )}
                              {event.resource && (
                                <div className="ode-flex ode-items-center ode-gap-1">
                                  <FaDatabase />
                                  <span>{event.resource}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="ode-flex ode-items-center ode-gap-2">
                          {!event.resolved && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleResolveEvent(event.id)
                              }}
                              className="ode-btn ode-btn-success ode-btn-sm"
                            >
                              <FaCheckCircle className="ode-mr-1" />
                              Resolve
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedEvent(event)
                            }}
                            className="ode-btn ode-btn-secondary ode-btn-sm"
                          >
                            <FaEye />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredEvents.length === 0 && (
                    <div className="ode-text-center ode-py-12">
                      <FaShieldAlt className="ode-text-6xl ode-text-gray-300 ode-mb-4" />
                      <h3 className="ode-text-xl ode-font-semibold ode-text-gray ode-mb-2">
                        No security events found
                      </h3>
                      <p className="ode-text-gray">
                        Try adjusting your filters or check back later
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Event Details Sidebar */}
          {selectedEvent && (
            <div className="ode-w-96 ode-bg-gray-50 ode-p-4 ode-border-l">
              <div className="ode-flex ode-items-center ode-justify-between ode-mb-4">
                <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal">
                  Event Details
                </h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="ode-text-gray-400 ode-hover:text-gray-600"
                >
                  <FaTimesCircle />
                </button>
              </div>
              
              <div className="ode-space-y-4">
                <div>
                  <label className="ode-text-sm ode-font-medium ode-text-gray">Event Type</label>
                  <p className="ode-text-charcoal">{getEventTypeText(selectedEvent.eventType)}</p>
                </div>
                
                <div>
                  <label className="ode-text-sm ode-font-medium ode-text-gray">Severity</label>
                  <p 
                    className="ode-font-medium"
                    style={{ color: getSeverityColor(selectedEvent.severity) }}
                  >
                    {getSeverityText(selectedEvent.severity)}
                  </p>
                </div>
                
                <div>
                  <label className="ode-text-sm ode-font-medium ode-text-gray">Timestamp</label>
                  <p className="ode-text-charcoal">{formatTimestamp(selectedEvent.timestamp)}</p>
                </div>
                
                {selectedEvent.userId && (
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray">User ID</label>
                    <p className="ode-text-charcoal">{selectedEvent.userId}</p>
                  </div>
                )}
                
                {selectedEvent.resource && (
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray">Resource</label>
                    <p className="ode-text-charcoal">{selectedEvent.resource}</p>
                  </div>
                )}
                
                {selectedEvent.action && (
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray">Action</label>
                    <p className="ode-text-charcoal">{selectedEvent.action}</p>
                  </div>
                )}
                
                <div>
                  <label className="ode-text-sm ode-font-medium ode-text-gray">Status</label>
                  <p className="ode-text-charcoal">
                    {selectedEvent.resolved ? 'Resolved' : 'Unresolved'}
                  </p>
                </div>
                
                <div>
                  <label className="ode-text-sm ode-font-medium ode-text-gray">Details</label>
                  <pre className="ode-bg-white ode-p-3 ode-rounded ode-text-sm ode-overflow-auto">
                    {JSON.stringify(selectedEvent.details, null, 2)}
                  </pre>
                </div>
                
                {!selectedEvent.resolved && (
                  <button
                    onClick={() => handleResolveEvent(selectedEvent.id)}
                    className="ode-w-full ode-btn ode-btn-success"
                  >
                    <FaCheckCircle className="ode-mr-2" />
                    Resolve Event
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SecurityNotifications
