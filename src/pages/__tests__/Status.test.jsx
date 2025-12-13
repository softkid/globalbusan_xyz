import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Status from '../Status'
import { statsService, projectService, investmentService, expenseService } from '../../lib/supabase'

// Mock dependencies
jest.mock('../../lib/supabase', () => ({
  statsService: {
    getProjectStats: jest.fn(),
    getInvestorStats: jest.fn(),
    getInvestmentStats: jest.fn(),
    getProjectExpenseStats: jest.fn()
  },
  projectService: {
    getProjects: jest.fn()
  },
  investmentService: {
    getInvestments: jest.fn()
  },
  expenseService: {
    getExpenses: jest.fn()
  }
}))

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'status.title': '실시간 통계',
        'status.description': '프로젝트 통계를 실시간으로 확인하세요',
        'status.totalRaised': '총 모금액',
        'status.totalInvestors': '총 투자자',
        'status.totalProjects': '총 프로젝트',
        'status.netProfit': '순이익',
        'status.realTime': '실시간',
        'status.active': '활성',
        'status.calculated': '계산됨',
        'status.investmentExpenseTrend': '투자 및 지출 추이',
        'status.netProfitTrend': '순이익 추이',
        'status.projectInvestments': '프로젝트별 투자',
        'status.expenseByCategory': '카테고리별 지출',
        'status.projectProgress': '프로젝트 진행률',
        'status.investments': '투자',
        'status.expenses': '지출',
        'status.raised': '모금액',
        'status.budget': '예산',
        'status.progress': '진행률',
        'status.lastUpdated': '마지막 업데이트',
        'common.loading': '로딩 중...'
      }
      return translations[key] || key
    }
  })
}))

// Mock recharts
jest.mock('recharts', () => ({
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>
}))

describe('Status', () => {
  const mockStats = {
    project: {
      total_raised: 100000,
      total_projects: 5
    },
    investor: {
      total_investors: 10
    },
    investment: {
      total_investments: 15
    },
    expense: {
      total_expenses: 20000
    }
  }

  const mockProjects = [
    { id: 1, title: 'Project 1', budget: 50000, progress: 50 },
    { id: 2, title: 'Project 2', budget: 30000, progress: 30 }
  ]

  const mockInvestments = [
    { id: 1, project_id: 1, amount: 25000, investment_date: '2025-01-01' },
    { id: 2, project_id: 2, amount: 9000, investment_date: '2025-01-02' }
  ]

  const mockExpenses = [
    { id: 1, amount: 10000, expense_date: '2025-01-01', category: 'development' },
    { id: 2, amount: 10000, expense_date: '2025-01-02', category: 'marketing' }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    statsService.getProjectStats.mockResolvedValue(mockStats.project)
    statsService.getInvestorStats.mockResolvedValue(mockStats.investor)
    statsService.getInvestmentStats.mockResolvedValue(mockStats.investment)
    statsService.getProjectExpenseStats.mockResolvedValue(mockStats.expense)
    projectService.getProjects.mockResolvedValue(mockProjects)
    investmentService.getInvestments.mockResolvedValue(mockInvestments)
    expenseService.getExpenses.mockResolvedValue(mockExpenses)
  })

  it('should render loading state initially', () => {
    render(<Status />)
    expect(screen.getByText('로딩 중...')).toBeInTheDocument()
  })

  it('should render status page with statistics', async () => {
    render(<Status />)

    await waitFor(() => {
      expect(screen.getByText('실시간 통계')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText('총 모금액')).toBeInTheDocument()
      expect(screen.getByText('총 투자자')).toBeInTheDocument()
      expect(screen.getByText('총 프로젝트')).toBeInTheDocument()
      expect(screen.getByText('순이익')).toBeInTheDocument()
    })
  })

  it('should display total raised amount', async () => {
    render(<Status />)

    await waitFor(() => {
      expect(screen.getByText(/\$100,000/)).toBeInTheDocument()
    })
  })

  it('should display total investors', async () => {
    render(<Status />)

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument()
    })
  })

  it('should display total projects', async () => {
    render(<Status />)

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })

  it('should calculate and display net profit', async () => {
    render(<Status />)

    await waitFor(() => {
      // Net profit = 100000 - 20000 = 80000
      expect(screen.getByText(/\$80,000/)).toBeInTheDocument()
    })
  })

  it('should render charts', async () => {
    render(<Status />)

    await waitFor(() => {
      expect(screen.getByTestId('area-chart')).toBeInTheDocument()
      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
    })
  })

  it('should handle data loading errors gracefully', async () => {
    statsService.getProjectStats.mockRejectedValue(new Error('Failed to load'))
    
    render(<Status />)

    await waitFor(() => {
      // Should still render the page structure
      expect(screen.getByText('실시간 통계')).toBeInTheDocument()
    })
  })

  it('should update data periodically', async () => {
    jest.useFakeTimers()
    
    render(<Status />)

    await waitFor(() => {
      expect(statsService.getProjectStats).toHaveBeenCalled()
    })

    // Fast-forward 30 seconds
    jest.advanceTimersByTime(30000)

    await waitFor(() => {
      // Should be called again after interval
      expect(statsService.getProjectStats).toHaveBeenCalledTimes(2)
    })

    jest.useRealTimers()
  })
})

