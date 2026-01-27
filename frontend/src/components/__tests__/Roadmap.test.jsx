import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n/config'
import Roadmap from '../Roadmap'

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    </BrowserRouter>
  )
}

describe('Roadmap Component', () => {
  test('renders roadmap section', () => {
    renderWithProviders(<Roadmap />)
    
    // Component displays Roadmap section
    const roadmapElements = screen.getAllByText(/Roadmap/i)
    expect(roadmapElements.length).toBeGreaterThan(0)
  })

  test('displays roadmap stages', () => {
    renderWithProviders(<Roadmap />)
    
    // Check for stage indicators - displayed as phase titles
    expect(screen.getByText(/Foundation Phase/i)).toBeInTheDocument()
  })

  test('shows progress indicators', () => {
    renderWithProviders(<Roadmap />)
    
    // Roadmap should have progress visualization with percentage indicators
    const progressElements = screen.getAllByText(/Progress/i)
    expect(progressElements.length).toBeGreaterThan(0)
  })
})

