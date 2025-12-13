import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n/config'
import Projects from '../Projects'

// Mock Supabase service
jest.mock('../../lib/supabase', () => ({
  projectService: {
    getProjects: jest.fn().mockResolvedValue([
      {
        id: 1,
        title: 'Test Project',
        description: 'Test Description',
        category: 'infrastructure',
        status: 'development',
        budget: 100000,
        raised: 50000
      }
    ])
  }
}))

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    </BrowserRouter>
  )
}

describe('Projects Page', () => {
  test('renders projects list', async () => {
    renderWithProviders(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText(/Test Project/i)).toBeInTheDocument()
    })
  })

  test('displays project information', async () => {
    renderWithProviders(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText(/Test Description/i)).toBeInTheDocument()
    })
  })
})

