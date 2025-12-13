// Supabase Edge Function: 환불 처리
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { paymentIntentId, amount, reason, investmentId } = await req.json()

    if (!paymentIntentId) {
      return new Response(
        JSON.stringify({ error: { message: 'Payment intent ID is required' } }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Stripe 환불 처리
    const refundParams = {
      payment_intent: paymentIntentId,
      reason: reason || 'requested_by_customer',
    }

    // 부분 환불인 경우
    if (amount) {
      refundParams.amount = Math.round(amount * 100) // 센트 단위
    }

    const refund = await stripe.refunds.create(refundParams)

    // Supabase 데이터베이스 업데이트
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    if (investmentId) {
      // 투자 기록 업데이트
      await supabase
        .from('investments')
        .update({
          status: 'refunded',
          refund_id: refund.id,
          refund_amount: refund.amount / 100,
          refund_date: new Date().toISOString(),
        })
        .eq('id', investmentId)

      // 투자자 총 투자액 업데이트
      const { data: investment } = await supabase
        .from('investments')
        .select('investor_id, amount')
        .eq('id', investmentId)
        .single()

      if (investment) {
        await supabase.rpc('decrement_investor_total', {
          investor_id: investment.investor_id,
          amount: refund.amount / 100,
        })
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        refund: {
          id: refund.id,
          amount: refund.amount / 100,
          currency: refund.currency,
          status: refund.status,
          reason: refund.reason,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Refund error:', error)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message || 'Failed to process refund',
        },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

