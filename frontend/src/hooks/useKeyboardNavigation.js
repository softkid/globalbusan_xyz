/**
 * Keyboard Navigation Hook
 * 키보드 네비게이션을 위한 커스텀 훅
 */
import { useEffect, useRef, useState } from 'react'

/**
 * 키보드 네비게이션 훅
 * @param {Object} options - 옵션
 * @param {string[]} options.keys - 감지할 키 배열 (기본값: ['ArrowUp', 'ArrowDown', 'Enter', 'Escape'])
 * @param {Function} options.onKeyPress - 키 입력 핸들러
 * @param {boolean} options.enabled - 활성화 여부
 */
export function useKeyboardNavigation(options = {}) {
  const {
    keys = ['ArrowUp', 'ArrowDown', 'Enter', 'Escape'],
    onKeyPress,
    enabled = true
  } = options

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event) => {
      if (keys.includes(event.key)) {
        onKeyPress?.(event)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [keys, onKeyPress, enabled])
}

/**
 * 포커스 트랩 훅 (모달 등에서 사용)
 */
export function useFocusTrap(containerRef, isActive = false) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    
    // 첫 번째 요소에 포커스
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }, [containerRef, isActive])
}

/**
 * 스킵 링크 훅
 */
export function useSkipLink() {
  const skipLinkRef = useRef(null)

  const handleSkip = () => {
    const mainContent = document.querySelector('main') || document.querySelector('#main-content')
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1')
      mainContent.focus()
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return { skipLinkRef, handleSkip }
}

