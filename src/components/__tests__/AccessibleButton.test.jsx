/**
 * AccessibleButton Component Tests
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AccessibleButton from '../AccessibleButton'

describe('AccessibleButton', () => {
  it('should render button with children', () => {
    render(<AccessibleButton>Click me</AccessibleButton>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<AccessibleButton onClick={handleClick}>Click me</AccessibleButton>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should call onClick on Enter key press', () => {
    const handleClick = jest.fn()
    render(<AccessibleButton onClick={handleClick}>Click me</AccessibleButton>)
    
    const button = screen.getByRole('button')
    fireEvent.keyDown(button, { key: 'Enter' })
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should call onClick on Space key press', () => {
    const handleClick = jest.fn()
    render(<AccessibleButton onClick={handleClick}>Click me</AccessibleButton>)
    
    const button = screen.getByRole('button')
    fireEvent.keyDown(button, { key: ' ' })
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should not call onClick when disabled', () => {
    const handleClick = jest.fn()
    render(<AccessibleButton onClick={handleClick} disabled>Click me</AccessibleButton>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    fireEvent.keyDown(button, { key: 'Enter' })
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should apply aria-label when provided', () => {
    render(<AccessibleButton ariaLabel="Custom label">Button</AccessibleButton>)
    
    const button = screen.getByRole('button', { name: 'Custom label' })
    expect(button).toHaveAttribute('aria-label', 'Custom label')
  })

  it('should apply aria-describedby when provided', () => {
    render(<AccessibleButton ariaDescribedBy="description-id">Button</AccessibleButton>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-describedby', 'description-id')
  })

  it('should set aria-disabled when disabled', () => {
    render(<AccessibleButton disabled>Button</AccessibleButton>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-disabled', 'true')
  })

  it('should set tabIndex to -1 when disabled', () => {
    render(<AccessibleButton disabled>Button</AccessibleButton>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('tabIndex', '-1')
  })

  it('should call custom onKeyDown handler', () => {
    const handleKeyDown = jest.fn()
    render(<AccessibleButton onKeyDown={handleKeyDown}>Button</AccessibleButton>)
    
    const button = screen.getByRole('button')
    fireEvent.keyDown(button, { key: 'Escape' })
    
    expect(handleKeyDown).toHaveBeenCalledTimes(1)
  })

  it('should apply custom className', () => {
    render(<AccessibleButton className="custom-class">Button</AccessibleButton>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('should set button type', () => {
    render(<AccessibleButton type="submit">Submit</AccessibleButton>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')
  })
})

