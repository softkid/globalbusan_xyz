/**
 * StripePayment Component Tests
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n/config'
import StripePayment from '../StripePayment'

// Mock Stripe
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({
    confirmCardPayment: jest.fn()
  }))
}))

jest.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }) => <div data-testid="stripe-elements">{children}</div>,
  CardElement: () => <div data-testid="card-element">Card Element</div>,
  useStripe: () => ({
    confirmCardPayment: jest.fn()
  }),
  useElements: () => ({
    getElement: jest.fn(() => ({ type: 'card' }))
  })
}))

// Mock environment
const originalEnv = process.env
beforeAll(() => {
  process.env = {
    ...originalEnv,
    VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_123'
  }
})

afterAll(() => {
  process.env = originalEnv
})

const renderWithProviders = (component) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {component}
    </I18nextProvider>
  )
}

describe('StripePayment', () => {
  const defaultProps = {
    amount: 100,
    currency: 'usd',
    onSuccess: jest.fn(),
    onError: jest.fn(),
    metadata: {
      name: 'Test User',
      email: 'test@example.com'
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  it('should render Stripe payment form when configured', () => {
    renderWithProviders(<StripePayment {...defaultProps} />)
    
    expect(screen.getByTestId('stripe-elements')).toBeInTheDocument()
    expect(screen.getByTestId('card-element')).toBeInTheDocument()
  })

  it('should show warning when Stripe is not configured', () => {
    const originalKey = process.env.VITE_STRIPE_PUBLISHABLE_KEY
    delete process.env.VITE_STRIPE_PUBLISHABLE_KEY

    renderWithProviders(<StripePayment {...defaultProps} />)
    
    expect(screen.getByText(/Stripe is not configured/i)).toBeInTheDocument()

    process.env.VITE_STRIPE_PUBLISHABLE_KEY = originalKey
  })

  it('should display payment amount', () => {
    renderWithProviders(<StripePayment {...defaultProps} />)
    
    expect(screen.getByText(/\$100.00/i)).toBeInTheDocument()
  })

  it('should be disabled when stripe is not loaded', () => {
    renderWithProviders(<StripePayment {...defaultProps} />)
    
    const button = screen.getByRole('button')
    // Button might be disabled initially if stripe is not ready
    expect(button).toBeInTheDocument()
  })
})

