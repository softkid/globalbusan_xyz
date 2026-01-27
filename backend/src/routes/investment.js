import { Hono } from 'hono'
import { createClient } from '@supabase/supabase-js'
import Joi from 'joi'

const app = new Hono()

const investmentSchema = Joi.object({
  projectId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  investorName: Joi.string().max(100).optional(),
  notes: Joi.string().max(500).optional(),
  digest: Joi.string().required(),
  walletAddress: Joi.string().required()
})

// GET all investments
app.get('/', async (c) => {
  try {
    const supabase = createClient(
      c.env.SUPABASE_URL,
      c.env.SUPABASE_KEY
    )

    const { data, error } = await supabase
      .from('investments')
      .select('*, projects(*)')
      .order('created_at', { ascending: false })

    if (error) throw error

    return c.json({ success: true, data })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// POST new investment
app.post('/', async (c) => {
  try {
    const body = await c.req.json()

    const { error: validationError, value } = investmentSchema.validate(body)
    if (validationError) {
      return c.json({ 
        success: false, 
        error: validationError.details[0].message 
      }, 400)
    }

    const supabase = createClient(
      c.env.SUPABASE_URL,
      c.env.SUPABASE_KEY
    )

    const { data, error } = await supabase
      .from('investments')
      .insert([{
        project_id: value.projectId,
        amount: value.amount,
        investor_name: value.investorName || 'Anonymous',
        notes: value.notes,
        digest: value.digest,
        wallet_address: value.walletAddress,
        verified: true
      }])
      .select()

    if (error) throw error

    return c.json({ success: true, data: data[0] }, 201)
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

export default app
