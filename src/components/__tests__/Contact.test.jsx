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
    
    expect(screen.getByText(/연락처/i) || screen.getByText(/Contact/i)).toBeDefined()
  })

  test('displays contact information', () => {
    renderWithProviders(<Contact />)
    
    // Should have contact details
    const contactSection = screen.getByText(/연락처/i) || screen.getByText(/Contact/i)
    expect(contactSection).toBeInTheDocument()
  })
})

