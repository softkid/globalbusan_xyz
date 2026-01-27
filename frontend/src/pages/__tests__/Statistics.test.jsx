/**
 * Statistics Page Tests
 */
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n/config'
import Statistics from '../Statistics'
import { statsService } from '../../lib/supabase'

// Mock supabase
jest.mock('../../lib/supabase', () => ({
  statsService: {
    getProjectStats: jest.fn(),
    getInvestorStats: jest.fn(),
    getInvestmentStats: jest.fn(),
    getMonthlyInvestmentStats: jest.fn(),
    getMonthlyExpenseStats: jest.fn()
  }
}))

// Mock useTranslation
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (key) => key
  })
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

describe('Statistics Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    statsService.getProjectStats.mockResolvedValue({
      total_projects: 10,
      total_raised: 100000
    })
    statsService.getInvestorStats.mockResolvedValue({
      total_investors: 50
    })
    statsService.getInvestmentStats.mockResolvedValue({
      total_investments: 200,
      total_amount: 50000
    })
    statsService.getMonthlyInvestmentStats.mockResolvedValue([])
    statsService.getMonthlyExpenseStats.mockResolvedValue([])
  })

  it('should render loading state initially', () => {
    renderWithProviders(<Statistics />)
    
    expect(screen.getByText(/loading|로딩/i)).toBeInTheDocument()
  })

  it('should render statistics after loading', async () => {
    renderWithProviders(<Statistics />)
    
    await waitFor(() => {
      expect(statsService.getProjectStats).toHaveBeenCalled()
      expect(statsService.getInvestorStats).toHaveBeenCalled()
      expect(statsService.getInvestmentStats).toHaveBeenCalled()
    })
  })

  it('should display project statistics', async () => {
    renderWithProviders(<Statistics />)
    
    await waitFor(() => {
      expect(screen.getByText(/total_projects|총 프로젝트/i)).toBeInTheDocument()
    })
  })

  it('should display investor statistics', async () => {
    renderWithProviders(<Statistics />)
    
    await waitFor(() => {
      expect(screen.getByText(/total_investors|총 투자자/i)).toBeInTheDocument()
    })
  })

  it('should handle loading errors gracefully', async () => {
    statsService.getProjectStats.mockRejectedValue(new Error('Failed to load'))
    
    renderWithProviders(<Statistics />)
    
    await waitFor(() => {
      // Page should still render even if data fails to load
      expect(screen.getByText(/statistics|통계/i)).toBeInTheDocument()
    })
  })
})

