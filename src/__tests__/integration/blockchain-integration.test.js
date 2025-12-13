/**
 * 블록체인 통합 테스트
 */
import { 
  sendTransaction, 
  verifyTransaction, 
  waitForEthereumTransaction,
  waitForPolygonTransaction,
  waitForSolanaTransaction,
  getBlockchainExplorerLink
} from '../../lib/blockchain'

// Mock ethers
jest.mock('ethers', () => ({
  JsonRpcProvider: jest.fn().mockImplementation(() => ({
    getTransaction: jest.fn().mockResolvedValue({
      hash: '0x123',
      from: '0xfrom',
      to: '0xto',
      value: '1000000000000000000' // 1 ETH in Wei
    }),
    getTransactionReceipt: jest.fn().mockResolvedValue({
      status: 1,
      blockNumber: 12345,
      confirmations: 1,
      gasUsed: { toString: () => '21000' }
    }),
    waitForTransaction: jest.fn().mockResolvedValue({
      status: 1,
      blockNumber: 12345,
      confirmations: 1,
      gasUsed: { toString: () => '21000' }
    })
  })),
  formatEther: jest.fn((value) => '1.0'),
  parseEther: jest.fn((value) => '1000000000000000000'),
  BrowserProvider: jest.fn().mockImplementation(() => ({
    getSigner: jest.fn().mockResolvedValue({
      getAddress: jest.fn().mockResolvedValue('0xfrom'),
      sendTransaction: jest.fn().mockResolvedValue({
        hash: '0x123'
      }),
      estimateGas: jest.fn().mockResolvedValue('21000')
    })
  }))
}))

// Mock window.ethereum
global.window = {
  ethereum: {
    request: jest.fn().mockResolvedValue(null),
    isMetaMask: true
  }
}

describe('Blockchain Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Transaction Sending', () => {
    test('sends Ethereum transaction', async () => {
      const result = await sendTransaction(
        '0xto',
        1.0,
        '0xfrom',
        'ethereum'
      )
      
      expect(result.success).toBe(true)
      expect(result.transactionHash).toBeDefined()
      expect(result.network).toBe('ethereum')
    })

    test('sends Polygon transaction', async () => {
      global.window.ethereum.request = jest.fn()
        .mockResolvedValueOnce(null) // switchChain
        .mockResolvedValueOnce(null) // addChain (if needed)
      
      const result = await sendTransaction(
        '0xto',
        1.0,
        '0xfrom',
        'polygon'
      )
      
      expect(result.success).toBe(true)
      expect(result.network).toBe('polygon')
    })
  })

  describe('Transaction Verification', () => {
    test('verifies Ethereum transaction', async () => {
      const result = await verifyTransaction(
        '0x123',
        'ethereum',
        1.0,
        '0xto'
      )
      
      expect(result.verified).toBe(true)
      expect(result.transaction).toBeDefined()
    })

    test('verifies Polygon transaction', async () => {
      const result = await verifyTransaction(
        '0x123',
        'polygon',
        1.0,
        '0xto'
      )
      
      expect(result.verified).toBe(true)
    })
  })

  describe('Transaction Waiting', () => {
    test('waits for Ethereum transaction confirmation', async () => {
      const result = await waitForEthereumTransaction('0x123', 1)
      
      expect(result.success).toBe(true)
      expect(result.receipt).toBeDefined()
    })

    test('waits for Polygon transaction confirmation', async () => {
      const result = await waitForPolygonTransaction('0x123', 1)
      
      expect(result.success).toBe(true)
      expect(result.receipt).toBeDefined()
    })
  })

  describe('Explorer Links', () => {
    test('generates Ethereum explorer link', () => {
      const link = getBlockchainExplorerLink('0x123', 'ethereum')
      expect(link).toContain('etherscan.io')
      expect(link).toContain('0x123')
    })

    test('generates Polygon explorer link', () => {
      const link = getBlockchainExplorerLink('0x123', 'polygon')
      expect(link).toContain('polygonscan.com')
      expect(link).toContain('0x123')
    })

    test('generates Solana explorer link', () => {
      const link = getBlockchainExplorerLink('abc123', 'solana')
      expect(link).toContain('solscan.io')
      expect(link).toContain('abc123')
    })
  })
})

