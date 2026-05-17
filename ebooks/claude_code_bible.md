# 📕 Claude Code 실전 바이블 2026
**Source:** https://aiaijungle.github.io/vibe-ebook/claude-code-bible.html
**Author:** 김화현 (AITF Director)
**Co-Authors:** 🧠 로드(Claude) & ⚡ 안티(Antigravity)

---

## 🤔 1강. Claude Code vs ChatGPT 차이점
* **ChatGPT:** 요리 레시피 검색기입니다. 레시피를 알려줄 테니 인간 보고 직접 식재료를 사고, 손질하고, 조리하라고 안내합니다.
* **Claude Code:** 나를 대신할 **수석 셰프**입니다. 냉장고(내 컴퓨터 하드디스크)를 직접 열고, 식재료(파일 소스)를 확인한 뒤 직접 조리를 하고, 먹음직스러운 밥상(완성된 프로그램 빌드)을 차립니다.

---

## 🔧 2강. 초고속 설치 및 로그인
```bash
# 1. 전역 CLI 설치 (Node.js v18 이상 필수)
npm install -g @anthropic-ai/claude-code

# 2. 실행 및 로그인 연동 (최초 실행 시 브라우저 OAuth 인증 진행)
claude
```

---

## 🔄 3강. 황금 워크플로우 (Golden Workflow)
Claude Code에게 분석 과정을 거치지 않은 채 대뜸 무턱대고 `"버그 고쳐줘"`라고 지시하면, 코드를 제대로 읽지 못해 가설로 고치며 오히려 코드를 망가뜨립니다. 반드시 아래 4단계 흐름을 습관화하십시오:

```
[Explore (탐색)] ──→ [Plan (계획)] ──→ [Code (구현)] ──→ [Commit (커밋)]
```

* **Step 1 (Explore):** `"특정 기능 파일이 어떻게 동작하는지 먼저 읽고 현재의 전체적 구조를 나에게 분석해서 보고해줘. 코드 수정은 하지 마."`
* **Step 2 (Plan):** `"이 기능을 넣으려는데 어떤 파일을 어떻게 바꿀 것인지 수정 계획을 먼저 알려줘. 내가 승인(OK)하면 코드 수정을 시작해."`
* **Step 3 (Code):** `"좋아, 진행해. 파일 하나씩 수정하고 잘 작동하는지 꼼꼼하게 빌드 검증을 돌려가며 확인해줘."`
* **Step 4 (Commit):** 변경이 정상 동작하면 깃에 안전하게 적립(Save Point)합니다.

---

## 📋 4강. CLAUDE.md — AI의 장기 기억 장치
Claude Code가 실행 시 디렉토리 최상단에서 가장 먼저 백그라운드로 스캔하여 행동 원칙과 프로젝트 환경을 이해하는 공식 뇌 장치입니다.

### 💻 CLAUDE.md 표준 템플릿
```markdown
# 프로젝트 규칙 - globalbusan-backend
## 프로젝트 스택
- Node.js / Hono / Cloudflare Workers
- Supabase (PostgreSQL)

## 코딩 규칙
- API 응답은 항상 TypedDict 또는 명확한 JSON 구조로 타입 명시
- 오류가 날 가능성이 있는 비동기 구간은 try-catch 로깅 후 전달

## ⛔ 금지 사항
- MASTER.env 파일에 절대 개인 키 하드코딩 직접 금지
- 강제 푸시(`git push -f`) 절대 금지

## 자주 쓰는 명령어
- 백엔드 스테이징 배포: `npx wrangler deploy`
- 백엔드 프로덕션 배포: `npx wrangler deploy --env production`
```

---

## 🔌 5강. MCP (Model Context Protocol)
* **MCP란:** Claude Code의 활동 범위를 컴퓨터 로컬 폴더 외부로 확장시키는 스마트 브릿지(손발)입니다.
* **설치 예시:** Supabase, GitHub, Playwright(브라우저 조작) 등을 등록하여 AI가 직접 외부 시스템 데이터를 읽고 조작하게 만듭니다.
```bash
claude mcp add supabase -- npx -y @supabase/mcp-server-supabase@latest --access-token sbp_XXXX --project-ref XXXX
```

---

## 🪝 6강. Hooks — 자동화의 극대화
Claude가 파일을 수정하거나, 툴을 사용하고 완료한 시점에 내가 정의한 특정 스크립트나 명령을 자동으로 실행하는 고성능 비서 트리거입니다.
* **적용 사례:** 
  1. **PostToolUse (Edit):** 파일이 수정된 즉시 `pytest` 또는 테스트 툴을 실행하여 수정한 코드가 시스템을 깨뜨렸는지 검증.
  2. **Stop:** 작업이 완전히 종료되면 Windows 콘솔에서 비프음(`beep(800,300)`)을 울리거나 텔레그램으로 완료 메시지를 전송.

---

## 🤖 7강. Subagents — AI 병렬 오케스트레이션
오케스트레이터(메인 AI)가 복잡한 지시를 받은 뒤, 이를 3개 이상의 하위 서브에이전트(Subagents)에 역할을 나눠주고 병렬로 분석(보안 스캔, 성능 분석, 테스트 커버리지 분석)하게 제어하는 분업 협업 패턴입니다.

---

## 🪟 Part F — Windows OS 한글 깨짐 방지 팁
국내 윈도우 환경의 터미널(PowerShell, CMD)에서 Claude Code를 사용할 때 출력 한글 깨짐 현상이 빈번하게 일어납니다. 터미널을 UTF-8로 고정하여 충돌을 피해야 합니다:

```powershell
# Windows PowerShell 한글 깨짐 방지 인코딩 강제 고정
$OutputEncoding = [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
```
