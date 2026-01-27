import { render, screen } from '@testing-library/react'
import Footer from '../Footer'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n/config'

const renderWithProviders = (component) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {component}
    </I18nextProvider>
  )
}

describe('Footer Component', () => {
  test('renders copyright information', () => {
    renderWithProviders(<Footer />)
    
    expect(screen.getAllByText(/Global BUSAN/i)[0]).toBeInTheDocument()
    expect(screen.getByText(/Beta Version/i)).toBeInTheDocument()
  })

  test('renders footer links', () => {
    renderWithProviders(<Footer />)
    
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })
})

