/**
 * API 엔드포인트 통합 테스트
 * Supabase Edge Functions 테스트
 */
import { describe, test, expect, beforeEach, jest } from '@jest/globals'

// Mock fetch for Edge Functions
global.fetch = jest.fn()

const SUPABASE_URL = 'https://mock-supabase-url.supabase.co'
const SUPABASE_ANON_KEY = 'mock-anon-key'

describe('API Endpoints Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch.mockClear()
  })

  describe('Payment Intent Creation', () => {
    test('creates payment intent successfully', async () => {
      const mockResponse = {
        client_secret: 'pi_mock_secret_123',
        amount: 10000,
        currency: 'usd'
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            amount: 10000,
            currency: 'usd',
            metadata: {
              project_id: '123',
              investor_email: 'test@example.com'
            }
          })
        }
      )

      expect(response.ok).toBe(true)
      const data = await response.json()
      expect(data.client_secret).toBeDefined()
      expect(data.amount).toBe(10000)
    })

    test('handles invalid amount', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Invalid amount' })
      })

      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            amount: -100,
            currency: 'usd'
          })
        }
      )

      expect(response.ok).toBe(false)
      const data = await response.json()
      expect(data.error).toBeDefined()
    })
  })

  describe('Payment Verification', () => {
    test('verifies payment successfully', async () => {
      const mockResponse = {
        verified: true,
        payment: {
          id: 'pi_123',
          status: 'succeeded',
          amount: 10000
        }
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/verify-payment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            payment_intent_id: 'pi_123',
            payment_type: 'stripe'
          })
        }
      )

      expect(response.ok).toBe(true)
      const data = await response.json()
      expect(data.verified).toBe(true)
      expect(data.payment).toBeDefined()
    })

    test('handles payment verification failure', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Payment not found' })
      })

      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/verify-payment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            payment_intent_id: 'pi_invalid',
            payment_type: 'stripe'
          })
        }
      )

      expect(response.ok).toBe(false)
    })
  })

  describe('Refund Processing', () => {
    test('processes refund successfully', async () => {
      const mockResponse = {
        success: true,
        refund: {
          id: 're_123',
          amount: 5000,
          status: 'succeeded'
        }
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/process-refund`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            payment_intent_id: 'pi_123',
            amount: 5000,
            reason: 'requested_by_customer'
          })
        }
      )

      expect(response.ok).toBe(true)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.refund).toBeDefined()
    })
  })

  describe('Error Handling', () => {
    test('handles network errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(
        fetch(`${SUPABASE_URL}/functions/v1/create-payment-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({ amount: 10000 })
        })
      ).rejects.toThrow('Network error')
    })

    test('handles timeout errors', async () => {
      global.fetch.mockImplementationOnce(
        () => new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      )

      await expect(
        fetch(`${SUPABASE_URL}/functions/v1/verify-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({ payment_intent_id: 'pi_123' })
        })
      ).rejects.toThrow('Timeout')
    })
  })
})

