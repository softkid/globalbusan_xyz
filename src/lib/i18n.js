// 간단한 i18n 시스템
const translations = {
  ko: {
    nav: {
      home: '홈',
      projects: '프로젝트',
      statistics: '통계',
      invest: '투자',
      contact: '문의',
      equity: 'Equity',
      reports: 'Reports',
      roadmap: 'Roadmap'
    },
    home: {
      title: 'Global BUSAN',
      subtitle: '투자 지금 시작하세요',
      description: 'Global BUSAN 프로젝트에 투자하고 부산을 글로벌 비즈니스 허브로 만들어보세요'
    },
    projects: {
      title: '개발 프로젝트',
      subtitle: '프로젝트',
      description: '기부금으로 개발되는 혁신적인 프로젝트들을 확인하고 투자 성과를 추적해보세요'
    },
    invest: {
      title: '투자',
      subtitle: '지금 시작하세요',
      description: 'Global BUSAN 프로젝트에 투자하고 부산을 글로벌 비즈니스 허브로 만들어보세요'
    },
    statistics: {
      title: 'Global BUSAN',
      subtitle: 'Statistics'
    }
  },
  en: {
    nav: {
      home: 'Home',
      projects: 'Projects',
      statistics: 'Statistics',
      invest: 'Invest',
      contact: 'Contact',
      equity: 'Equity',
      reports: 'Reports',
      roadmap: 'Roadmap'
    },
    home: {
      title: 'Global BUSAN',
      subtitle: 'Start Investing Now',
      description: 'Invest in Global BUSAN projects and help transform Busan into a global business hub'
    },
    projects: {
      title: 'Development Projects',
      subtitle: 'Projects',
      description: 'Check out innovative projects developed with donations and track investment performance'
    },
    invest: {
      title: 'Invest',
      subtitle: 'Start Now',
      description: 'Invest in Global BUSAN projects and help transform Busan into a global business hub'
    },
    statistics: {
      title: 'Global BUSAN',
      subtitle: 'Statistics'
    }
  }
}

// 기본 언어는 한국어
let currentLanguage = localStorage.getItem('language') || 'ko'

export const setLanguage = (lang) => {
  if (translations[lang]) {
    currentLanguage = lang
    localStorage.setItem('language', lang)
    // 언어 변경 시 페이지 리로드 (또는 React Context로 상태 업데이트)
    window.dispatchEvent(new Event('languagechange'))
  }
}

export const getLanguage = () => currentLanguage

export const t = (key) => {
  const keys = key.split('.')
  let value = translations[currentLanguage]
  
  for (const k of keys) {
    if (value && value[k]) {
      value = value[k]
    } else {
      // 폴백: 한국어에서 찾기
      value = translations['ko']
      for (const k2 of keys) {
        if (value && value[k2]) {
          value = value[k2]
        } else {
          return key // 키를 그대로 반환
        }
      }
      break
    }
  }
  
  return typeof value === 'string' ? value : key
}

export default { setLanguage, getLanguage, t, translations }

