import { validatePaymentAmount, getMinimumAmount, convertCurrency } from '../payment'

describe('Payment Utilities (Sui only)', () => {
  describe('validatePaymentAmount', () => {
    test('accepts valid SUI amounts', () => {
      const result = validatePaymentAmount(0.1, 'SUI')
      expect(result.valid).toBe(true)
    })

    test('rejects values below minimum', () => {
      const result = validatePaymentAmount(0.00001, 'SUI')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Minimum amount')
    })

    test('rejects zero or negative amounts', () => {
      expect(validatePaymentAmount(0, 'SUI').valid).toBe(false)
      expect(validatePaymentAmount(-10, 'SUI').valid).toBe(false)
    })

    test('rejects non-SUI currencies', () => {
      const result = validatePaymentAmount(1, 'USD')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Only SUI')
    })
  })

  describe('getMinimumAmount', () => {
    test('returns Sui minimum', () => {
      expect(getMinimumAmount('SUI')).toBe(0.0001)
    })

    test('returns 0 for unsupported currency', () => {
      expect(getMinimumAmount('USD')).toBe(0)
    })
  })

  describe('convertCurrency', () => {
    test('returns same amount (identity)', () => {
      expect(convertCurrency(123)).toBe(123)
    })
  })
})

