/**
 * 환불 처리 유틸리티
 */

/**
 * Stripe 환불 처리
 */
export const processStripeRefund = async (paymentIntentId, amount = null, reason = 'requested_by_customer', investmentId = null) => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const response = await fetch(`${supabaseUrl}/functions/v1/process-refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        paymentIntentId,
        amount,
        reason,
        investmentId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'Refund failed')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Stripe refund error:', error)
    throw error
  }
}

/**
 * Coinbase Commerce 환불 처리
 * Note: Coinbase Commerce는 자동 환불을 지원하지 않으므로 수동 처리 필요
 */
export const processCoinbaseRefund = async (chargeCode, reason = 'requested_by_customer') => {
  try {
    // Coinbase Commerce는 환불 API를 제공하지 않으므로
    // 수동으로 처리하거나 웹훅을 통해 처리해야 합니다
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    
    // 데이터베이스에 환불 요청 기록
    const response = await fetch(`${supabaseUrl}/functions/v1/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        transactionHash: chargeCode,
        status: 'refund_requested',
        refundReason: reason,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to record refund request')
    }

    return {
      success: true,
      message: 'Refund request recorded. Please contact support for manual processing.',
      chargeCode,
    }
  } catch (error) {
    console.error('Coinbase refund error:', error)
    throw error
  }
}

/**
 * 환불 가능 여부 확인
 */
export const canRefund = (payment, maxRefundDays = 30) => {
  if (!payment || !payment.timestamp) {
    return { canRefund: false, reason: 'Invalid payment data' }
  }

  const paymentDate = new Date(payment.timestamp)
  const now = new Date()
  const daysSincePayment = (now - paymentDate) / (1000 * 60 * 60 * 24)

  if (daysSincePayment > maxRefundDays) {
    return {
      canRefund: false,
      reason: `Refund period expired. Maximum ${maxRefundDays} days allowed.`,
    }
  }

  if (payment.status === 'refunded') {
    return {
      canRefund: false,
      reason: 'Payment already refunded',
    }
  }

  if (payment.status === 'pending') {
    return {
      canRefund: false,
      reason: 'Payment is still pending',
    }
  }

  return { canRefund: true }
}

/**
 * 환불 금액 계산 (수수료 제외)
 */
export const calculateRefundAmount = (originalAmount, refundType = 'full') => {
  if (refundType === 'full') {
    // 전체 환불 (Stripe는 수수료 환불 안 함)
    return originalAmount
  } else if (refundType === 'partial') {
    // 부분 환불은 사용자가 지정
    return originalAmount
  }
  return 0
}

