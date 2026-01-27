import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n/config'
import EquityStructure from '../EquityStructure'

// Mock Supabase service
jest.mock('../../lib/supabase', () => ({
  investmentService: {
    getInvestments: jest.fn().mockResolvedValue([
      {
        id: 1,
        investor_email: 'test@example.com',
        amount: 1000,
        crypto_type: 'ETH',
        status: 'confirmed',
        investment_date: new Date().toISOString()
      }
    ])
  },
  statsService: {
    getStats: jest.fn().mockResolvedValue({
      total_investments: 100000,
      total_investors: 10
    })
  }
}))

// Mock PDF generator
jest.mock('../../lib/pdfGenerator', () => ({
  generateEquityStructurePDF: jest.fn().mockResolvedValue(undefined)
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

describe('EquityStructure Component', () => {
  test('renders equity structure section', async () => {
    renderWithProviders(<EquityStructure />)
    
    await waitFor(() => {
      expect(screen.getByText(/지분 구조/i)).toBeInTheDocument()
    })
  })

  test('displays total investments', async () => {
    renderWithProviders(<EquityStructure />)
    
    await waitFor(() => {
      expect(screen.getByText(/\$100,000/i)).toBeInTheDocument()
    })
  })

  test('handles PDF download', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EquityStructure />)
    
    await waitFor(() => {
      const downloadButton = screen.getByText(/PDF 다운로드/i)
      expect(downloadButton).toBeInTheDocument()
    })
    
    // PDF download functionality is tested in pdfGenerator.test.js
  })
})

