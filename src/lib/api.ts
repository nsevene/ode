// import { supabase } from './supabase'

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url?: string
  is_available: boolean
  allergens?: string[]
  nutrition_info?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

export interface Event {
  id: string
  title: string
  description: string
  event_date: string
  start_time: string
  end_time: string
  location: string
  category: string
  image_url?: string
  max_attendees: number
  current_attendees: number
  price: number
  is_public: boolean
  registration_required: boolean
  is_available: boolean
  spots_remaining: number
}

export interface BookingRequest {
  event_id: string
  user_name: string
  user_email: string
  user_phone?: string
  special_requests?: string
  guests_count?: number
}

export interface BookingResponse {
  success: boolean
  data?: {
    booking_id: string
    event_title: string
    confirmation_number: string
    status: string
  }
  error?: string
}

// API Functions
export const api = {
  // Get public menu
  async getPublicMenu(): Promise<Record<string, MenuItem[]>> {
    // Demo mode - return mock data
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    return {
      'Основные блюда': [
        {
          id: '1',
          name: 'Стейк из говядины',
          description: 'Сочный стейк с картофелем фри',
          price: 1200,
          category: 'Основные блюда',
          is_available: true,
          allergens: ['глютен'],
          nutrition_info: {
            calories: 650,
            protein: 45,
            carbs: 35,
            fat: 28
          }
        },
        {
          id: '2',
          name: 'Лосось на гриле',
          description: 'Филе лосося с овощами',
          price: 950,
          category: 'Основные блюда',
          is_available: true,
          allergens: ['рыба'],
          nutrition_info: {
            calories: 420,
            protein: 38,
            carbs: 15,
            fat: 22
          }
        }
      ],
      'Десерты': [
        {
          id: '3',
          name: 'Тирамису',
          description: 'Классический итальянский десерт',
          price: 350,
          category: 'Десерты',
          is_available: true,
          allergens: ['молоко', 'яйца', 'глютен'],
          nutrition_info: {
            calories: 280,
            protein: 8,
            carbs: 32,
            fat: 12
          }
        }
      ]
    }
  },

  // Get public events
  async getPublicEvents(params?: {
    limit?: number
    category?: string
    date_from?: string
    date_to?: string
  }): Promise<Event[]> {
    // Demo mode - return mock data
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Винная дегустация',
        description: 'Дегустация лучших вин региона',
        event_date: '2024-12-25',
        start_time: '19:00',
        end_time: '22:00',
        location: 'Ресторан "Винный погреб"',
        category: 'Дегустация',
        max_attendees: 20,
        current_attendees: 12,
        price: 2500,
        is_public: true,
        registration_required: true,
        is_available: true,
        spots_remaining: 8
      },
      {
        id: '2',
        title: 'Мастер-класс по кулинарии',
        description: 'Учимся готовить итальянскую пасту',
        event_date: '2024-12-28',
        start_time: '18:00',
        end_time: '21:00',
        location: 'Кулинарная студия',
        category: 'Обучение',
        max_attendees: 15,
        current_attendees: 8,
        price: 1800,
        is_public: true,
        registration_required: true,
        is_available: true,
        spots_remaining: 7
      }
    ]
    
    return mockEvents.slice(0, params?.limit || 10)
  },

  // Create booking
  async createBooking(_booking: BookingRequest): Promise<BookingResponse> {
    // Demo mode - simulate booking creation
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
    
    return {
      success: true,
      data: {
        booking_id: `BK${Date.now()}`,
        event_title: 'Демо событие',
        confirmation_number: `BK${Date.now()}`,
        status: 'confirmed'
      }
    }
  },

  // Get user bookings
  async getUserBookings(userEmail: string): Promise<any[]> {
    // Demo mode - return mock data
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    return [
      {
        id: '1',
        event_id: '1',
        user_name: 'Иван Петров',
        user_email: userEmail,
        guests_count: 2,
        status: 'confirmed',
        booking_date: '2024-12-20T10:00:00Z',
        events: {
          title: 'Винная дегустация',
          event_date: '2024-12-25',
          start_time: '19:00',
          location: 'Ресторан "Винный погреб"'
        }
      }
    ]
  },

  // Cancel booking
  async cancelBooking(bookingId: string): Promise<void> {
    // Demo mode - simulate cancellation
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    console.log(`Booking ${bookingId} cancelled`)
  }
}

// Utility functions
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(price)
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatTime = (timeString: string): string => {
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getEventStatus = (event: Event): 'available' | 'full' | 'past' => {
  const eventDate = new Date(`${event.event_date}T${event.start_time}`)
  const now = new Date()
  
  if (eventDate < now) return 'past'
  if (event.spots_remaining <= 0) return 'full'
  return 'available'
}
