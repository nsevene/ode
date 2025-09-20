import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import AdminNavigation from '../../components/admin/AdminNavigation'
import { adminApi } from '../../lib/api/admin'
import { 
  FaUsers, FaFileAlt, FaBuilding, FaDollarSign, FaChartLine, FaCog, FaShieldAlt, 
  FaGamepad, FaFolder, FaBell,
  FaArrowUp, FaArrowDown
} from 'react-icons/fa'

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalApplications: 0,
    totalRevenue: 0,
    pendingApplications: 0,
    activeProperties: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        // Fallback to mock data
        setStats({
          totalUsers: 1234,
          totalProperties: 156,
          totalApplications: 23,
          totalRevenue: 2500000,
          pendingApplications: 5,
          activeProperties: 120
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statsData = [
    {
      name: 'Всего пользователей',
      value: stats.totalUsers.toLocaleString(),
      change: '+12%',
      changeType: 'positive',
      icon: FaUsers,
      color: '#8B0000'
    },
    {
      name: 'Новые заявки',
      value: stats.pendingApplications.toString(),
      change: '+5%',
      changeType: 'positive',
      icon: FaFileAlt,
      color: '#f59e0b'
    },
    {
      name: 'Активные объекты',
      value: stats.activeProperties.toString(),
      change: '+2%',
      changeType: 'positive',
      icon: FaBuilding,
      color: '#2563eb'
    },
    {
      name: 'Доход за месяц',
      value: `₽${(stats.totalRevenue / 1000000).toFixed(1)}М`,
      change: '+8%',
      changeType: 'positive',
      icon: FaDollarSign,
      color: '#16a34a'
    }
  ]

  const quickActions = [
    {
      title: 'Управление пользователями',
      description: 'Создание, редактирование, блокировка пользователей',
      icon: FaUsers,
      link: '/admin/users',
      color: '#8B0000'
    },
    {
      title: 'Управление заявками',
      description: 'Обработка заявок от арендаторов и инвесторов',
      icon: FaFileAlt,
      link: '/admin/applications',
      color: '#f59e0b'
    },
    {
      title: 'Управление недвижимостью',
      description: 'Добавление, редактирование объектов недвижимости',
      icon: FaBuilding,
      link: '/admin/properties',
      color: '#2563eb'
    },
    {
      title: 'Финансовый модуль',
      description: 'Управление платежами, счетами, отчетностью',
      icon: FaDollarSign,
      link: '/admin/finance',
      color: '#16a34a'
    },
    {
      title: 'Аналитика и отчеты',
      description: 'Статистика, графики, аналитические отчеты',
      icon: FaChartLine,
      link: '/admin/analytics',
      color: '#8B5CF6'
    },
    {
      title: 'Геймификация',
      description: 'Управление Taste Alley, Compass, Passport',
      icon: FaGamepad,
      link: '/admin/gamification',
      color: '#EC4899'
    },
    {
      title: 'Data Room',
      description: 'Управление документами и файлами',
      icon: FaFolder,
      link: '/admin/documents',
      color: '#06B6D4'
    },
    {
      title: 'Настройки системы',
      description: 'Конфигурация системы, роли, права доступа',
      icon: FaCog,
      link: '/admin/settings',
      color: '#6B7280'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'application',
      message: 'Новая заявка от ООО "ТехноИнновации"',
      time: '2 минуты назад',
      status: 'pending',
      icon: FaFileAlt
    },
    {
      id: 2,
      type: 'user',
      message: 'Зарегистрирован новый пользователь',
      time: '15 минут назад',
      status: 'success',
      icon: FaUsers
    },
    {
      id: 3,
      type: 'property',
      message: 'Обновлен объект "Бизнес-центр Солнечный"',
      time: '1 час назад',
      status: 'info',
      icon: FaBuilding
    },
    {
      id: 4,
      type: 'payment',
      message: 'Получен платеж от арендатора',
      time: '2 часа назад',
      status: 'success',
      icon: FaDollarSign
    },
    {
      id: 5,
      type: 'gamification',
      message: 'Пользователь получил достижение в Taste Alley',
      time: '3 часа назад',
      status: 'info',
      icon: FaGamepad
    }
  ]

  const systemStatus = [
    { name: 'API', status: 'success', icon: FaShieldAlt },
    { name: 'База данных', status: 'success', icon: FaShieldAlt },
    { name: 'Файловое хранилище', status: 'success', icon: FaShieldAlt },
    { name: 'Email сервис', status: 'warning', icon: FaBell },
    { name: 'Платежная система', status: 'success', icon: FaDollarSign },
    { name: 'Аналитика', status: 'success', icon: FaChartLine }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#16a34a'
      case 'warning': return '#f59e0b'
      case 'error': return '#dc2626'
      case 'pending': return '#f59e0b'
      case 'info': return '#2563eb'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return 'Работает'
      case 'warning': return 'Проблемы'
      case 'error': return 'Ошибка'
      case 'pending': return 'На рассмотрении'
      case 'info': return 'Информация'
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
              <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-2">Панель администратора</h1>
              <p className="ode-text-gray">Добро пожаловать, {user?.email}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="ode-text-sm ode-text-gray">
                Роль: <span className="ode-font-medium ode-text-primary">{user?.role}</span>
              </div>
              <Link to="/admin/settings" className="ode-btn ode-btn-secondary">
                <FaCog style={{ marginRight: '8px' }} />
                Настройки
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="ode-container" style={{ padding: '32px 0' }}>
        {/* Stats Grid */}
        <div className="ode-grid ode-grid-4 ode-mb-6">
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
            statsData.map((stat) => (
              <div key={stat.name} className="ode-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <p className="ode-text-sm ode-font-medium ode-text-gray ode-mb-1">{stat.name}</p>
                    <p className="ode-text-3xl ode-font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <stat.icon style={{ width: '24px', height: '24px', color: stat.color }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {stat.changeType === 'positive' ? (
                        <FaArrowUp style={{ width: '12px', height: '12px', color: '#16a34a' }} />
                      ) : (
                        <FaArrowDown style={{ width: '12px', height: '12px', color: '#dc2626' }} />
                      )}
                      <span className={`ode-text-sm ode-font-medium ${
                        stat.changeType === 'positive' ? 'ode-text-success' : 'ode-text-error'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="ode-grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          {/* Quick Actions */}
          <div>
            <div className="ode-card">
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-4">Быстрые действия</h3>
              <div className="ode-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                {quickActions.map((action) => (
                  <Link key={action.title} to={action.link} className="ode-card ode-card-interactive">
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        background: action.color + '20', 
                        borderRadius: '8px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <action.icon style={{ width: '20px', height: '20px', color: action.color }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 className="ode-text-md ode-font-semibold ode-text-charcoal ode-mb-1">{action.title}</h4>
                        <p className="ode-text-sm ode-text-gray">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities & System Status */}
          <div>
            <div className="ode-card ode-mb-4">
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-4">Последние активности</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentActivities.map((activity) => (
                  <div key={activity.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      background: getStatusColor(activity.status) + '20', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <activity.icon style={{ width: '14px', height: '14px', color: getStatusColor(activity.status) }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p className="ode-text-sm ode-text-charcoal">{activity.message}</p>
                      <p className="ode-text-xs ode-text-gray">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="ode-mt-4">
                <Link to="/admin/activities" className="ode-btn ode-btn-secondary" style={{ width: '100%' }}>
                  Показать все активности
                </Link>
              </div>
            </div>

            {/* System Status */}
            <div className="ode-card">
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-4">Статус системы</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {systemStatus.map((item) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <item.icon style={{ 
                        width: '16px', 
                        height: '16px', 
                        color: getStatusColor(item.status)
                      }} />
                      <span className="ode-text-sm ode-text-gray">{item.name}</span>
                    </div>
                    <span className={`ode-text-sm ode-font-medium ${
                      item.status === 'success' ? 'ode-text-success' : 
                      item.status === 'warning' ? 'ode-text-warning' : 'ode-text-error'
                    }`}>
                      {getStatusText(item.status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage