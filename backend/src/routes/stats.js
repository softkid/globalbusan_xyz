import { Hono } from 'hono'
import { createClient } from '@supabase/supabase-js'

const app = new Hono()

// GET overall statistics
app.get('/', async (c) => {
  try {
    const supabase = createClient(
      c.env.SUPABASE_URL,
      c.env.SUPABASE_KEY
    )

    const [donationsResult, investmentsResult] = await Promise.all([
      supabase.from('donations').select('amount'),
      supabase.from('investments').select('amount')
    ])

    const totalDonations = donationsResult.data?.reduce((sum, d) => sum + parseFloat(d.amount), 0) || 0
    const totalInvestments = investmentsResult.data?.reduce((sum, i) => sum + parseFloat(i.amount), 0) || 0

    return c.json({
      success: true,
      data: {
        donations: {
          total: totalDonations,
          count: donationsResult.data?.length || 0
        },
        investments: {
          total: totalInvestments,
          count: investmentsResult.data?.length || 0
        },
        overall: {
          total: totalDonations + totalInvestments,
          count: (donationsResult.data?.length || 0) + (investmentsResult.data?.length || 0)
        }
      }
    })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

export default app
