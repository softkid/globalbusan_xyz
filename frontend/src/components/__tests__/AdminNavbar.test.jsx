/**
 * AdminNavbar Component Tests
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import AdminNavbar from '../AdminNavbar'

const renderWithProviders = (component, initialPath = '/admin') => {
  window.history.pushState({}, 'Test page', initialPath)
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('AdminNavbar', () => {
  it('should render admin navbar with logo', () => {
    renderWithProviders(<AdminNavbar />)
    
    expect(screen.getByText(/Admin Panel/i)).toBeInTheDocument()
  })

  it('should render navigation items', () => {
    renderWithProviders(<AdminNavbar />)
    
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
    expect(screen.getByText(/Projects/i)).toBeInTheDocument()
    expect(screen.getByText(/Statistics/i)).toBeInTheDocument()
  })

  it('should highlight active route', () => {
    renderWithProviders(<AdminNavbar />, '/admin')
    
    const dashboardLink = screen.getByText(/Dashboard/i).closest('a')
    expect(dashboardLink).toHaveClass('bg-orange-600')
  })

  it('should toggle mobile menu', () => {
    renderWithProviders(<AdminNavbar />)
    
    const menuButton = screen.getByLabelText(/Toggle mobile menu/i)
    fireEvent.click(menuButton)
    
    // Mobile menu should be visible
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
  })

  it('should close mobile menu when link is clicked', () => {
    renderWithProviders(<AdminNavbar />)
    
    const menuButton = screen.getByLabelText(/Toggle mobile menu/i)
    fireEvent.click(menuButton)
    
    const projectsLink = screen.getByText(/Projects/i)
    fireEvent.click(projectsLink)
    
    // Menu should close after navigation
    expect(menuButton).toBeInTheDocument()
  })
})

