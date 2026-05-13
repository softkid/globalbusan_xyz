import { Hono } from 'hono'
import { createClient } from '@supabase/supabase-js'
import { SuiClient } from '@mysten/sui.js/client'
import Joi from 'joi'

const app = new Hono()


// Validation schema
const donationSchema = Joi.object({
  amount: Joi.number().positive().required(),
  donorName: Joi.string().max(100).optional(),
  message: Joi.string().max(500).optional(),
  digest: Joi.string().required(),
  walletAddress: Joi.string().required()
})

// GET all donations
app.get('/', async (c) => {
  try {
    const supabase = createClient(
      c.env.SUPABASE_URL,
      c.env.SUPABASE_KEY
    )

    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return c.json({ success: true, data })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// GET single donation
app.get('/:id', async (c) => {
  try {
    const supabase = createClient(
      c.env.SUPABASE_URL,
      c.env.SUPABASE_KEY
    )

    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('id', c.req.param('id'))
      .single()

    if (error) throw error

    return c.json({ success: true, data })
  } catch (error) {
    return c.json({ success: false, error: 'Donation not found' }, 404)
  }
})

// POST new donation
app.post('/', async (c) => {
  try {
    const body = await c.req.json()

    // Validate input
    const { error: validationError, value } = donationSchema.validate(body)
    if (validationError) {
      return c.json({ 
        success: false, 
        error: validationError.details[0].message 
      }, 400)
    }

    // Verify transaction on Sui blockchain
    const suiClient = new SuiClient({
      url: c.env.SUI_RPC_URL || 'https://fullnode.testnet.sui.io:443'
    })

    const txData = await suiClient.getTransactionBlock({
      digest: value.digest,
      options: { showEffects: true, showInput: true }
    })

    if (!txData || txData.effects?.status?.status !== 'success') {
      return c.json({ 
        success: false, 
        error: 'Invalid or failed transaction' 
      }, 400)
    }

    // Save to database
    const supabase = createClient(
      c.env.SUPABASE_URL,
      c.env.SUPABASE_KEY
    )

    const { data, error } = await supabase
      .from('donations')
      .insert([{
        amount: value.amount,
        donor_name: value.donorName || 'Anonymous',
        message: value.message,
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

// GET donation statistics
app.get('/stats/summary', async (c) => {
  try {
    const supabase = createClient(
      c.env.SUPABASE_URL,
      c.env.SUPABASE_KEY
    )

    const { data, error } = await supabase
      .from('donations')
      .select('amount')

    if (error) throw error

    const totalAmount = data.reduce((sum, d) => sum + parseFloat(d.amount), 0)
    const totalCount = data.length
    const averageAmount = totalCount > 0 ? totalAmount / totalCount : 0

    return c.json({
      success: true,
      data: {
        totalAmount,
        totalCount,
        averageAmount
      }
    })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

export default app
