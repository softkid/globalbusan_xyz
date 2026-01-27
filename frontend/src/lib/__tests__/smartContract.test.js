/**
 * Smart Contract Utility Tests
 */
import { EthereumContract, SolanaContract, createDonationContract } from '../smartContract'

// Mock ethers
jest.mock('ethers', () => ({
  ethers: {
    BrowserProvider: jest.fn(),
    Contract: jest.fn(),
    parseEther: jest.fn((value) => value),
    formatEther: jest.fn((value) => value.toString())
  }
}))

// Mock @solana/web3.js
jest.mock('@solana/web3.js', () => ({
  Connection: jest.fn(),
  PublicKey: jest.fn(),
  Transaction: jest.fn(),
  SystemProgram: {
    transfer: jest.fn()
  }
}))

// Mock window.ethereum
global.window.ethereum = {
  request: jest.fn()
}

describe('Smart Contract Utilities', () => {
  describe('EthereumContract', () => {
    let contract
    const mockProvider = {
      getSigner: jest.fn()
    }
    const mockContract = {
      donate: jest.fn(),
      getTotalDonations: jest.fn(),
      getDonorCount: jest.fn()
    }

    beforeEach(() => {
      jest.clearAllMocks()
      contract = new EthereumContract('0x123', [], mockProvider)
    })

    it('should initialize contract', async () => {
      mockProvider.getSigner.mockResolvedValue({})
      const { Contract } = require('ethers')
      Contract.mockReturnValue(mockContract)

      const result = await contract.init()

      expect(result).toBe(mockContract)
    })

    it('should throw error if provider not found', async () => {
      const contractWithoutProvider = new EthereumContract('0x123', [])
      delete global.window.ethereum

      await expect(contractWithoutProvider.init()).rejects.toThrow('Ethereum provider not found')
    })

    it('should call donate function', async () => {
      contract.contract = mockContract
      mockContract.donate.mockResolvedValue({
        hash: '0xabc',
        wait: jest.fn().mockResolvedValue({})
      })

      const result = await contract.donate(1.5, '0xrecipient')

      expect(mockContract.donate).toHaveBeenCalled()
      expect(result).toHaveProperty('hash')
    })

    it('should get total donations', async () => {
      contract.contract = mockContract
      mockContract.getTotalDonations.mockResolvedValue('1000000000000000000')

      const result = await contract.getTotalDonations()

      expect(mockContract.getTotalDonations).toHaveBeenCalled()
      expect(result).toBeDefined()
    })
  })

  describe('SolanaContract', () => {
    let contract
    const mockConnection = {
      sendTransaction: jest.fn(),
      getBalance: jest.fn()
    }

    beforeEach(() => {
      jest.clearAllMocks()
      const { Connection } = require('@solana/web3.js')
      Connection.mockReturnValue(mockConnection)
      contract = new SolanaContract('https://api.mainnet-beta.solana.com')
    })

    it('should initialize connection', () => {
      expect(contract.connection).toBeDefined()
    })

    it('should get total donations', async () => {
      mockConnection.getBalance.mockResolvedValue(1000000000)

      const result = await contract.getTotalDonations('walletAddress')

      expect(mockConnection.getBalance).toHaveBeenCalled()
      expect(result).toBeDefined()
    })
  })

  describe('createDonationContract', () => {
    it('should create Ethereum contract for ethereum network', () => {
      const contract = createDonationContract('ethereum', '0x123', [])
      
      expect(contract).toBeInstanceOf(EthereumContract)
    })

    it('should create Solana contract for solana network', () => {
      const contract = createDonationContract('solana', 'walletAddress')
      
      expect(contract).toBeInstanceOf(SolanaContract)
    })

    it('should throw error for unsupported network', () => {
      expect(() => {
        createDonationContract('unsupported', 'address')
      }).toThrow('Unsupported network')
    })
  })
})

