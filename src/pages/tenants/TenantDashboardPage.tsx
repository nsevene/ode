import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { tenantApi } from '../../lib/api/tenant'
import { 
  FaHome, FaFileAlt, FaDollarSign, FaWrench, FaCalendar, FaChartLine,
  FaArrowUp, FaArrowDown, FaClock, FaCheckCircle, FaExclamationTriangle
} from 'react-icons/fa'

const TenantDashboardPage: React.FC = () => {
  const { t } = useTranslation('common')
  const [stats, setStats] = useState({
    activeLeases: 0,
    pendingPayments: 0,
    overduePayments: 0,
    openMaintenanceRequests: 0,
    upcomingBookings: 0,
    totalSpent: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Mock tenant ID - в реальном приложении получать из auth
        const tenantId = 'tenant-1'
        const data = await tenantApi.getDashboardStats(tenantId)
        setStats(data)
      } catch (error) {
        console.error('Error fetching tenant stats:', error)
        // Fallback to mock data
        setStats({
          activeLeases: 1,
          pendingPayments: 2,
          overduePayments: 0,
          openMaintenanceRequests: 1,
          upcomingBookings: 3,
          totalSpent: 450000
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statsData = [
    {
      name: 'Активные договоры',
      value: stats.activeLeases.toString(),
      icon: FaHome,
      color: '#8B0000',
      link: '/tenants/leases'
    },
    {
      name: 'Ожидающие платежи',
      value: stats.pendingPayments.toString(),
      icon: FaDollarSign,
      color: '#f59e0b',
      link: '/tenants/payments'
    },
    {
      name: 'Заявки на обслуживание',
      value: stats.openMaintenanceRequests.toString(),
      icon: FaWrench,
      color: '#2563eb',
      link: '/tenants/maintenance'
    },
    {
      name: 'Предстоящие бронирования',
      value: stats.upcomingBookings.toString(),
      icon: FaCalendar,
      color: '#16a34a',
      link: '/tenants/bookings'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'payment',
      title: 'Платеж за декабрь получен',
      time: '2 часа назад',
      status: 'success',
      icon: FaCheckCircle
    },
    {
      id: 2,
      type: 'maintenance',
      title: 'Заявка на ремонт кондиционера',
      time: '1 день назад',
      status: 'pending',
      icon: FaClock
    },
    {
      id: 3,
      type: 'booking',
      title: 'Бронирование переговорной на завтра',
      time: '2 дня назад',
      status: 'confirmed',
      icon: FaCalendar
    },
    {
      id: 4,
      type: 'lease',
      title: 'Обновлен договор аренды',
      time: '1 неделю назад',
      status: 'success',
      icon: FaFileAlt
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#16a34a'
      case 'pending': return '#f59e0b'
      case 'confirmed': return '#2563eb'
      case 'warning': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return 'Выполнено'
      case 'pending': return 'В ожидании'
      case 'confirmed': return 'Подтверждено'
      case 'warning': return 'Требует внимания'
      default: return status
    }
  }

  return (
    <>
      <Helmet>
        <title>{t('tenant.dashboard.title', 'Панель арендатора')} - ODPortal B2B</title>
        <meta name="description" content={t('tenant.dashboard.description', 'Личный кабинет арендатора с управлением договорами, платежами и обслуживанием')} />
      </Helmet>

      <div className="ode-bg-gray" style={{ minHeight: '100vh', padding: '32px 0' }}>
        <div className="ode-container">
          {/* Header */}
          <div className="ode-dashboard-header">
            <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-2">
              {t('tenant.dashboard.heading', 'Панель арендатора')}
            </h1>
            <p className="ode-text-gray">
              {t('tenant.dashboard.welcome_message', 'Добро пожаловать в ваш личный кабинет!')}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="ode-grid ode-grid-cols-1 md:ode-grid-cols-2 lg:ode-grid-cols-4 ode-gap-6 ode-mb-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="ode-card">
                  <div className="ode-animate-pulse">
                    <div className="ode-h-4 ode-bg-gray-200 ode-rounded ode-mb-2"></div>
                    <div className="ode-h-8 ode-bg-gray-200 ode-rounded ode-mb-2"></div>
                    <div className="ode-h-4 ode-bg-gray-200 ode-rounded ode-w-16"></div>
                  </div>
                </div>
              ))
            ) : (
              statsData.map((stat, index) => (
                <Link key={index} to={stat.link} className="ode-card hover:ode-shadow-lg transition-shadow">
                  <div className="ode-flex ode-items-center ode-justify-between">
                    <div>
                      <p className="ode-text-sm ode-font-medium ode-text-gray-600">{stat.name}</p>
                      <p className="ode-text-2xl ode-font-bold ode-text-charcoal">{stat.value}</p>
                    </div>
                    <div 
                      className="ode-p-3 ode-rounded-full"
                      style={{ backgroundColor: `${stat.color}20` }}
                    >
                      <stat.icon 
                        className="ode-text-2xl"
                        style={{ color: stat.color }}
                      />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="ode-grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
            {/* Quick Actions */}
            <div>
              <div className="ode-card">
                <h2 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-6">
                  {t('tenant.dashboard.quick_actions', 'Быстрые действия')}
                </h2>
                <div className="ode-grid ode-grid-cols-2 ode-gap-4">
                  <Link to="/tenants/payments" className="ode-btn ode-btn-primary ode-flex ode-items-center ode-justify-center">
                    <FaDollarSign className="ode-mr-2" />
                    {t('tenant.dashboard.make_payment', 'Оплатить')}
                  </Link>
                  <Link to="/tenants/maintenance" className="ode-btn ode-btn-secondary ode-flex ode-items-center ode-justify-center">
                    <FaWrench className="ode-mr-2" />
                    {t('tenant.dashboard.request_maintenance', 'Заявка на ремонт')}
                  </Link>
                  <Link to="/tenants/bookings" className="ode-btn ode-btn-secondary ode-flex ode-items-center ode-justify-center">
                    <FaCalendar className="ode-mr-2" />
                    {t('tenant.dashboard.book_space', 'Забронировать')}
                  </Link>
                  <Link to="/tenants/leases" className="ode-btn ode-btn-secondary ode-flex ode-items-center ode-justify-center">
                    <FaFileAlt className="ode-mr-2" />
                    {t('tenant.dashboard.view_leases', 'Договоры')}
                  </Link>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="ode-card ode-mt-6">
                <h2 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-6">
                  {t('tenant.dashboard.recent_activities', 'Последние активности')}
                </h2>
                <div className="ode-space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="ode-flex ode-items-start ode-gap-3">
                      <div 
                        className="ode-p-2 ode-rounded-full"
                        style={{ backgroundColor: `${getStatusColor(activity.status)}20` }}
                      >
                        <activity.icon 
                          className="ode-text-sm"
                          style={{ color: getStatusColor(activity.status) }}
                        />
                      </div>
                      <div className="ode-flex-1">
                        <p className="ode-text-sm ode-font-medium ode-text-charcoal">{activity.title}</p>
                        <p className="ode-text-xs ode-text-gray">{activity.time}</p>
                      </div>
                      <span 
                        className="ode-text-xs ode-font-medium"
                        style={{ color: getStatusColor(activity.status) }}
                      >
                        {getStatusText(activity.status)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              {/* Payment Status */}
              <div className="ode-card ode-mb-6">
                <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                  {t('tenant.dashboard.payment_status', 'Статус платежей')}
                </h3>
                <div className="ode-space-y-3">
                  <div className="ode-flex ode-justify-between ode-items-center">
                    <span className="ode-text-sm ode-text-gray">Декабрь 2024</span>
                    <span className="ode-text-sm ode-font-medium ode-text-success">Оплачено</span>
                  </div>
                  <div className="ode-flex ode-justify-between ode-items-center">
                    <span className="ode-text-sm ode-text-gray">Январь 2025</span>
                    <span className="ode-text-sm ode-font-medium ode-text-warning">Ожидает</span>
                  </div>
                  <div className="ode-flex ode-justify-between ode-items-center">
                    <span className="ode-text-sm ode-text-gray">Февраль 2025</span>
                    <span className="ode-text-sm ode-font-medium ode-text-gray">Не наступил</span>
                  </div>
                </div>
                <div className="ode-mt-4">
                  <Link to="/tenants/payments" className="ode-btn ode-btn-primary ode-w-full">
                    {t('tenant.dashboard.view_all_payments', 'Все платежи')}
                  </Link>
                </div>
              </div>

              {/* Maintenance Requests */}
              <div className="ode-card">
                <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                  {t('tenant.dashboard.maintenance_requests', 'Заявки на обслуживание')}
                </h3>
                <div className="ode-space-y-3">
                  <div className="ode-flex ode-justify-between ode-items-center">
                    <span className="ode-text-sm ode-text-gray">Кондиционер</span>
                    <span className="ode-text-sm ode-font-medium ode-text-warning">В работе</span>
                  </div>
                  <div className="ode-flex ode-justify-between ode-items-center">
                    <span className="ode-text-sm ode-text-gray">Освещение</span>
                    <span className="ode-text-sm ode-font-medium ode-text-success">Завершено</span>
                  </div>
                </div>
                <div className="ode-mt-4">
                  <Link to="/tenants/maintenance" className="ode-btn ode-btn-secondary ode-w-full">
                    {t('tenant.dashboard.view_all_requests', 'Все заявки')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TenantDashboardPage
