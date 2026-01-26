import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n/config'
import Contact from '../Contact'

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    </BrowserRouter>
  )
}

describe('Contact Component', () => {
  test('renders contact section', () => {
    renderWithProviders(<Contact />)
    
    // English heading is displayed in default locale
    expect(screen.getByText(/Contact Information/i)).toBeInTheDocument()
  })

  test('displays contact details', () => {
    renderWithProviders(<Contact />)
    
    // Should have email contact details
    expect(screen.getByText(/info@globalbusan.com/i)).toBeInTheDocument()
  })
})

