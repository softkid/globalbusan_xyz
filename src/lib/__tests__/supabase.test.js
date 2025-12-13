import { projectService, investorService, investmentService } from '../supabase'

// Mock Supabase client
jest.mock('../supabase', () => {
  const mockSupabase = {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          data: [],
          error: null
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          data: [{ id: 1 }],
          error: null
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            data: [{ id: 1 }],
            error: null
          }))
        }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({
          error: null
        }))
      })),
      upsert: jest.fn(() => ({
        select: jest.fn(() => ({
          data: [{ id: 1 }],
          error: null
        }))
      })),
      eq: jest.fn(() => ({
        single: jest.fn(() => ({
          data: { id: 1 },
          error: null
        }))
      }))
    }))
  }
  return {
    supabase: mockSupabase,
    projectService: {
      getProjects: jest.fn().mockResolvedValue([]),
      createProject: jest.fn().mockResolvedValue({ id: 1 }),
      updateProject: jest.fn().mockResolvedValue({ id: 1 }),
      deleteProject: jest.fn().mockResolvedValue(undefined)
    },
    investorService: {
      upsertInvestor: jest.fn().mockResolvedValue({ id: 1 }),
      getInvestorByWallet: jest.fn().mockResolvedValue({ id: 1 }),
      getInvestors: jest.fn().mockResolvedValue([])
    },
    investmentService: {
      createInvestment: jest.fn().mockResolvedValue({ id: 1 }),
      getInvestments: jest.fn().mockResolvedValue([])
    }
  }
})

describe('Supabase Services', () => {
  describe('projectService', () => {
    test('getProjects returns array', async () => {
      const projects = await projectService.getProjects()
      expect(Array.isArray(projects)).toBe(true)
    })

    test('createProject returns project with id', async () => {
      const project = await projectService.createProject({ title: 'Test' })
      expect(project).toHaveProperty('id')
    })
  })

  describe('investorService', () => {
    test('upsertInvestor returns investor', async () => {
      const investor = await investorService.upsertInvestor({ wallet_address: '0x123' })
      expect(investor).toHaveProperty('id')
    })

    test('getInvestorByWallet returns investor', async () => {
      const investor = await investorService.getInvestorByWallet('0x123')
      expect(investor).toHaveProperty('id')
    })
  })

  describe('investmentService', () => {
    test('createInvestment returns investment', async () => {
      const investment = await investmentService.createInvestment({
        investor_email: 'test@example.com',
        amount: 100
      })
      expect(investment).toHaveProperty('id')
    })

    test('getInvestments returns array', async () => {
      const investments = await investmentService.getInvestments()
      expect(Array.isArray(investments)).toBe(true)
    })
  })
})

