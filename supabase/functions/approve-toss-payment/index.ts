// Supabase Edge Function: 토스페이먼츠 결제 승인
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const TOSS_SECRET_KEY = Deno.env.get('TOSS_SECRET_KEY') || ''
const TOSS_API_URL = 'https://api.tosspayments.com/v1/payments/confirm'

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
    const { paymentKey, orderId, amount } = await req.json()

    if (!paymentKey || !orderId || !amount) {
      return new Response(
        JSON.stringify({ error: { message: 'Missing required parameters' } }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // 토스페이먼츠 결제 승인 API 호출
    const response = await fetch(TOSS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(TOSS_SECRET_KEY + ':')}`, // 시크릿 키 base64 인코딩
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to approve Toss payment')
    }

    const payment = await response.json()

    return new Response(
      JSON.stringify({ payment }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error approving Toss payment:', error)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message || 'Failed to approve Toss payment',
        },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

