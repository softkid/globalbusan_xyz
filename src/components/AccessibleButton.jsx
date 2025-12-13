/**
 * Accessible Button Component
 * 키보드 네비게이션 및 스크린 리더 지원을 포함한 접근성 향상 버튼
 */
import { useRef, useEffect } from 'react'

function AccessibleButton({
  children,
  onClick,
  onKeyDown,
  className = '',
  ariaLabel,
  ariaDescribedBy,
  disabled = false,
  type = 'button',
  ...props
}) {
  const buttonRef = useRef(null)

  // 키보드 이벤트 처리
  const handleKeyDown = (e) => {
    // Enter 또는 Space 키로 클릭 가능
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!disabled && onClick) {
        onClick(e)
      }
    }
    
    // 사용자 정의 키보드 핸들러
    if (onKeyDown) {
      onKeyDown(e)
    }
  }

  // 포커스 관리
  useEffect(() => {
    if (buttonRef.current && props.autoFocus) {
      buttonRef.current.focus()
    }
  }, [props.autoFocus])

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={className}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {children}
    </button>
  )
}

export default AccessibleButton

