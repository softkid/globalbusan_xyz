import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n/config'
import Hero from '../Hero'

// Mock Supabase service
jest.mock('../../lib/supabase', () => ({
  statsService: {
    getProjectStats: jest.fn().mockResolvedValue({
      total_raised: 1000000,
      total_projects: 5
    }),
    getInvestorStats: jest.fn().mockResolvedValue({
      total_investors: 10
    }),
    getInvestmentStats: jest.fn().mockResolvedValue({
      total_investments: 50
    })
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

describe('Hero Component', () => {
  test('renders hero section', async () => {
    renderWithProviders(<Hero />)
    
    await waitFor(() => {
      expect(screen.getByText(/Global BUSAN/i)).toBeInTheDocument()
    })
  })

  test('displays statistics after loading', async () => {
    renderWithProviders(<Hero />)
    
    await waitFor(() => {
      expect(screen.getByText(/\$1,000,000/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  test('shows loading state initially', () => {
    renderWithProviders(<Hero />)
    
    // Loading state should be present initially
    expect(screen.queryByText(/로딩/i)).toBeDefined()
  })
})

