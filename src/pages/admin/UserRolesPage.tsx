import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { 
  FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaPlus, FaUser, 
  FaUserShield, FaUserCheck, FaUserTimes, FaCrown, FaUsers,
  FaEnvelope, FaPhone, FaBuilding, FaCalendar, FaKey, FaShield,
  FaCheck, FaTimes, FaSpinner, FaDownload, FaUpload, FaCopy,
  FaSortAmountDown, FaSortAmountUp, FaRefresh, FaHistory,
  FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaLock
} from 'react-icons/fa'
import AdminNavigation from '../../components/admin/AdminNavigation'
import { adminApi, type AdminUser } from '../../lib/api/admin'

const UserRolesPage: React.FC = () => {
  const { t } = useTranslation('common')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [organizationFilter, setOrganizationFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminApi.getUsers()
        setUsers(data)
      } catch (error) {
        console.error('Error fetching users:', error)
        // Fallback to mock data
        setUsers([
          {
            id: '1',
            email: 'admin@example.com',
            full_name: 'Администратор Системы',
            role: 'admin',
            status: 'active',
            created_at: '2024-01-01T10:00:00Z',
            last_login: '2024-12-20T09:30:00Z',
            organization_id: 'org_1'
          },
          {
            id: '2',
            email: 'investor@example.com',
            full_name: 'Иван Инвесторов',
            role: 'investor',
            status: 'active',
            created_at: '2024-02-15T14:20:00Z',
            last_login: '2024-12-19T16:45:00Z',
            organization_id: 'org_2'
          },
          {
            id: '3',
            email: 'tenant@example.com',
            full_name: 'Петр Арендаторов',
            role: 'tenant',
            status: 'active',
            created_at: '2024-03-10T11:15:00Z',
            last_login: '2024-12-18T13:20:00Z',
            organization_id: 'org_1'
          },
          {
            id: '4',
            email: 'pending@example.com',
            full_name: 'Ожидающий Пользователь',
            role: 'tenant',
            status: 'pending',
            created_at: '2024-12-19T08:30:00Z',
            last_login: null,
            organization_id: null
          },
          {
            id: '5',
            email: 'inactive@example.com',
            full_name: 'Неактивный Пользователь',
            role: 'investor',
            status: 'inactive',
            created_at: '2024-04-05T09:45:00Z',
            last_login: '2024-11-15T10:30:00Z',
            organization_id: 'org_2'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesOrganization = organizationFilter === 'all' || user.organization_id === organizationFilter
    return matchesSearch && matchesRole && matchesStatus && matchesOrganization
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'name':
        return a.full_name.localeCompare(b.full_name)
      case 'email':
        return a.email.localeCompare(b.email)
      case 'role':
        return a.role.localeCompare(b.role)
      case 'status':
        return a.status.localeCompare(b.status)
      default:
        return 0
    }
  })

  const handleViewDetails = (user: AdminUser) => {
    setSelectedUser(user)
    setShowDetails(true)
  }

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user)
    setShowDetails(true)
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return

    try {
      setProcessing(userId)
      await adminApi.deleteUser(userId)
      setUsers(prev => prev.filter(user => user.id !== userId))
      alert('Пользователь успешно удален')
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Ошибка при удалении пользователя')
    } finally {
      setProcessing(null)
    }
  }

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      setProcessing(userId)
      await adminApi.updateUserRole(userId, newRole)
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, role: newRole as 'admin' | 'investor' | 'tenant' }
          : user
      ))
      alert('Роль пользователя успешно обновлена')
    } catch (error) {
      console.error('Error updating user role:', error)
      alert('Ошибка при обновлении роли пользователя')
    } finally {
      setProcessing(null)
    }
  }

  const handleUpdateUserStatus = async (userId: string, newStatus: string) => {
    try {
      setProcessing(userId)
      await adminApi.updateUserStatus(userId, newStatus)
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status: newStatus as 'active' | 'inactive' | 'pending' }
          : user
      ))
      alert('Статус пользователя успешно обновлен')
    } catch (error) {
      console.error('Error updating user status:', error)
      alert('Ошибка при обновлении статуса пользователя')
    } finally {
      setProcessing(null)
    }
  }

  const handleBulkAction = async (action: string, userIds: string[]) => {
    try {
      setProcessing('bulk')
      switch (action) {
        case 'activate':
          await Promise.all(userIds.map(id => adminApi.updateUserStatus(id, 'active')))
          setUsers(prev => prev.map(user => 
            userIds.includes(user.id) ? { ...user, status: 'active' } : user
          ))
          break
        case 'deactivate':
          await Promise.all(userIds.map(id => adminApi.updateUserStatus(id, 'inactive')))
          setUsers(prev => prev.map(user => 
            userIds.includes(user.id) ? { ...user, status: 'inactive' } : user
          ))
          break
        case 'delete':
          await Promise.all(userIds.map(id => adminApi.deleteUser(id)))
          setUsers(prev => prev.filter(user => !userIds.includes(user.id)))
          break
      }
      alert(`Массовое действие "${action}" выполнено успешно`)
    } catch (error) {
      console.error('Error performing bulk action:', error)
      alert('Ошибка при выполнении массового действия')
    } finally {
      setProcessing(null)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#dc2626'
      case 'investor': return '#2563eb'
      case 'tenant': return '#16a34a'
      default: return '#6b7280'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Администратор'
      case 'investor': return 'Инвестор'
      case 'tenant': return 'Арендатор'
      default: return 'Неизвестно'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return FaCrown
      case 'investor': return FaUserShield
      case 'tenant': return FaUser
      default: return FaUser
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#16a34a'
      case 'inactive': return '#dc2626'
      case 'pending': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активный'
      case 'inactive': return 'Неактивный'
      case 'pending': return 'Ожидает активации'
      default: return 'Неизвестно'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return FaCheckCircle
      case 'inactive': return FaTimesCircle
      case 'pending': return FaClock
      default: return FaExclamationTriangle
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

  const getUniqueOrganizations = () => {
    return [...new Set(users.map(user => user.organization_id).filter(Boolean))].sort()
  }

  const getStats = () => {
    const total = users.length
    const active = users.filter(user => user.status === 'active').length
    const pending = users.filter(user => user.status === 'pending').length
    const admins = users.filter(user => user.role === 'admin').length
    const investors = users.filter(user => user.role === 'investor').length
    const tenants = users.filter(user => user.role === 'tenant').length

    return { total, active, pending, admins, investors, tenants }
  }

  const stats = getStats()

  return (
    <>
      <Helmet>
        <title>{t('admin.user_roles.title', 'Управление пользователями и ролями')} - ODPortal B2B</title>
        <meta name="description" content={t('admin.user_roles.description', 'Провижинг пользователей и управление ролями')} />
      </Helmet>
      
      <div className="ode-bg-gray" style={{ minHeight: '100vh', padding: '32px 0' }}>
        <div className="ode-container">
          <div className="ode-dashboard-layout">
            <AdminNavigation />
            
            <div className="ode-dashboard-content">
              <div className="ode-dashboard-header">
                <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-2">
                  {t('admin.user_roles.heading', 'Управление пользователями и ролями')}
                </h1>
                <p className="ode-text-gray">
                  {t('admin.user_roles.description', 'Провижинг пользователей и управление ролями')}
                </p>
              </div>

              {/* Stats Cards */}
              <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-lg-grid-6 ode-gap-4 ode-mb-6">
                <div className="ode-card">
                  <div className="ode-p-4">
                    <div className="ode-flex ode-items-center ode-justify-between">
                      <div>
                        <p className="ode-text-sm ode-text-gray">Всего пользователей</p>
                        <p className="ode-text-2xl ode-font-bold ode-text-charcoal">{stats.total}</p>
                      </div>
                      <FaUsers className="ode-text-3xl ode-text-blue-500" />
                    </div>
                  </div>
                </div>
                
                <div className="ode-card">
                  <div className="ode-p-4">
                    <div className="ode-flex ode-items-center ode-justify-between">
                      <div>
                        <p className="ode-text-sm ode-text-gray">Активных</p>
                        <p className="ode-text-2xl ode-font-bold ode-text-green-500">{stats.active}</p>
                      </div>
                      <FaCheckCircle className="ode-text-3xl ode-text-green-500" />
                    </div>
                  </div>
                </div>
                
                <div className="ode-card">
                  <div className="ode-p-4">
                    <div className="ode-flex ode-items-center ode-justify-between">
                      <div>
                        <p className="ode-text-sm ode-text-gray">Ожидают</p>
                        <p className="ode-text-2xl ode-font-bold ode-text-yellow-500">{stats.pending}</p>
                      </div>
                      <FaClock className="ode-text-3xl ode-text-yellow-500" />
                    </div>
                  </div>
                </div>
                
                <div className="ode-card">
                  <div className="ode-p-4">
                    <div className="ode-flex ode-items-center ode-justify-between">
                      <div>
                        <p className="ode-text-sm ode-text-gray">Админов</p>
                        <p className="ode-text-2xl ode-font-bold ode-text-red-500">{stats.admins}</p>
                      </div>
                      <FaCrown className="ode-text-3xl ode-text-red-500" />
                    </div>
                  </div>
                </div>
                
                <div className="ode-card">
                  <div className="ode-p-4">
                    <div className="ode-flex ode-items-center ode-justify-between">
                      <div>
                        <p className="ode-text-sm ode-text-gray">Инвесторов</p>
                        <p className="ode-text-2xl ode-font-bold ode-text-blue-500">{stats.investors}</p>
                      </div>
                      <FaUserShield className="ode-text-3xl ode-text-blue-500" />
                    </div>
                  </div>
                </div>
                
                <div className="ode-card">
                  <div className="ode-p-4">
                    <div className="ode-flex ode-items-center ode-justify-between">
                      <div>
                        <p className="ode-text-sm ode-text-gray">Арендаторов</p>
                        <p className="ode-text-2xl ode-font-bold ode-text-green-500">{stats.tenants}</p>
                      </div>
                      <FaUser className="ode-text-3xl ode-text-green-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters and Search */}
              <div className="ode-card ode-mb-6">
                <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-lg-grid-5 ode-gap-4 ode-mb-4">
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Поиск</label>
                    <div className="ode-relative">
                      <FaSearch className="ode-absolute ode-left-3 ode-top-1/2 ode-transform ode--translate-y-1/2 ode-text-gray-400" />
                      <input
                        type="text"
                        placeholder="Имя, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="ode-w-full ode-pl-10 ode-pr-4 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary ode-focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Роль</label>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary"
                    >
                      <option value="all">Все роли</option>
                      <option value="admin">Администратор</option>
                      <option value="investor">Инвестор</option>
                      <option value="tenant">Арендатор</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Статус</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary"
                    >
                      <option value="all">Все статусы</option>
                      <option value="active">Активный</option>
                      <option value="inactive">Неактивный</option>
                      <option value="pending">Ожидает активации</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Организация</label>
                    <select
                      value={organizationFilter}
                      onChange={(e) => setOrganizationFilter(e.target.value)}
                      className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary"
                    >
                      <option value="all">Все организации</option>
                      {getUniqueOrganizations().map(org => (
                        <option key={org} value={org}>{org}</option>
                      ))}
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
                      <option value="name">По имени</option>
                      <option value="email">По email</option>
                      <option value="role">По роли</option>
                      <option value="status">По статусу</option>
                    </select>
                  </div>
                </div>
                
                <div className="ode-flex ode-justify-between ode-items-center">
                  <div className="ode-flex ode-items-center ode-gap-4">
                    <span className="ode-text-sm ode-text-gray">
                      Найдено: {filteredUsers.length} пользователей
                    </span>
                    <span className="ode-text-sm ode-text-gray">
                      Активных: {filteredUsers.filter(user => user.status === 'active').length}
                    </span>
                  </div>
                  
                  <div className="ode-flex ode-items-center ode-gap-2">
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="ode-btn ode-btn-primary ode-btn-sm"
                    >
                      <FaPlus className="ode-mr-2" />
                      Создать пользователя
                    </button>
                    <button className="ode-btn ode-btn-secondary ode-btn-sm">
                      <FaDownload className="ode-mr-2" />
                      Экспорт
                    </button>
                    <button className="ode-btn ode-btn-secondary ode-btn-sm">
                      <FaUpload className="ode-mr-2" />
                      Импорт
                    </button>
                  </div>
                </div>
              </div>

              {/* Users List */}
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
                  filteredUsers.map((user) => {
                    const RoleIcon = getRoleIcon(user.role)
                    const StatusIcon = getStatusIcon(user.status)
                    
                    return (
                      <div key={user.id} className="ode-card ode-hover-shadow ode-transition">
                        <div className="ode-p-6">
                          <div className="ode-flex ode-items-start ode-justify-between ode-mb-4">
                            <div className="ode-flex ode-items-center ode-gap-4">
                              <div 
                                className="ode-w-12 ode-h-12 ode-rounded-full ode-flex ode-items-center ode-justify-center"
                                style={{ backgroundColor: getRoleColor(user.role) + '20' }}
                              >
                                <RoleIcon 
                                  className="ode-text-xl"
                                  style={{ color: getRoleColor(user.role) }}
                                />
                              </div>
                              <div>
                                <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal">
                                  {user.full_name}
                                </h3>
                                <p className="ode-text-sm ode-text-gray">{user.email}</p>
                                <div className="ode-flex ode-items-center ode-gap-2 ode-mt-1">
                                  <span 
                                    className="ode-badge"
                                    style={{
                                      backgroundColor: getRoleColor(user.role) + '20',
                                      color: getRoleColor(user.role)
                                    }}
                                  >
                                    {getRoleText(user.role)}
                                  </span>
                                  <span 
                                    className="ode-badge"
                                    style={{
                                      backgroundColor: getStatusColor(user.status) + '20',
                                      color: getStatusColor(user.status)
                                    }}
                                  >
                                    <StatusIcon className="ode-mr-1" />
                                    {getStatusText(user.status)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="ode-flex ode-items-center ode-gap-2">
                              <button
                                onClick={() => handleViewDetails(user)}
                                className="ode-btn ode-btn-secondary ode-btn-sm"
                              >
                                <FaEye />
                                Подробнее
                              </button>
                              <button
                                onClick={() => handleEditUser(user)}
                                className="ode-btn ode-btn-primary ode-btn-sm"
                              >
                                <FaEdit />
                                Редактировать
                              </button>
                              <div className="ode-dropdown">
                                <button className="ode-btn ode-btn-ghost ode-btn-sm">
                                  <FaKey />
                                  Роль
                                </button>
                                <div className="ode-dropdown-content">
                                  <button
                                    onClick={() => handleUpdateUserRole(user.id, 'admin')}
                                    disabled={processing === user.id}
                                    className="ode-dropdown-item"
                                  >
                                    <FaCrown className="ode-mr-2" />
                                    Администратор
                                  </button>
                                  <button
                                    onClick={() => handleUpdateUserRole(user.id, 'investor')}
                                    disabled={processing === user.id}
                                    className="ode-dropdown-item"
                                  >
                                    <FaUserShield className="ode-mr-2" />
                                    Инвестор
                                  </button>
                                  <button
                                    onClick={() => handleUpdateUserRole(user.id, 'tenant')}
                                    disabled={processing === user.id}
                                    className="ode-dropdown-item"
                                  >
                                    <FaUser className="ode-mr-2" />
                                    Арендатор
                                  </button>
                                </div>
                              </div>
                              <div className="ode-dropdown">
                                <button className="ode-btn ode-btn-ghost ode-btn-sm">
                                  <FaShield />
                                  Статус
                                </button>
                                <div className="ode-dropdown-content">
                                  <button
                                    onClick={() => handleUpdateUserStatus(user.id, 'active')}
                                    disabled={processing === user.id}
                                    className="ode-dropdown-item"
                                  >
                                    <FaCheckCircle className="ode-mr-2" />
                                    Активировать
                                  </button>
                                  <button
                                    onClick={() => handleUpdateUserStatus(user.id, 'inactive')}
                                    disabled={processing === user.id}
                                    className="ode-dropdown-item"
                                  >
                                    <FaTimesCircle className="ode-mr-2" />
                                    Деактивировать
                                  </button>
                                  <button
                                    onClick={() => handleUpdateUserStatus(user.id, 'pending')}
                                    disabled={processing === user.id}
                                    className="ode-dropdown-item"
                                  >
                                    <FaClock className="ode-mr-2" />
                                    В ожидание
                                  </button>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={processing === user.id}
                                className="ode-btn ode-btn-danger ode-btn-sm"
                              >
                                {processing === user.id ? (
                                  <FaSpinner className="ode-animate-spin" />
                                ) : (
                                  <FaTrash />
                                )}
                                Удалить
                              </button>
                            </div>
                          </div>
                          
                          <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-lg-grid-4 ode-gap-4 ode-mb-4">
                            <div className="ode-flex ode-items-center ode-gap-2">
                              <FaEnvelope className="ode-text-gray-400" />
                              <span className="ode-text-sm ode-text-gray">{user.email}</span>
                            </div>
                            <div className="ode-flex ode-items-center ode-gap-2">
                              <FaBuilding className="ode-text-gray-400" />
                              <span className="ode-text-sm ode-text-gray">{user.organization_id || 'Не назначена'}</span>
                            </div>
                            <div className="ode-flex ode-items-center ode-gap-2">
                              <FaCalendar className="ode-text-gray-400" />
                              <span className="ode-text-sm ode-text-gray">Создан: {formatDate(user.created_at)}</span>
                            </div>
                            <div className="ode-flex ode-items-center ode-gap-2">
                              <FaHistory className="ode-text-gray-400" />
                              <span className="ode-text-sm ode-text-gray">
                                {user.last_login ? `Вход: ${formatDate(user.last_login)}` : 'Никогда не входил'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="ode-flex ode-items-center ode-justify-between">
                            <div className="ode-flex ode-items-center ode-gap-4">
                              <div className="ode-flex ode-items-center ode-gap-1">
                                <FaShield className="ode-text-gray-400" />
                                <span className="ode-text-sm ode-text-gray">
                                  ID: {user.id}
                                </span>
                              </div>
                              {user.organization_id && (
                                <div className="ode-flex ode-items-center ode-gap-1">
                                  <FaBuilding className="ode-text-gray-400" />
                                  <span className="ode-text-sm ode-text-gray">
                                    Организация: {user.organization_id}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="ode-text-right">
                              <span className="ode-text-xs ode-text-gray">Последняя активность</span>
                              <p className="ode-text-sm ode-font-medium ode-text-charcoal">
                                {user.last_login ? formatDate(user.last_login) : 'Никогда'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {!loading && filteredUsers.length === 0 && (
                <div className="ode-text-center" style={{ padding: '48px 0' }}>
                  <FaUsers className="ode-text-6xl ode-text-gray-300 ode-mb-4" />
                  <h3 className="ode-text-xl ode-font-semibold ode-text-gray ode-mb-2">
                    Пользователи не найдены
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

      {/* User Details Modal */}
      {showDetails && selectedUser && (
        <div className="ode-fixed ode-inset-0 ode-bg-black ode-bg-opacity-50 ode-flex ode-items-center ode-justify-center ode-z-50">
          <div className="ode-bg-white ode-rounded-lg ode-shadow-xl ode-max-w-4xl ode-w-full ode-mx-4 ode-max-h-[90vh] ode-overflow-hidden">
            <div className="ode-flex ode-items-center ode-justify-between ode-p-6 ode-border-b">
              <h2 className="ode-text-2xl ode-font-bold ode-text-charcoal">
                Детали пользователя
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
                      <span className="ode-text-sm ode-text-gray">Полное имя</span>
                      <p className="ode-text-charcoal">{selectedUser.full_name}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Email</span>
                      <p className="ode-text-charcoal">{selectedUser.email}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Роль</span>
                      <p 
                        className="ode-font-medium"
                        style={{ color: getRoleColor(selectedUser.role) }}
                      >
                        {getRoleText(selectedUser.role)}
                      </p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Статус</span>
                      <p 
                        className="ode-font-medium"
                        style={{ color: getStatusColor(selectedUser.status) }}
                      >
                        {getStatusText(selectedUser.status)}
                      </p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">ID пользователя</span>
                      <p className="ode-text-charcoal">{selectedUser.id}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Организация</span>
                      <p className="ode-text-charcoal">{selectedUser.organization_id || 'Не назначена'}</p>
                    </div>
                  </div>
                </div>

                {/* Activity Info */}
                <div>
                  <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                    Активность
                  </h3>
                  <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-gap-4">
                    <div>
                      <span className="ode-text-sm ode-text-gray">Дата создания</span>
                      <p className="ode-text-charcoal">{formatDate(selectedUser.created_at)}</p>
                    </div>
                    <div>
                      <span className="ode-text-sm ode-text-gray">Последний вход</span>
                      <p className="ode-text-charcoal">
                        {selectedUser.last_login ? formatDate(selectedUser.last_login) : 'Никогда не входил'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                    Разрешения
                  </h3>
                  <div className="ode-space-y-2">
                    {selectedUser.role === 'admin' && (
                      <>
                        <div className="ode-flex ode-items-center ode-gap-2">
                          <FaCheckCircle className="ode-text-green-500" />
                          <span className="ode-text-sm ode-text-charcoal">Полный доступ к системе</span>
                        </div>
                        <div className="ode-flex ode-items-center ode-gap-2">
                          <FaCheckCircle className="ode-text-green-500" />
                          <span className="ode-text-sm ode-text-charcoal">Управление пользователями</span>
                        </div>
                        <div className="ode-flex ode-items-center ode-gap-2">
                          <FaCheckCircle className="ode-text-green-500" />
                          <span className="ode-text-sm ode-text-charcoal">Управление недвижимостью</span>
                        </div>
                        <div className="ode-flex ode-items-center ode-gap-2">
                          <FaCheckCircle className="ode-text-green-500" />
                          <span className="ode-text-sm ode-text-charcoal">Просмотр журнала аудита</span>
                        </div>
                      </>
                    )}
                    {selectedUser.role === 'investor' && (
                      <>
                        <div className="ode-flex ode-items-center ode-gap-2">
                          <FaCheckCircle className="ode-text-green-500" />
                          <span className="ode-text-sm ode-text-charcoal">Просмотр инвестиционных возможностей</span>
                        </div>
                        <div className="ode-flex ode-items-center ode-gap-2">
                          <FaCheckCircle className="ode-text-green-500" />
                          <span className="ode-text-sm ode-text-charcoal">Управление портфелем</span>
                        </div>
                        <div className="ode-flex ode-items-center ode-gap-2">
                          <FaTimesCircle className="ode-text-red-500" />
                          <span className="ode-text-sm ode-text-charcoal">Административные функции</span>
                        </div>
                      </>
                    )}
                    {selectedUser.role === 'tenant' && (
                      <>
                        <div className="ode-flex ode-items-center ode-gap-2">
                          <FaCheckCircle className="ode-text-green-500" />
                          <span className="ode-text-sm ode-text-charcoal">Подача заявок на аренду</span>
                        </div>
                        <div className="ode-flex ode-items-center ode-gap-2">
                          <FaCheckCircle className="ode-text-green-500" />
                          <span className="ode-text-sm ode-text-charcoal">Просмотр статуса заявок</span>
                        </div>
                        <div className="ode-flex ode-items-center ode-gap-2">
                          <FaTimesCircle className="ode-text-red-500" />
                          <span className="ode-text-sm ode-text-charcoal">Административные функции</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">
                    Действия
                  </h3>
                  <div className="ode-flex ode-items-center ode-gap-2">
                    <button
                      onClick={() => handleUpdateUserRole(selectedUser.id, selectedUser.role === 'admin' ? 'investor' : 'admin')}
                      className="ode-btn ode-btn-primary ode-btn-sm"
                    >
                      <FaKey className="ode-mr-2" />
                      Изменить роль
                    </button>
                    <button
                      onClick={() => handleUpdateUserStatus(selectedUser.id, selectedUser.status === 'active' ? 'inactive' : 'active')}
                      className="ode-btn ode-btn-secondary ode-btn-sm"
                    >
                      <FaShield className="ode-mr-2" />
                      Изменить статус
                    </button>
                    <button
                      onClick={() => handleDeleteUser(selectedUser.id)}
                      className="ode-btn ode-btn-danger ode-btn-sm"
                    >
                      <FaTrash className="ode-mr-2" />
                      Удалить пользователя
                    </button>
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

export default UserRolesPage
