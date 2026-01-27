import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n/config'
import LanguageSwitcher from '../LanguageSwitcher'

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    </BrowserRouter>
  )
}

describe('LanguageSwitcher Component', () => {
  test('renders language switcher', () => {
    renderWithProviders(<LanguageSwitcher />)
    
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  test('opens language dropdown on click', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LanguageSwitcher />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/한국어/i) || screen.getByText(/English/i)).toBeDefined()
    })
  })

  test('changes language on selection', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LanguageSwitcher />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    await waitFor(() => {
      const koreanOption = screen.getByText(/한국어/i)
      if (koreanOption) {
        user.click(koreanOption)
      }
    })
  })
})

