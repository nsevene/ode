import React, { useState } from 'react'
import { FaSearch, FaPlus, FaEdit, FaTrash, FaUser, FaEnvelope, FaCalendar, FaShieldAlt, FaBuilding, FaDollarSign } from 'react-icons/fa'
import { UserRole } from '../../types/auth'

const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)

  const users = [
    {
      id: 1,
      name: 'Александр Иванов',
      email: 'ivanov@example.com',
      role: UserRole.Admin,
      status: 'active',
      lastLogin: '2024-12-19',
      createdAt: '2024-01-15',
      company: 'ООО "ТехноИнновации"',
      properties: 5
    },
    {
      id: 2,
      name: 'Мария Петрова',
      email: 'petrova@example.com',
      role: UserRole.Tenant,
      status: 'active',
      lastLogin: '2024-12-18',
      createdAt: '2024-02-20',
      company: 'ИП Петрова М.А.',
      properties: 2
    },
    {
      id: 3,
      name: 'Дмитрий Сидоров',
      email: 'sidorov@example.com',
      role: UserRole.Investor,
      status: 'active',
      lastLogin: '2024-12-17',
      createdAt: '2024-03-10',
      company: 'ЗАО "ИнвестГрупп"',
      properties: 12
    },
    {
      id: 4,
      name: 'Елена Козлова',
      email: 'kozlova@example.com',
      role: UserRole.Tenant,
      status: 'inactive',
      lastLogin: '2024-12-10',
      createdAt: '2024-04-05',
      company: 'ООО "СтартапСтудия"',
      properties: 1
    }
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.company.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleDeleteUser = (userId: string) => {
    console.log('Удаление пользователя:', userId)
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      alert('Пользователь удален')
    }
  }

  const handleAddUser = () => {
    console.log('Добавление нового пользователя')
    setShowAddModal(true)
  }

  const handleBulkUserAction = (action: string) => {
    console.log('Массовое действие:', action, 'для пользователей:', selectedUsers)
    if (selectedUsers.length === 0) {
      alert('Выберите пользователей для выполнения действия')
      return
    }
    
    switch (action) {
      case 'delete':
        if (confirm(`Удалить ${selectedUsers.length} пользователей?`)) {
          alert('Пользователи удалены')
          setSelectedUsers([])
        }
        break
      case 'activate':
        alert(`Активация ${selectedUsers.length} пользователей`)
        break
      case 'deactivate':
        alert(`Деактивация ${selectedUsers.length} пользователей`)
        break
      case 'export':
        alert(`Экспорт ${selectedUsers.length} пользователей`)
        break
      default:
        alert(`Действие ${action} для ${selectedUsers.length} пользователей`)
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
    <div className="ode-bg-gray" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div className="ode-bg-white" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div className="ode-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0' }}>
            <div>
              <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal">Управление пользователями</h1>
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
          </div>
        </div>
      </div>

      <div className="ode-container" style={{ padding: '32px 0' }}>
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
            {filteredUsers.map((user) => (
              <div key={user.id} className="ode-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaUser style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                        <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal">{user.name}</h3>
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
                        <FaBuilding style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                        <span className="ode-text-sm ode-text-gray">{user.company}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaCalendar style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                        <span className="ode-text-sm ode-text-gray">Последний вход: {user.lastLogin}</span>
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
                    <p className="ode-text-sm ode-text-charcoal">{user.createdAt}</p>
                  </div>
                  <div>
                    <span className="ode-text-xs ode-text-gray">Объектов в портфеле:</span>
                    <p className="ode-text-sm ode-text-charcoal">{user.properties}</p>
                  </div>
                  <div>
                    <span className="ode-text-xs ode-text-gray">Статус:</span>
                    <p className="ode-text-sm ode-text-charcoal">{getStatusText(user.status)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="ode-text-center" style={{ padding: '48px 0' }}>
              <p className="ode-text-gray">Пользователи не найдены</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UsersPage