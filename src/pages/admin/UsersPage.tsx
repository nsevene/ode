import React from 'react'
import { FaPlus } from 'react-icons/fa'
import AdminNavigation from '../../components/admin/AdminNavigation'
import UserRoleManager from '../../components/admin/UserRoleManager'

const UsersPage: React.FC = () => {

  // User management now handled by UserRoleManager component


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
              <button className="ode-btn ode-btn-primary" disabled>
                <FaPlus style={{ marginRight: '8px' }} />
                Добавить пользователя (скоро)
              </button>
            </div>

            <div style={{ marginTop: '32px' }}>
              <UserRoleManager 
                onUserUpdated={(user) => {
                  console.log('User updated:', user);
                  // TODO: Refresh user list if needed
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsersPage