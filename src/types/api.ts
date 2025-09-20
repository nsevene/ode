export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
}

export interface MenuCategory {
  id: string
  name: string
  description?: string
  order: number
}

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

export interface Booking {
  id: string
  event_id: string
  user_name: string
  user_email: string
  user_phone?: string
  special_requests?: string
  guests_count: number
  status: 'confirmed' | 'cancelled' | 'pending'
  booking_date: string
  events?: {
    title: string
    event_date: string
    start_time: string
    location: string
  }
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

// Gamification types
export interface TasteAlleyItem {
  id: string
  name: string
  description: string
  category: string
  points_required: number
  is_unlocked: boolean
  image_url?: string
}

export interface CompassChallenge {
  id: string
  title: string
  description: string
  points_reward: number
  is_completed: boolean
  completion_date?: string
  requirements: {
    type: 'visit_count' | 'spend_amount' | 'event_attendance'
    target: number
    current: number
  }
}

export interface PassportLevel {
  id: string
  name: string
  description: string
  points_required: number
  benefits: string[]
  is_achieved: boolean
  achieved_date?: string
}

export interface UserProgress {
  total_points: number
  current_level: string
  next_level_points: number
  taste_alley_items: TasteAlleyItem[]
  compass_challenges: CompassChallenge[]
  passport_levels: PassportLevel[]
}
