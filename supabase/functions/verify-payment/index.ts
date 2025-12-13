// Supabase Edge Function: 결제 검증 및 데이터베이스 업데이트
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { paymentIntentId, transactionHash, network, amount, investorEmail, cryptoType } = await req.json()

    if (!paymentIntentId && !transactionHash) {
      return new Response(
        JSON.stringify({ error: { message: 'Payment intent ID or transaction hash required' } }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 투자 기록 생성
    const investmentData = {
      investor_email: investorEmail,
      amount: amount,
      crypto_type: cryptoType || 'USD',
      transaction_hash: paymentIntentId || transactionHash,
      status: 'confirmed',
      investment_date: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('investments')
      .insert([investmentData])
      .select()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    return new Response(
      JSON.stringify({
        success: true,
        investment: data[0],
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error verifying payment:', error)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message || 'Failed to verify payment',
        },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

