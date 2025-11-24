# Google OAuth 설정 가이드

## 문제 해결: redirect_uri_mismatch 오류

Google OAuth 로그인 시 `redirect_uri_mismatch` 오류가 발생하는 경우, Google Cloud Console에서 JavaScript 출처와 리디렉션 URI를 등록해야 합니다.

## 설정 단계

### 1. Google Cloud Console 접속
1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 프로젝트 선택 (또는 새 프로젝트 생성)

### 2. OAuth 동의 화면 설정
1. 좌측 메뉴에서 **APIs & Services** > **OAuth consent screen** 선택
2. User Type 선택 (외부 또는 내부)
3. 필수 정보 입력 후 저장

### 3. OAuth 클라이언트 ID 설정
1. 좌측 메뉴에서 **APIs & Services** > **Credentials** 선택
2. 기존 OAuth 2.0 클라이언트 ID 선택하거나 새로 생성
   - 클라이언트 ID: `299500936836-elk8daqqn64np59q473u66lt9ud0u7cj.apps.googleusercontent.com`
   - 클라이언트 유형: **웹 애플리케이션** 선택

### 4. 승인된 JavaScript 출처 추가
**Authorized JavaScript origins** 섹션에 다음을 추가:
```
http://localhost:5173
http://localhost:3000
https://your-production-domain.com
```

### 5. 승인된 리디렉션 URI 추가
**Authorized redirect URIs** 섹션에 다음을 추가:
```
http://localhost:5173
http://localhost:3000
https://your-production-domain.com
```

### 6. 설정 저장
- 모든 변경사항 저장 후 5-10분 대기 (설정 반영 시간)

## 현재 앱 설정

### 개발 환경 (Vite)
- 기본 포트: `5173`
- JavaScript 출처: `http://localhost:5173`
- 리디렉션 URI: `http://localhost:5173`

### 프로덕션 환경
배포 도메인에 맞춰 추가 설정 필요

## 빠른 설정 체크리스트

- [ ] OAuth 동의 화면 구성 완료
- [ ] OAuth 클라이언트 ID 생성 또는 선택
- [ ] JavaScript 출처에 `http://localhost:5173` 추가
- [ ] 리디렉션 URI에 `http://localhost:5173` 추가 (선택사항 - @react-oauth/google은 자동 처리)
- [ ] 설정 저장 후 5-10분 대기
- [ ] 브라우저 캐시 삭제 후 다시 시도

## 주의사항

**@react-oauth/google 패키지 사용 시:**
- 리디렉션 URI는 자동으로 처리되므로 **JavaScript 출처만 등록하면 됩니다**
- 하지만 안전을 위해 리디렉션 URI도 추가하는 것을 권장합니다

## 참고사항

1. **로컬 개발**: `http://localhost:5173` 반드시 추가
2. **프로덕션**: 실제 배포 도메인 추가 필요
3. **설정 반영 시간**: 최대 10분 소요될 수 있음
4. **보안**: 프로덕션에서는 HTTPS 필수

## 문제 해결

### 여전히 오류가 발생하는 경우:
1. Google Cloud Console에서 설정이 올바른지 다시 확인
2. 브라우저 캐시 및 쿠키 삭제
3. 시크릿 모드에서 테스트
4. 개발자 도구 콘솔에서 정확한 오류 메시지 확인

