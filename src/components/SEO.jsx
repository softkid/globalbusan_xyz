import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * SEO 컴포넌트 - 각 페이지별 동적 메타 태그 관리
 * 
 * @param {Object} props
 * @param {string} props.title - 페이지 제목
 * @param {string} props.description - 페이지 설명
 * @param {string} props.keywords - 페이지 키워드 (선택)
 * @param {string} props.image - Open Graph 이미지 URL (선택)
 * @param {string} props.url - 페이지 URL (선택, 기본값: 현재 경로)
 * @param {string} props.type - Open Graph 타입 (선택, 기본값: 'website')
 * @param {Object} props.structuredData - JSON-LD 구조화된 데이터 (선택)
 */
function SEO({
  title,
  description,
  keywords,
  image = 'https://globalbusan.xyz/og-image-placeholder.svg',
  url,
  type = 'website',
  structuredData
}) {
  const { i18n } = useTranslation()
  const currentLang = i18n.language || 'ko'
  const baseUrl = 'https://globalbusan.xyz'
  const currentUrl = url || (typeof window !== 'undefined' 
    ? `${baseUrl}${window.location.pathname}${window.location.search}` 
    : baseUrl)

  useEffect(() => {
    // 기본 메타 태그 업데이트
    document.title = title || 'Global BUSAN - 부산을 글로벌 비즈니스 허브로'
    
    // Description
    updateMetaTag('description', description || '투명한 블록체인 기반 플랫폼을 구축하여 국제 기업가들과 한국의 비즈니스 생태계를 연결합니다.')
    
    // Keywords
    if (keywords) {
      updateMetaTag('keywords', keywords)
    }
    
    // Open Graph 태그
    updateMetaTag('og:title', title, 'property')
    updateMetaTag('og:description', description, 'property')
    updateMetaTag('og:url', currentUrl, 'property')
    updateMetaTag('og:type', type, 'property')
    updateMetaTag('og:image', image, 'property')
    
    // Twitter Card 태그
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', image)
    
    // Canonical URL
    updateLinkTag('canonical', currentUrl, 'href')
    
    // Alternate language links
    if (typeof window !== 'undefined') {
      const languages = ['ko', 'en', 'ja', 'zh', 'ar']
      languages.forEach(lang => {
        const langUrl = `${baseUrl}${window.location.pathname}?lang=${lang}`
        updateLinkTag(`alternate-${lang}`, langUrl, 'href', { hreflang: lang, rel: 'alternate' })
      })
    }
    
    // Structured Data (JSON-LD)
    if (structuredData) {
      addStructuredData(structuredData)
    }
    
    return () => {
      // Cleanup는 필요시 추가
    }
  }, [title, description, keywords, image, url, type, structuredData, currentUrl, currentLang])

  return null
}

/**
 * 메타 태그 업데이트 헬퍼 함수
 */
function updateMetaTag(name, content, attribute = 'name') {
  if (!content) return
  
  let element = document.querySelector(`meta[${attribute}="${name}"]`)
  
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  
  element.setAttribute('content', content)
}

/**
 * 링크 태그 업데이트 헬퍼 함수
 */
function updateLinkTag(id, href, attribute = 'href', additionalAttrs = {}) {
  let element = document.querySelector(`link[data-seo-id="${id}"]`)
  
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('data-seo-id', id)
    document.head.appendChild(element)
  }
  
  element.setAttribute(attribute, href)
  
  // 추가 속성 설정
  Object.keys(additionalAttrs).forEach(key => {
    element.setAttribute(key, additionalAttrs[key])
  })
}

/**
 * JSON-LD 구조화된 데이터 추가
 */
function addStructuredData(data) {
  // 기존 structured data 제거
  const existingScript = document.querySelector('script[type="application/ld+json"][data-seo]')
  if (existingScript) {
    existingScript.remove()
  }
  
  // 새로운 structured data 추가
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.setAttribute('data-seo', 'true')
  script.text = JSON.stringify(data)
  document.head.appendChild(script)
}

export default SEO

