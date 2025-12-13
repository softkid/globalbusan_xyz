# 이미지 최적화 가이드

이 문서는 Global BUSAN 프로젝트의 이미지 최적화 및 관리 방법을 안내합니다.

## 1. 필요한 이미지 파일

### 1.1 필수 이미지

- [ ] **로고**
  - `public/logo.png` (512x512px)
  - `public/logo192.png` (192x192px)
  - `public/logo512.png` (512x512px)
  - `public/favicon.ico` (32x32px)

- [ ] **Open Graph 이미지**
  - `public/og-image.jpg` (1200x630px)
  - 용도: 소셜 미디어 공유 시 표시되는 이미지

- [ ] **아이콘**
  - `public/favicon.svg` (SVG 형식, 모든 크기 지원)

### 1.2 선택적 이미지

- [ ] **히어로 섹션 배경 이미지**
- [ ] **프로젝트 썸네일 이미지**
- [ ] **파트너 로고 이미지**

## 2. 이미지 최적화 방법

### 2.1 이미지 형식 선택

- **PNG**: 로고, 아이콘, 투명 배경 필요 시
- **JPG**: 사진, 복잡한 이미지
- **WebP**: 최신 브라우저 지원, 최고 압축률
- **SVG**: 벡터 그래픽, 아이콘, 로고

### 2.2 이미지 크기 최적화

#### 로고
- 최대 크기: 512x512px
- 파일 크기: 50KB 이하 권장
- 형식: PNG 또는 SVG

#### Open Graph 이미지
- 크기: 1200x630px (1.91:1 비율)
- 파일 크기: 200KB 이하 권장
- 형식: JPG 또는 WebP

#### 아이콘
- 크기: 32x32px, 192x192px, 512x512px
- 파일 크기: 각 10KB 이하
- 형식: PNG 또는 ICO

### 2.3 이미지 압축 도구

#### 온라인 도구
- [TinyPNG](https://tinypng.com/) - PNG/JPG 압축
- [Squoosh](https://squoosh.app/) - 다양한 형식 변환 및 압축
- [ImageOptim](https://imageoptim.com/) - 이미지 최적화

#### 명령줄 도구
```bash
# ImageMagick 사용
magick input.jpg -quality 85 -resize 1200x630 output.jpg

# Sharp (Node.js)
npm install sharp
```

## 3. 이미지 생성 가이드

### 3.1 로고 디자인 요구사항

- **색상**: 파란색(#1e40af)과 보라색(#764ba2) 그라데이션
- **요소**: 지구본 아이콘 + "Global BUSAN" 텍스트
- **스타일**: 현대적, 미니멀, 전문적

### 3.2 Open Graph 이미지 디자인

- **크기**: 1200x630px
- **내용**: 
  - "Global BUSAN" 로고
  - "부산을 글로벌 비즈니스 허브로" 슬로건
  - 배경: 그라데이션 또는 부산 관련 이미지
- **텍스트**: 명확하고 읽기 쉬운 폰트
- **색상**: 브랜드 컬러 사용

### 3.3 디자인 도구

- **Figma** - 무료 디자인 도구
- **Canva** - 템플릿 기반 디자인
- **Adobe Photoshop/Illustrator** - 전문 디자인 도구

## 4. 이미지 사용 방법

### 4.1 LazyImage 컴포넌트 사용

```jsx
import LazyImage from '../components/LazyImage'

<LazyImage
  src="/images/hero-background.jpg"
  alt="Global BUSAN Hero Background"
  className="w-full h-full object-cover"
/>
```

### 4.2 일반 img 태그 (즉시 로드 필요 시)

```jsx
<img
  src="/logo.png"
  alt="Global BUSAN Logo"
  loading="eager"
  width="512"
  height="512"
/>
```

## 5. 이미지 파일 구조

```
public/
├── images/
│   ├── logo.png
│   ├── logo192.png
│   ├── logo512.png
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── og-image.jpg
│   ├── hero/
│   │   └── background.jpg
│   └── partners/
│       └── partner-logo-*.png
```

## 6. 이미지 최적화 체크리스트

- [ ] 모든 이미지가 적절한 크기로 최적화됨
- [ ] WebP 형식 사용 (지원 브라우저)
- [ ] Lazy loading 적용 (위치에 따라)
- [ ] Alt 텍스트 모든 이미지에 추가
- [ ] 반응형 이미지 (srcset) 사용
- [ ] 이미지 CDN 사용 (선택사항)

## 7. 이미지 생성 템플릿

### 7.1 로고 템플릿 (Figma)

1. 512x512px 캔버스 생성
2. 배경: 그라데이션 (파란색 → 보라색)
3. 중앙에 지구본 아이콘 배치
4. 하단에 "Global BUSAN" 텍스트
5. 내보내기: PNG (512px, 192px, 32px)

### 7.2 OG 이미지 템플릿

1. 1200x630px 캔버스 생성
2. 배경: 그라데이션 또는 부산 이미지
3. 로고 배치 (좌측 상단)
4. 슬로건 텍스트 (중앙 또는 우측)
5. 내보내기: JPG (품질 85%)

## 8. 이미지 CDN 설정 (선택사항)

### Cloudflare Images

1. Cloudflare Images 활성화
2. 이미지 업로드
3. 자동 최적화 및 변환
4. URL을 코드에 적용

### 예시

```jsx
const imageUrl = `https://imagedelivery.net/${accountHash}/${imageId}/public`
```

## 9. 접근성 고려사항

- 모든 이미지에 의미 있는 alt 텍스트 추가
- 장식용 이미지는 빈 alt="" 사용
- 복잡한 이미지는 추가 설명 제공
- 색상 대비 확인

## 10. 성능 모니터링

- Lighthouse 이미지 점수 확인
- 이미지 로딩 시간 모니터링
- Web Vitals LCP (Largest Contentful Paint) 확인

---

**마지막 업데이트**: 2025-12-13

