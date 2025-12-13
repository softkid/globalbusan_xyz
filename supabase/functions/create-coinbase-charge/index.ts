// Supabase Edge Function: Coinbase Commerce Charge 생성
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
    const { amount, currency, metadata } = await req.json()

    // 입력 검증
    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: { message: 'Invalid amount' } }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Coinbase Commerce API 호출
    const response = await fetch('https://api.commerce.coinbase.com/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': COINBASE_API_KEY,
        'X-CC-Version': COINBASE_API_VERSION,
      },
      body: JSON.stringify({
        name: metadata?.name || 'Global Busan Donation',
        description: metadata?.description || 'Donation to Global Busan project',
        local_price: {
          amount: amount.toString(),
          currency: currency.toUpperCase() || 'USD',
        },
        pricing_type: 'fixed_price',
        metadata: {
          ...metadata,
          platform: 'global-busan',
          timestamp: new Date().toISOString(),
        },
        redirect_url: metadata?.redirect_url || 'https://globalbusan.xyz/donation?success=true',
        cancel_url: metadata?.cancel_url || 'https://globalbusan.xyz/donation?canceled=true',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'Failed to create Coinbase charge')
    }

    const charge = await response.json()

    return new Response(
      JSON.stringify({
        charge: charge.data,
        hosted_url: charge.data.hosted_url,
        code: charge.data.code,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error creating Coinbase charge:', error)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message || 'Failed to create Coinbase charge',
        },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

