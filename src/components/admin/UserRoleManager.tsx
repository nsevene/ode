import React, { useState, useEffect } from 'react';
import { FaEdit, FaTimes, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { UserRole } from '../../types/auth';
import { useAuthStore } from '../../store/authStore';

interface User {
  id: string;
  email: string;
  display_name?: string;
  role: UserRole;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
}

interface UserRoleManagerProps {
  onUserUpdated?: (user: User) => void;
}

const UserRoleManager: React.FC<UserRoleManagerProps> = ({ onUserUpdated }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [updatingRoles, setUpdatingRoles] = useState<Set<string>>(new Set());
  
  const { accessToken } = useAuthStore();
  
  // Use environment variable for API URL, fallback to localhost for development
  const API_BASE_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3001';

  // Fetch users from our backend auth service
  const fetchUsers = async () => {
    if (!accessToken) {
      setError('Необходима аутентификация');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setUsers(data.users || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  // Update user role
  const updateUserRole = async (userId: string, newRole: UserRole) => {
    if (!accessToken) {
      setError('Необходима аутентификация');
      return;
    }

    setUpdatingRoles(prev => new Set(prev).add(userId));

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, role: newRole }
            : user
        )
      );

      // Notify parent component
      if (onUserUpdated && data.user) {
        onUserUpdated(data.user);
      }

      setEditingUserId(null);
      setError(null);
    } catch (err) {
      console.error('Error updating user role:', err);
      setError(err instanceof Error ? err.message : 'Ошибка обновления роли');
    } finally {
      setUpdatingRoles(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  // Toggle user active status
  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    if (!accessToken) {
      setError('Необходима аутентификация');
      return;
    }

    setUpdatingRoles(prev => new Set(prev).add(userId));

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: !currentStatus })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, is_active: !currentStatus }
            : user
        )
      );

      // Notify parent component
      if (onUserUpdated && data.user) {
        onUserUpdated(data.user);
      }

      setError(null);
    } catch (err) {
      console.error('Error updating user status:', err);
      setError(err instanceof Error ? err.message : 'Ошибка обновления статуса');
    } finally {
      setUpdatingRoles(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [accessToken]);

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.Admin: return '#dc2626';
      case UserRole.Tenant: return '#f59e0b';
      case UserRole.Investor: return '#2563eb';
      case UserRole.Public: return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getRoleText = (role: UserRole) => {
    switch (role) {
      case UserRole.Admin: return 'Администратор';
      case UserRole.Tenant: return 'Арендатор';
      case UserRole.Investor: return 'Инвестор';
      case UserRole.Public: return 'Публичный';
      default: return role;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Никогда';
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  if (loading) {
    return (
      <div className="ode-card" style={{ padding: '48px', textAlign: 'center' }}>
        <FaSpinner className="ode-spin" style={{ fontSize: '24px', color: '#6b7280', marginBottom: '16px' }} />
        <p className="ode-text-gray">Загрузка пользователей...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ode-card" style={{ padding: '24px', borderColor: '#fca5a5', backgroundColor: '#fef2f2' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <FaExclamationTriangle style={{ color: '#dc2626', fontSize: '20px' }} />
          <h3 className="ode-text-lg ode-font-semibold" style={{ color: '#dc2626' }}>
            Ошибка загрузки
          </h3>
        </div>
        <p className="ode-text-sm" style={{ color: '#7f1d1d', marginBottom: '16px' }}>
          {error}
        </p>
        <button 
          onClick={fetchUsers}
          className="ode-btn ode-btn-sm ode-btn-primary"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="ode-card">
      <div style={{ marginBottom: '24px' }}>
        <h2 className="ode-text-xl ode-font-semibold ode-text-charcoal">
          Управление ролями пользователей
        </h2>
        <p className="ode-text-gray ode-text-sm" style={{ marginTop: '4px' }}>
          Найдено пользователей: {users.length}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {users.map((user) => (
          <div key={user.id} className="ode-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* User Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal">
                    {user.display_name || user.email}
                  </h3>
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
                      background: user.is_active ? '#16a34a20' : '#6b728020',
                      color: user.is_active ? '#16a34a' : '#6b7280',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    {user.is_active ? 'Активен' : 'Неактивен'}
                  </span>
                </div>
                
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  <span className="ode-text-sm ode-text-gray">
                    Email: {user.email}
                  </span>
                  <span className="ode-text-sm ode-text-gray">
                    Последний вход: {formatDate(user.last_login_at)}
                  </span>
                  <span className="ode-text-sm ode-text-gray">
                    Зарегистрирован: {formatDate(user.created_at)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {editingUserId === user.id ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select 
                      className="form-input"
                      style={{ minWidth: '140px' }}
                      defaultValue={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                      disabled={updatingRoles.has(user.id)}
                    >
                      <option value={UserRole.Public}>Публичный</option>
                      <option value={UserRole.Tenant}>Арендатор</option>
                      <option value={UserRole.Investor}>Инвестор</option>
                      <option value={UserRole.Admin}>Администратор</option>
                    </select>
                    <button 
                      onClick={() => setEditingUserId(null)}
                      className="ode-btn ode-btn-sm"
                      style={{ background: '#f9fafb', color: '#374151' }}
                      disabled={updatingRoles.has(user.id)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => setEditingUserId(user.id)}
                      className="ode-btn ode-btn-sm"
                      style={{ background: '#f9fafb', color: '#374151' }}
                      disabled={updatingRoles.has(user.id)}
                    >
                      {updatingRoles.has(user.id) ? (
                        <FaSpinner className="ode-spin" />
                      ) : (
                        <><FaEdit style={{ marginRight: '4px' }} />Роль</>
                      )}
                    </button>
                    
                    <button 
                      onClick={() => toggleUserStatus(user.id, user.is_active)}
                      className="ode-btn ode-btn-sm"
                      style={{ 
                        background: user.is_active ? '#fef2f2' : '#f0f9ff', 
                        color: user.is_active ? '#dc2626' : '#0369a1' 
                      }}
                      disabled={updatingRoles.has(user.id)}
                    >
                      {user.is_active ? 'Деактивировать' : 'Активировать'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="ode-text-center" style={{ padding: '48px 0' }}>
            <p className="ode-text-gray">Пользователи не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRoleManager;