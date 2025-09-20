import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa'

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login(email, password)
    if (success) {
      navigate('/')
    }
  }

  return (
    <div className="ode-bg-gray" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="ode-container" style={{ maxWidth: '400px' }}>
        <div className="ode-card">
          <div className="ode-text-center ode-mb-6">
            <div className="ode-logo" style={{ margin: '0 auto 24px' }}>
              <span>OD</span>
            </div>
            <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-2">
              Вход в систему
            </h1>
            <p className="ode-text-gray">
              Войдите в свой аккаунт для доступа к порталу
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="ode-mb-4">
              <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <FaUser style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', width: '16px', height: '16px' }} />
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

            <div className="ode-mb-6">
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
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="ode-text-center ode-mt-6">
            <p className="ode-text-sm ode-text-gray">
              Нет аккаунта?{' '}
              <Link to="/register" className="ode-text-primary" style={{ textDecoration: 'none' }}>
                Зарегистрироваться
              </Link>
            </p>
          </div>

          <div className="ode-mt-6" style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
            <h3 className="ode-text-sm ode-font-semibold ode-text-charcoal ode-mb-3">Демо-аккаунты:</h3>
            <div className="ode-grid" style={{ gap: '8px' }}>
              <button
                onClick={() => { setEmail('admin@example.com'); setPassword('password'); }}
                className="ode-btn ode-btn-sm"
                style={{ background: '#fef2f2', color: '#8B0000', fontSize: '12px' }}
              >
                Администратор
              </button>
              <button
                onClick={() => { setEmail('tenant@example.com'); setPassword('password'); }}
                className="ode-btn ode-btn-sm"
                style={{ background: '#fef3c7', color: '#8B0000', fontSize: '12px' }}
              >
                Арендатор
              </button>
              <button
                onClick={() => { setEmail('investor@example.com'); setPassword('password'); }}
                className="ode-btn ode-btn-sm"
                style={{ background: '#dbeafe', color: '#8B0000', fontSize: '12px' }}
              >
                Инвестор
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
