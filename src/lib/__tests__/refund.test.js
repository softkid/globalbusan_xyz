// Mock import.meta.env before importing
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'test-key'
      }
    }
  }
})

import { processStripeRefund, processCoinbaseRefund, canRefund, calculateRefundAmount } from '../refund'

// Mock fetch
global.fetch = jest.fn()

describe('Refund Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('canRefund', () => {
    test('allows refund for recent payment', () => {
      const payment = {
        timestamp: new Date().toISOString(),
        status: 'completed'
      }
      const result = canRefund(payment, 30)
      expect(result.canRefund).toBe(true)
    })

    test('rejects refund for expired payment', () => {
      const payment = {
        timestamp: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed'
      }
      const result = canRefund(payment, 30)
      expect(result.canRefund).toBe(false)
      expect(result.reason).toContain('expired')
    })

    test('rejects refund for already refunded payment', () => {
      const payment = {
        timestamp: new Date().toISOString(),
        status: 'refunded'
      }
      const result = canRefund(payment, 30)
      expect(result.canRefund).toBe(false)
      expect(result.reason).toContain('already refunded')
    })

    test('rejects refund for pending payment', () => {
      const payment = {
        timestamp: new Date().toISOString(),
        status: 'pending'
      }
      const result = canRefund(payment, 30)
      expect(result.canRefund).toBe(false)
      expect(result.reason).toContain('pending')
    })
  })

  describe('calculateRefundAmount', () => {
    test('calculates full refund', () => {
      const amount = calculateRefundAmount(100, 'full')
      expect(amount).toBe(100)
    })

    test('calculates partial refund', () => {
      const amount = calculateRefundAmount(100, 'partial')
      expect(amount).toBe(100) // Returns original for user to specify
    })
  })

  describe('processStripeRefund', () => {
    test('processes refund successfully', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          refund: {
            id: 'refund_123',
            amount: 50,
            status: 'succeeded'
          }
        })
      })

      const result = await processStripeRefund('pi_123', 50)
      expect(result.success).toBe(true)
      expect(result.refund.id).toBe('refund_123')
    })

    test('handles refund error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: { message: 'Refund failed' }
        })
      })

      await expect(processStripeRefund('pi_123')).rejects.toThrow()
    })
  })

  describe('processCoinbaseRefund', () => {
    test('records refund request', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true
        })
      })

      const result = await processCoinbaseRefund('charge_123')
      expect(result.success).toBe(true)
      expect(result.message).toContain('recorded')
    })
  })
})
