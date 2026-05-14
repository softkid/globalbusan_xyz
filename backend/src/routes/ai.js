import { Hono } from 'hono'
import { createClient } from '@supabase/supabase-js'

const app = new Hono()

// Helper to create Supabase client
const getSupabase = (c) => createClient(c.env.SUPABASE_URL, c.env.SUPABASE_KEY)

// GET all courses
app.get('/courses', async (c) => {
  try {
    const supabase = getSupabase(c)
    const { data, error } = await supabase.from('ai_courses').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return c.json({ success: true, data })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// GET course by ID
app.get('/courses/:id', async (c) => {
  try {
    const supabase = getSupabase(c)
    const { data, error } = await supabase.from('ai_courses').select('*').eq('id', c.req.param('id')).single()
    if (error) throw error
    return c.json({ success: true, data })
  } catch (error) {
    return c.json({ success: false, error: 'Course not found' }, 404)
  }
})

// GET all services
app.get('/services', async (c) => {
  try {
    const supabase = getSupabase(c)
    const { data, error } = await supabase.from('ai_services').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return c.json({ success: true, data })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// GET service by ID
app.get('/services/:id', async (c) => {
  try {
    const supabase = getSupabase(c)
    const { data, error } = await supabase.from('ai_services').select('*').eq('id', c.req.param('id')).single()
    if (error) throw error
    return c.json({ success: true, data })
  } catch (error) {
    return c.json({ success: false, error: 'Service not found' }, 404)
  }
})

// GET all projects
app.get('/projects', async (c) => {
  try {
    const supabase = getSupabase(c)
    const { data, error } = await supabase.from('ai_projects').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return c.json({ success: true, data })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// GET project by ID
app.get('/projects/:id', async (c) => {
  try {
    const supabase = getSupabase(c)
    const { data, error } = await supabase.from('ai_projects').select('*').eq('id', c.req.param('id')).single()
    if (error) throw error
    return c.json({ success: true, data })
  } catch (error) {
    return c.json({ success: false, error: 'Project not found' }, 404)
  }
})

// GET all news/events
app.get('/news', async (c) => {
  try {
    const supabase = getSupabase(c)
    const { data, error } = await supabase.from('ai_news').select('*').order('date', { ascending: false })
    if (error) throw error
    return c.json({ success: true, data })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// GET all prompts
app.get('/prompts', async (c) => {
  try {
    const supabase = getSupabase(c)
    const { data, error } = await supabase.from('ai_prompts').select('*').order('likes', { ascending: false })
    if (error) throw error
    return c.json({ success: true, data })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// GET community posts
app.get('/community/posts', async (c) => {
  try {
    const supabase = getSupabase(c)
    const { data, error } = await supabase.from('ai_community_posts').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return c.json({ success: true, data })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ===== V2 API Endpoints =====

// POST event reservation (무료 설명회 예약)
app.post('/events/reserve', async (c) => {
  try {
    const supabase = getSupabase(c)
    const body = await c.req.json()
    const { data, error } = await supabase.from('ai_event_reservations').insert(body).select().single()
    if (error) throw error
    return c.json({ success: true, data })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// GET event reservations count by event
app.get('/events/stats', async (c) => {
  try {
    const supabase = getSupabase(c)
    const { data, error } = await supabase.from('ai_event_reservations').select('event_title, max_spots')
    if (error) throw error
    const stats = {}
    data.forEach(r => {
      if (!stats[r.event_title]) stats[r.event_title] = { count: 0, max: r.max_spots }
      stats[r.event_title].count++
    })
    return c.json({ success: true, data: stats })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// GET challenges
app.get('/challenges', async (c) => {
  try {
    const supabase = getSupabase(c)
    const { data, error } = await supabase.from('ai_challenges').select('*').order('deadline', { ascending: true })
    if (error) throw error
    return c.json({ success: true, data })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// POST challenge submission
app.post('/challenges/:id/submit', async (c) => {
  try {
    const supabase = getSupabase(c)
    const body = await c.req.json()
    body.challenge_id = parseInt(c.req.param('id'))
    const { data, error } = await supabase.from('ai_challenge_submissions').insert(body).select().single()
    if (error) throw error
    // Increment participants count
    await supabase.rpc('increment_challenge_participants', { challenge_id: body.challenge_id })
    return c.json({ success: true, data })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// GET experts
app.get('/experts', async (c) => {
  try {
    const supabase = getSupabase(c)
    const region = c.req.query('region')
    let query = supabase.from('ai_experts').select('*').order('rating', { ascending: false })
    if (region) query = query.eq('region', region)
    const { data, error } = await query
    if (error) throw error
    return c.json({ success: true, data })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// GET expert by ID
app.get('/experts/:id', async (c) => {
  try {
    const supabase = getSupabase(c)
    const { data, error } = await supabase.from('ai_experts').select('*').eq('id', c.req.param('id')).single()
    if (error) throw error
    return c.json({ success: true, data })
  } catch (error) {
    return c.json({ success: false, error: 'Expert not found' }, 404)
  }
})

// POST marketplace request (AI 구축 의뢰)
app.post('/marketplace/request', async (c) => {
  try {
    const supabase = getSupabase(c)
    const body = await c.req.json()
    const { data, error } = await supabase.from('ai_marketplace_requests').insert(body).select().single()
    if (error) throw error
    return c.json({ success: true, data })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// GET marketplace requests
app.get('/marketplace/requests', async (c) => {
  try {
    const supabase = getSupabase(c)
    const { data, error } = await supabase.from('ai_marketplace_requests').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return c.json({ success: true, data })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

export default app
