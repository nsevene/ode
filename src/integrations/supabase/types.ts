export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_date: string
          created_at: string
          experience_type: string
          guest_count: number
          guest_email: string
          guest_name: string
          guest_phone: string | null
          id: string
          nfc_passport_id: string | null
          passport_enabled: boolean | null
          payment_amount: number | null
          payment_status: string | null
          special_requests: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          taste_sectors: string[] | null
          time_slot: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          booking_date: string
          created_at?: string
          experience_type: string
          guest_count?: number
          guest_email: string
          guest_name: string
          guest_phone?: string | null
          id?: string
          nfc_passport_id?: string | null
          passport_enabled?: boolean | null
          payment_amount?: number | null
          payment_status?: string | null
          special_requests?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          taste_sectors?: string[] | null
          time_slot: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          booking_date?: string
          created_at?: string
          experience_type?: string
          guest_count?: number
          guest_email?: string
          guest_name?: string
          guest_phone?: string | null
          id?: string
          nfc_passport_id?: string | null
          passport_enabled?: boolean | null
          payment_amount?: number | null
          payment_status?: string | null
          special_requests?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          taste_sectors?: string[] | null
          time_slot?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      campaign_applications: {
        Row: {
          applied_at: string
          booking_id: string | null
          campaign_id: string
          discount_amount: number | null
          guest_email: string | null
          id: string
          order_id: string | null
          promo_code_generated: string | null
          user_id: string | null
        }
        Insert: {
          applied_at?: string
          booking_id?: string | null
          campaign_id: string
          discount_amount?: number | null
          guest_email?: string | null
          id?: string
          order_id?: string | null
          promo_code_generated?: string | null
          user_id?: string | null
        }
        Update: {
          applied_at?: string
          booking_id?: string | null
          campaign_id?: string
          discount_amount?: number | null
          guest_email?: string | null
          id?: string
          order_id?: string | null
          promo_code_generated?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_applications_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      daily_quests: {
        Row: {
          created_at: string
          description: string
          id: string
          is_active: boolean
          quest_date: string
          quest_type: string
          reward_description: string | null
          reward_points: number
          target_value: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          quest_date?: string
          quest_type: string
          reward_description?: string | null
          reward_points?: number
          target_value?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          quest_date?: string
          quest_type?: string
          reward_description?: string | null
          reward_points?: number
          target_value?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      document_metadata: {
        Row: {
          bucket_name: string
          created_at: string
          description: string | null
          document_type: string | null
          file_path: string
          file_size: number | null
          id: string
          is_signed: boolean | null
          mime_type: string | null
          original_name: string
          signed_at: string | null
          signed_by: string | null
          tags: string[] | null
          updated_at: string
          uploaded_by: string | null
          version: number | null
        }
        Insert: {
          bucket_name: string
          created_at?: string
          description?: string | null
          document_type?: string | null
          file_path: string
          file_size?: number | null
          id?: string
          is_signed?: boolean | null
          mime_type?: string | null
          original_name: string
          signed_at?: string | null
          signed_by?: string | null
          tags?: string[] | null
          updated_at?: string
          uploaded_by?: string | null
          version?: number | null
        }
        Update: {
          bucket_name?: string
          created_at?: string
          description?: string | null
          document_type?: string | null
          file_path?: string
          file_size?: number | null
          id?: string
          is_signed?: boolean | null
          mime_type?: string | null
          original_name?: string
          signed_at?: string | null
          signed_by?: string | null
          tags?: string[] | null
          updated_at?: string
          uploaded_by?: string | null
          version?: number | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          subject: string
          template_type: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          subject: string
          template_type?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          subject?: string
          template_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          available_spots: number
          category: string
          created_at: string
          description: string | null
          duration_minutes: number
          end_time: string
          event_date: string
          event_type: string
          id: string
          image_url: string | null
          instructor: string | null
          max_guests: number
          price_usd: number
          start_time: string
          status: string
          title: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          available_spots?: number
          category?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          end_time?: string
          event_date?: string
          event_type: string
          id?: string
          image_url?: string | null
          instructor?: string | null
          max_guests?: number
          price_usd: number
          start_time?: string
          status?: string
          title: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          available_spots?: number
          category?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          end_time?: string
          event_date?: string
          event_type?: string
          id?: string
          image_url?: string | null
          instructor?: string | null
          max_guests?: number
          price_usd?: number
          start_time?: string
          status?: string
          title?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      food_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      food_orders: {
        Row: {
          actual_prep_time: number | null
          completed_at: string | null
          created_at: string
          delivery_address: string | null
          delivery_fee: number | null
          discount_amount: number | null
          estimated_prep_time: number | null
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          id: string
          order_number: string
          order_type: string
          payment_method: string | null
          payment_status: string
          scheduled_for: string | null
          special_instructions: string | null
          status: string
          stripe_payment_intent_id: string | null
          subtotal: number
          tax_amount: number | null
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          actual_prep_time?: number | null
          completed_at?: string | null
          created_at?: string
          delivery_address?: string | null
          delivery_fee?: number | null
          discount_amount?: number | null
          estimated_prep_time?: number | null
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          order_number: string
          order_type?: string
          payment_method?: string | null
          payment_status?: string
          scheduled_for?: string | null
          special_instructions?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          subtotal: number
          tax_amount?: number | null
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          actual_prep_time?: number | null
          completed_at?: string | null
          created_at?: string
          delivery_address?: string | null
          delivery_fee?: number | null
          discount_amount?: number | null
          estimated_prep_time?: number | null
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          order_number?: string
          order_type?: string
          payment_method?: string | null
          payment_status?: string
          scheduled_for?: string | null
          special_instructions?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      guest_profiles: {
        Row: {
          created_at: string
          current_streak: number
          email: string | null
          guest_id: string
          id: string
          last_stamp_date: string | null
          name: string | null
          phone: string | null
          registration_date: string
          total_stamps: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          email?: string | null
          guest_id: string
          id?: string
          last_stamp_date?: string | null
          name?: string | null
          phone?: string | null
          registration_date?: string
          total_stamps?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          email?: string | null
          guest_id?: string
          id?: string
          last_stamp_date?: string | null
          name?: string | null
          phone?: string | null
          registration_date?: string
          total_stamps?: number
          updated_at?: string
        }
        Relationships: []
      }
      guest_rewards: {
        Row: {
          claimed_date: string | null
          created_at: string
          expires_at: string | null
          guest_id: string
          id: string
          issued_date: string
          promo_code: string | null
          reward_description: string | null
          reward_title: string
          reward_type: string
          reward_value: number | null
          status: string
          updated_at: string
        }
        Insert: {
          claimed_date?: string | null
          created_at?: string
          expires_at?: string | null
          guest_id: string
          id?: string
          issued_date?: string
          promo_code?: string | null
          reward_description?: string | null
          reward_title: string
          reward_type: string
          reward_value?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          claimed_date?: string | null
          created_at?: string
          expires_at?: string | null
          guest_id?: string
          id?: string
          issued_date?: string
          promo_code?: string | null
          reward_description?: string | null
          reward_title?: string
          reward_type?: string
          reward_value?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      guest_stamps: {
        Row: {
          created_at: string
          guest_id: string
          id: string
          jwt_token: string | null
          location_verified: boolean
          nfc_tag_id: string | null
          source: string
          timestamp: string
          zone_name: string
        }
        Insert: {
          created_at?: string
          guest_id: string
          id?: string
          jwt_token?: string | null
          location_verified?: boolean
          nfc_tag_id?: string | null
          source?: string
          timestamp?: string
          zone_name: string
        }
        Update: {
          created_at?: string
          guest_id?: string
          id?: string
          jwt_token?: string | null
          location_verified?: boolean
          nfc_tag_id?: string | null
          source?: string
          timestamp?: string
          zone_name?: string
        }
        Relationships: []
      }
      loyalty_programs: {
        Row: {
          created_at: string
          id: string
          points: number
          tier: string
          total_spent: number
          updated_at: string
          user_id: string
          visits: number
        }
        Insert: {
          created_at?: string
          id?: string
          points?: number
          tier?: string
          total_spent?: number
          updated_at?: string
          user_id: string
          visits?: number
        }
        Update: {
          created_at?: string
          id?: string
          points?: number
          tier?: string
          total_spent?: number
          updated_at?: string
          user_id?: string
          visits?: number
        }
        Relationships: []
      }
      loyalty_redemptions: {
        Row: {
          created_at: string
          id: string
          points_used: number
          reward_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points_used: number
          reward_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points_used?: number
          reward_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "loyalty_rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_rewards: {
        Row: {
          active: boolean
          created_at: string
          description: string
          id: string
          points_required: number
          tier_required: string
          title: string
          type: string
          updated_at: string
          value: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          description: string
          id?: string
          points_required: number
          tier_required?: string
          title: string
          type: string
          updated_at?: string
          value: number
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          id?: string
          points_required?: number
          tier_required?: string
          title?: string
          type?: string
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      marketing_campaigns: {
        Row: {
          created_at: string
          description: string
          discount_type: string
          discount_value: number
          email_template: string | null
          end_date: string | null
          id: string
          is_active: boolean
          name: string
          push_notification_template: string | null
          start_date: string
          title: string
          trigger_conditions: Json
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          discount_type: string
          discount_value: number
          email_template?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          name: string
          push_notification_template?: string | null
          start_date?: string
          title: string
          trigger_conditions: Json
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          discount_type?: string
          discount_value?: number
          email_template?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          name?: string
          push_notification_template?: string | null
          start_date?: string
          title?: string
          trigger_conditions?: Json
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          allergens: string[] | null
          calories: number | null
          category_id: string | null
          created_at: string
          description: string | null
          dietary_tags: string[] | null
          display_order: number | null
          id: string
          image_url: string | null
          ingredients: string[] | null
          is_available: boolean
          is_featured: boolean
          name: string
          prep_time_minutes: number | null
          price_usd: number
          spice_level: number | null
          updated_at: string
          vendor_name: string | null
        }
        Insert: {
          allergens?: string[] | null
          calories?: number | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          dietary_tags?: string[] | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          is_available?: boolean
          is_featured?: boolean
          name: string
          prep_time_minutes?: number | null
          price_usd: number
          spice_level?: number | null
          updated_at?: string
          vendor_name?: string | null
        }
        Update: {
          allergens?: string[] | null
          calories?: number | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          dietary_tags?: string[] | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          is_available?: boolean
          is_featured?: boolean
          name?: string
          prep_time_minutes?: number | null
          price_usd?: number
          spice_level?: number | null
          updated_at?: string
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "food_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      mini_games: {
        Row: {
          base_points: number
          created_at: string
          description: string
          difficulty: string
          game_type: string
          id: string
          is_active: boolean
          name: string
          sector_id: string
          time_limit: number | null
          updated_at: string
        }
        Insert: {
          base_points?: number
          created_at?: string
          description: string
          difficulty: string
          game_type: string
          id?: string
          is_active?: boolean
          name: string
          sector_id: string
          time_limit?: number | null
          updated_at?: string
        }
        Update: {
          base_points?: number
          created_at?: string
          description?: string
          difficulty?: string
          game_type?: string
          id?: string
          is_active?: boolean
          name?: string
          sector_id?: string
          time_limit?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          menu_item_id: string
          order_id: string
          quantity: number
          special_requests: string | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          menu_item_id: string
          order_id: string
          quantity: number
          special_requests?: string | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          menu_item_id?: string
          order_id?: string
          quantity?: number
          special_requests?: string | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "food_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          referral_code: string | null
          referral_count: number | null
          referral_earnings: number | null
          referred_by: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          phone?: string | null
          referral_code?: string | null
          referral_count?: number | null
          referral_earnings?: number | null
          referred_by?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          referral_code?: string | null
          referral_count?: number | null
          referral_earnings?: number | null
          referred_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_code_usages: {
        Row: {
          booking_id: string | null
          created_at: string
          discount_amount: number
          guest_email: string | null
          id: string
          order_id: string | null
          promo_code_id: string
          user_id: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          discount_amount: number
          guest_email?: string | null
          id?: string
          order_id?: string | null
          promo_code_id: string
          user_id?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          discount_amount?: number
          guest_email?: string | null
          id?: string
          order_id?: string | null
          promo_code_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promo_code_usages_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          applicable_to: string[] | null
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean
          max_discount_amount: number | null
          min_order_amount: number | null
          title: string
          updated_at: string
          usage_count: number
          usage_limit: number | null
          user_usage_limit: number | null
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          applicable_to?: string[] | null
          code: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean
          max_discount_amount?: number | null
          min_order_amount?: number | null
          title: string
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
          user_usage_limit?: number | null
          valid_from?: string
          valid_until?: string | null
        }
        Update: {
          applicable_to?: string[] | null
          code?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean
          max_discount_amount?: number | null
          min_order_amount?: number | null
          title?: string
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
          user_usage_limit?: number | null
          valid_from?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      referral_transactions: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          description: string | null
          id: string
          processed_at: string
          referred_id: string
          referrer_id: string
          transaction_type: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          processed_at?: string
          referred_id: string
          referrer_id: string
          transaction_type: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          processed_at?: string
          referred_id?: string
          referrer_id?: string
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_transactions_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_transactions_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          content: string
          created_at: string
          guest_email: string | null
          guest_name: string | null
          id: string
          rating: number
          status: string
          title: string
          updated_at: string
          user_id: string | null
          vendor_name: string
        }
        Insert: {
          content: string
          created_at?: string
          guest_email?: string | null
          guest_name?: string | null
          id?: string
          rating: number
          status?: string
          title: string
          updated_at?: string
          user_id?: string | null
          vendor_name: string
        }
        Update: {
          content?: string
          created_at?: string
          guest_email?: string | null
          guest_name?: string | null
          id?: string
          rating?: number
          status?: string
          title?: string
          updated_at?: string
          user_id?: string | null
          vendor_name?: string
        }
        Relationships: []
      }
      space_booking_comments: {
        Row: {
          admin_user_id: string
          booking_id: string
          comment: string
          created_at: string
          id: string
          is_internal: boolean
          updated_at: string
        }
        Insert: {
          admin_user_id: string
          booking_id: string
          comment: string
          created_at?: string
          id?: string
          is_internal?: boolean
          updated_at?: string
        }
        Update: {
          admin_user_id?: string
          booking_id?: string
          comment?: string
          created_at?: string
          id?: string
          is_internal?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "space_booking_comments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "space_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      space_bookings: {
        Row: {
          admin_notes: string | null
          admin_notes_count: number | null
          best_contact_time: string | null
          business_type: string
          company_name: string
          contact_person: string
          created_at: string
          cuisine_type: string | null
          description: string
          email: string
          expected_revenue: string | null
          floor_number: number
          has_food_license: boolean | null
          id: string
          investment_budget: string | null
          lease_duration: string
          lease_start_date: string | null
          phone: string
          preferred_contact_method: string | null
          previous_experience: string | null
          space_area: number
          space_id: number
          space_name: string
          special_requirements: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          admin_notes_count?: number | null
          best_contact_time?: string | null
          business_type: string
          company_name: string
          contact_person: string
          created_at?: string
          cuisine_type?: string | null
          description: string
          email: string
          expected_revenue?: string | null
          floor_number: number
          has_food_license?: boolean | null
          id?: string
          investment_budget?: string | null
          lease_duration: string
          lease_start_date?: string | null
          phone: string
          preferred_contact_method?: string | null
          previous_experience?: string | null
          space_area: number
          space_id: number
          space_name: string
          special_requirements?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          admin_notes_count?: number | null
          best_contact_time?: string | null
          business_type?: string
          company_name?: string
          contact_person?: string
          created_at?: string
          cuisine_type?: string | null
          description?: string
          email?: string
          expected_revenue?: string | null
          floor_number?: number
          has_food_license?: boolean | null
          id?: string
          investment_budget?: string | null
          lease_duration?: string
          lease_start_date?: string | null
          phone?: string
          preferred_contact_method?: string | null
          previous_experience?: string | null
          space_area?: number
          space_id?: number
          space_name?: string
          special_requirements?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      support_chats: {
        Row: {
          admin_user_id: string | null
          closed_at: string | null
          created_at: string
          guest_email: string | null
          guest_name: string | null
          id: string
          priority: string
          status: string
          subject: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_user_id?: string | null
          closed_at?: string | null
          created_at?: string
          guest_email?: string | null
          guest_name?: string | null
          id?: string
          priority?: string
          status?: string
          subject: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_user_id?: string | null
          closed_at?: string | null
          created_at?: string
          guest_email?: string | null
          guest_name?: string | null
          id?: string
          priority?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          chat_id: string
          created_at: string
          id: string
          message: string
          read_at: string | null
          sender_id: string | null
          sender_type: string
        }
        Insert: {
          chat_id: string
          created_at?: string
          id?: string
          message: string
          read_at?: string | null
          sender_id?: string | null
          sender_type: string
        }
        Update: {
          chat_id?: string
          created_at?: string
          id?: string
          message?: string
          read_at?: string | null
          sender_id?: string | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "support_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      taste_alley_achievements: {
        Row: {
          achievement_description: string
          achievement_id: string
          achievement_title: string
          achievement_type: string
          created_at: string
          id: string
          reward_points: number
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_description: string
          achievement_id: string
          achievement_title: string
          achievement_type: string
          created_at?: string
          id?: string
          reward_points?: number
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_description?: string
          achievement_id?: string
          achievement_title?: string
          achievement_type?: string
          created_at?: string
          id?: string
          reward_points?: number
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      taste_alley_leaderboard: {
        Row: {
          achievements_count: number
          completed_sectors: number
          created_at: string
          current_rank: number
          display_name: string
          fastest_time: number | null
          id: string
          last_updated: string
          total_score: number
          updated_at: string
          user_id: string
          user_level: number
        }
        Insert: {
          achievements_count?: number
          completed_sectors?: number
          created_at?: string
          current_rank?: number
          display_name: string
          fastest_time?: number | null
          id?: string
          last_updated?: string
          total_score?: number
          updated_at?: string
          user_id: string
          user_level?: number
        }
        Update: {
          achievements_count?: number
          completed_sectors?: number
          created_at?: string
          current_rank?: number
          display_name?: string
          fastest_time?: number | null
          id?: string
          last_updated?: string
          total_score?: number
          updated_at?: string
          user_id?: string
          user_level?: number
        }
        Relationships: []
      }
      taste_alley_progress: {
        Row: {
          achievements_count: number
          completed_sectors: number
          created_at: string
          current_multiplier: number
          current_sector: number
          fastest_time: number | null
          id: string
          last_activity_date: string | null
          quests_completed: number
          streak_count: number
          total_quest_time: number
          total_score: number
          updated_at: string
          user_id: string
          user_level: number
        }
        Insert: {
          achievements_count?: number
          completed_sectors?: number
          created_at?: string
          current_multiplier?: number
          current_sector?: number
          fastest_time?: number | null
          id?: string
          last_activity_date?: string | null
          quests_completed?: number
          streak_count?: number
          total_quest_time?: number
          total_score?: number
          updated_at?: string
          user_id: string
          user_level?: number
        }
        Update: {
          achievements_count?: number
          completed_sectors?: number
          created_at?: string
          current_multiplier?: number
          current_sector?: number
          fastest_time?: number | null
          id?: string
          last_activity_date?: string | null
          quests_completed?: number
          streak_count?: number
          total_quest_time?: number
          total_score?: number
          updated_at?: string
          user_id?: string
          user_level?: number
        }
        Relationships: []
      }
      taste_alley_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          score_earned: number
          sectors_completed: number
          session_duration: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          score_earned?: number
          sectors_completed?: number
          session_duration?: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          score_earned?: number
          sectors_completed?: number
          session_duration?: number
          user_id?: string
        }
        Relationships: []
      }
      taste_compass_progress: {
        Row: {
          completed: boolean
          created_at: string
          first_visit_date: string | null
          id: string
          last_visit_date: string | null
          nfc_taps: number
          sector_name: string
          updated_at: string
          user_id: string
          visit_count: number
        }
        Insert: {
          completed?: boolean
          created_at?: string
          first_visit_date?: string | null
          id?: string
          last_visit_date?: string | null
          nfc_taps?: number
          sector_name: string
          updated_at?: string
          user_id: string
          visit_count?: number
        }
        Update: {
          completed?: boolean
          created_at?: string
          first_visit_date?: string | null
          id?: string
          last_visit_date?: string | null
          nfc_taps?: number
          sector_name?: string
          updated_at?: string
          user_id?: string
          visit_count?: number
        }
        Relationships: []
      }
      taste_passport_achievements: {
        Row: {
          achievement_name: string
          achievement_type: string
          created_at: string
          description: string | null
          id: string
          reward_points: number | null
          unlock_date: string
          user_id: string
        }
        Insert: {
          achievement_name: string
          achievement_type: string
          created_at?: string
          description?: string | null
          id?: string
          reward_points?: number | null
          unlock_date?: string
          user_id: string
        }
        Update: {
          achievement_name?: string
          achievement_type?: string
          created_at?: string
          description?: string | null
          id?: string
          reward_points?: number | null
          unlock_date?: string
          user_id?: string
        }
        Relationships: []
      }
      tenant_applications: {
        Row: {
          admin_notes: string | null
          brand: string
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          cuisine: string
          expected_revenue: string | null
          format: string
          id: string
          instagram: string | null
          notes: string | null
          preferred_corner: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          brand: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          cuisine: string
          expected_revenue?: string | null
          format: string
          id?: string
          instagram?: string | null
          notes?: string | null
          preferred_corner?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          brand?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          cuisine?: string
          expected_revenue?: string | null
          format?: string
          id?: string
          instagram?: string | null
          notes?: string | null
          preferred_corner?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_daily_quest_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          current_progress: number
          id: string
          quest_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          current_progress?: number
          id?: string
          quest_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          current_progress?: number
          id?: string
          quest_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_daily_quest_progress_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "daily_quests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_mini_game_results: {
        Row: {
          completed_at: string
          created_at: string
          game_id: string
          id: string
          points_earned: number
          score: number
          time_taken: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          game_id: string
          id?: string
          points_earned?: number
          score?: number
          time_taken?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          game_id?: string
          id?: string
          points_earned?: number
          score?: number
          time_taken?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_mini_game_results_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "mini_games"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_quest_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          current_progress: number
          id: string
          quest_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          current_progress?: number
          id?: string
          quest_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          current_progress?: number
          id?: string
          quest_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vendor_applications: {
        Row: {
          admin_notes: string | null
          company_name: string
          contact_person: string
          created_at: string
          cuisine_type: string
          description: string
          email: string
          expected_revenue: string | null
          experience_years: number | null
          id: string
          investment_budget: string | null
          phone: string
          preferred_sector: string
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          company_name: string
          contact_person: string
          created_at?: string
          cuisine_type: string
          description: string
          email: string
          expected_revenue?: string | null
          experience_years?: number | null
          id?: string
          investment_budget?: string | null
          phone: string
          preferred_sector: string
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          company_name?: string
          contact_person?: string
          created_at?: string
          cuisine_type?: string
          description?: string
          email?: string
          expected_revenue?: string | null
          experience_years?: number | null
          id?: string
          investment_budget?: string | null
          phone?: string
          preferred_sector?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      vendor_communications: {
        Row: {
          admin_user_id: string | null
          communication_type: string
          content: string
          created_at: string
          id: string
          sent_at: string
          subject: string | null
          vendor_application_id: string
        }
        Insert: {
          admin_user_id?: string | null
          communication_type: string
          content: string
          created_at?: string
          id?: string
          sent_at?: string
          subject?: string | null
          vendor_application_id: string
        }
        Update: {
          admin_user_id?: string | null
          communication_type?: string
          content?: string
          created_at?: string
          id?: string
          sent_at?: string
          subject?: string | null
          vendor_application_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_communications_vendor_application_id_fkey"
            columns: ["vendor_application_id"]
            isOneToOne: false
            referencedRelation: "vendor_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_meetings: {
        Row: {
          admin_notes: string | null
          created_at: string
          duration_minutes: number
          id: string
          meeting_date: string
          meeting_time: string
          meeting_type: string
          status: string
          updated_at: string
          vendor_application_id: string
          vendor_notes: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          meeting_date: string
          meeting_time: string
          meeting_type?: string
          status?: string
          updated_at?: string
          vendor_application_id: string
          vendor_notes?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          meeting_date?: string
          meeting_time?: string
          meeting_type?: string
          status?: string
          updated_at?: string
          vendor_application_id?: string
          vendor_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_meetings_vendor_application_id_fkey"
            columns: ["vendor_application_id"]
            isOneToOne: false
            referencedRelation: "vendor_applications"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_marketing_campaigns: {
        Args: {
          p_context?: Json
          p_guest_email?: string
          p_trigger_type?: string
          p_user_id?: string
        }
        Returns: {
          campaign_id: string
          discount_amount: number
          promo_code: string
        }[]
      }
      award_taste_alley_achievement: {
        Args: {
          p_achievement_id: string
          p_description: string
          p_reward_points: number
          p_title: string
          p_type: string
          p_user_id: string
        }
        Returns: undefined
      }
      generate_nfc_passport_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_promo_code: {
        Args: { prefix?: string }
        Returns: string
      }
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_availability: {
        Args: { p_booking_date: string; p_experience_type: string }
        Returns: {
          booked_count: number
          is_available: boolean
          time_slot: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_guest_booking_secure: {
        Args: {
          p_booking_id: string
          p_guest_email: string
          p_verification_code?: string
        }
        Returns: Json
      }
      get_guest_profile_secure: {
        Args: { p_guest_id: string; p_verification_token?: string }
        Returns: Json
      }
      get_guest_progress: {
        Args: { p_guest_id: string }
        Returns: Json
      }
      get_user_role: {
        Args: { _user_id?: string }
        Returns: string
      }
      handle_referral_reward: {
        Args: { new_user_id: string; referrer_code: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: { _user_id?: string }
        Returns: boolean
      }
      process_guest_stamp: {
        Args: {
          p_guest_id: string
          p_jwt_token?: string
          p_nfc_tag_id?: string
          p_source?: string
          p_zone_name: string
        }
        Returns: Json
      }
      track_nfc_interaction: {
        Args: { p_sector_name: string; p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
