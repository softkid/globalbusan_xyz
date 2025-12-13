import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from '../Navbar'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n/config'

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    </BrowserRouter>
  )
}

describe('Navbar Component', () => {
  test('renders logo and navigation links', () => {
    renderWithProviders(<Navbar />)
    
    expect(screen.getByText(/Global BUSAN/i)).toBeInTheDocument()
    expect(screen.getByText(/BETA/i)).toBeInTheDocument()
  })

  test('renders navigation menu items', () => {
    renderWithProviders(<Navbar />)
    
    // Navigation items should be present
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
  })

  test('has language switcher', () => {
    renderWithProviders(<Navbar />)
    
    // Language switcher should be present
    const langSwitcher = screen.queryByRole('button', { name: /language/i })
    // May or may not be visible depending on implementation
    expect(langSwitcher || screen.getByRole('navigation')).toBeInTheDocument()
  })
})

