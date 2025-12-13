/**
 * BottomNav Component Tests
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n/config'
import BottomNav from '../BottomNav'

const renderWithProviders = (component, initialPath = '/') => {
  window.history.pushState({}, 'Test page', initialPath)
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    </BrowserRouter>
  )
}

describe('BottomNav', () => {
  it('should render navigation items', () => {
    renderWithProviders(<BottomNav />)
    
    expect(screen.getByText(/홈|Home/i)).toBeInTheDocument()
    expect(screen.getByText(/프로젝트|Projects/i)).toBeInTheDocument()
  })

  it('should highlight active route', () => {
    renderWithProviders(<BottomNav />, '/')
    
    const homeLink = screen.getByText(/홈|Home/i).closest('a')
    expect(homeLink).toHaveClass('text-blue-600')
  })

  it('should render all navigation items', () => {
    renderWithProviders(<BottomNav />)
    
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThanOrEqual(4)
  })

  it('should be hidden on desktop (md:hidden class)', () => {
    const { container } = renderWithProviders(<BottomNav />)
    const nav = container.querySelector('nav')
    
    expect(nav).toHaveClass('md:hidden')
  })
})

