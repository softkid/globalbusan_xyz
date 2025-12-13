import '@testing-library/jest-dom'

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

