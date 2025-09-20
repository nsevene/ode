import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { UserRole } from '../types/auth'
import { FaEye, FaEyeSlash, FaLock, FaEnvelope, FaBuilding } from 'react-icons/fa'

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<UserRole>(UserRole.Tenant)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register, isLoading, error } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      alert('Пароли не совпадают')
      return
    }

    const success = await register(email, password, role)
    if (success) {
      navigate('/')
    }
  }

  return (
    <div className="ode-bg-gray" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="ode-container" style={{ maxWidth: '500px' }}>
        <div className="ode-card">
          <div className="ode-text-center ode-mb-6">
            <div className="ode-logo" style={{ margin: '0 auto 24px' }}>
              <span>OD</span>
            </div>
            <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-2">
              Регистрация
            </h1>
            <p className="ode-text-gray">
              Создайте аккаунт для доступа к порталу
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="ode-mb-4">
              <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', width: '16px', height: '16px' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="Введите ваш email"
                  required
                />
              </div>
            </div>

            <div className="ode-mb-4">
              <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
                Роль
              </label>
              <div style={{ position: 'relative' }}>
                <FaBuilding style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', width: '16px', height: '16px' }} />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="form-select"
                  style={{ paddingLeft: '40px' }}
                  required
                >
                  <option value={UserRole.Tenant}>Арендатор</option>
                  <option value={UserRole.Investor}>Инвестор</option>
                  <option value={UserRole.Admin}>Администратор</option>
                </select>
              </div>
            </div>

            <div className="ode-mb-4">
              <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
                Пароль
              </label>
              <div style={{ position: 'relative' }}>
                <FaLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', width: '16px', height: '16px' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px', paddingRight: '40px' }}
                  placeholder="Введите пароль"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="ode-mb-6">
              <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
                Подтвердите пароль
              </label>
              <div style={{ position: 'relative' }}>
                <FaLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', width: '16px', height: '16px' }} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px', paddingRight: '40px' }}
                  placeholder="Подтвердите пароль"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-error ode-mb-4">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="ode-btn ode-btn-primary"
              style={{ width: '100%' }}
              disabled={isLoading}
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="ode-text-center ode-mt-6">
            <p className="ode-text-sm ode-text-gray">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="ode-text-primary" style={{ textDecoration: 'none' }}>
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
