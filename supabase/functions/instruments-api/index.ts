import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Input validation schema
const queryParamsSchema = z.object({
  category: z.string().max(50).optional(),
  family: z.string().max(50).optional(),
  difficulty: z.string().max(20).optional(),
  search: z.string().max(100).optional(),
})

// Sanitize search input to prevent SQL injection
function sanitizeSearchInput(input: string | null): string | null {
  if (!input) return null
  // Remove special SQL characters and limit length
  return input.replace(/[%_\\]/g, '').trim().slice(0, 100) || null
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const url = new URL(req.url)
    const pathname = url.pathname

    // GET /instruments-api/categories - Get all categories
    if (req.method === 'GET' && pathname.endsWith('/categories')) {
      const { data, error } = await supabase
        .from('instruments')
        .select('category')

      if (error) {
        console.error('Error fetching categories:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const categories = [...new Set(data?.map(item => item.category))].sort()

      return new Response(
        JSON.stringify({ categories }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /instruments-api/stats - Get statistics
    if (req.method === 'GET' && pathname.endsWith('/stats')) {
      const { data, error } = await supabase
        .from('instruments')
        .select('category')

      if (error) {
        console.error('Error fetching stats:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const categoryCount: Record<string, number> = {}
      data?.forEach(item => {
        categoryCount[item.category] = (categoryCount[item.category] || 0) + 1
      })

      return new Response(
        JSON.stringify({ 
          total: data?.length || 0,
          by_category: categoryCount 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /instruments-api - Get all instruments
    if (req.method === 'GET' && pathname.endsWith('/instruments-api')) {
      // Validate query parameters
      const rawParams = {
        category: url.searchParams.get('category'),
        family: url.searchParams.get('family'),
        difficulty: url.searchParams.get('difficulty'),
        search: url.searchParams.get('search'),
      }

      const validationResult = queryParamsSchema.safeParse(rawParams)
      
      if (!validationResult.success) {
        console.error('Invalid query parameters:', validationResult.error)
        return new Response(
          JSON.stringify({ error: 'Invalid query parameters', details: validationResult.error.errors }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { category, family, difficulty, search } = validationResult.data

      let query = supabase
        .from('instruments')
        .select('*')
        .order('name')

      if (category) {
        query = query.eq('category', category)
      }
      if (family) {
        query = query.eq('family', family)
      }
      if (difficulty) {
        query = query.eq('difficulty_level', difficulty)
      }
      if (search) {
        const sanitizedSearch = sanitizeSearchInput(search)
        if (sanitizedSearch) {
          query = query.or(`name.ilike.%${sanitizedSearch}%,description.ilike.%${sanitizedSearch}%`)
        }
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching instruments:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ instruments: data, count: data?.length || 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /instruments-api/:id - Get single instrument
    if (req.method === 'GET' && pathname.includes('/instruments-api/')) {
      const id = pathname.split('/').pop()

      const { data, error } = await supabase
        .from('instruments')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching instrument:', error)
        return new Response(
          JSON.stringify({ error: 'Instrument not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ instrument: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Server error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})