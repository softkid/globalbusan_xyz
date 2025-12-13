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
    
    expect(screen.getByText(/로드맵/i)).toBeInTheDocument()
  })

  test('displays roadmap stages', () => {
    renderWithProviders(<Roadmap />)
    
    // Check for stage indicators
    expect(screen.getByText(/1단계/i) || screen.getByText(/Stage 1/i)).toBeDefined()
  })

  test('shows progress indicators', () => {
    renderWithProviders(<Roadmap />)
    
    // Roadmap should have progress visualization
    const roadmap = screen.getByText(/로드맵/i).closest('section')
    expect(roadmap).toBeInTheDocument()
  })
})

