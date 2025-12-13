/**
 * 데이터베이스 연동 통합 테스트
 */
import { describe, test, expect, beforeEach, jest } from '@jest/globals'
import { 
  projectService, 
  investmentService, 
  expenseService, 
  statsService 
} from '../../lib/supabase'

// Mock Supabase client
const mockSupabaseClient = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        order: jest.fn(() => ({
          limit: jest.fn(() => Promise.resolve({ data: [], error: null }))
        })),
        single: jest.fn(() => Promise.resolve({ data: null, error: null }))
      })),
      order: jest.fn(() => ({
        limit: jest.fn(() => Promise.resolve({ data: [], error: null }))
      })),
      limit: jest.fn(() => Promise.resolve({ data: [], error: null }))
    })),
    insert: jest.fn(() => Promise.resolve({ data: { id: 1 }, error: null })),
    update: jest.fn(() => ({
      eq: jest.fn(() => Promise.resolve({ data: { id: 1 }, error: null }))
    })),
    delete: jest.fn(() => ({
      eq: jest.fn(() => Promise.resolve({ data: null, error: null }))
    }))
  }))
}

// Mock the supabase module
jest.mock('../../lib/supabase', () => {
  const actual = jest.requireActual('../../lib/supabase')
  return {
    ...actual,
    supabase: mockSupabaseClient
  }
})

describe('Database Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Project Service', () => {
    test('fetches all projects', async () => {
      const mockProjects = [
        { id: 1, title: 'Test Project 1', status: 'active' },
        { id: 2, title: 'Test Project 2', status: 'development' }
      ]

      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => Promise.resolve({ 
              data: mockProjects, 
              error: null 
            }))
          }))
        }))
      })

      const projects = await projectService.getProjects()
      expect(projects).toBeDefined()
      expect(Array.isArray(projects)).toBe(true)
    })

    test('creates a new project', async () => {
      const newProject = {
        title: 'New Project',
        description: 'Test description',
        category: 'infrastructure',
        budget: 100000
      }

      mockSupabaseClient.from.mockReturnValueOnce({
        insert: jest.fn(() => Promise.resolve({ 
          data: { id: 1, ...newProject }, 
          error: null 
        }))
      })

      const result = await projectService.createProject(newProject)
      expect(result).toBeDefined()
      expect(result.id).toBe(1)
    })

    test('handles database errors', async () => {
      const error = { message: 'Database connection failed', code: 'PGRST116' }

      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => Promise.resolve({ 
              data: null, 
              error 
            }))
          }))
        }))
      })

      try {
        await projectService.getProjects()
      } catch (err) {
        expect(err).toBeDefined()
      }
    })
  })

  describe('Investment Service', () => {
    test('creates investment record', async () => {
      const investment = {
        investor_email: 'test@example.com',
        amount: 1000,
        crypto_type: 'ETH',
        transaction_hash: '0x123',
        status: 'confirmed'
      }

      mockSupabaseClient.from.mockReturnValueOnce({
        insert: jest.fn(() => Promise.resolve({ 
          data: { id: 1, ...investment }, 
          error: null 
        }))
      })

      const result = await investmentService.createInvestment(investment)
      expect(result).toBeDefined()
      expect(result.id).toBe(1)
    })

    test('fetches investments by email', async () => {
      const mockInvestments = [
        { id: 1, investor_email: 'test@example.com', amount: 1000 },
        { id: 2, investor_email: 'test@example.com', amount: 2000 }
      ]

      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ 
              data: mockInvestments, 
              error: null 
            }))
          }))
        }))
      })

      const investments = await investmentService.getInvestments({
        investor_email: 'test@example.com'
      })
      expect(investments).toBeDefined()
      expect(Array.isArray(investments)).toBe(true)
    })
  })

  describe('Expense Service', () => {
    test('fetches expenses', async () => {
      const mockExpenses = [
        { id: 1, category: 'infrastructure', amount: 5000 },
        { id: 2, category: 'marketing', amount: 3000 }
      ]

      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ 
            data: mockExpenses, 
            error: null 
          }))
        }))
      })

      const expenses = await expenseService.getExpenses()
      expect(expenses).toBeDefined()
      expect(Array.isArray(expenses)).toBe(true)
    })
  })

  describe('Stats Service', () => {
    test('fetches statistics', async () => {
      const mockStats = {
        total_investments: 100000,
        total_expenses: 50000,
        active_projects: 5,
        total_donors: 50
      }

      // Mock multiple queries for stats
      mockSupabaseClient.from
        .mockReturnValueOnce({
          select: jest.fn(() => ({
            limit: jest.fn(() => Promise.resolve({ 
              data: [{ sum: 100000 }], 
              error: null 
            }))
          }))
        })
        .mockReturnValueOnce({
          select: jest.fn(() => ({
            limit: jest.fn(() => Promise.resolve({ 
              data: [{ sum: 50000 }], 
              error: null 
            }))
          }))
        })
        .mockReturnValueOnce({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              limit: jest.fn(() => Promise.resolve({ 
                data: [{ count: 5 }], 
                error: null 
              }))
            }))
          }))
        })

      const stats = await statsService.getStats()
      expect(stats).toBeDefined()
    })
  })

  describe('Transaction Management', () => {
    test('handles concurrent database operations', async () => {
      const operations = [
        projectService.getProjects(),
        investmentService.getInvestments(),
        expenseService.getExpenses()
      ]

      const results = await Promise.all(operations)
      expect(results).toHaveLength(3)
      results.forEach(result => {
        expect(result).toBeDefined()
      })
    })

    test('handles database connection timeout', async () => {
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => 
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), 100)
              )
            )
          }))
        }))
      })

      await expect(projectService.getProjects()).rejects.toThrow('Timeout')
    })
  })
})

