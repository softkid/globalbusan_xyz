import { Hono } from 'hono'
import { createClient } from '@supabase/supabase-js'

const app = new Hono()

// GET all projects
app.get('/', async (c) => {
  try {
    const supabase = createClient(
      c.env.SUPABASE_URL,
      c.env.SUPABASE_KEY
    )

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return c.json({ success: true, data })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// GET project by ID
app.get('/:id', async (c) => {
  try {
    const supabase = createClient(
      c.env.SUPABASE_URL,
      c.env.SUPABASE_KEY
    )

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', c.req.param('id'))
      .single()

    if (error) throw error

    return c.json({ success: true, data })
  } catch (error) {
    return c.json({ success: false, error: 'Project not found' }, 404)
  }
})

export default app
