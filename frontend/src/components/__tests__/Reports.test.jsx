import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n/config'
import Reports from '../Reports'

// Mock PDF generator
jest.mock('../../lib/pdfGenerator', () => ({
  generateReportPDF: jest.fn().mockResolvedValue(undefined)
}))

// Mock navigator.share
global.navigator.share = jest.fn().mockResolvedValue(undefined)

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    </BrowserRouter>
  )
}

describe('Reports Component', () => {
  test('renders reports section', () => {
    renderWithProviders(<Reports />)
    
    expect(screen.getByText(/보고서/i)).toBeInTheDocument()
  })

  test('displays quarterly reports', () => {
    renderWithProviders(<Reports />)
    
    expect(screen.getByText(/Q1/i)).toBeInTheDocument()
    expect(screen.getByText(/Q2/i)).toBeInTheDocument()
    expect(screen.getByText(/Q3/i)).toBeInTheDocument()
    expect(screen.getByText(/Q4/i)).toBeInTheDocument()
  })

  test('handles quarter selection', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Reports />)
    
    const q1Button = screen.getByText(/Q1/i)
    await user.click(q1Button)
    
    await waitFor(() => {
      expect(screen.getByText(/2024 Q1/i)).toBeInTheDocument()
    })
  })

  test('handles PDF download', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Reports />)
    
    await waitFor(() => {
      const downloadButton = screen.getByText(/PDF 다운로드/i)
      expect(downloadButton).toBeInTheDocument()
    })
    
    // PDF download functionality is tested in pdfGenerator.test.js
  })
})

