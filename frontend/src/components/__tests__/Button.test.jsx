import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Button from '../Button'

describe('Button', () => {
  it('should render button with title', () => {
    render(<Button title="Click me" />)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should handle click events', () => {
    const handleClick = jest.fn()
    render(<Button title="Click me" onClick={handleClick} />)
    
    const button = screen.getByText('Click me').closest('button')
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should apply custom className via containerClass', () => {
    const { container } = render(<Button title="Button" containerClass="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should render with left and right icons', () => {
    const leftIcon = <span data-testid="left-icon">←</span>
    const rightIcon = <span data-testid="right-icon">→</span>
    render(<Button title="Button" leftIcon={leftIcon} rightIcon={rightIcon} />)
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  it('should have button element', () => {
    const { container } = render(<Button title="Button" />)
    expect(container.firstChild.tagName).toBe('BUTTON')
  })

  it('should pass through id prop', () => {
    render(<Button id="test-button" title="Button" />)
    const button = screen.getByText('Button').closest('button')
    expect(button).toHaveAttribute('id', 'test-button')
  })
})

