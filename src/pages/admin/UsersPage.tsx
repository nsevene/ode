import React, { useState, useEffect } from 'react'
import { FaSearch, FaPlus, FaEdit, FaTrash, FaUser, FaEnvelope, FaCalendar, FaShieldAlt, FaBuilding, FaDollarSign } from 'react-icons/fa'
import { UserRole } from '../../types/auth'
import AdminNavigation from '../../components/admin/AdminNavigation'
import { adminApi, type AdminUser } from '../../lib/api/admin'

const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)

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
            email: 'ivanov@example.com',
            full_name: 'Александр Иванов',
            role: 'admin',
            status: 'active',
            created_at: '2024-01-15T10:00:00Z',
            last_login: '2024-12-19T10:00:00Z',
            organization_id: 'org-1'
          },
          {
            id: '2',
            email: 'petrova@example.com',
            full_name: 'Мария Петрова',
            role: 'tenant',
            status: 'active',
            created_at: '2024-02-20T10:00:00Z',
            last_login: '2024-12-18T10:00:00Z',
            organization_id: 'org-1'
          },
          {
            id: '3',
            email: 'sidorov@example.com',
            full_name: 'Дмитрий Сидоров',
            role: 'investor',
            status: 'active',
            created_at: '2024-03-10T10:00:00Z',
            last_login: '2024-12-17T10:00:00Z',
            organization_id: 'org-2'
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
    return matchesSearch && matchesRole
  })

  // Функции для работы с пользователями
  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleViewUser = (user: any) => {
    console.log('Просмотр пользователя:', user)
    alert(`Просмотр пользователя: ${user.name}`)
  }

  const handleEditUser = (user: any) => {
    console.log('Редактирование пользователя:', user)
    setEditingUser(user)
    setShowEditModal(true)
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      // В реальном приложении здесь будет API для удаления пользователя
      setUsers(prev => prev.filter(u => u.id !== userId))
      alert('Пользователь успешно удален')
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Ошибка при удалении пользователя')
    }
  }

  const handleUpdateUserRole = async (userId: string, role: 'admin' | 'investor' | 'tenant') => {
    try {
      await adminApi.updateUserRole(userId, role)
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u))
      alert('Роль пользователя обновлена')
    } catch (error) {
      console.error('Error updating user role:', error)
      alert('Ошибка при обновлении роли пользователя')
    }
  }

  const handleUpdateUserStatus = async (userId: string, status: 'active' | 'inactive' | 'pending') => {
    try {
      await adminApi.updateUserStatus(userId, status)
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u))
      alert('Статус пользователя обновлен')
    } catch (error) {
      console.error('Error updating user status:', error)
      alert('Ошибка при обновлении статуса пользователя')
    }
  }

  const handleAddUser = () => {
    console.log('Добавление нового пользователя')
    setShowAddModal(true)
  }

  const handleBulkUserAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      alert('Выберите пользователей для выполнения действия')
      return
    }
    
    try {
      switch (action) {
        case 'delete':
          if (confirm(`Удалить ${selectedUsers.length} пользователей?`)) {
            setUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)))
            setSelectedUsers([])
            alert('Пользователи успешно удалены')
          }
          break
        case 'activate':
          await Promise.all(selectedUsers.map(id => 
            adminApi.updateUserStatus(id, 'active')
          ))
          setUsers(prev => prev.map(u => 
            selectedUsers.includes(u.id) ? { ...u, status: 'active' } : u
          ))
          setSelectedUsers([])
          alert('Пользователи активированы')
          break
        case 'deactivate':
          await Promise.all(selectedUsers.map(id => 
            adminApi.updateUserStatus(id, 'inactive')
          ))
          setUsers(prev => prev.map(u => 
            selectedUsers.includes(u.id) ? { ...u, status: 'inactive' } : u
          ))
          setSelectedUsers([])
          alert('Пользователи деактивированы')
          break
        case 'export':
          alert(`Экспорт ${selectedUsers.length} пользователей`)
          break
        default:
          alert(`Действие ${action} для ${selectedUsers.length} пользователей`)
      }
    } catch (error) {
      console.error('Error performing bulk action:', error)
      alert('Ошибка при выполнении массового действия')
    }
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.Admin: return '#dc2626'
      case UserRole.Tenant: return '#f59e0b'
      case UserRole.Investor: return '#2563eb'
      default: return '#6b7280'
    }
  }

  const getRoleText = (role: UserRole) => {
    switch (role) {
      case UserRole.Admin: return 'Администратор'
      case UserRole.Tenant: return 'Арендатор'
      case UserRole.Investor: return 'Инвестор'
      default: return role
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'active' ? '#16a34a' : '#6b7280'
  }

  const getStatusText = (status: string) => {
    return status === 'active' ? 'Активен' : 'Неактивен'
  }

  return (
    <div className="ode-bg-gray" style={{ minHeight: '100vh', padding: '32px 0' }}>
      <div className="ode-container">
        <div className="ode-dashboard-layout">
          <AdminNavigation />
          <div className="ode-dashboard-content">
            {/* Header */}
            <div className="ode-dashboard-header">
              <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-2">Управление пользователями</h1>
              <p className="ode-text-gray">Просмотр и управление пользователями системы</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleAddUser} className="ode-btn ode-btn-primary">
                <FaPlus style={{ marginRight: '8px' }} />
                Добавить пользователя
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
                placeholder="Поиск по имени, email или компании..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setRoleFilter('all')}
                className={`ode-btn ode-btn-sm ${roleFilter === 'all' ? 'ode-btn-primary' : ''}`}
                style={{ background: roleFilter === 'all' ? undefined : '#f9fafb', color: roleFilter === 'all' ? undefined : '#374151' }}
              >
                Все роли
              </button>
              <button
                onClick={() => setRoleFilter(UserRole.Admin)}
                className={`ode-btn ode-btn-sm ${roleFilter === UserRole.Admin ? 'ode-btn-primary' : ''}`}
                style={{ background: roleFilter === UserRole.Admin ? undefined : '#f9fafb', color: roleFilter === UserRole.Admin ? undefined : '#374151' }}
              >
                Администраторы
              </button>
              <button
                onClick={() => setRoleFilter(UserRole.Tenant)}
                className={`ode-btn ode-btn-sm ${roleFilter === UserRole.Tenant ? 'ode-btn-primary' : ''}`}
                style={{ background: roleFilter === UserRole.Tenant ? undefined : '#f9fafb', color: roleFilter === UserRole.Tenant ? undefined : '#374151' }}
              >
                Арендаторы
              </button>
              <button
                onClick={() => setRoleFilter(UserRole.Investor)}
                className={`ode-btn ode-btn-sm ${roleFilter === UserRole.Investor ? 'ode-btn-primary' : ''}`}
                style={{ background: roleFilter === UserRole.Investor ? undefined : '#f9fafb', color: roleFilter === UserRole.Investor ? undefined : '#374151' }}
              >
                Инвесторы
              </button>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="ode-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="ode-text-xl ode-font-semibold ode-text-charcoal">
              Пользователи ({filteredUsers.length})
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="ode-card" style={{ padding: '20px' }}>
                  <div className="ode-animate-pulse">
                    <div className="ode-h-6 ode-bg-gray-200 ode-rounded ode-mb-2"></div>
                    <div className="ode-h-4 ode-bg-gray-200 ode-rounded ode-mb-4"></div>
                    <div className="ode-h-4 ode-bg-gray-200 ode-rounded ode-w-1/2"></div>
                  </div>
                </div>
              ))
            ) : (
              filteredUsers.map((user) => (
              <div key={user.id} className="ode-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaUser style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                        <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal">{user.full_name}</h3>
                      </div>
                      <span 
                        className="badge"
                        style={{ 
                          background: getRoleColor(user.role) + '20',
                          color: getRoleColor(user.role),
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        {getRoleText(user.role)}
                      </span>
                      <span 
                        className="badge"
                        style={{ 
                          background: getStatusColor(user.status) + '20',
                          color: getStatusColor(user.status),
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        {getStatusText(user.status)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaEnvelope style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                        <span className="ode-text-sm ode-text-gray">{user.email}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaCalendar style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                        <span className="ode-text-sm ode-text-gray">
                          Последний вход: {user.last_login ? new Date(user.last_login).toLocaleDateString('ru-RU') : 'Никогда'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="ode-btn ode-btn-sm" style={{ background: '#f9fafb', color: '#374151' }}>
                      <FaEdit style={{ marginRight: '4px' }} />
                      Редактировать
                    </button>
                    <button className="ode-btn ode-btn-sm" style={{ background: '#fef2f2', color: '#dc2626' }}>
                      <FaTrash style={{ marginRight: '4px' }} />
                      Удалить
                    </button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                  <div>
                    <span className="ode-text-xs ode-text-gray">Дата регистрации:</span>
                    <p className="ode-text-sm ode-text-charcoal">
                      {new Date(user.created_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <div>
                    <span className="ode-text-xs ode-text-gray">Организация:</span>
                    <p className="ode-text-sm ode-text-charcoal">{user.organization_id || 'Не указана'}</p>
                  </div>
                  <div>
                    <span className="ode-text-xs ode-text-gray">Статус:</span>
                    <p className="ode-text-sm ode-text-charcoal">{getStatusText(user.status)}</p>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>

          {!loading && filteredUsers.length === 0 && (
            <div className="ode-text-center" style={{ padding: '48px 0' }}>
              <p className="ode-text-gray">Пользователи не найдены</p>
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

export default UsersPage