/**
 * Sui 전용 결제/검증 유틸리티
 */

const MIN_SUI = 0.0001

// 통화 변환은 Sui 단일 자산 기준으로 그대로 반환
export const convertCurrency = (amount) => amount

// 최소 금액 확인 (Sui 전용)
export const getMinimumAmount = (currency = 'SUI') => {
  return currency?.toUpperCase() === 'SUI' ? MIN_SUI : 0
}

// 결제 금액 유효성 검사 (Sui만 지원)
export const validatePaymentAmount = (amount, currency = 'SUI') => {
  const normalizedCurrency = currency?.toUpperCase() || 'SUI'
  if (normalizedCurrency !== 'SUI') {
    return { valid: false, error: 'Only SUI payments are supported.' }
  }

  if (amount <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' }
  }

  const minAmount = getMinimumAmount(normalizedCurrency)
  if (amount < minAmount) {
    return { valid: false, error: `Minimum amount is ${minAmount} SUI` }
  }

  return { valid: true }
}

