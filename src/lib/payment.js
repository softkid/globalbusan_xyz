/**
 * 결제 서비스 유틸리티
 * Stripe 및 Coinbase Commerce 통합
 */

// Stripe 결제 처리
export const processStripePayment = async (amount, currency = 'usd', metadata = {}) => {
  try {
    // 실제 구현에서는 백엔드 API를 호출해야 합니다
    // 여기서는 클라이언트 측 구조만 제공합니다
    
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // 센트 단위로 변환
        currency: currency.toLowerCase(),
        metadata: {
          ...metadata,
          platform: 'global-busan',
          timestamp: new Date().toISOString()
        }
      })
    })

    if (!response.ok) {
      throw new Error('Payment intent creation failed')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Stripe payment error:', error)
    throw error
  }
}

// Coinbase Commerce 결제 처리
export const processCoinbasePayment = async (amount, currency = 'ETH', metadata = {}) => {
  try {
    // Coinbase Commerce API 호출
    const response = await fetch('/api/create-coinbase-charge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Global BUSAN Donation',
        description: 'Donation to Global BUSAN project',
        local_price: {
          amount: amount.toString(),
          currency: currency.toUpperCase()
        },
        pricing_type: 'fixed_price',
        metadata: {
          ...metadata,
          platform: 'global-busan',
          timestamp: new Date().toISOString()
        }
      })
    })

    if (!response.ok) {
      throw new Error('Coinbase charge creation failed')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Coinbase payment error:', error)
    throw error
  }
}

// 결제 상태 확인
export const checkPaymentStatus = async (paymentId, paymentType = 'stripe') => {
  try {
    const endpoint = paymentType === 'stripe' 
      ? `/api/check-payment-intent/${paymentId}`
      : `/api/check-coinbase-charge/${paymentId}`

    const response = await fetch(endpoint)
    
    if (!response.ok) {
      throw new Error('Payment status check failed')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Payment status check error:', error)
    throw error
  }
}

// 통화 변환 (간단한 버전, 실제로는 환율 API 사용)
export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  // 간단한 환율 (실제로는 API에서 가져와야 함)
  const exchangeRates = {
    USD: { KRW: 1300, ETH: 0.0004, BTC: 0.00002, SOL: 0.01 },
    KRW: { USD: 0.00077, ETH: 0.0000003, BTC: 0.000000015, SOL: 0.0000077 },
    ETH: { USD: 2500, KRW: 3250000, BTC: 0.05, SOL: 25 },
    BTC: { USD: 50000, KRW: 65000000, ETH: 20, SOL: 500 },
    SOL: { USD: 100, KRW: 130000, ETH: 0.04, BTC: 0.002 }
  }

  if (fromCurrency === toCurrency) {
    return amount
  }

  const rate = exchangeRates[fromCurrency]?.[toCurrency]
  if (!rate) {
    console.warn(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`)
    return amount
  }

  return amount * rate
}

// 결제 방법별 최소 금액 확인
export const getMinimumAmount = (currency, paymentMethod) => {
  const minimums = {
    stripe: {
      USD: 0.50,
      KRW: 500,
      EUR: 0.50,
      GBP: 0.30
    },
    coinbase: {
      ETH: 0.001,
      BTC: 0.00001,
      SOL: 0.01,
      USDC: 1
    }
  }

  return minimums[paymentMethod]?.[currency.toUpperCase()] || 0
}

// 결제 금액 유효성 검사
export const validatePaymentAmount = (amount, currency, paymentMethod) => {
  const minAmount = getMinimumAmount(currency, paymentMethod)
  
  if (amount < minAmount) {
    return {
      valid: false,
      error: `Minimum amount is ${minAmount} ${currency}`
    }
  }

  if (amount <= 0) {
    return {
      valid: false,
      error: 'Amount must be greater than 0'
    }
  }

  return {
    valid: true
  }
}

