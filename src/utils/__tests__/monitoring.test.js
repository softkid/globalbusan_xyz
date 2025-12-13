/**
 * Monitoring System Tests
 */
import {
  monitorError,
  monitorPerformance,
  monitorUserAction,
  monitorApiCall,
  monitorTransaction,
  monitorPayment,
  getMonitoringData,
  clearMonitoringData,
  retryFailedMonitoring,
  initMonitoring,
  monitoringService
} from '../monitoring'
import { logError } from '../errorHandler'
import { trackEvent } from '../analytics'

// Mock dependencies
jest.mock('../errorHandler')
jest.mock('../webVitals')
jest.mock('../analytics')

// Mock fetch
global.fetch = jest.fn()

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}
global.localStorage = localStorageMock

// Mock window.gtag
global.window.gtag = jest.fn()

describe('Monitoring System', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    clearMonitoringData()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('monitorError', () => {
    it('should log error and store in memory', () => {
      const error = new Error('Test error')
      const context = { type: 'API_ERROR' }
      
      logError.mockReturnValue({
        message: 'Test error',
        type: 'API_ERROR',
        timestamp: new Date().toISOString()
      })

      const result = monitorError(error, context)

      expect(logError).toHaveBeenCalledWith(error, context)
      expect(trackEvent).toHaveBeenCalledWith('error', expect.objectContaining({
        error_type: 'API_ERROR'
      }))
      expect(result).toBeDefined()
    })

    it('should limit stored errors to maxStorage', () => {
      const error = new Error('Test error')
      logError.mockReturnValue({
        message: 'Test error',
        timestamp: Date.now()
      })

      // Add more than maxStorage (100) errors
      for (let i = 0; i < 105; i++) {
        monitorError(error, {})
      }

      const data = getMonitoringData()
      expect(data.errors.length).toBeLessThanOrEqual(100)
    })
  })

  describe('monitorPerformance', () => {
    it('should store performance metrics', () => {
      const metrics = {
        name: 'LCP',
        value: 1200,
        rating: 'good'
      }

      monitorPerformance(metrics)

      const data = getMonitoringData()
      expect(data.performance.length).toBe(1)
      expect(data.performance[0].name).toBe('LCP')
      expect(trackEvent).toHaveBeenCalledWith('performance', metrics)
    })
  })

  describe('monitorUserAction', () => {
    it('should track user actions', () => {
      const action = 'button_click'
      const details = { button_id: 'test-button' }

      monitorUserAction(action, details)

      const data = getMonitoringData()
      expect(data.userActions.length).toBe(1)
      expect(data.userActions[0].action).toBe(action)
      expect(trackEvent).toHaveBeenCalledWith('user_action', expect.objectContaining({
        action,
        ...details
      }))
    })
  })

  describe('monitorApiCall', () => {
    it('should track successful API calls', () => {
      monitorApiCall('/api/test', 'GET', 150, 200)

      const data = getMonitoringData()
      expect(data.apiCalls.length).toBe(1)
      expect(data.apiCalls[0].status).toBe(200)
      expect(trackEvent).toHaveBeenCalledWith('api_call', expect.objectContaining({
        status: 'success'
      }))
    })

    it('should track failed API calls and send to backend', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true })

      monitorApiCall('/api/test', 'GET', 150, 500, new Error('Server error'))

      const data = getMonitoringData()
      expect(data.apiCalls.length).toBe(1)
      expect(data.apiCalls[0].status).toBe(500)
      expect(data.apiCalls[0].error).toBe('Server error')
    })
  })

  describe('monitorTransaction', () => {
    it('should track blockchain transactions', () => {
      const transactionData = {
        network: 'ethereum',
        txHash: '0x123',
        amount: '1.5',
        currency: 'ETH'
      }

      monitorTransaction(transactionData)

      expect(trackEvent).toHaveBeenCalledWith('transaction', transactionData)
    })
  })

  describe('monitorPayment', () => {
    it('should track payment events', () => {
      const paymentData = {
        amount: 100,
        currency: 'USD',
        method: 'stripe',
        status: 'success'
      }

      monitorPayment(paymentData)

      expect(trackEvent).toHaveBeenCalledWith('payment', expect.objectContaining({
        amount: 100,
        currency: 'USD',
        method: 'stripe',
        status: 'success'
      }))
    })
  })

  describe('getMonitoringData', () => {
    it('should return copies of monitoring data', () => {
      monitorError(new Error('test'), {})
      monitorUserAction('test', {})

      const data1 = getMonitoringData()
      const data2 = getMonitoringData()

      expect(data1).not.toBe(data2) // Different objects
      expect(data1.errors.length).toBe(data2.errors.length)
    })
  })

  describe('clearMonitoringData', () => {
    it('should clear all monitoring data', () => {
      monitorError(new Error('test'), {})
      monitorUserAction('test', {})

      clearMonitoringData()

      const data = getMonitoringData()
      expect(data.errors.length).toBe(0)
      expect(data.userActions.length).toBe(0)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('monitoring_queue')
    })
  })

  describe('retryFailedMonitoring', () => {
    it('should retry sending failed monitoring data', async () => {
      const queue = [
        { type: 'error', data: { message: 'test' } },
        { type: 'performance', data: { name: 'LCP' } }
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(queue))
      global.fetch.mockResolvedValue({ ok: true })

      await retryFailedMonitoring()

      expect(global.fetch).toHaveBeenCalledTimes(2)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('monitoring_queue')
    })

    it('should stop retrying on failure', async () => {
      const queue = [
        { type: 'error', data: { message: 'test' } },
        { type: 'performance', data: { name: 'LCP' } }
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(queue))
      global.fetch.mockRejectedValueOnce(new Error('Network error'))

      await retryFailedMonitoring()

      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(localStorageMock.removeItem).not.toHaveBeenCalled()
    })
  })

  describe('monitoringService', () => {
    it('should export all monitoring functions', () => {
      expect(monitoringService.monitorError).toBe(monitorError)
      expect(monitoringService.monitorPerformance).toBe(monitorPerformance)
      expect(monitoringService.monitorUserAction).toBe(monitorUserAction)
      expect(monitoringService.monitorApiCall).toBe(monitorApiCall)
      expect(monitoringService.monitorTransaction).toBe(monitorTransaction)
      expect(monitoringService.monitorPayment).toBe(monitorPayment)
      expect(monitoringService.getMonitoringData).toBe(getMonitoringData)
      expect(monitoringService.clearMonitoringData).toBe(clearMonitoringData)
      expect(monitoringService.retryFailedMonitoring).toBe(retryFailedMonitoring)
      expect(monitoringService.initMonitoring).toBe(initMonitoring)
    })
  })
})

