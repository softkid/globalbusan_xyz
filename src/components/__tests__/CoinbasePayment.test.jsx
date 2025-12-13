/**
 * CoinbasePayment Component Tests
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n/config'
import CoinbasePayment from '../CoinbasePayment'
import { processCoinbasePayment, checkPaymentStatus } from '../../lib/payment'

// Mock payment utilities
jest.mock('../../lib/payment', () => ({
  processCoinbasePayment: jest.fn(),
  checkPaymentStatus: jest.fn()
}))

// Mock useTranslation
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (key) => key
  })
}))

const renderWithProviders = (component) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {component}
    </I18nextProvider>
  )
}

describe('CoinbasePayment', () => {
  const defaultProps = {
    amount: 100,
    currency: 'USD',
    onSuccess: jest.fn(),
    onError: jest.fn(),
    metadata: {}
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should render payment component', () => {
    renderWithProviders(<CoinbasePayment {...defaultProps} />)
    
    expect(screen.getByText(/cryptoPayment|Cryptocurrency Payment/i)).toBeInTheDocument()
    expect(screen.getByText(/Bitcoin|Ethereum|Solana/i)).toBeInTheDocument()
  })

  it('should create charge on button click', async () => {
    const mockCharge = {
      charge: {
        code: 'test-code',
        hosted_url: 'https://commerce.coinbase.com/charges/test'
      },
      hosted_url: 'https://commerce.coinbase.com/charges/test'
    }

    processCoinbasePayment.mockResolvedValue(mockCharge)

    renderWithProviders(<CoinbasePayment {...defaultProps} />)

    const button = screen.getByRole('button', { name: /pay|결제/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(processCoinbasePayment).toHaveBeenCalledWith(
        100,
        'USD',
        defaultProps.metadata
      )
    })
  })

  it('should display error on payment failure', async () => {
    const error = new Error('Payment failed')
    processCoinbasePayment.mockRejectedValue(error)

    renderWithProviders(<CoinbasePayment {...defaultProps} />)

    const button = screen.getByRole('button', { name: /pay|결제/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(defaultProps.onError).toHaveBeenCalledWith(error)
    })
  })

  it('should redirect to hosted URL when charge is created', async () => {
    const mockCharge = {
      charge: {
        code: 'test-code',
        hosted_url: 'https://commerce.coinbase.com/charges/test'
      },
      hosted_url: 'https://commerce.coinbase.com/charges/test'
    }

    processCoinbasePayment.mockResolvedValue(mockCharge)
    delete window.location
    window.location = { href: '' }

    renderWithProviders(<CoinbasePayment {...defaultProps} />)

    const button = screen.getByRole('button', { name: /pay|결제/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(window.location.href).toBe(mockCharge.hosted_url)
    })
  })

  it('should check payment status periodically', async () => {
    const mockCharge = {
      charge: {
        code: 'test-code'
      }
    }

    processCoinbasePayment.mockResolvedValue(mockCharge)
    checkPaymentStatus
      .mockResolvedValueOnce({ status: 'PENDING' })
      .mockResolvedValueOnce({ status: 'COMPLETED', charge: mockCharge.charge })

    renderWithProviders(<CoinbasePayment {...defaultProps} />)

    const button = screen.getByRole('button', { name: /pay|결제/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(processCoinbasePayment).toHaveBeenCalled()
    })

    // Fast-forward timers
    jest.advanceTimersByTime(5000)

    await waitFor(() => {
      expect(checkPaymentStatus).toHaveBeenCalled()
    })

    // Fast-forward again to trigger second check
    jest.advanceTimersByTime(5000)

    await waitFor(() => {
      expect(defaultProps.onSuccess).toHaveBeenCalled()
    })
  })

  it('should handle payment cancellation', async () => {
    const mockCharge = {
      charge: {
        code: 'test-code'
      }
    }

    processCoinbasePayment.mockResolvedValue(mockCharge)
    checkPaymentStatus.mockResolvedValue({ status: 'CANCELED' })

    renderWithProviders(<CoinbasePayment {...defaultProps} />)

    const button = screen.getByRole('button', { name: /pay|결제/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(processCoinbasePayment).toHaveBeenCalled()
    })

    jest.advanceTimersByTime(5000)

    await waitFor(() => {
      expect(defaultProps.onError).toHaveBeenCalled()
    })
  })

  it('should be disabled while processing', () => {
    renderWithProviders(<CoinbasePayment {...defaultProps} />)

    const button = screen.getByRole('button', { name: /pay|결제/i })
    expect(button).not.toBeDisabled()

    // Simulate loading state by clicking
    fireEvent.click(button)
    
    // Button should be disabled during processing
    expect(button).toBeDisabled()
  })
})

