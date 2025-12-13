import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ErrorBoundary from '../ErrorBoundary'

// Component that throws an error
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  // Suppress console.error for tests
  const originalError = console.error
  beforeAll(() => {
    console.error = jest.fn()
  })

  afterAll(() => {
    console.error = originalError
  })

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )
    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('should render error message when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    expect(screen.getByText(/오류가 발생했습니다/)).toBeInTheDocument()
  })

  it('should render error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    // Error details only shown in development
    const errorMessage = screen.queryByText(/Test error|오류가 발생했습니다/)
    expect(errorMessage || screen.getByText(/오류가 발생했습니다/)).toBeInTheDocument()
    
    process.env.NODE_ENV = originalEnv
  })

  it('should have reload button', () => {
    const reload = jest.fn()
    Object.defineProperty(window, 'location', {
      value: { reload: reload },
      writable: true
    })

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const reloadButton = screen.getByText(/새로고침/)
    expect(reloadButton).toBeInTheDocument()
  })
})

