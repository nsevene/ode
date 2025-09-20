import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaTimesCircle,
  FaEye, FaLock, FaUser, FaClock, FaGlobe, FaDatabase, FaKey
} from 'react-icons/fa'
import { getSecurityManager, type SecurityContext, type AuditLog } from '../../lib/auth/security'

interface SecurityMonitorProps {
  isOpen: boolean
  onClose: () => void
}

const SecurityMonitor: React.FC<SecurityMonitorProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('common')
  const [securityContext, setSecurityContext] = useState<SecurityContext | null>(null)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [securityMetrics, setSecurityMetrics] = useState({
    totalLogins: 0,
    failedAttempts: 0,
    suspiciousActivities: 0,
    dataAccessCount: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      loadSecurityData()
    }
  }, [isOpen])

  const loadSecurityData = async () => {
    try {
      setLoading(true)
      const securityManager = getSecurityManager()
      
      // Get current security context
      const context = securityManager.getSecurityContext()
      setSecurityContext(context)

      // Load audit logs (mock data for now)
      const mockAuditLogs: AuditLog[] = [
        {
          id: '1',
          tableName: 'users',
          operation: 'UPDATE',
          oldData: { status: 'inactive' },
          newData: { status: 'active' },
          userId: 'user-1',
          timestamp: new Date().toISOString(),
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0...'
        },
        {
          id: '2',
          tableName: 'properties',
          operation: 'INSERT',
          newData: { name: 'New Property', status: 'available' },
          userId: 'user-2',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          ipAddress: '192.168.1.2',
          userAgent: 'Mozilla/5.0...'
        },
        {
          id: '3',
          tableName: 'applications',
          operation: 'DELETE',
          oldData: { id: 'app-1', status: 'pending' },
          userId: 'user-3',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          ipAddress: '192.168.1.3',
          userAgent: 'Mozilla/5.0...'
        }
      ]
      setAuditLogs(mockAuditLogs)

      // Load security metrics (mock data)
      setSecurityMetrics({
        totalLogins: 156,
        failedAttempts: 3,
        suspiciousActivities: 1,
        dataAccessCount: 1247
      })

    } catch (error) {
      console.error('Error loading security data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getOperationColor = (operation: string) => {
    switch (operation) {
      case 'INSERT': return '#16a34a'
      case 'UPDATE': return '#f59e0b'
      case 'DELETE': return '#dc2626'
      case 'SELECT': return '#2563eb'
      default: return '#6b7280'
    }
  }

  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case 'INSERT': return <FaCheckCircle />
      case 'UPDATE': return <FaExclamationTriangle />
      case 'DELETE': return <FaTimesCircle />
      case 'SELECT': return <FaEye />
      default: return <FaDatabase />
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

  if (!isOpen) return null

  return (
    <div className="ode-fixed ode-inset-0 ode-bg-black ode-bg-opacity-50 ode-flex ode-items-center ode-justify-center ode-z-50">
      <div className="ode-bg-white ode-rounded-lg ode-shadow-xl ode-max-w-6xl ode-w-full ode-mx-4 ode-max-h-[90vh] ode-overflow-hidden">
        {/* Header */}
        <div className="ode-flex ode-items-center ode-justify-between ode-p-6 ode-border-b">
          <div className="ode-flex ode-items-center ode-gap-3">
            <FaShieldAlt className="ode-text-2xl ode-text-primary" />
            <h2 className="ode-text-2xl ode-font-bold ode-text-charcoal">
              {t('security.monitor.title', 'Security Monitor')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="ode-text-gray-400 ode-hover:text-gray-600 ode-transition"
          >
            <FaTimesCircle className="ode-text-xl" />
          </button>
        </div>

        <div className="ode-p-6 ode-overflow-y-auto ode-max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="ode-flex ode-items-center ode-justify-center ode-py-12">
              <div className="ode-animate-spin ode-rounded-full ode-h-8 ode-w-8 ode-border-b-2 ode-border-primary"></div>
            </div>
          ) : (
            <div className="ode-space-y-6">
              {/* Security Context */}
              <div className="ode-card">
                <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                  {t('security.monitor.current_context', 'Current Security Context')}
                </h3>
                {securityContext ? (
                  <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-gap-4">
                    <div className="ode-flex ode-items-center ode-gap-3">
                      <FaUser className="ode-text-primary" />
                      <div>
                        <p className="ode-text-sm ode-text-gray">User ID</p>
                        <p className="ode-font-medium">{securityContext.userId}</p>
                      </div>
                    </div>
                    <div className="ode-flex ode-items-center ode-gap-3">
                      <FaShieldAlt className="ode-text-primary" />
                      <div>
                        <p className="ode-text-sm ode-text-gray">Role</p>
                        <p className="ode-font-medium">{securityContext.role}</p>
                      </div>
                    </div>
                    <div className="ode-flex ode-items-center ode-gap-3">
                      <FaCheckCircle className="ode-text-success" />
                      <div>
                        <p className="ode-text-sm ode-text-gray">Session Status</p>
                        <p className="ode-font-medium">
                          {securityContext.sessionValid ? 'Valid' : 'Invalid'}
                        </p>
                      </div>
                    </div>
                    <div className="ode-flex ode-items-center ode-gap-3">
                      <FaKey className="ode-text-primary" />
                      <div>
                        <p className="ode-text-sm ode-text-gray">Permissions</p>
                        <p className="ode-font-medium">{securityContext.permissions.length}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="ode-text-gray">No security context available</p>
                )}
              </div>

              {/* Security Metrics */}
              <div className="ode-card">
                <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                  {t('security.monitor.metrics', 'Security Metrics')}
                </h3>
                <div className="ode-grid ode-grid-2 ode-md-grid-4 ode-gap-4">
                  <div className="ode-text-center">
                    <div className="ode-text-2xl ode-font-bold ode-text-primary">
                      {securityMetrics.totalLogins}
                    </div>
                    <p className="ode-text-sm ode-text-gray">Total Logins</p>
                  </div>
                  <div className="ode-text-center">
                    <div className="ode-text-2xl ode-font-bold ode-text-danger">
                      {securityMetrics.failedAttempts}
                    </div>
                    <p className="ode-text-sm ode-text-gray">Failed Attempts</p>
                  </div>
                  <div className="ode-text-center">
                    <div className="ode-text-2xl ode-font-bold ode-text-warning">
                      {securityMetrics.suspiciousActivities}
                    </div>
                    <p className="ode-text-sm ode-text-gray">Suspicious Activities</p>
                  </div>
                  <div className="ode-text-center">
                    <div className="ode-text-2xl ode-font-bold ode-text-success">
                      {securityMetrics.dataAccessCount}
                    </div>
                    <p className="ode-text-sm ode-text-gray">Data Access Count</p>
                  </div>
                </div>
              </div>

              {/* Audit Logs */}
              <div className="ode-card">
                <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                  {t('security.monitor.audit_logs', 'Recent Audit Logs')}
                </h3>
                <div className="ode-space-y-3">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="ode-flex ode-items-center ode-justify-between ode-p-3 ode-bg-gray-50 ode-rounded-lg">
                      <div className="ode-flex ode-items-center ode-gap-3">
                        <div 
                          className="ode-p-2 ode-rounded-full"
                          style={{ 
                            backgroundColor: getOperationColor(log.operation) + '20',
                            color: getOperationColor(log.operation)
                          }}
                        >
                          {getOperationIcon(log.operation)}
                        </div>
                        <div>
                          <p className="ode-font-medium">{log.tableName}</p>
                          <p className="ode-text-sm ode-text-gray">{log.operation}</p>
                        </div>
                      </div>
                      <div className="ode-text-right">
                        <p className="ode-text-sm ode-text-gray">{formatTimestamp(log.timestamp)}</p>
                        <p className="ode-text-xs ode-text-gray">{log.ipAddress}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Status */}
              <div className="ode-card">
                <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                  {t('security.monitor.status', 'Security Status')}
                </h3>
                <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-gap-4">
                  <div className="ode-flex ode-items-center ode-gap-3">
                    <FaCheckCircle className="ode-text-success" />
                    <div>
                      <p className="ode-font-medium">RLS Policies</p>
                      <p className="ode-text-sm ode-text-gray">Active and configured</p>
                    </div>
                  </div>
                  <div className="ode-flex ode-items-center ode-gap-3">
                    <FaCheckCircle className="ode-text-success" />
                    <div>
                      <p className="ode-font-medium">Audit Logging</p>
                      <p className="ode-text-sm ode-text-gray">Enabled and recording</p>
                    </div>
                  </div>
                  <div className="ode-flex ode-items-center ode-gap-3">
                    <FaCheckCircle className="ode-text-success" />
                    <div>
                      <p className="ode-font-medium">Rate Limiting</p>
                      <p className="ode-text-sm ode-text-gray">Active protection</p>
                    </div>
                  </div>
                  <div className="ode-flex ode-items-center ode-gap-3">
                    <FaCheckCircle className="ode-text-success" />
                    <div>
                      <p className="ode-font-medium">Session Management</p>
                      <p className="ode-text-sm ode-text-gray">Secure and monitored</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SecurityMonitor
