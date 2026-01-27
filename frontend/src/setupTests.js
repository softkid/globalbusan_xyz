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
        VITE_SUI_DONATION_PACKAGE: '0x0',
        VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_test'
      }
    }
  }
})

// Mock Sui wallet
global.window.suiWallet = {
  requestPermissions: jest.fn().mockResolvedValue(true),
  getAccounts: jest.fn().mockResolvedValue([{ address: '0xsuiwallet' }]),
  signAndExecuteTransaction: jest.fn().mockResolvedValue({ digest: '0xsuidigest' })
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

