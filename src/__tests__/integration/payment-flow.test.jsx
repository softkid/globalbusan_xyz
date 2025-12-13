/**
 * 결제 플로우 통합 테스트
 */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n/config'
import Donation from '../../pages/Donation'

// Mock dependencies
jest.mock('../../lib/supabase', () => ({
  investmentService: {
    createInvestment: jest.fn().mockResolvedValue({ id: 1 })
  },
  expenseService: {
    getExpenses: jest.fn().mockResolvedValue([])
  },
  statsService: {
    getStats: jest.fn().mockResolvedValue({})
  }
}))

jest.mock('../../lib/blockchain', () => ({
  sendTransaction: jest.fn().mockResolvedValue({
    success: true,
    transactionHash: '0x1234567890abcdef',
    network: 'ethereum'
  }),
  waitForEthereumTransaction: jest.fn().mockResolvedValue({
    success: true,
    receipt: { status: 1 }
  }),
  verifyTransaction: jest.fn().mockResolvedValue({
    verified: true,
    transaction: { hash: '0x1234567890abcdef' }
  })
}))

jest.mock('../../lib/payment', () => ({
  validatePaymentAmount: jest.fn().mockReturnValue({ valid: true })
}))

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    </BrowserRouter>
  )
}

describe('Payment Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock Google OAuth
    window.google = {
      accounts: {
        oauth2: {
          initTokenClient: jest.fn()
        }
      }
    }
  })

  test('renders donation page', () => {
    renderWithProviders(<Donation />)
    expect(screen.getByText(/donate/i)).toBeInTheDocument()
  })

  test('displays payment method selection', async () => {
    renderWithProviders(<Donation />)
    
    // Should show payment method options
    await waitFor(() => {
      expect(screen.getByText(/결제 방법 선택/i)).toBeInTheDocument()
    })
  })
})

