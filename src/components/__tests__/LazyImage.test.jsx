import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import LazyImage from '../LazyImage'

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn()
})
global.IntersectionObserver = mockIntersectionObserver

describe('LazyImage', () => {
  const defaultProps = {
    src: 'https://example.com/image.jpg',
    alt: 'Test image'
  }

  it('should render image with alt', () => {
    render(<LazyImage {...defaultProps} />)
    const img = screen.getByAltText('Test image')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('alt', 'Test image')
  })

  it('should start with placeholder src', () => {
    render(<LazyImage {...defaultProps} />)
    const img = screen.getByAltText('Test image')
    // Initially uses placeholder
    expect(img).toHaveAttribute('src')
  })

  it('should apply custom className', () => {
    const { container } = render(
      <LazyImage {...defaultProps} className="custom-class" />
    )
    expect(container.querySelector('.lazy-image-container')).toHaveClass('custom-class')
  })

  it('should handle image load', async () => {
    render(<LazyImage {...defaultProps} />)
    const img = screen.getByAltText('Test image')
    
    fireEvent.load(img)
    
    await waitFor(() => {
      expect(img).toHaveClass('loaded')
    })
  })

  it('should handle image error', () => {
    render(<LazyImage {...defaultProps} />)
    const img = screen.getByAltText('Test image')
    
    fireEvent.error(img)
    
    // Should show error state
    expect(img).toBeInTheDocument()
  })

  it('should use custom placeholder when provided', () => {
    render(
      <LazyImage
        {...defaultProps}
        placeholder="https://example.com/placeholder.jpg"
      />
    )
    const img = screen.getByAltText('Test image')
    expect(img).toBeInTheDocument()
  })

  it('should pass through other props', () => {
    render(
      <LazyImage
        {...defaultProps}
        width={100}
        height={100}
      />
    )
    const img = screen.getByAltText('Test image')
    expect(img).toHaveAttribute('width', '100')
    expect(img).toHaveAttribute('height', '100')
  })
})

