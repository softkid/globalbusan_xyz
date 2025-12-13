/**
 * MobileHeader Component Tests
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n/config'
import MobileHeader from '../MobileHeader'

// Mock i18n
const mockChangeLanguage = jest.fn()
i18n.changeLanguage = mockChangeLanguage
i18n.language = 'ko'

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    </BrowserRouter>
  )
}

describe('MobileHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('should render header with logo', () => {
    renderWithProviders(<MobileHeader />)
    
    expect(screen.getByText(/Global BUSAN/i)).toBeInTheDocument()
    expect(screen.getByText(/BETA/i)).toBeInTheDocument()
  })

  it('should toggle settings dropdown', () => {
    renderWithProviders(<MobileHeader />)
    
    const settingsButton = screen.getByLabelText(/Settings|설정/i)
    fireEvent.click(settingsButton)
    
    expect(screen.getByText(/언어 선택|Select Language/i)).toBeInTheDocument()
  })

  it('should open language modal when language button is clicked', () => {
    renderWithProviders(<MobileHeader />)
    
    const settingsButton = screen.getByLabelText(/Settings|설정/i)
    fireEvent.click(settingsButton)
    
    const languageButton = screen.getByText(/언어 선택|Select Language/i)
    fireEvent.click(languageButton)
    
    expect(screen.getByText(/언어 선택/i)).toBeInTheDocument()
  })

  it('should change language when language is selected', () => {
    renderWithProviders(<MobileHeader />)
    
    const settingsButton = screen.getByLabelText(/Settings|설정/i)
    fireEvent.click(settingsButton)
    
    const languageButton = screen.getByText(/언어 선택|Select Language/i)
    fireEvent.click(languageButton)
    
    const englishOption = screen.getByText(/English/i)
    fireEvent.click(englishOption)
    
    expect(mockChangeLanguage).toHaveBeenCalledWith('en')
  })

  it('should close language modal when close button is clicked', () => {
    renderWithProviders(<MobileHeader />)
    
    const settingsButton = screen.getByLabelText(/Settings|설정/i)
    fireEvent.click(settingsButton)
    
    const languageButton = screen.getByText(/언어 선택|Select Language/i)
    fireEvent.click(languageButton)
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    
    expect(screen.queryByText(/언어 선택/i)).not.toBeInTheDocument()
  })

  it('should be hidden on desktop (md:hidden class)', () => {
    const { container } = renderWithProviders(<MobileHeader />)
    const header = container.querySelector('header')
    
    expect(header).toHaveClass('md:hidden')
  })
})

