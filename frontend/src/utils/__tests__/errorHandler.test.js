import { setupGlobalErrorHandling, trackError, handleApiError, handleBlockchainError, handlePaymentError } from '../errorHandler';

// Mock analytics
const mockSendToAnalytics = jest.fn();
jest.mock('../analytics', () => ({
  sendToAnalytics: (...args) => mockSendToAnalytics(...args),
}));

describe('errorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
    console.groupCollapsed = jest.fn();
    console.groupEnd = jest.fn();
  });

  describe('setupGlobalErrorHandling', () => {
    it('should set up global error handlers', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      setupGlobalErrorHandling();
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
      
      addEventListenerSpy.mockRestore();
    });

    it('should handle uncaught errors', () => {
      setupGlobalErrorHandling();
      
      const error = new Error('Test error');
      const errorEvent = new ErrorEvent('error', { error, message: 'Test error', filename: 'test.js', lineno: 1, colno: 1 });
      
      window.dispatchEvent(errorEvent);
      
      expect(console.error).toHaveBeenCalled();
      expect(mockSendToAnalytics).toHaveBeenCalled();
    });

    it('should handle unhandled promise rejections', () => {
      setupGlobalErrorHandling();
      
      const rejectionEvent = new PromiseRejectionEvent('unhandledrejection', {
        reason: new Error('Promise rejection'),
      });
      
      window.dispatchEvent(rejectionEvent);
      
      expect(console.error).toHaveBeenCalled();
      expect(mockSendToAnalytics).toHaveBeenCalled();
    });
  });

  describe('trackError', () => {
    it('should track error with context', () => {
      const error = new Error('Test error');
      const context = { component: 'TestComponent', action: 'test' };
      
      trackError(error, context);
      
      expect(console.groupCollapsed).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
      expect(mockSendToAnalytics).toHaveBeenCalledWith('exception', expect.objectContaining({
        description: 'Test error',
        fatal: true,
        ...context,
      }));
    });

    it('should handle errors without stack trace', () => {
      const error = { message: 'Error without stack' };
      
      trackError(error);
      
      expect(mockSendToAnalytics).toHaveBeenCalled();
    });

    it('should handle unknown errors', () => {
      trackError(null);
      
      expect(mockSendToAnalytics).toHaveBeenCalledWith('exception', expect.objectContaining({
        description: 'Unknown error',
      }));
    });
  });

  describe('handleApiError', () => {
    it('should handle API errors with JSON response', async () => {
      const response = {
        status: 404,
        statusText: 'Not Found',
        url: 'https://api.example.com/endpoint',
        text: jest.fn().mockResolvedValue(JSON.stringify({ message: 'Resource not found' })),
      };

      await expect(handleApiError(response)).rejects.toThrow('Resource not found');
      expect(mockSendToAnalytics).toHaveBeenCalled();
    });

    it('should handle API errors with text response', async () => {
      const response = {
        status: 500,
        statusText: 'Internal Server Error',
        url: 'https://api.example.com/endpoint',
        text: jest.fn().mockResolvedValue('Server error'),
      };

      await expect(handleApiError(response)).rejects.toThrow('Server error');
      expect(mockSendToAnalytics).toHaveBeenCalled();
    });

    it('should handle API errors with invalid JSON', async () => {
      const response = {
        status: 400,
        statusText: 'Bad Request',
        url: 'https://api.example.com/endpoint',
        text: jest.fn().mockResolvedValue('Invalid JSON response'),
      };

      await expect(handleApiError(response)).rejects.toThrow('Invalid JSON response');
    });
  });

  describe('handleBlockchainError', () => {
    it('should handle blockchain errors', () => {
      const error = new Error('Transaction failed');
      const transactionType = 'send_eth';

      expect(() => {
        handleBlockchainError(error, transactionType);
      }).toThrow('Blockchain Error (send_eth): Transaction failed');

      expect(mockSendToAnalytics).toHaveBeenCalledWith('exception', expect.objectContaining({
        type: 'blockchain_error',
        transactionType: 'send_eth',
      }));
    });
  });

  describe('handlePaymentError', () => {
    it('should handle payment gateway errors', () => {
      const error = new Error('Payment declined');
      const gateway = 'stripe';

      expect(() => {
        handlePaymentError(error, gateway);
      }).toThrow('Payment Error (stripe): Payment declined');

      expect(mockSendToAnalytics).toHaveBeenCalledWith('exception', expect.objectContaining({
        type: 'payment_error',
        gateway: 'stripe',
      }));
    });
  });
});

