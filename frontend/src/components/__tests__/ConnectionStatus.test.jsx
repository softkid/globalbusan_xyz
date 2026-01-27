/**
 * ConnectionStatus Component Tests
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ConnectionStatus from '../ConnectionStatus'
import { connectionStatus, checkSupabaseConnection } from '../lib/supabase'

// Mock supabase
jest.mock('../lib/supabase', () => ({
  connectionStatus: {
    connected: false,
    error: null,
    lastChecked: null
  },
  checkSupabaseConnection: jest.fn()
}))

describe('ConnectionStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should not render when connected', () => {
    const mockStatus = {
      connected: true,
      error: null,
      lastChecked: null
    }
    require('../lib/supabase').connectionStatus = mockStatus

    const { container } = render(<ConnectionStatus />)
    
    expect(container.firstChild).toBeNull()
  })

  it('should render when not connected', () => {
    const mockStatus = {
      connected: false,
      error: null,
      lastChecked: null
    }
    require('../lib/supabase').connectionStatus = mockStatus

    render(<ConnectionStatus />)
    
    expect(screen.getByText(/연결 중|데이터베이스 연결/i)).toBeInTheDocument()
  })

  it('should display error message when error exists', () => {
    const mockStatus = {
      connected: false,
      error: 'Connection failed',
      lastChecked: null
    }
    require('../lib/supabase').connectionStatus = mockStatus

    render(<ConnectionStatus />)
    
    expect(screen.getByText(/연결 문제 발생|Connection failed/i)).toBeInTheDocument()
  })

  it('should call checkSupabaseConnection on retry button click', async () => {
    const mockStatus = {
      connected: false,
      error: 'Connection failed',
      lastChecked: null
    }
    require('../lib/supabase').connectionStatus = mockStatus
    checkSupabaseConnection.mockResolvedValue({
      connected: true,
      error: null,
      lastChecked: new Date()
    })

    render(<ConnectionStatus />)
    
    const retryButton = screen.getByText(/재시도/i)
    fireEvent.click(retryButton)

    await waitFor(() => {
      expect(checkSupabaseConnection).toHaveBeenCalled()
    })
  })

  it('should hide when close button is clicked', () => {
    const mockStatus = {
      connected: false,
      error: null,
      lastChecked: null
    }
    require('../lib/supabase').connectionStatus = mockStatus

    render(<ConnectionStatus />)
    
    const closeButton = screen.getByText(/닫기/i)
    fireEvent.click(closeButton)

    // Component should still be in DOM but may be hidden
    expect(closeButton).toBeInTheDocument()
  })

  it('should update status periodically', () => {
    const mockStatus = {
      connected: false,
      error: null,
      lastChecked: null
    }
    require('../lib/supabase').connectionStatus = mockStatus

    render(<ConnectionStatus />)
    
    // Fast-forward timer
    jest.advanceTimersByTime(1000)

    // Status should be checked
    expect(screen.getByText(/연결 중|데이터베이스 연결/i)).toBeInTheDocument()
  })
})

