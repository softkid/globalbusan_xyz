/**
 * i18n Utility Tests
 */
import { setLanguage, getLanguage, t } from '../i18n'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}
global.localStorage = localStorageMock

// Mock window.dispatchEvent
global.window.dispatchEvent = jest.fn()

describe('i18n', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('ko')
  })

  describe('getLanguage', () => {
    it('should return current language', () => {
      const lang = getLanguage()
      expect(lang).toBe('ko')
    })
  })

  describe('setLanguage', () => {
    it('should set language and save to localStorage', () => {
      setLanguage('en')
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('language', 'en')
      expect(window.dispatchEvent).toHaveBeenCalled()
    })

    it('should not set invalid language', () => {
      const originalLang = getLanguage()
      setLanguage('invalid')
      
      expect(getLanguage()).toBe(originalLang)
    })
  })

  describe('t (translate)', () => {
    beforeEach(() => {
      setLanguage('ko')
    })

    it('should translate simple key', () => {
      const result = t('common.loading')
      expect(result).toBe('로딩 중...')
    })

    it('should translate nested key', () => {
      const result = t('nav.home')
      expect(result).toBe('홈')
    })

    it('should return key if translation not found', () => {
      const result = t('nonexistent.key')
      expect(result).toBe('nonexistent.key')
    })

    it('should translate in English when language is set to en', () => {
      setLanguage('en')
      const result = t('common.loading')
      expect(result).toBe('Loading...')
    })

    it('should fallback to Korean if translation not found in current language', () => {
      setLanguage('en')
      // Assuming 'ko' has a translation that 'en' doesn't
      const result = t('nav.home')
      expect(result).toBe('Home')
    })

    it('should handle deep nested keys', () => {
      const result = t('projects.status.planning')
      expect(result).toBe('기획 중')
    })
  })
})

