import { validatePaymentAmount, getMinimumAmount, convertCurrency } from '../payment'

describe('Payment Utilities', () => {
  describe('validatePaymentAmount', () => {
    test('should validate minimum amount for Stripe', () => {
      const result = validatePaymentAmount(0.50, 'USD', 'stripe')
      expect(result.valid).toBe(true)
    })

    test('should reject amount below minimum for Stripe', () => {
      const result = validatePaymentAmount(0.30, 'USD', 'stripe')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Minimum amount')
    })

    test('should validate minimum amount for Coinbase', () => {
      const result = validatePaymentAmount(0.001, 'ETH', 'coinbase')
      expect(result.valid).toBe(true)
    })

    test('should reject amount below minimum for Coinbase', () => {
      const result = validatePaymentAmount(0.0001, 'ETH', 'coinbase')
      expect(result.valid).toBe(false)
    })

    test('should reject zero or negative amounts', () => {
      const result1 = validatePaymentAmount(0, 'USD', 'stripe')
      expect(result1.valid).toBe(false)

      const result2 = validatePaymentAmount(-10, 'USD', 'stripe')
      expect(result2.valid).toBe(false)
    })
  })

  describe('getMinimumAmount', () => {
    test('should return correct minimum for Stripe USD', () => {
      const min = getMinimumAmount('USD', 'stripe')
      expect(min).toBe(0.50)
    })

    test('should return correct minimum for Coinbase ETH', () => {
      const min = getMinimumAmount('ETH', 'coinbase')
      expect(min).toBe(0.001)
    })

    test('should return 0 for unknown currency', () => {
      const min = getMinimumAmount('UNKNOWN', 'stripe')
      expect(min).toBe(0)
    })
  })

  describe('convertCurrency', () => {
    test('should return same amount for same currency', () => {
      const result = convertCurrency(100, 'USD', 'USD')
      expect(result).toBe(100)
    })

    test('should convert USD to KRW', () => {
      const result = convertCurrency(1, 'USD', 'KRW')
      expect(result).toBe(1300)
    })

    test('should convert ETH to USD', () => {
      const result = convertCurrency(1, 'ETH', 'USD')
      expect(result).toBe(2500)
    })

    test('should handle unknown currency gracefully', () => {
      const result = convertCurrency(100, 'UNKNOWN', 'USD')
      expect(result).toBe(100) // Returns original amount
    })
  })
})

