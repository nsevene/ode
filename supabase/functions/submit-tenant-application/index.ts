import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TenantApplication {
  full_name: string
  brand_name: string
  phone_number: string
  email: string
  concept_description?: string
  presentation_url?: string
  notes?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse request body
    const body: TenantApplication = await req.json()

    // Validate required fields
    const requiredFields = ['full_name', 'brand_name', 'phone_number', 'email']
    const missingFields = requiredFields.filter(field => !body[field] || body[field].trim() === '')
    
    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: `Обязательные поля не заполнены: ${missingFields.join(', ')}` 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return new Response(
        JSON.stringify({ error: 'Некорректный формат email' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    if (!phoneRegex.test(body.phone_number.replace(/[\s\-\(\)]/g, ''))) {
      return new Response(
        JSON.stringify({ error: 'Некорректный формат номера телефона' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate URL if provided
    if (body.presentation_url && body.presentation_url.trim() !== '') {
      try {
        new URL(body.presentation_url)
      } catch {
        return new Response(
          JSON.stringify({ error: 'Некорректный формат ссылки на презентацию' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    // Clean and prepare data
    const applicationData = {
      full_name: body.full_name.trim(),
      brand_name: body.brand_name.trim(),
      phone_number: body.phone_number.trim(),
      email: body.email.trim().toLowerCase(),
      concept_description: body.concept_description?.trim() || null,
      presentation_url: body.presentation_url?.trim() || null,
      notes: body.notes?.trim() || null,
      status: 'pending'
    }

    // Insert data into database
    const { data, error } = await supabase
      .from('tenant_applications')
      .insert([applicationData])
      .select()

    if (error) {
      console.error('Database error:', error)
      
      // Handle unique constraint violation
      if (error.code === '23505' && error.message.includes('email')) {
        return new Response(
          JSON.stringify({ error: 'Заявка с таким email уже существует' }),
          { 
            status: 409, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ error: 'Ошибка при сохранении заявки' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Заявка успешно отправлена',
        application_id: data[0].id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Внутренняя ошибка сервера' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})