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

export default app
