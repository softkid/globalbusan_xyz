import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n/config'
import Donors from '../Donors'

// Mock Supabase service
jest.mock('../../lib/supabase', () => ({
  investmentService: {
    getInvestments: jest.fn().mockResolvedValue([
      {
        id: 1,
        investor_email: 'donor1@example.com',
        amount: 5000,
        crypto_type: 'ETH',
        status: 'confirmed'
      },
      {
        id: 2,
        investor_email: 'donor2@example.com',
        amount: 3000,
        crypto_type: 'BTC',
        status: 'confirmed'
      }
    ])
  }
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

describe('Donors Component', () => {
  test('renders donors section', async () => {
    renderWithProviders(<Donors />)
    
    await waitFor(() => {
      expect(screen.getByText(/기부자/i) || screen.getByText(/Donors/i)).toBeDefined()
    })
  })

  test('displays donor list', async () => {
    renderWithProviders(<Donors />)
    
    await waitFor(() => {
      // Should display donor information
      expect(screen.getByText(/\$5,000/i) || screen.getByText(/ETH/i)).toBeDefined()
    })
  })
})

