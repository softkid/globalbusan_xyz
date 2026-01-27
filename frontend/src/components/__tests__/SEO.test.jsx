import { render, screen } from '@testing-library/react'
import SEO from '../SEO'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n/config'

// Mock react-helmet-async
jest.mock('react-helmet-async', () => ({
  Helmet: ({ children }) => children,
  HelmetProvider: ({ children }) => children
}))

describe('SEO Component', () => {
  const renderWithI18n = (component) => {
    return render(
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    )
  }

  test('should update document title', () => {
    renderWithI18n(<SEO title="Test Title" description="Test Description" />)
    expect(document.title).toBe('Test Title')
  })

  test('should set meta description', () => {
    renderWithI18n(<SEO title="Test" description="Test Description" />)
    // Meta tag should be created/updated
    expect(document.createElement).toHaveBeenCalled()
  })

  test('should handle structured data', () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Test'
    }
    renderWithI18n(<SEO title="Test" structuredData={structuredData} />)
    // Structured data script should be added
    expect(document.createElement).toHaveBeenCalledWith('script')
  })
})

