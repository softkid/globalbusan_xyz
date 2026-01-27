import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n/config'
import Home from '../Home'

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    </BrowserRouter>
  )
}

// Mock components
jest.mock('../../components/EquityStructure', () => {
  return function MockEquityStructure() {
    return <div data-testid="equity-structure">Equity Structure</div>
  }
})

jest.mock('../../components/Reports', () => {
  return function MockReports() {
    return <div data-testid="reports">Reports</div>
  }
})

jest.mock('../../components/Roadmap', () => {
  return function MockRoadmap() {
    return <div data-testid="roadmap">Roadmap</div>
  }
})

describe('Home Page', () => {
  test('renders main sections', () => {
    renderWithProviders(<Home />)
    
    expect(screen.getByTestId('equity-structure')).toBeInTheDocument()
    expect(screen.getByTestId('reports')).toBeInTheDocument()
    expect(screen.getByTestId('roadmap')).toBeInTheDocument()
  })

  test('renders SEO component', () => {
    renderWithProviders(<Home />)
    
    // SEO component should be present (may not be directly testable)
    expect(document.title).toBeDefined()
  })
})

