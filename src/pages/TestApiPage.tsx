import React, { useState, useEffect } from 'react'
import { FaCode, FaUtensils, FaCalendarAlt, FaBook, FaPlay, FaCheck, FaTimes, FaSpinner, FaHome } from 'react-icons/fa'
import { api, formatPrice, formatDate, formatTime } from '../lib/api'
import type { MenuItem, Event, BookingRequest } from '../lib/api'

const TestApiPage: React.FC = () => {
  const [menuData, setMenuData] = useState<Record<string, MenuItem[]>>({})
  const [eventsData, setEventsData] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'menu' | 'events' | 'booking'>('menu')
  const [bookingResult, setBookingResult] = useState<string | null>(null)

  // Test Menu API
  const testMenuAPI = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getPublicMenu()
      setMenuData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menu')
    } finally {
      setLoading(false)
    }
  }

  // Test Events API
  const testEventsAPI = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getPublicEvents({ limit: 10 })
      setEventsData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  // Test Booking API
  const testBookingAPI = async (eventId: string) => {
    setLoading(true)
    setError(null)
    setBookingResult(null)
    try {
      const bookingData: BookingRequest = {
        event_id: eventId,
        user_name: 'Test User',
        user_email: 'test@example.com',
        user_phone: '+7 (999) 123-45-67',
        special_requests: 'Test booking'
      }
      const result = await api.createBooking(bookingData)
      setBookingResult(`Booking created successfully! ID: ${result.booking_id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'menu', name: 'Меню API', icon: FaUtensils },
    { id: 'events', name: 'События API', icon: FaCalendarAlt },
    { id: 'booking', name: 'Бронирование API', icon: FaBook }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'menu':
        return (
          <div className="ode-space-y-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal">Тест API Меню</h2>
              <button
                onClick={testMenuAPI}
                disabled={loading}
                className="ode-btn ode-btn-primary"
              >
                {loading ? <FaSpinner className="animate-spin" style={{ marginRight: '8px' }} /> : <FaPlay style={{ marginRight: '8px' }} />}
                {loading ? 'Загрузка...' : 'Тестировать API'}
              </button>
            </div>

            {error && (
              <div className="alert alert-error">
                <FaTimes style={{ marginRight: '8px' }} />
                {error}
              </div>
            )}

            {Object.keys(menuData).length > 0 && (
              <div className="ode-card">
                <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">Результат API:</h3>
                <div className="ode-space-y-4">
                  {Object.entries(menuData).map(([category, items]) => (
                    <div key={category}>
                      <h4 className="ode-text-md ode-font-semibold ode-text-charcoal ode-mb-2">{category}</h4>
                      <div className="ode-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                        {items.map((item, index) => (
                          <div key={index} className="ode-card" style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                              <h5 className="ode-text-sm ode-font-medium ode-text-charcoal">{item.name}</h5>
                              <span className="ode-text-sm ode-font-semibold ode-text-primary">{formatPrice(item.price)}</span>
                            </div>
                            {item.description && (
                              <p className="ode-text-xs ode-text-gray ode-mb-2">{item.description}</p>
                            )}
                            {item.allergens && item.allergens.length > 0 && (
                              <div className="ode-text-xs ode-text-gray">
                                <strong>Аллергены:</strong> {item.allergens.join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 'events':
        return (
          <div className="ode-space-y-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal">Тест API Событий</h2>
              <button
                onClick={testEventsAPI}
                disabled={loading}
                className="ode-btn ode-btn-primary"
              >
                {loading ? <FaSpinner className="animate-spin" style={{ marginRight: '8px' }} /> : <FaPlay style={{ marginRight: '8px' }} />}
                {loading ? 'Загрузка...' : 'Тестировать API'}
              </button>
            </div>

            {error && (
              <div className="alert alert-error">
                <FaTimes style={{ marginRight: '8px' }} />
                {error}
              </div>
            )}

            {eventsData.length > 0 && (
              <div className="ode-card">
                <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">Результат API:</h3>
                <div className="ode-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                  {eventsData.map((event) => (
                    <div key={event.id} className="ode-card" style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h4 className="ode-text-md ode-font-semibold ode-text-charcoal">{event.title}</h4>
                        <span className="ode-text-sm ode-font-semibold ode-text-primary">{formatPrice(event.price)}</span>
                      </div>
                      <p className="ode-text-sm ode-text-gray ode-mb-2">{event.description}</p>
                      <div className="ode-text-xs ode-text-gray">
                        <div><strong>Дата:</strong> {formatDate(event.date)}</div>
                        <div><strong>Время:</strong> {formatTime(event.start_time)} - {formatTime(event.end_time)}</div>
                        <div><strong>Место:</strong> {event.location}</div>
                        <div><strong>Мест:</strong> {event.available_spots}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 'booking':
        return (
          <div className="ode-space-y-6">
            <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal">Тест API Бронирования</h2>

            {error && (
              <div className="alert alert-error">
                <FaTimes style={{ marginRight: '8px' }} />
                {error}
              </div>
            )}

            {bookingResult && (
              <div className="alert" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a' }}>
                <FaCheck style={{ marginRight: '8px' }} />
                {bookingResult}
              </div>
            )}

            <div className="ode-card">
              <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">Тестовые события для бронирования:</h3>
              <div className="ode-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {[
                  { id: 'event-1', title: 'Дегустация вин', price: 2500, date: '2024-12-25', time: '19:00' },
                  { id: 'event-2', title: 'Кулинарный мастер-класс', price: 3500, date: '2024-12-26', time: '18:00' },
                  { id: 'event-3', title: 'Бизнес-ланч', price: 1500, date: '2024-12-27', time: '13:00' }
                ].map((event) => (
                  <div key={event.id} className="ode-card" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <h4 className="ode-text-md ode-font-semibold ode-text-charcoal">{event.title}</h4>
                      <span className="ode-text-sm ode-font-semibold ode-text-primary">{formatPrice(event.price)}</span>
                    </div>
                    <div className="ode-text-xs ode-text-gray ode-mb-4">
                      <div><strong>Дата:</strong> {formatDate(event.date)}</div>
                      <div><strong>Время:</strong> {event.time}</div>
                    </div>
                    <button
                      onClick={() => testBookingAPI(event.id)}
                      disabled={loading}
                      className="ode-btn ode-btn-primary"
                      style={{ width: '100%' }}
                    >
                      {loading ? <FaSpinner className="animate-spin" style={{ marginRight: '8px' }} /> : <FaBook style={{ marginRight: '8px' }} />}
                      {loading ? 'Создание...' : 'Забронировать'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="ode-bg-gray" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div className="ode-bg-white" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div className="ode-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0' }}>
            <div>
              <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal">Тестирование B2C API</h1>
              <p className="ode-text-gray">Проверка работы API для меню, событий и бронирований</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => window.location.href = '/'}
                className="ode-btn ode-btn-secondary"
              >
                <FaHome style={{ marginRight: '8px' }} />
                На главную
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="ode-container" style={{ padding: '32px 0' }}>
        {/* Tabs */}
        <div className="tab-list">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
              >
                <tab.icon style={{ width: '16px', height: '16px' }} />
                {tab.name}
              </button>
            ))}
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  )
}

export default TestApiPage