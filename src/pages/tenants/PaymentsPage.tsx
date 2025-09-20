import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { tenantApi, type TenantPayment } from '../../lib/api/tenant'
import { 
  FaDollarSign, FaCalendar, FaCheckCircle, FaClock, FaExclamationTriangle,
  FaDownload, FaEye, FaCreditCard, FaBank
} from 'react-icons/fa'

const PaymentsPage: React.FC = () => {
  const { t } = useTranslation('common')
  const [payments, setPayments] = useState<TenantPayment[]>([])
  const [upcomingPayments, setUpcomingPayments] = useState<TenantPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // Mock tenant ID - в реальном приложении получать из auth
        const tenantId = 'tenant-1'
        const [allPayments, upcoming] = await Promise.all([
          tenantApi.getPayments(tenantId),
          tenantApi.getUpcomingPayments(tenantId)
        ])
        setPayments(allPayments)
        setUpcomingPayments(upcoming)
      } catch (error) {
        console.error('Error fetching payments:', error)
        // Fallback to mock data
        const mockPayments: TenantPayment[] = [
          {
            id: '1',
            tenant_id: 'tenant-1',
            lease_id: 'lease-1',
            amount: 150000,
            due_date: '2024-12-01',
            paid_date: '2024-11-28',
            status: 'paid',
            payment_method: 'bank_transfer',
            reference_number: 'TXN-001',
            description: 'Арендная плата за декабрь 2024'
          },
          {
            id: '2',
            tenant_id: 'tenant-1',
            lease_id: 'lease-1',
            amount: 150000,
            due_date: '2025-01-01',
            status: 'pending',
            description: 'Арендная плата за январь 2025'
          },
          {
            id: '3',
            tenant_id: 'tenant-1',
            lease_id: 'lease-1',
            amount: 150000,
            due_date: '2025-02-01',
            status: 'pending',
            description: 'Арендная плата за февраль 2025'
          }
        ]
        setPayments(mockPayments)
        setUpcomingPayments(mockPayments.filter(p => p.status === 'pending'))
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [])

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true
    return payment.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#16a34a'
      case 'pending': return '#f59e0b'
      case 'overdue': return '#dc2626'
      case 'cancelled': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Оплачено'
      case 'pending': return 'Ожидает оплаты'
      case 'overdue': return 'Просрочено'
      case 'cancelled': return 'Отменено'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return FaCheckCircle
      case 'pending': return FaClock
      case 'overdue': return FaExclamationTriangle
      case 'cancelled': return FaClock
      default: return FaClock
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handlePayment = async (paymentId: string) => {
    try {
      // В реальном приложении здесь будет интеграция с платежной системой
      await tenantApi.recordPayment(paymentId, {
        paid_date: new Date().toISOString(),
        payment_method: 'bank_transfer',
        reference_number: `TXN-${Date.now()}`
      })
      
      setPayments(prev => prev.map(p => 
        p.id === paymentId ? { ...p, status: 'paid' as const } : p
      ))
      alert('Платеж успешно обработан!')
    } catch (error) {
      console.error('Error processing payment:', error)
      alert('Ошибка при обработке платежа')
    }
  }

  return (
    <>
      <Helmet>
        <title>{t('tenant.payments.title', 'Платежи')} - ODPortal B2B</title>
        <meta name="description" content={t('tenant.payments.description', 'Управление платежами и арендной платой')} />
      </Helmet>

      <div className="ode-bg-gray" style={{ minHeight: '100vh', padding: '32px 0' }}>
        <div className="ode-container">
          {/* Header */}
          <div className="ode-dashboard-header">
            <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-2">
              {t('tenant.payments.heading', 'Платежи')}
            </h1>
            <p className="ode-text-gray">
              {t('tenant.payments.description', 'Управление платежами и арендной платой')}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="ode-grid ode-grid-cols-1 md:ode-grid-cols-3 ode-gap-6 ode-mb-8">
            <div className="ode-card">
              <div className="ode-flex ode-items-center ode-justify-between">
                <div>
                  <p className="ode-text-sm ode-font-medium ode-text-gray-600">Ожидающие платежи</p>
                  <p className="ode-text-2xl ode-font-bold ode-text-warning">
                    {upcomingPayments.length}
                  </p>
                </div>
                <FaClock className="ode-text-2xl ode-text-warning" />
              </div>
            </div>
            <div className="ode-card">
              <div className="ode-flex ode-items-center ode-justify-between">
                <div>
                  <p className="ode-text-sm ode-font-medium ode-text-gray-600">Общая сумма к оплате</p>
                  <p className="ode-text-2xl ode-font-bold ode-text-charcoal">
                    {formatAmount(upcomingPayments.reduce((sum, p) => sum + p.amount, 0))}
                  </p>
                </div>
                <FaDollarSign className="ode-text-2xl ode-text-primary" />
              </div>
            </div>
            <div className="ode-card">
              <div className="ode-flex ode-items-center ode-justify-between">
                <div>
                  <p className="ode-text-sm ode-font-medium ode-text-gray-600">Просроченные</p>
                  <p className="ode-text-2xl ode-font-bold ode-text-danger">
                    {payments.filter(p => p.status === 'overdue').length}
                  </p>
                </div>
                <FaExclamationTriangle className="ode-text-2xl ode-text-danger" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="ode-card ode-mb-6">
            <div className="ode-flex ode-items-center ode-justify-between">
              <h2 className="ode-text-xl ode-font-semibold ode-text-charcoal">
                {t('tenant.payments.payment_history', 'История платежей')}
              </h2>
              <div className="ode-flex ode-gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`ode-btn ode-btn-sm ${filter === 'all' ? 'ode-btn-primary' : 'ode-btn-secondary'}`}
                >
                  Все
                </button>
                <button
                  onClick={() => setFilter('paid')}
                  className={`ode-btn ode-btn-sm ${filter === 'paid' ? 'ode-btn-primary' : 'ode-btn-secondary'}`}
                >
                  Оплаченные
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`ode-btn ode-btn-sm ${filter === 'pending' ? 'ode-btn-primary' : 'ode-btn-secondary'}`}
                >
                  Ожидающие
                </button>
              </div>
            </div>
          </div>

          {/* Payments List */}
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
                {filteredPayments.map((payment) => {
                  const StatusIcon = getStatusIcon(payment.status)
                  return (
                    <div key={payment.id} className="ode-p-6 ode-border-b last:ode-border-b-0">
                      <div className="ode-flex ode-items-center ode-justify-between">
                        <div className="ode-flex ode-items-center ode-gap-4">
                          <div 
                            className="ode-p-2 ode-rounded-full"
                            style={{ backgroundColor: `${getStatusColor(payment.status)}20` }}
                          >
                            <StatusIcon 
                              className="ode-text-lg"
                              style={{ color: getStatusColor(payment.status) }}
                            />
                          </div>
                          <div>
                            <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal">
                              {payment.description}
                            </h3>
                            <div className="ode-flex ode-items-center ode-gap-4 ode-mt-1">
                              <span className="ode-text-sm ode-text-gray">
                                <FaCalendar className="ode-inline ode-mr-1" />
                                Срок: {formatDate(payment.due_date)}
                              </span>
                              {payment.paid_date && (
                                <span className="ode-text-sm ode-text-gray">
                                  Оплачено: {formatDate(payment.paid_date)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="ode-flex ode-items-center ode-gap-4">
                          <div className="ode-text-right">
                            <p className="ode-text-xl ode-font-bold ode-text-charcoal">
                              {formatAmount(payment.amount)}
                            </p>
                            <span 
                              className="ode-text-sm ode-font-medium"
                              style={{ color: getStatusColor(payment.status) }}
                            >
                              {getStatusText(payment.status)}
                            </span>
                          </div>
                          <div className="ode-flex ode-gap-2">
                            {payment.status === 'pending' && (
                              <button
                                onClick={() => handlePayment(payment.id)}
                                className="ode-btn ode-btn-primary ode-btn-sm"
                              >
                                <FaCreditCard className="ode-mr-1" />
                                Оплатить
                              </button>
                            )}
                            <button className="ode-btn ode-btn-secondary ode-btn-sm">
                              <FaEye className="ode-mr-1" />
                              Подробнее
                            </button>
                            {payment.reference_number && (
                              <button className="ode-btn ode-btn-secondary ode-btn-sm">
                                <FaDownload className="ode-mr-1" />
                                Квитанция
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {!loading && filteredPayments.length === 0 && (
              <div className="ode-text-center ode-p-12">
                <FaDollarSign className="ode-text-4xl ode-text-gray-300 ode-mx-auto ode-mb-4" />
                <p className="ode-text-gray">Платежи не найдены</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentsPage
