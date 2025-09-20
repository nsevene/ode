import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FaSearch, FaFilter, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers, FaCar, FaVideo, FaPhone, FaWifi, FaCoffee, FaProjector, FaWhiteboard, FaTrash, FaEdit, FaPlus, FaInfoCircle, FaCheckCircle, FaTimes, FaExclamationTriangle } from 'react-icons/fa'
import { tenantApi } from '../../lib/api/tenant'
import TenantNavigation from '../../components/tenants/TenantNavigation'
import { Helmet } from 'react-helmet-async'
import { format, addDays, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns'

interface BookingItem {
  id: string
  name: string
  type: 'meeting_room' | 'parking_spot' | 'conference_room' | 'coworking_space'
  capacity: number
  price_per_hour: number
  description: string
  amenities: string[]
  location: string
  floor: number
  is_available: boolean
  images: string[]
}

interface TenantBooking {
  id: string
  booking_item_id: string
  booking_item_name: string
  booking_type: 'meeting_room' | 'parking_spot' | 'conference_room' | 'coworking_space'
  start_datetime: string
  end_datetime: string
  duration_hours: number
  total_cost: number
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  purpose: string
  attendees?: number
  special_requirements?: string
  created_at: string
  updated_at: string
}

const BookingPage: React.FC = () => {
  const { t } = useTranslation('common')
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([])
  const [userBookings, setUserBookings] = useState<TenantBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterAvailability, setFilterAvailability] = useState('all')
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [selectedBooking, setSelectedBooking] = useState<TenantBooking | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)
  const [newBooking, setNewBooking] = useState<Partial<TenantBooking>>({})

  useEffect(() => {
    fetchBookingItems()
    fetchUserBookings()
  }, [])

  const fetchBookingItems = async () => {
    try {
      const data = await tenantApi.getBookingItems()
      setBookingItems(data)
    } catch (err) {
      console.error('Error fetching booking items:', err)
      setError(t('tenant.booking.error_fetching_items'))
    }
  }

  const fetchUserBookings = async () => {
    try {
      const data = await tenantApi.getTenantBookings()
      setUserBookings(data)
    } catch (err) {
      console.error('Error fetching user bookings:', err)
      setError(t('tenant.booking.error_fetching_bookings'))
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await tenantApi.createBooking(newBooking)
      await fetchUserBookings()
      setIsBookingModalOpen(false)
      setNewBooking({})
      alert(t('tenant.booking.create_success'))
    } catch (err) {
      console.error('Error creating booking:', err)
      alert(t('tenant.booking.create_error'))
    }
  }

  const handleCancelBooking = async (id: string) => {
    if (window.confirm(t('tenant.booking.confirm_cancel'))) {
      try {
        await tenantApi.cancelBooking(id)
        await fetchUserBookings()
        alert(t('tenant.booking.cancel_success'))
      } catch (err) {
        console.error('Error cancelling booking:', err)
        alert(t('tenant.booking.cancel_error'))
      }
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting_room': return <FaUsers className="ode-mr-1" />
      case 'parking_spot': return <FaCar className="ode-mr-1" />
      case 'conference_room': return <FaVideo className="ode-mr-1" />
      case 'coworking_space': return <FaCoffee className="ode-mr-1" />
      default: return <FaMapMarkerAlt className="ode-mr-1" />
    }
  }

  const getStatusClass = (status: TenantBooking['status']) => {
    switch (status) {
      case 'confirmed': return 'ode-badge ode-badge-success'
      case 'pending': return 'ode-badge ode-badge-warning'
      case 'cancelled': return 'ode-badge ode-badge-error'
      case 'completed': return 'ode-badge ode-badge-info'
      default: return 'ode-badge'
    }
  }

  const getStatusIcon = (status: TenantBooking['status']) => {
    switch (status) {
      case 'confirmed': return <FaCheckCircle className="ode-text-green-500" />
      case 'pending': return <FaExclamationTriangle className="ode-text-yellow-500" />
      case 'cancelled': return <FaTimes className="ode-text-red-500" />
      case 'completed': return <FaInfoCircle className="ode-text-blue-500" />
      default: return <FaInfoCircle className="ode-text-gray-500" />
    }
  }

  return (
    <div className="ode-tenant-dashboard ode-p-4 sm:ode-p-6 lg:ode-p-8">
      <Helmet>
        <title>{t('tenant.booking.title')} | ODPortal</title>
        <meta name="description" content={t('tenant.booking.description')} />
      </Helmet>
      <TenantNavigation />
      <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-6">{t('tenant.booking.heading')}</h1>

      {/* Filters and Search */}
      <div className="ode-bg-white ode-rounded-lg ode-shadow-md ode-p-6 ode-mb-6">
        <div className="ode-grid ode-grid-cols-1 md:ode-grid-cols-2 lg:ode-grid-cols-4 ode-gap-4 ode-mb-4">
          <div className="ode-relative">
            <FaSearch className="ode-absolute ode-left-3 ode-top-1/2 -ode-translate-y-1/2 ode-text-gray-400" />
            <input
              type="text"
              placeholder={t('tenant.booking.search_placeholder')}
              className="ode-input ode-input-bordered ode-w-full ode-pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="ode-select ode-select-bordered ode-w-full"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">{t('tenant.booking.filter_type')}: {t('all')}</option>
            <option value="meeting_room">{t('tenant.booking.type_meeting_room')}</option>
            <option value="parking_spot">{t('tenant.booking.type_parking_spot')}</option>
            <option value="conference_room">{t('tenant.booking.type_conference_room')}</option>
            <option value="coworking_space">{t('tenant.booking.type_coworking_space')}</option>
          </select>

          <select
            className="ode-select ode-select-bordered ode-w-full"
            value={filterAvailability}
            onChange={(e) => setFilterAvailability(e.target.value)}
          >
            <option value="all">{t('tenant.booking.filter_availability')}: {t('all')}</option>
            <option value="available">{t('tenant.booking.available_now')}</option>
            <option value="booked">{t('tenant.booking.fully_booked')}</option>
          </select>

          <input
            type="date"
            className="ode-input ode-input-bordered ode-w-full"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* Available Items */}
      <div className="ode-mb-8">
        <div className="ode-flex ode-justify-between ode-items-center ode-mb-4">
          <h2 className="ode-text-2xl ode-font-semibold">{t('tenant.booking.available_items')}</h2>
          <button className="ode-btn ode-btn-primary" onClick={() => setIsBookingModalOpen(true)}>
            <FaPlus /> {t('tenant.booking.new_booking')}
          </button>
        </div>

        {loading ? (
          <div className="ode-grid ode-grid-cols-1 md:ode-grid-cols-2 lg:ode-grid-cols-3 ode-gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="ode-card ode-bg-white ode-shadow-md ode-rounded-lg ode-animate-pulse">
                <div className="ode-h-48 ode-bg-gray-200 ode-rounded-t-lg"></div>
                <div className="ode-p-4">
                  <div className="ode-h-6 ode-bg-gray-200 ode-rounded ode-mb-2"></div>
                  <div className="ode-h-4 ode-bg-gray-200 ode-rounded ode-w-3/4 ode-mb-4"></div>
                  <div className="ode-grid ode-grid-cols-2 ode-gap-2">
                    <div className="ode-h-4 ode-bg-gray-200 ode-rounded"></div>
                    <div className="ode-h-4 ode-bg-gray-200 ode-rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="ode-text-center ode-py-12">
            <p className="ode-text-red-500 ode-text-lg ode-mb-4">{error}</p>
            <button className="ode-btn ode-btn-primary" onClick={() => { fetchBookingItems(); fetchUserBookings(); }}>
              {t('tenant.booking.retry')}
            </button>
          </div>
        ) : bookingItems.length === 0 ? (
          <div className="ode-text-center ode-py-12">
            <FaInfoCircle className="ode-text-gray-300 ode-text-6xl ode-mb-4 ode-mx-auto" />
            <p className="ode-text-gray-500 ode-text-lg ode-mb-2">{t('tenant.booking.no_items')}</p>
            <p className="ode-text-gray-400">{t('tenant.booking.try_different_filters')}</p>
          </div>
        ) : (
          <div className="ode-grid ode-grid-cols-1 md:ode-grid-cols-2 lg:ode-grid-cols-3 ode-gap-6">
            {bookingItems.map(item => (
              <div key={item.id} className="ode-card ode-bg-white ode-shadow-md ode-rounded-lg ode-overflow-hidden">
                <div className="ode-p-4">
                  <div className="ode-flex ode-justify-between ode-items-start ode-mb-2">
                    <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal">{item.name}</h3>
                    <div className="ode-flex ode-items-center">
                      {getTypeIcon(item.type)}
                      <span className="ode-ml-1">{t(`tenant.booking.type_${item.type}`)}</span>
                    </div>
                  </div>
                  <p className="ode-text-gray-600 ode-text-sm ode-mb-2">{item.description}</p>
                  <div className="ode-flex ode-items-center ode-text-sm ode-text-gray-700 ode-mb-2">
                    <FaMapMarkerAlt className="ode-mr-1" />
                    {item.location} - {t('tenant.booking.floor')} {item.floor}
                  </div>
                  <div className="ode-grid ode-grid-cols-2 ode-gap-2 ode-mb-4">
                    <div className="ode-text-center">
                      <p className="ode-text-lg ode-font-bold ode-text-charcoal">{item.capacity}</p>
                      <p className="ode-text-xs ode-text-gray-500">{t('tenant.booking.capacity')}</p>
                    </div>
                    <div className="ode-text-center">
                      <p className="ode-text-lg ode-font-bold ode-text-green-600">${item.price_per_hour}</p>
                      <p className="ode-text-xs ode-text-gray-500">{t('tenant.booking.per_hour')}</p>
                    </div>
                  </div>
                  <div className="ode-mb-4">
                    <p className="ode-text-sm ode-text-gray-600 ode-mb-2">{t('tenant.booking.amenities')}:</p>
                    <div className="ode-flex ode-flex-wrap ode-gap-1">
                      {item.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="ode-badge ode-badge-sm ode-badge-outline">
                          {amenity}
                        </span>
                      ))}
                      {item.amenities.length > 3 && (
                        <span className="ode-badge ode-badge-sm ode-badge-outline">
                          +{item.amenities.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    className={`ode-btn ode-w-full ${item.is_available ? 'ode-btn-primary' : 'ode-btn-disabled'}`}
                    disabled={!item.is_available}
                    onClick={() => {
                      setNewBooking({ booking_item_id: item.id, booking_type: item.type })
                      setIsBookingModalOpen(true)
                    }}
                  >
                    {item.is_available ? t('tenant.booking.book_now') : t('tenant.booking.not_available')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Bookings */}
      <div>
        <h2 className="ode-text-2xl ode-font-semibold ode-mb-4">{t('tenant.booking.my_bookings')}</h2>
        {userBookings.length === 0 ? (
          <div className="ode-text-center ode-py-12 ode-bg-white ode-rounded-lg ode-shadow-md">
            <FaCalendarAlt className="ode-text-gray-300 ode-text-6xl ode-mb-4 ode-mx-auto" />
            <p className="ode-text-gray-500 ode-text-lg ode-mb-2">{t('tenant.booking.no_bookings')}</p>
            <p className="ode-text-gray-400">{t('tenant.booking.make_first_booking')}</p>
          </div>
        ) : (
          <div className="ode-bg-white ode-rounded-lg ode-shadow-md ode-overflow-x-auto">
            <table className="ode-table ode-w-full">
              <thead>
                <tr>
                  <th>{t('tenant.booking.booking_item')}</th>
                  <th>{t('tenant.booking.type')}</th>
                  <th>{t('tenant.booking.start_time')}</th>
                  <th>{t('tenant.booking.duration')}</th>
                  <th>{t('tenant.booking.total_cost')}</th>
                  <th>{t('tenant.booking.status')}</th>
                  <th>{t('tenant.booking.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {userBookings.map(booking => (
                  <tr key={booking.id}>
                    <td>{booking.booking_item_name}</td>
                    <td>{getTypeIcon(booking.booking_type)} {t(`tenant.booking.type_${booking.booking_type}`)}</td>
                    <td>{format(new Date(booking.start_datetime), 'dd/MM/yyyy HH:mm')}</td>
                    <td>{booking.duration_hours}h</td>
                    <td>${booking.total_cost.toLocaleString()}</td>
                    <td>
                      <div className="ode-flex ode-items-center">
                        {getStatusIcon(booking.status)}
                        <span className={`ode-ml-2 ${getStatusClass(booking.status)}`}>
                          {t(`tenant.booking.status_${booking.status}`)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <button 
                        className="ode-btn ode-btn-sm ode-btn-info ode-mr-2" 
                        onClick={() => {
                          setSelectedBooking(booking)
                          setIsManageModalOpen(true)
                        }}
                      >
                        <FaEdit /> {t('tenant.booking.view_details')}
                      </button>
                      {booking.status === 'confirmed' && (
                        <button 
                          className="ode-btn ode-btn-sm ode-btn-error" 
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          <FaTrash /> {t('tenant.booking.cancel')}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <dialog className="ode-modal" open>
          <div className="ode-modal-box ode-w-11/12 ode-max-w-2xl">
            <h3 className="ode-font-bold ode-text-2xl ode-mb-4">{t('tenant.booking.create_booking')}</h3>
            <form onSubmit={handleCreateBooking} className="ode-py-4">
              <div className="ode-form-control ode-mb-4">
                <label className="ode-label">
                  <span className="ode-label-text">{t('tenant.booking.start_datetime')}</span>
                </label>
                <input
                  type="datetime-local"
                  className="ode-input ode-input-bordered"
                  value={newBooking.start_datetime || ''}
                  onChange={(e) => setNewBooking(prev => ({ 
                    ...prev, 
                    start_datetime: e.target.value,
                    end_datetime: e.target.value ? format(addDays(new Date(e.target.value), 1), "yyyy-MM-dd'T'HH:mm") : ''
                  }))}
                  required
                />
              </div>

              <div className="ode-form-control ode-mb-4">
                <label className="ode-label">
                  <span className="ode-label-text">{t('tenant.booking.end_datetime')}</span>
                </label>
                <input
                  type="datetime-local"
                  className="ode-input ode-input-bordered"
                  value={newBooking.end_datetime || ''}
                  onChange={(e) => setNewBooking(prev => ({ ...prev, end_datetime: e.target.value }))}
                  required
                />
              </div>

              <div className="ode-form-control ode-mb-4">
                <label className="ode-label">
                  <span className="ode-label-text">{t('tenant.booking.purpose')}</span>
                </label>
                <input
                  type="text"
                  className="ode-input ode-input-bordered"
                  placeholder={t('tenant.booking.purpose_placeholder')}
                  value={newBooking.purpose || ''}
                  onChange={(e) => setNewBooking(prev => ({ ...prev, purpose: e.target.value }))}
                  required
                />
              </div>

              <div className="ode-form-control ode-mb-4">
                <label className="ode-label">
                  <span className="ode-label-text">{t('tenant.booking.attendees')}</span>
                </label>
                <input
                  type="number"
                  className="ode-input ode-input-bordered"
                  placeholder="0"
                  value={newBooking.attendees || ''}
                  onChange={(e) => setNewBooking(prev => ({ ...prev, attendees: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="ode-form-control ode-mb-4">
                <label className="ode-label">
                  <span className="ode-label-text">{t('tenant.booking.special_requirements')}</span>
                </label>
                <textarea
                  className="ode-textarea ode-textarea-bordered"
                  placeholder={t('tenant.booking.requirements_placeholder')}
                  value={newBooking.special_requirements || ''}
                  onChange={(e) => setNewBooking(prev => ({ ...prev, special_requirements: e.target.value }))}
                />
              </div>

              <div className="ode-modal-action">
                <button type="submit" className="ode-btn ode-btn-success ode-mr-2">
                  <FaPlus /> {t('tenant.booking.create_booking')}
                </button>
                <button type="button" className="ode-btn" onClick={() => setIsBookingModalOpen(false)}>
                  {t('tenant.booking.cancel')}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}

      {/* Manage Booking Modal */}
      {isManageModalOpen && selectedBooking && (
        <dialog className="ode-modal" open>
          <div className="ode-modal-box ode-w-11/12 ode-max-w-3xl">
            <h3 className="ode-font-bold ode-text-2xl ode-mb-4">{t('tenant.booking.booking_details')}</h3>
            <div className="ode-py-4 ode-grid ode-grid-cols-1 md:ode-grid-cols-2 ode-gap-4">
              <div>
                <p><strong>{t('tenant.booking.booking_item')}:</strong> {selectedBooking.booking_item_name}</p>
                <p><strong>{t('tenant.booking.type')}:</strong> {t(`tenant.booking.type_${selectedBooking.booking_type}`)}</p>
                <p><strong>{t('tenant.booking.start_datetime')}:</strong> {format(new Date(selectedBooking.start_datetime), 'dd/MM/yyyy HH:mm')}</p>
                <p><strong>{t('tenant.booking.end_datetime')}:</strong> {format(new Date(selectedBooking.end_datetime), 'dd/MM/yyyy HH:mm')}</p>
                <p><strong>{t('tenant.booking.duration')}:</strong> {selectedBooking.duration_hours} {t('tenant.booking.hours')}</p>
                <p><strong>{t('tenant.booking.total_cost')}:</strong> ${selectedBooking.total_cost.toLocaleString()}</p>
                <p><strong>{t('tenant.booking.status')}:</strong> <span className={getStatusClass(selectedBooking.status)}>{t(`tenant.booking.status_${selectedBooking.status}`)}</span></p>
              </div>
              <div>
                <p><strong>{t('tenant.booking.purpose')}:</strong> {selectedBooking.purpose}</p>
                <p><strong>{t('tenant.booking.attendees')}:</strong> {selectedBooking.attendees || t('tenant.booking.not_specified')}</p>
                <p><strong>{t('tenant.booking.special_requirements')}:</strong></p>
                <p className="ode-bg-gray-100 ode-p-3 ode-rounded-md">{selectedBooking.special_requirements || t('tenant.booking.none')}</p>
                <p><strong>{t('tenant.booking.created_at')}:</strong> {format(new Date(selectedBooking.created_at), 'dd/MM/yyyy HH:mm')}</p>
              </div>
            </div>
            <div className="ode-modal-action">
              {selectedBooking.status === 'confirmed' && (
                <button className="ode-btn ode-btn-error ode-mr-2" onClick={() => handleCancelBooking(selectedBooking.id)}>
                  <FaTrash /> {t('tenant.booking.cancel_booking')}
                </button>
              )}
              <button className="ode-btn" onClick={() => setIsManageModalOpen(false)}>
                {t('tenant.booking.close')}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  )
}

export default BookingPage
