// Supabase Edge Function: PayPal Order 생성
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID') || ''
const PAYPAL_SECRET = Deno.env.get('PAYPAL_SECRET') || ''
const PAYPAL_BASE_URL = Deno.env.get('PAYPAL_MODE') === 'live' 
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// PayPal Access Token 가져오기
const getPayPalAccessToken = async () => {
  const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`)
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials'
  })

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token')
  }

  const data = await response.json()
  return data.access_token
}

serve(async (req) => {
  // CORS preflight 요청 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, currency, metadata } = await req.json()

    if (!amount || amount < 0.01) {
      return new Response(
        JSON.stringify({ error: { message: 'Amount must be at least $0.01' } }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // PayPal Access Token 가져오기
    const accessToken = await getPayPalAccessToken()

    // PayPal Order 생성
    const orderResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency.toUpperCase(),
              value: amount.toFixed(2)
            },
            description: metadata?.orderName || 'Global BUSAN Donation',
            custom_id: metadata?.orderId || `donation_${Date.now()}`,
            soft_descriptor: 'Global BUSAN'
          }
        ],
        application_context: {
          brand_name: 'Global BUSAN',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${req.headers.get('origin') || 'https://globalbusan.xyz'}/donation/success`,
          cancel_url: `${req.headers.get('origin') || 'https://globalbusan.xyz'}/donation/cancel`
        }
      })
    })

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json()
      throw new Error(errorData.message || 'Failed to create PayPal order')
    }

    const order = await orderResponse.json()

    return new Response(
      JSON.stringify({ orderId: order.id, order }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error creating PayPal order:', error)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message || 'Failed to create PayPal order',
        },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

