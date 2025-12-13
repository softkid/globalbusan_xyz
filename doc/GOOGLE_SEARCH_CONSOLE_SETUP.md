# Google Search Console 설정 가이드

이 문서는 Global BUSAN 웹사이트를 Google Search Console에 등록하는 방법을 안내합니다.

## 1. Google Search Console 접속

1. [Google Search Console](https://search.google.com/search-console)에 접속
2. Google 계정으로 로그인

## 2. 속성 추가

### 방법 1: 도메인 속성 (권장)

1. "속성 추가" 클릭
2. "도메인" 선택
3. `globalbusan.xyz` 입력
4. "계속" 클릭

### 방법 2: URL 접두어 속성

1. "속성 추가" 클릭
2. "URL 접두어" 선택
3. `https://globalbusan.xyz` 입력
4. "계속" 클릭

## 3. 소유권 확인

### 방법 1: HTML 파일 업로드 (권장)

1. Google Search Console에서 제공하는 HTML 파일 다운로드
2. 파일 이름을 확인 (예: `google1234567890abcdef.html`)
3. `public/google-site-verification.html` 파일을 다운로드한 파일로 교체
4. GitHub에 커밋 및 푸시
5. 배포 완료 후 Google Search Console에서 "확인" 클릭

### 방법 2: HTML 태그

1. Google Search Console에서 제공하는 메타 태그 복사
   - 예: `<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />`
2. `index.html` 파일의 `<head>` 섹션에 추가
3. GitHub에 커밋 및 푸시
4. 배포 완료 후 Google Search Console에서 "확인" 클릭

### 방법 3: DNS 레코드

1. Google Search Console에서 제공하는 TXT 레코드 복사
2. 도메인 등록 기관에서 DNS 설정에 TXT 레코드 추가
3. DNS 전파 완료 후 Google Search Console에서 "확인" 클릭

## 4. 사이트맵 제출

1. Google Search Console 대시보드에서 "사이트맵" 메뉴 선택
2. "새 사이트맵 추가" 클릭
3. `https://globalbusan.xyz/sitemap.xml` 입력
4. "제출" 클릭

## 5. robots.txt 확인

1. Google Search Console에서 "robots.txt 테스터" 사용
2. `https://globalbusan.xyz/robots.txt` 확인
3. 문제가 있으면 수정 후 재확인

## 6. 색인 요청 (선택사항)

1. "URL 검사" 도구 사용
2. 중요한 페이지 URL 입력
3. "색인 생성 요청" 클릭

## 7. 성능 모니터링

### Core Web Vitals 확인

1. "성능" 메뉴에서 Core Web Vitals 확인
2. LCP (Largest Contentful Paint)
3. FID (First Input Delay)
4. CLS (Cumulative Layout Shift)

### 모바일 사용성 확인

1. "모바일 사용성" 메뉴 확인
2. 모바일 친화적 문제 해결

## 8. 검색 성능 분석

1. "성능" 메뉴에서 검색 결과 분석
2. 클릭률(CTR) 확인
3. 평균 위치 확인
4. 노출 수 확인

## 9. 보안 문제 모니터링

1. "보안 문제" 메뉴 확인
2. 해킹 또는 악성 코드 감지 시 즉시 조치

## 10. 유지보수

### 정기 확인 사항

- 주 1회: 검색 성능 확인
- 월 1회: 색인 커버리지 확인
- 분기 1회: 사이트맵 업데이트

### 알림 설정

1. Google Search Console 설정에서 이메일 알림 활성화
2. 중요 알림 수신 설정

## 문제 해결

### 색인이 생성되지 않는 경우

1. robots.txt 확인
2. 사이트맵 유효성 확인
3. 페이지가 noindex로 설정되지 않았는지 확인
4. 사이트 접근 가능 여부 확인

### 색인 생성 속도가 느린 경우

1. 사이트맵 제출 확인
2. 내부 링크 구조 확인
3. 페이지 로딩 속도 최적화

## 참고 자료

- [Google Search Console 도움말](https://support.google.com/webmasters)
- [사이트맵 가이드](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [robots.txt 가이드](https://developers.google.com/search/docs/crawling-indexing/robots/intro)

---

**마지막 업데이트**: 2025-12-13

