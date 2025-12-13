// Supabase Edge Function: PayPal Order 승인
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
    const { orderID } = await req.json()

    if (!orderID) {
      return new Response(
        JSON.stringify({ error: { message: 'Order ID is required' } }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // PayPal Access Token 가져오기
    const accessToken = await getPayPalAccessToken()

    // PayPal Order 승인 (Capture)
    const captureResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      }
    })

    if (!captureResponse.ok) {
      const errorData = await captureResponse.json()
      throw new Error(errorData.message || 'Failed to capture PayPal order')
    }

    const order = await captureResponse.json()

    return new Response(
      JSON.stringify({ order }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error approving PayPal order:', error)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message || 'Failed to approve PayPal order',
        },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

