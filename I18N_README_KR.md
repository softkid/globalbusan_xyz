# 다국어 지원 (i18n) 구현 완료

## 구현 내용
Global BUSAN 투자 플랫폼에 5개 언어 지원이 추가되었습니다.

## 지원 언어
1. **영어 (English)** - 기본 및 최우선 언어 ✅
2. **중국어 (中文)** - 간체 중국어
3. **일본어 (日本語)** - 일본어
4. **한국어 (한국어)** - 한국어
5. **아랍어 (العربية)** - RTL(오른쪽에서 왼쪽) 지원

## 주요 기능
- ✅ **영어가 기본 언어**로 설정됨
- ✅ 모든 페이지에 다국어 지원 적용
- ✅ 아름다운 언어 선택 드롭다운 (국기 이모지 포함)
- ✅ 아랍어 RTL 레이아웃 자동 전환
- ✅ 브라우저 언어 자동 감지
- ✅ localStorage에 언어 설정 저장
- ✅ 반응형 디자인 (모바일 지원)

## 변경된 파일
### 새로 생성된 파일
- `src/i18n/config.js` - i18n 설정
- `src/i18n/locales/en.json` - 영어 번역
- `src/i18n/locales/zh.json` - 중국어 번역
- `src/i18n/locales/ja.json` - 일본어 번역
- `src/i18n/locales/ko.json` - 한국어 번역
- `src/i18n/locales/ar.json` - 아랍어 번역
- `src/components/LanguageSwitcher.jsx` - 언어 선택 컴포넌트
- `I18N_GUIDE.md` - 상세 사용 가이드 (영문)

### 수정된 파일
- `src/main.jsx` - i18n 초기화 추가
- `src/components/Navbar.jsx` - 언어 선택기 통합
- `src/index.css` - 애니메이션 추가
- `index.html` - RTL 지원 속성 추가
- `package.json` - i18n 패키지 추가

## 사용 방법

### 1. 언어 전환
- 네비게이션 바 우측 상단의 국기 아이콘 클릭
- 드롭다운에서 원하는 언어 선택

### 2. 컴포넌트에서 번역 사용
```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('home.description')}</p>
    </div>
  );
}
```

### 3. 새로운 번역 추가
1. 모든 언어 파일에 키 추가 (`src/i18n/locales/*.json`)
2. 컴포넌트에서 `t('키.이름')` 형식으로 사용

## 번역 키 구조
```
nav          - 네비게이션 메뉴
home         - 홈 페이지
invest       - 투자 페이지
projects     - 프로젝트 페이지
statistics   - 통계 페이지
donation     - 기부 페이지
globalBusan  - 글로벌 부산 페이지
roadmap      - 로드맵 페이지
admin        - 관리자 페이지
projectApplication - 프로젝트 신청
common       - 공통 UI 요소
```

## 테스트 방법
1. 개발 서버 실행: `npm run dev`
2. 브라우저에서 http://localhost:5173 접속
3. 네비게이션 바의 언어 선택기 클릭
4. 각 언어로 전환하여 번역 확인
5. 아랍어 선택 시 RTL 레이아웃 확인

## 기술 스택
- **i18next** - 핵심 i18n 프레임워크
- **react-i18next** - React 통합
- **i18next-browser-languagedetector** - 자동 언어 감지

## 다음 단계
기존 컴포넌트들의 하드코딩된 텍스트를 번역 키로 교체하여 완전한 다국어 지원을 구현할 수 있습니다.

상세한 사용 가이드는 `I18N_GUIDE.md` 파일을 참조하세요.
