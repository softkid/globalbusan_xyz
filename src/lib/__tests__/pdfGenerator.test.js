import { generateReportPDF, generateEquityStructurePDF } from '../pdfGenerator'

// Mock jsPDF and html2canvas
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    setFontSize: jest.fn(),
    text: jest.fn(),
    setTextColor: jest.fn(),
    save: jest.fn(),
    addImage: jest.fn(),
    addPage: jest.fn()
  }))
})

jest.mock('html2canvas', () => {
  return jest.fn().mockResolvedValue({
    height: 100,
    width: 100,
    toDataURL: jest.fn().mockReturnValue('data:image/png;base64,test')
  })
})

describe('PDF Generator', () => {
  describe('generateReportPdf', () => {
    test('generates PDF with report data', async () => {
      const reportData = {
        title: 'Q1 2024 Report',
        period: 'Q1 2024',
        fundsReceived: 10000,
        fundsSpent: 5000,
        milestones: [
          { title: 'Milestone 1', status: 'completed' }
        ],
        impactMetrics: {
          'Projects Launched': 5
        },
        financialBreakdown: {
          'Development': 3000,
          'Marketing': 2000
        },
        nextQuarterGoals: ['Goal 1', 'Goal 2']
      }

      await expect(generateReportPDF(reportData, 'Q1-2024')).resolves.not.toThrow()
    })

    test('handles empty report data', async () => {
      const reportData = {
        title: 'Empty Report',
        period: 'Q1 2024',
        fundsReceived: 0,
        fundsSpent: 0,
        milestones: [],
        impactMetrics: {},
        financialBreakdown: {},
        nextQuarterGoals: []
      }

      await expect(generateReportPDF(reportData, 'Q1-2024')).resolves.not.toThrow()
    })
  })

  describe('generateEquityPdf', () => {
    test('generates PDF from element', async () => {
      const mockElement = document.createElement('div')
      mockElement.innerHTML = '<div>Test Content</div>'

      await expect(generateEquityStructurePDF({ totalAmount: 1000 })).resolves.not.toThrow()
    })

    test('handles empty equity data', async () => {
      const equityData = {
        totalAmount: 0,
        donorCount: 0,
        averageDonation: 0
      }

      await expect(generateEquityStructurePDF(equityData)).resolves.not.toThrow()
    })
  })
})

