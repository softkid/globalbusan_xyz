import '@testing-library/jest-dom'

// Polyfill for TextEncoder/TextDecoder
import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock import.meta.env
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'test-key',
        VITE_ETHEREUM_RPC_URL: 'https://eth.llamarpc.com',
        VITE_POLYGON_RPC_URL: 'https://polygon.llamarpc.com',
        VITE_SOLANA_RPC_URL: 'https://api.mainnet-beta.solana.com',
        VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_test'
      }
    }
  }
})

// Mock window.ethereum for MetaMask
global.window.ethereum = {
  request: jest.fn(),
  isMetaMask: true,
  on: jest.fn(),
  removeListener: jest.fn()
}

// Mock window.solana for Phantom
global.window.solana = {
  isPhantom: true,
  isConnected: false,
  connect: jest.fn(),
  disconnect: jest.fn(),
  signTransaction: jest.fn(),
  signAllTransactions: jest.fn(),
  publicKey: null
}

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}
global.localStorage = localStorageMock

// Mock navigator
global.navigator.clipboard = {
  writeText: jest.fn().mockResolvedValue(undefined)
}

global.navigator.share = jest.fn().mockResolvedValue(undefined)

// Mock fetch
global.fetch = jest.fn()

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))

