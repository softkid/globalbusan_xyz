import { processSuiRefund, canRefund, calculateRefundAmount } from '../refund'

describe('Refund Utilities (Sui only)', () => {
  describe('canRefund', () => {
    test('always returns false for on-chain transfers', () => {
      const result = canRefund()
      expect(result.canRefund).toBe(false)
      expect(result.reason).toContain('irreversible')
    })
  })

  describe('calculateRefundAmount', () => {
    test('returns original amount for reference', () => {
      expect(calculateRefundAmount(100)).toBe(100)
    })
  })

  describe('processSuiRefund', () => {
    test('throws because refunds are not supported', async () => {
      await expect(processSuiRefund()).rejects.toThrow('irreversible')
    })
  })
})
