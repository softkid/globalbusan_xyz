// 완전한 i18n 번역 시스템
const translations = {
  ko: {
    nav: {
      home: '홈',
      globalBusan: 'Global BUSAN',
      roadmap: 'Roadmap',
      team: 'Team',
      projects: '프로젝트',
      statistics: '통계',
      invest: '내 정보',
      donation: '기부',
      contact: '문의',
      apply: '프로젝트 신청'
    },
    common: {
      loading: '로딩 중...',
      error: '오류 발생',
      success: '성공',
      cancel: '취소',
      save: '저장',
      delete: '삭제',
      edit: '수정',
      submit: '제출',
      confirm: '확인',
      total: '총',
      viewAll: '전체보기',
      noData: '데이터가 없습니다'
    },
    home: {
      title: 'Global BUSAN',
      subtitle: '투자 지금 시작하세요',
      description: 'Global BUSAN 프로젝트에 투자하고 부산을 글로벌 비즈니스 허브로 만들어보세요',
      totalInvestment: '총 투자액',
      globalPartners: '글로벌 파트너',
      activeProjects: '활성 프로젝트',
      investNow: '지금 투자하기',
      donorsTitle: '기부자 현황',
      donorsSubtitle: 'Global BUSAN을 지원해주신 기부자들',
      topDonors: '주요 기부자',
      recentDonors: '최근 기부자'
    },
    projects: {
      title: '내 프로젝트',
      subtitle: '신청한 프로젝트',
      description: '내가 신청한 프로젝트의 진행 상황을 확인하세요',
      allCategories: '전체',
      noProjects: '신청한 프로젝트가 없습니다',
      applyProject: '프로젝트 신청하기',
      viewAllProjects: '전체 프로젝트 보기',
      status: {
        planning: '기획 중',
        development: '개발 중',
        testing: '테스트 중',
        launched: '출시됨',
        completed: '완료됨'
      }
    },
    invest: {
      title: '투자',
      subtitle: '투자 대시보드',
      description: '신규 및 유망 프로젝트에 투자하고 투자 내역을 확인하세요',
      newProjects: '신규 프로젝트',
      featuredProjects: '유망 프로젝트',
      myInvestments: '내 투자 내역',
      myDonations: '내 기부 내역',
      projectParticipation: '프로젝트 참여 내역',
      investInProjects: '프로젝트에 투자하기',
      goToProjects: '프로젝트 페이지로 이동',
      totalInvested: '총 투자액',
      totalDonated: '총 기부액',
      investmentCount: '투자 횟수',
      donationCount: '기부 횟수'
    },
    donation: {
      title: '기부',
      subtitle: 'Global BUSAN에 기부하기',
      description: 'Global BUSAN 프로젝트 전체를 지원하는 기부',
      donateNow: '지금 기부하기',
      donationAddress: '기부 주소',
      selectCrypto: '암호화폐 선택',
      amount: '기부 금액',
      myDonations: '내 기부 내역',
      totalDonated: '총 기부액',
      donationUsage: '기부 사용처',
      usageTitle: '기부금 사용 내역',
      usageDescription: 'Global BUSAN의 기부금이 어떻게 사용되고 있는지 확인하세요',
      category: {
        development: '개발',
        marketing: '마케팅',
        infrastructure: '인프라',
        legal: '법무',
        operations: '운영',
        other: '기타'
      },
      noUsage: '기부 사용 내역이 없습니다'
    },
    statistics: {
      title: 'Global BUSAN',
      subtitle: 'Statistics',
      overallStats: '전체 통계',
      monthlyTrends: '월별 추이',
      investmentTrends: '월별 투자 추이',
      expenseTrends: '월별 지출 추이'
    },
    admin: {
      title: '관리자 대시보드',
      projects: '프로젝트 관리',
      donations: '기부 관리',
      donationList: '기부 목록',
      donationUsage: '기부 사용처 관리',
      totalDonations: '총 기부액',
      donationCount: '기부 건수',
      donorCount: '기부자 수',
      donorDetails: '기부자별 내역',
      addUsage: '사용처 추가',
      editUsage: '사용처 수정',
      deleteUsage: '사용처 삭제',
      usageCategory: '카테고리',
      usageDescription: '설명',
      usageAmount: '금액',
      usageDate: '사용일'
    },
    contact: {
      title: 'Get In Touch',
      subtitle: '문의하기',
      email: '이메일',
      address: '주소',
      website: '웹사이트',
      sendMessage: '메시지 보내기',
      name: '이름',
      message: '메시지'
    },
    apply: {
      title: '프로젝트 신청하기',
      subtitle: '신청',
      basicInfo: '프로젝트 기본 정보',
      projectName: '프로젝트명',
      projectDescription: '프로젝트 설명',
      category: '카테고리',
      expectedBudget: '예상 예산',
      expectedTimeline: '예상 개발 기간',
      contactInfo: '담당자 정보',
      contactName: '담당자 이름',
      contactEmail: '이메일',
      contactPhone: '전화번호',
      documentUpload: '문서 업로드',
      businessPlan: '사업 계획서',
      additionalDocs: '추가 문서',
      submit: '신청서 제출',
      submitted: '신청서가 제출되었습니다!',
      submitting: '제출 중...'
    }
  },
  en: {
    nav: {
      home: 'Home',
      globalBusan: 'Global BUSAN',
      roadmap: 'Roadmap',
      team: 'Team',
      projects: 'Projects',
      statistics: 'Statistics',
      invest: 'My Info',
      donation: 'Donation',
      contact: 'Contact',
      apply: 'Apply Project'
    },
    common: {
      loading: 'Loading...',
      error: 'Error occurred',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      submit: 'Submit',
      confirm: 'Confirm',
      total: 'Total',
      viewAll: 'View All',
      noData: 'No data available'
    },
    home: {
      title: 'Global BUSAN',
      subtitle: 'Start Investing Now',
      description: 'Invest in Global BUSAN projects and help transform Busan into a global business hub',
      totalInvestment: 'Total Investment',
      globalPartners: 'Global Partners',
      activeProjects: 'Active Projects',
      investNow: 'Invest Now',
      donorsTitle: 'Donors',
      donorsSubtitle: 'Donors who support Global BUSAN',
      topDonors: 'Top Donors',
      recentDonors: 'Recent Donors'
    },
    projects: {
      title: 'My Projects',
      subtitle: 'Applied Projects',
      description: 'Check the progress of your applied projects',
      allCategories: 'All',
      noProjects: 'No projects applied',
      applyProject: 'Apply Project',
      viewAllProjects: 'View All Projects',
      status: {
        planning: 'Planning',
        development: 'Development',
        testing: 'Testing',
        launched: 'Launched',
        completed: 'Completed'
      }
    },
    invest: {
      title: 'Invest',
      subtitle: 'Investment Dashboard',
      description: 'Invest in new and featured projects and view your investment history',
      newProjects: 'New Projects',
      featuredProjects: 'Featured Projects',
      myInvestments: 'My Investments',
      myDonations: 'My Donations',
      projectParticipation: 'Project Participation',
      investInProjects: 'Invest in Projects',
      goToProjects: 'Go to Projects Page',
      totalInvested: 'Total Invested',
      totalDonated: 'Total Donated',
      investmentCount: 'Investment Count',
      donationCount: 'Donation Count'
    },
    donation: {
      title: 'Donation',
      subtitle: 'Donate to Global BUSAN',
      description: 'Support the entire Global BUSAN project through donation',
      donateNow: 'Donate Now',
      donationAddress: 'Donation Address',
      selectCrypto: 'Select Cryptocurrency',
      amount: 'Donation Amount',
      myDonations: 'My Donations',
      totalDonated: 'Total Donated',
      donationUsage: 'Donation Usage',
      usageTitle: 'How Donations Are Used',
      usageDescription: 'See how Global BUSAN uses donations',
      category: {
        development: 'Development',
        marketing: 'Marketing',
        infrastructure: 'Infrastructure',
        legal: 'Legal',
        operations: 'Operations',
        other: 'Other'
      },
      noUsage: 'No donation usage data'
    },
    statistics: {
      title: 'Global BUSAN',
      subtitle: 'Statistics',
      overallStats: 'Overall Statistics',
      monthlyTrends: 'Monthly Trends',
      investmentTrends: 'Monthly Investment Trends',
      expenseTrends: 'Monthly Expense Trends'
    },
    admin: {
      title: 'Admin Dashboard',
      projects: 'Project Management',
      donations: 'Donation Management',
      donationList: 'Donation List',
      donationUsage: 'Donation Usage Management',
      totalDonations: 'Total Donations',
      donationCount: 'Donation Count',
      donorCount: 'Donor Count',
      donorDetails: 'Donor Details',
      addUsage: 'Add Usage',
      editUsage: 'Edit Usage',
      deleteUsage: 'Delete Usage',
      usageCategory: 'Category',
      usageDescription: 'Description',
      usageAmount: 'Amount',
      usageDate: 'Usage Date'
    },
    contact: {
      title: 'Get In Touch',
      subtitle: 'Contact Us',
      email: 'Email',
      address: 'Address',
      website: 'Website',
      sendMessage: 'Send Message',
      name: 'Name',
      message: 'Message'
    },
    apply: {
      title: 'Apply for Project',
      subtitle: 'Application',
      basicInfo: 'Project Basic Information',
      projectName: 'Project Name',
      projectDescription: 'Project Description',
      category: 'Category',
      expectedBudget: 'Expected Budget',
      expectedTimeline: 'Expected Timeline',
      contactInfo: 'Contact Information',
      contactName: 'Contact Name',
      contactEmail: 'Email',
      contactPhone: 'Phone',
      documentUpload: 'Document Upload',
      businessPlan: 'Business Plan',
      additionalDocs: 'Additional Documents',
      submit: 'Submit Application',
      submitted: 'Application submitted successfully!',
      submitting: 'Submitting...'
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
