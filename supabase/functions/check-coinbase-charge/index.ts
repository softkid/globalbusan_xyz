// Supabase Edge Function: Coinbase Commerce Charge 상태 확인
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const COINBASE_API_KEY = Deno.env.get('COINBASE_COMMERCE_API_KEY') || ''
const COINBASE_API_VERSION = '2018-03-22'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS preflight 요청 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // URL에서 charge ID 추출
    const url = new URL(req.url)
    const chargeId = url.pathname.split('/').pop()

    if (!chargeId) {
      return new Response(
        JSON.stringify({ error: { message: 'Charge ID is required' } }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Coinbase Commerce API 호출
    const response = await fetch(`https://api.commerce.coinbase.com/charges/${chargeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': COINBASE_API_KEY,
        'X-CC-Version': COINBASE_API_VERSION,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || 'Failed to fetch Coinbase charge')
    }

    const charge = await response.json()

    return new Response(
      JSON.stringify({
        charge: charge.data,
        status: charge.data.timeline?.[charge.data.timeline.length - 1]?.status || 'PENDING',
        hosted_url: charge.data.hosted_url,
        code: charge.data.code,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error checking Coinbase charge:', error)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message || 'Failed to check Coinbase charge',
        },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

