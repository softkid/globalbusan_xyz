# ⚡ 바이브코딩 4권 — Claude Code 바이블
**Source:** https://aiaijungle.github.io/vibe-ebook/claude-code-bible.html

---

📚 AI사냥꾼 시리즈[📘 1권 바이브코딩 입문](book1.html)[📗 2권 바이브코딩바이블](index.html)[🤖 3권 에이전트 바이블](agent-bible.html)⚡ 4권 Claude Code 바이블 ✓❮AITF · 2026 EDITION

# Claude Code바이블

터미널 한 줄로 개발팀 한 명을 고용하는 법
실전 경험 기반JANDA 실전 경험퀴즈 & 코드 포함저자김화현공동저자로드 (Claude Sonnet)"솔직히 말할게. 나도 처음엔 그냥 ChatGPT랑 뭐가 다른가 했다.써보고 나서야 알았다. 차원이 다르다는 걸."— 김화현, Claude Code 사용 6개월 후전체 커리큘럼 **1강** Claude Code가 뭔데? (ChatGPT와 뭐가 달라) **2강** 설치 & 첫 대화 (10분 완성) **3강** 황금 워크플로우 (Explore→Plan→Code→Commit) **4강** CLAUDE.md — AI에게 뇌를 심어라 **5강** MCP 서버 — 슈퍼파워 장착 **6강** Hooks — 자동화의 끝판왕 **7강** Subagents — AI 팀 구성 **8강** API 직접 연동 — 봇 만들기 **9강** JANDA AGI 구축 실제 사례 **10강** 다음 단계 & AI사냥꾼Level 1 · 입문 — 1강

## Claude Code가 뭔데?ChatGPT랑 뭐가 달라

제일 많이 받는 질문이다. 이 강에서 단번에 정리한다. 비유 하나면 충분하다.
개념 이해학습 목표 포함

> [!TIP]
> **🎯 이 강의 학습 목표**
> ① Claude Code가 기존 AI 채팅과 *근본적으로* 다른 이유를 설명할 수 있다② "에이전트"의 의미를 비개발자에게도 쉽게 설명할 수 있다③ Claude Code로 할 수 있는 것과 할 수 없는 것을 구분한다

## 비유 하나로 전부 설명한다

ChatGPT에게 코드를 물어보는 건 *요리 레시피 검색* 이다. 레시피를 알려주면 내가 직접 재료 사고, 요리하고, 설거지까지 해야 한다.

Claude Code는 다르다. 이건 *셰프를 고용한 것* 이다. "오늘 저녁 파스타 만들어줘"라고 하면 셰프가 냉장고 열어보고, 재료 파악하고, 요리하고, 상까지 차려준다. 내가 할 일은 "맛있네, 조금 짜다"라고 피드백하는 것뿐이다.
처음 Claude Code를 접했을 때 반신반의했다. "ChatGPT도 코드 잘 짜는데, 뭐가 달라?" 그래서 테스트했다. 파이썬 파일 50개짜리 프로젝트를 주고 "버그 찾아줘"라고 했다.ChatGPT: "어떤 파일인지 붙여넣어 주세요."Claude Code: (실제로 폴더 뒤지고 30초 뒤) "app.py 127번째 줄에서 None 타입 오류 날 것 같아요. 고칠까요?"그냥 고쳤다. 진짜로.

## 핵심 차이 — 4가지

구분ChatGPT / Claude.ai 웹Claude Code CLI파일 접근붙여넣기만 가능직접 읽고 쓰고 실행기억대화 끝나면 리셋CLAUDE.md로 영구 기억행동답변 생성계획 → 실행 → 검증확장없음MCP로 DB·GitHub 직접 제어
결정적인 차이는 **파일 시스템 직접 접근** 이다. Claude Code는 당신 컴퓨터의 폴더를 직접 열고, 파일을 읽고, 수정하고, 터미널 명령어를 실행한다. AI가 개발자처럼 일하는 게 아니라, AI가 실제로 개발자처럼 일한다.

## 에이전트가 뭔가요

요즘 "AI 에이전트"라는 말이 많이 나온다. 쉽게 말하면 이렇다.

> [!IMPORTANT]
> **🔑 에이전트 정의**
> **일반 AI:** 질문 → 답변. 끝. **에이전트:** 목표 → 계획 → 도구 사용 → 결과 확인 → 수정 → 완료에이전트는 *결과가 나올 때까지 스스로 루프를 돈다.* 한 번 지시하면 알아서 한다.

Claude Code는 코딩 에이전트다. "이 API에 유닛 테스트 추가해줘"라고 하면, 코드 읽고, 테스트 작성하고, 실행해서 통과하는지 확인하고, 실패하면 고치는 과정을 알아서 반복한다.

## 할 수 있는 것 vs 못 하는 것

> [!TIP]
> **✅ Claude Code가 잘하는 것**
> 코드 버그 찾기 & 수정 / 새 기능 구현 / 리팩터링 / 문서화 / 테스트 작성기존 코드 구조 파악 / 에러 원인 분석 / SQL 쿼리 최적화git commit 메시지 작성 / PR 설명 초안 생성

❌ Claude Code가 못 하는 것실시간 인터넷 정보 조회 (MCP 없이) / 비공개 내부 DB 접근 (MCP 없이)GUI 앱 직접 조작 (Playwright MCP 없이) / 무한정 자율 실행 (확인 요청함)🧪 강의 확인 퀴즈 1Claude Code와 ChatGPT의 가장 핵심적인 차이는 무엇인가요?A. Claude Code가 더 영리한 AI다B. Claude Code는 한국어를 더 잘한다C. Claude Code는 파일 시스템에 직접 접근해서 실행까지 한다D. Claude Code는 무료다Level 1 · 입문 — 2강

## 설치 & 첫 대화10분 완성 가이드

복잡하게 생각하지 마라. Node.js 설치하고 명령어 하나 치면 끝이다.
직접 따라하기Windows · Mac 모두 OK

> [!TIP]
> **🎯 이 강의 학습 목표**
> ① Claude Code를 내 컴퓨터에 설치하고 로그인한다② 실제 프로젝트 폴더에서 첫 번째 대화를 완성한다③ 기본 명령어 5개를 외운다

## 사전 준비 (5분)

필요한 것 3가지1Node.js 18 이상 설치nodejs.org → LTS 버전 다운로드 → 설치. 이미 있으면node --version으로 버전 확인.2Anthropic 계정claude.ai 가입. Pro 플랜($20/월) 추천. 무료 플랜은 사용량 제한 있음.3터미널 준비Windows: PowerShell 또는 Windows Terminal. Mac: Terminal 또는 iTerm2.

## 설치 (1분)

터미널에 그대로 붙여넣기

```bash
npm install -g @anthropic-ai/claude-code
```

## 로그인 (2분)

터미널

```python
claude
```

처음 실행하면 브라우저가 열린다. Anthropic 계정으로 로그인하고 "허용" 버튼 누르면 끝. 토큰이 내 컴퓨터에 저장된다.
처음에 API 키를 환경변수로 설정하고 삽질했다. 알고 보니 claude.ai Pro 계정이 있으면 그냥 OAuth 로그인으로 쓸 수 있었다. API 키는 직접 API를 코드에서 호출할 때만 필요한 거였다.

## 첫 대화 (2분)

내 프로젝트 폴더로 이동 후

```python
cd 내-프로젝트-폴더
claude
```

이게 전부다. Claude Code가 현재 폴더를 자동으로 읽고 대화 모드로 진입한다.
첫 번째 해볼 것

```python
이 폴더 구조를 파악하고 어떤 프로젝트인지 설명해줘.
```

Claude가 실제로 파일들을 열어보고 설명한다. 마법처럼 느껴지는 첫 순간이다.

## 꼭 외울 명령어 5개

명령어역할/clear대화 컨텍스트 초기화 (새 작업 시작 전)/help사용 가능한 명령어 전체 목록/context현재 컨텍스트 윈도우 사용량 확인Ctrl+CClaude 응답 즉시 중단Shift+Enter줄바꿈 (Enter는 전송)🧪 강의 확인 퀴즈 2Claude Code를 특정 프로젝트에서 실행하려면 어떻게 해야 하나요?A. claude 뒤에 폴더 경로를 인자로 준다B. 해당 폴더로 cd한 다음 claude를 실행한다C. Claude.ai 웹사이트에서 폴더를 업로드한다D. VS Code를 반드시 먼저 설치해야 한다Level 1 · 입문 — 3강

## 황금 워크플로우Explore → Plan → Code → Commit

Claude Code를 쓰는 올바른 순서. 이 순서를 무시하면 90%가 실패한다. 우리가 직접 증명했다.
핵심 패턴실전 예제

> [!TIP]
> **🎯 이 강의 학습 목표**
> ① 4단계 워크플로우를 외우고 순서대로 실행한다② "탐색 → 계획 확인 → 구현 → 검증"의 이유를 설명한다③ Plan 모드를 언제 쓰는지 안다

> *"Claude Code한테 바로 코딩 시키면 왜 이상한 게 나오냐고? 셰프한테 뭘 원하는지도 말 안 하고 '요리해'라고 하는 거랑 같다."*

## 왜 순서가 중요한가

처음 Claude Code를 쓸 때 저지르는 실수 1위: "버그 고쳐줘"라고 바로 시킨다. 그러면 Claude가 코드를 뜯어보지도 않고 추측으로 고친다. 틀린다. 다시 고친다. 더 망가진다.
시황 AGI 초기 개발 때 이런 일이 있었다. Claude Code에게 "데이터 파이프라인 최적화해줘"라고 했더니, 코드를 제대로 파악하지 않은 채 그냥 수정했다. 관련 없는 파일까지 건드려서 멀쩡했던 모듈이 고장 났다. 1시간 복구했다.그 후로 절대로 바로 수정 안 시킨다. **반드시 탐색 먼저.** 

## 4단계 황금 워크플로우

올바른 Claude Code 워크플로우1Explore — 탐색 (코드 건드리지 마)관련 파일들을 읽고, 구조를 파악하고, 현재 상태를 설명하게 한다. 이 단계에서 Claude는 파일을 수정하면 안 된다.2Plan — 계획 확인 (내가 승인해야 다음 단계)"어떤 파일을 어떻게 바꿀 거야?"를 먼저 묻는다. Claude가 계획을 설명하면 내가 확인 후 진행 지시.3Code — 구현 (각 변경 후 즉시 검증)계획대로 파일을 수정. 각 주요 변경 후에 테스트 또는 실행으로 즉시 확인.4Commit — 완료 (git commit까지 Claude가)테스트 통과 확인 후 git commit. 커밋 메시지도 Claude가 Conventional Commits 형식으로 작성.

## 실제 프롬프트 — 복붙해서 써라

### Step 1: 탐색 프롬프트

이걸 먼저 쳐라

```python
[파일명 또는 기능명]이 어떻게 동작하는지 파악해줘.
관련 파일들 읽어보고 현재 구조 설명해줘.
지금은 코드 건드리지 마, 분석만.
```

### Step 2: 계획 확인 프롬프트

탐색 끝나면

```python
[원하는 변경사항] 구현하려면 어떻게 할 거야?
어떤 파일을 어떻게 바꿀 건지 계획 먼저 알려줘.
코드 수정은 내가 OK 하면 시작해.
```

### Step 3: 구현 프롬프트

계획 확인 후

```python
OK, 진행해. [파일명]부터 시작해.
각 파일 수정 후에 잘 돌아가는지 확인하면서 해줘.
```

## /plan 모드 — 더 안전하게

복잡한 작업에는/plan모드를 쓴다. 이 모드에서 Claude는 파일을 수정할 수 없다. 계획만 세울 수 있다.
터미널

```python
/plan
# 이제 Claude는 읽기만 가능, 수정 불가
# "좋아, 시작해" 하면 일반 모드로 전환
```

🧪 강의 확인 퀴즈 3새로운 기능을 Claude Code로 구현할 때 첫 번째로 해야 할 것은?A. 바로 "구현해줘"라고 지시한다B. 기존 코드를 전부 복사해서 붙여넣는다C. 관련 코드 탐색을 시키고 현재 구조를 파악한다D. git commit을 먼저 한다Level 2 · 핵심 — 4강

## CLAUDE.md — AI에게 뇌를 심어라

Claude는 기본적으로 기억이 없다. 매 세션마다 처음 만나는 사람이다. CLAUDE.md가 그 기억을 만든다.
영구 컨텍스트실전 템플릿 제공

> [!TIP]
> **🎯 이 강의 학습 목표**
> ① CLAUDE.md의 역할과 위치를 이해한다② 내 프로젝트에 맞는 CLAUDE.md를 직접 작성한다③ 다중 CLAUDE.md 배치 전략을 이해한다

> *"CLAUDE.md 없이 Claude Code 쓰는 건, 직원을 고용했는데 회사 설명은 안 해주는 것과 같다. 매번 처음부터 설명해야 한다."*

## CLAUDE.md가 뭔가

Claude Code가 시작할 때 가장 먼저 찾는 파일이 CLAUDE.md다. 여기에 쓰인 내용은 매 세션마다 자동으로 읽힌다. 한 번 써두면 다시 설명할 필요가 없다.
CLAUDE.md 없이 개발하던 초기. 매 세션마다 "이 프로젝트는 FastAPI고, 포트는 8766이고, MASTER.env에 키가 있고, 한국어 경로 때문에 인코딩 주의해야 하고..."를 반복했다. 어느 날 세어보니 매 세션 준비에 5분씩 썼다. 한 달이면 2시간 반이다. CLAUDE.md 쓰는 데 30분 투자해서 2시간 반을 아꼈다.

## CLAUDE.md 황금 템플릿

내 프로젝트 루트에 이 파일 만들기

```python
# 프로젝트명 — Claude 행동 지침

## 프로젝트 개요
- **목적**: [한 줄로 설명]
- **스택**: Python 3.11 / FastAPI / PostgreSQL
- **포트**: 8766 (로컬), Render 배포

## 폴더 구조 핵심
- `api_server/` — 백엔드
- `frontend/` — React SPA
- `MASTER.env` — 환경변수 (절대 커밋 금지!)

## 코딩 규칙
- 주석보다 명확한 함수명 우선
- try/except 있으면 반드시 로깅
- 새 기능 전에 기존 테스트 먼저 통과 확인

## ⛔ 금지 사항 (Claude 필독)
- git push --force 절대 금지
- .env 파일 내용 출력 금지
- rm -rf 실행 전 반드시 확인 요청

## 자주 쓰는 명령어
- 서버 시작: `python local_agent_server.py`
- 테스트: `pytest tests/ -v`
- 보안 체크: `python git_security_check.py`

## 과거 실수 — 똑같은 실수 금지
- [2026-05] 한국어 경로 subprocess 인코딩 오류
 → 해결: PYTHONUTF8=1 항상 설정
- [2026-05] MCP 204 빈 응답 파싱 오류
 → 해결: content 길이 먼저 체크
```

## CLAUDE.md 배치 전략

> [!IMPORTANT]
> **📁 어디에 둘까**
> **루트 CLAUDE.md** — 프로젝트 전체 규칙. 항상 로드됨. **하위 폴더 CLAUDE.md** — 해당 폴더 특화 규칙. 그 폴더 작업할 때 추가 로드.예:api_server/CLAUDE.md에 "이 폴더는 FastAPI 전용" 규칙 따로 관리 **~/.claude/CLAUDE.md** — 내 모든 프로젝트에 공통 적용. 개인 스타일 정의.

⚠️ CLAUDE.md에 절대 쓰면 안 되는 것실제 API 키, 비밀번호, OAuth 토큰.CLAUDE.md는 git에 올라가는 파일이다. 키가 노출되면 답 없다.키는 항상os.getenv("API_KEY")로 환경변수에서 가져와라.🧪 강의 확인 퀴즈 4CLAUDE.md에 대한 설명 중 틀린 것은?A. Claude Code 시작 시 자동으로 읽힌다B. 하위 폴더에도 별도 CLAUDE.md를 둘 수 있다C. API 키를 여기에 저장해두면 Claude가 자동으로 쓴다D. 코딩 규칙, 금지 사항, 자주 쓰는 명령어를 적는다Level 2 · 핵심 — 5강

## MCP — 슈퍼파워 장착

MCP가 없으면 Claude Code는 코드 폴더 안에만 갇혀 있다. MCP를 달면 DB, GitHub, 브라우저까지 Claude의 손이 된다.
MCP 완전 이해Supabase · GitHub · Playwright

> [!TIP]
> **🎯 이 강의 학습 목표**
> ① MCP가 뭔지, 어떻게 작동하는지 설명한다② Supabase, GitHub MCP 중 1개를 직접 연결한다③ MCP로 가능해지는 것들을 3가지 이상 말한다

## MCP란 뭐냐

Model Context Protocol. 복잡하게 생각할 것 없다. 한 줄 요약:

> [!IMPORTANT]
> **🔌 MCP 한 줄 정의**
> **Claude에게 외부 서비스를 도구로 연결하는 표준 방법이다.** MCP 없이: Claude는 내 코드 폴더 안에서만 일한다MCP 있으면: Claude가 직접 DB 쿼리하고, GitHub에 PR 올리고, 브라우저 조작한다

Supabase MCP 달고 처음으로 "지난 7일 신규 가입자 수 알려줘"라고 했다. Claude가 직접 SQL 짜서 Supabase에 날리고 결과 가져왔다. 내가 한 건 질문 하나뿐이다. 그 순간 진짜 무서워졌다. 좋은 의미로.

## MCP 설치 — 명령어 하나로

터미널 — Supabase MCP 추가

```bash
claude mcp add supabase -- npx -y @supabase/mcp-server-supabase@latest \
 --access-token 내_Supabase_토큰 \
 --project-ref 내_프로젝트_ref
```

터미널 — GitHub MCP 추가

```bash
claude mcp add github -- npx @modelcontextprotocol/server-github \
 --token 내_GitHub_토큰
```

설치된 MCP 확인

```bash
claude mcp list
```

## 주요 MCP 서버 목록

서버주요 기능 **Supabase** PostgreSQL 쿼리, 마이그레이션, Edge Function 배포 **GitHub** PR 생성, 이슈 조회, 코드 검색, 브랜치 관리 **Playwright** 실제 브라우저 조작, 스크린샷, 스크래핑 **Figma** 디자인 읽기, Code Connect, 목업 자동 생성 **Context7** 최신 라이브러리 공식 문서 실시간 조회 **Linear** 이슈 생성, 스프린트 관리, 작업 추적

## 설정 파일로 관리하는 법

~/.claude/settings.json

```json
{
 "mcpServers": {
 "supabase": {
 "command": "npx",
 "args": [
 "-y",
 "@supabase/mcp-server-supabase@latest",
 "--access-token", "sbp_XXXXXXXXXX",
 "--project-ref", "XXXXXXXXXX"
 ]
 },
 "playwright": {
 "command": "npx",
 "args": ["-y", "@modelcontextprotocol/server-playwright"]
 }
 }
}
```

⚠️ 주의 — 설정 파일 위치 & 토큰 보안MCP 서버 설정은~/.claude.json파일의mcpServers키에 저장한다 (프로젝트 레벨은.mcp.json).Hooks 설정은~/.claude/settings.json에 저장한다. 두 파일이 다르니 주의.토큰 값이 들어가는 파일은 절대 git에 올리지 마라.환경변수로 대체하는 방법도 있다 — Anthropic 공식 문서 참고.∞🧠 변화를 적응하는 인간인류는 언제나 변화에 적응해왔습니다.불을 피우고, 문자를 만들고, 인쇄기를 발명하고, 인터넷을 연결했습니다.그리고 지금 —AI가 왔습니다.변화가 올 때마다 두 종류의 사람이 있었습니다. **"이걸 어떻게 쓰지?"** 라고 물은 사람,그리고 *"이건 나와 상관없어"* 라고 돌아선 사람.인쇄기가 등장했을 때 필경사들은 일자리를 잃었지만,책을 읽을 줄 아는 사람들은 그 어느 때보다 더 강해졌습니다.인터넷이 왔을 때 오프라인 가게들은 무너졌지만,검색을 배운 사람들은 세상 전체를 책상 위에 올렸습니다.AI는 당신을 대체하지 않습니다.AI는 당신이 이미 가진 것을 **10배로 확장** 합니다.변화를 두려워하지 마세요.당신은 이미, 수백만 년 동안 변화에 적응해온 종(種)의 후손입니다. **그것이 인간의 본질이고, 당신의 본능입니다.** Level 2 · 핵심 — 6강

## Hooks — 자동화의 끝판왕

Claude가 뭔가를 할 때마다 자동으로 실행되는 셸 명령어. 이걸 쓰면 진짜 자동화가 된다.
자동화 심화복붙 레시피 5개

> [!TIP]
> **🎯 이 강의 학습 목표**
> ① Hooks의 5가지 이벤트 타입을 안다② settings.json에서 Hook을 직접 설정한다③ 실전에서 쓸 수 있는 Hook 레시피 2개 이상 적용한다

## Hooks가 뭔가

Claude가 파일을 수정할 때, Bash 명령어를 실행할 때, 응답을 완료할 때 — 이 시점에 내가 원하는 셸 명령어를 자동으로 실행할 수 있다. 이게 Hooks다.
파일 수정 후 자동으로 테스트가 돌아가게 했다. Claude가 뭔가 고치면 1초 뒤에 테스트 결과가 터미널에 뜬다. 깨진 게 있으면 Claude가 바로 안다. 내가 "테스트 돌려봐" 안 해도 된다. 이게 진짜 자동화다.

## Hook 이벤트 5가지

이벤트언제 실행되나활용PreToolUse도구 실행 직전위험 명령어 차단, 로그 기록PostToolUse도구 실행 직후테스트 자동 실행, 린트 체크Notification알림 발생 시Slack/텔레그램 전송StopClaude 응답 완료소리 알림, 자동 커밋SubagentStop하위 에이전트 완료파이프라인 다음 단계 트리거

## 설정 방법

~/.claude/settings.json

```json
{
 "hooks": {
 "PostToolUse": [
 {
 "matcher": "Edit",
 "hooks": [
 {
 "type": "command",
 "command": "pytest tests/ -x -q 2>&1 | tail -8"
 }
 ]
 }
 ],
 "Stop": [
 {
 "matcher": "*",
 "hooks": [
 {
 "type": "command",
 "command": "powershell -c \"[console]::beep(880, 400)\""
 }
 ]
 }
 ]
 }
}
```

## 복붙 레시피 5개

### ① 파일 수정 후 자동 테스트

PostToolUse → Edit

```python
"command": "python -m pytest tests/ -x -q 2>&1 | tail -5"
```

### ② 작업 완료 시 소리 알림 (Windows)

Stop

```python
"command": "powershell -c \"[console]::beep(800,300)\""
```

### ③ 텔레그램 알림 전송

Stop

```python
"command": "python /tools/telegram_notify.py \"Claude 작업 완료!\""
```

### ④ rm -rf 차단 (PreToolUse)

PreToolUse → Bash, 보안 스크립트가 종료코드 2 반환 시 차단

```python
"command": "python /tools/bash_safety_check.py"
```

### ⑤ 파일 수정 후 git auto-stage

PostToolUse → Edit

```python
"command": "git add -u"
```

> [!TIP]
> **💡 Hook 실전 원칙**
> Hook 명령어는 **10초 이내** 에 끝나야 한다.오래 걸리는 작업은 백그라운드(&)로 빼거나 별도 파이프라인에서 처리.PreToolUse에서 종료코드 2를 반환하면 해당 Claude 동작이 차단된다.

Level 3 · 고급 — 7강

## Subagents — AI 팀 구성

Claude 혼자보다 Claude 여럿이 훨씬 강하다. 오케스트레이터가 팀을 지휘하면 작업이 병렬로 돌아간다.
멀티에이전트병렬 처리 패턴Agent SDK

> [!TIP]
> **🎯 이 강의 학습 목표**
> ① 오케스트레이터 - 서브에이전트 관계를 이해한다② Claude Code에서 병렬 처리 프롬프트를 쓸 수 있다③ Agent SDK의 존재와 기본 패턴을 안다

> *"시황 AGI의 26라운드 루프를 Claude 하나가 처리하면 몇 시간이 걸린다. 멀티에이전트로 병렬화하니까 1시간 안에 끝난다."*

## 오케스트레이터 패턴

Claude A (오케스트레이터)가 전체 목표를 이해하고 작업을 나눠서 여러 Claude B, C, D에게 위임한다. 각 서브에이전트는 독립된 컨텍스트에서 자기 일만 한다. 다 끝나면 오케스트레이터가 결과를 종합한다.

> [!TIP]
> **🤖 에이전트 계층 구조**
> **오케스트레이터** — 목표 이해 → 작업 분해 → 위임 → 결과 종합 **서브에이전트 A** — 프론트엔드 코드 리뷰 **서브에이전트 B** — 백엔드 보안 검토 **서브에이전트 C** — DB 쿼리 최적화각 에이전트는 *격리된 컨텍스트* 에서 실행 → 메인 컨텍스트 오염 없음

## Claude Code에서 병렬 작업 시키는 법

오케스트레이터 프롬프트 예시

```python
다음 3가지를 병렬로 처리해줘:
1. api_server/ 보안 취약점 검토 (에이전트 1)
2. frontend/ 성능 최적화 포인트 분석 (에이전트 2)
3. tests/ 커버리지 분석 (에이전트 3)

각각 독립적으로 분석하고, 끝나면 종합 보고서 만들어줘.
```

## Agent SDK — 코드로 팀 구성

Anthropic Agent SDK를 쓰면 멀티에이전트 시스템을 코드로 만들 수 있다. 이게 JANDA 시황 AGI의 핵심이다.
Python — Agent SDK 순차 파이프라인 패턴 (진단 → 개선)

```python
import anthropic

client = anthropic.Anthropic()

# 순차 파이프라인: 진단 결과를 다음 에이전트에 넘긴다
def run_pipeline(task: str):
 # 에이전트 1: 코드 리뷰 (Haiku — 빠르고 저렴)
 review = client.messages.create(
 model="claude-haiku-4-5-20251001",
 max_tokens=1024,
 system="코드 리뷰 전문가. 버그와 보안 취약점만 찾아.",
 messages=[{"role": "user", "content": task}]
 )

 # 에이전트 2: 리뷰 결과 받아서 개선안 작성 (Sonnet)
 solution = client.messages.create(
 model="claude-sonnet-4-6",
 max_tokens=2048,
 system="개선안 작성 전문가. 구체적 코드 제시.",
 messages=[
 {"role": "user", "content": task},
 {"role": "assistant", "content": review.content[0].text},
 {"role": "user", "content": "위 리뷰를 바탕으로 개선된 코드를 작성해줘"}
 ]
 )
 return solution.content[0].text

# ── 독립 작업을 실제로 병렬 실행하려면 asyncio 사용 ──
import asyncio, anthropic

async def run_parallel(tasks: list[str]):
 client = anthropic.AsyncAnthropic()
 async def call(t):
 r = await client.messages.create(
 model="claude-haiku-4-5-20251001", max_tokens=512,
 messages=[{"role": "user", "content": t}]
 )
 return r.content[0].text
 return await asyncio.gather(*[call(t) for t in tasks])
```

시황 AGI에서 자가코딩 루프를 만들 때 이 패턴을 썼다. "진단 에이전트 → 패치 에이전트 → 검증 에이전트"로 파이프라인을 구성했다. 진단이 끝나야 패치가 시작되고, 패치 후 반드시 검증이 돌아간다. 검증 실패하면 자동 롤백. 이게 매일 밤 혼자 돌아간다.Level 3 · 고급 — 8강

## API로 직접 연동하기봇과 SaaS 만들기

CLI를 넘어서, 내 앱 안에 Claude를 넣는 법. 텔레그램 봇부터 SaaS 제품까지.
API 개발Python 예제

> [!TIP]
> **🎯 이 강의 학습 목표**
> ① Anthropic Python SDK로 메시지를 보내고 받는다② 모델별 용도와 비용 차이를 이해한다③ Tool Use (함수 호출) 패턴의 구조를 안다

## SDK 설치

터미널

```python
pip install anthropic python-dotenv
```

## 기본 메시지 전송

Python

```json
import anthropic
import os
from dotenv import load_dotenv

load_dotenv("MASTER.env")

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

response = client.messages.create(
 model="claude-sonnet-4-6", # 기본 모델
 max_tokens=1024,
 system="한국어로만 답해.",
 messages=[
 {"role": "user", "content": "오늘 블로그 제목 3개 만들어줘. JSON 배열로."}
 ]
)

print(response.content[0].text)
```

## 모델 선택 — 언제 뭘 쓸까

모델언제 쓰나비용claude-haiku-4-5-20251001분류, 스코어링, 짧은 응답, 고속 처리가장 저렴claude-sonnet-4-6일반 개발, 분석, 긴 응답 (기본값)중간claude-opus-4-7전략적 판단, 복잡한 추론가장 비쌈💰 토큰 절약 원칙 (JANDA 운영 기준)대부분 Sonnet 4.6 고정. Haiku는 스코어링·분류·짧은 응답 전용.Opus 4.7은 월 예산 고려해서 꼭 필요할 때만. "더 좋은 답변"을 위해 쓰면 안 됨.

## 스트리밍 응답

Python — 글자가 실시간으로 출력됨

```json
with client.messages.stream(
 model="claude-sonnet-4-6",
 max_tokens=2048,
 messages=[{"role": "user", "content": "긴 보고서 작성해줘"}]
) as stream:
 for text in stream.text_stream:
 print(text, end="", flush=True)
```

## Tool Use — Claude에게 함수 주기

Python — 외부 API 호출 도구 등록

```json
tools = [{
 "name": "search_naver_local",
 "description": "네이버 지역 검색 API로 업체 정보 검색",
 "input_schema": {
 "type": "object",
 "properties": {
 "query": {"type": "string", "description": "검색어 (예: 강남 스터디카페)"}
 },
 "required": ["query"]
 }
}]

response = client.messages.create(
 model="claude-sonnet-4-6",
 max_tokens=512,
 tools=tools,
 messages=[{"role": "user", "content": "강남 필라테스 업체 찾아줘"}]
)

# Claude가 tool_use 블록 반환하면 실제 함수 실행
for block in response.content:
 if block.type == "tool_use":
 result = search_naver_local(block.input["query"])
 # 결과를 다시 Claude에게 전달해서 요약시킴
```

정글부킹 리드 수집기(jungle_lead_collector.py)가 딱 이 패턴이다. Claude Haiku가 네이버 API 검색 결과를 받아서 "이 업체가 예약 SaaS 구독할 가능성"을 0~100으로 스코어링한다. 전 세그먼트 300개 업체를 한 번에 평가. 사람이 하면 며칠 걸릴 일이다.Level 4 · 실전 — 9강

## JANDA AGI 구축기진짜로 만들어본 사람의 이야기

Claude Code를 실제로 6개월 쓴 결과. 구체적인 숫자와 구체적인 코드로 이야기한다.
실제 케이스숫자로 증명자가코딩 AGI

> *"외주 개발비로 월 300만 원 썼다. Claude Code 도입 후 API 비용은 월 5만 원. 생산량은 3배다."*

## 우리가 만든 것들

> [!IMPORTANT]
> **📊 Claude Code로 만든 시스템 목록**
> **봇 11개:** 유튜브 자동댓글봇 / 이메일 마케팅봇 / 글쓰기봇 / 인사이트헌터 / KISA 보안봇 / 쇼츠 파이프라인 봇 / 전자책봇 / 텔레그램 에이전트봇 / 롱폼영상봇 / API 비용모니터봇 / 정글부킹 리드수집봇 **에이전트 시스템:** 시황 AGI (26라운드 자가코딩 루프) / 멀티에이전트 오케스트레이터 / Knowledge RAG 봇 **SaaS 제품:** AITF API (17개 상품, 48 엔드포인트) / 정글부킹 예약 시스템 **코드베이스:** 50,000줄+ (개발자 1명이 6개월에)

## 시황 AGI — 자가코딩의 구현

시황 AGI는 매일 밤 00:30에 혼자 시작해서 스스로 코드를 개선하고 07:00에 끝난다. 사람은 아무것도 안 해도 된다.
26라운드 자가코딩 루프 (매일 밤)1자가 진단 (sihwang_self_director.py)현재 코드 상태 분석 → 개선 포인트 3개 도출 → LLM-as-Judge로 자기 평가 → Learnings.json에 교훈 저장2코드 패치 생성 (sihwang_code_patcher.py)Confidence 65점 이상 패치만 선별 → 전체 파일 읽기 → import 의존성 확인 → 패치 코드 생성3subprocess 검증실제 Python으로 패치된 코드 실행 → 에러 없으면 적용 → 에러 있으면 .bak 파일로 롤백4git 체크포인트성공 패치마다 git commit 자동 생성 → 7라운드마다 git push → _code_patcher_log.json에 히스토리

## CLAUDE.md가 전부를 가능케 했다

02_AI_에이전트_연구소/에이전트_개발/CLAUDE.md 핵심

```python
## 시황 AGI 파일 안전 규칙 (v3.3 — 2026-05-14)

| 규칙 | 내용 |
|------|------|
| confidence < 55 | 스킵 — 스코프 축소 재시도 1회 |
| 쿨다운 기준 | 마지막 시도 기준 1시간 (반복 방지) |
| import 검증 | subprocess 실행 후 반영 |
| overnight 수정 | code_patcher 통해서만, 직접 수정 금지 |
| 목표 성공률 | 100% — 모든 유효 시도는 patched=True
```

이 규칙들이 CLAUDE.md에 있어서 매 세션마다 Claude에게 주입된다. AI가 AI 코드를 수정할 때 지켜야 할 안전 프로토콜이다.

## 핵심 교훈 — 6개월 후 돌아보며

> [!TIP]
> **💡 실전에서 얻은 교훈**
> **1. CLAUDE.md 먼저 써라.** 개발 시작 전에 30분 투자하면 수십 시간을 아낀다. **2. 검증 없이 적용하지 마라.** subprocess로 실제 실행해보는 검증 단계가 없으면 자동화가 화근이 된다. **3. 롤백 먼저 설계해라.** .bak 파일 자동 생성, git commit 단위 체크포인트가 없으면 야간 루프는 못 믿는다. **4. 작게 시작해라.** 봇 1개부터 시작했다. 11개는 6개월 동안 하나씩 쌓인 것이다.

여기서 잠깐. Claude Code로 뭘 만들어야 할지 막막하다면, 우리가 실제로 운영 중인 채널을 보면 된다. AI사냥꾼은 이 책에서 배운 Claude Code 자동화를 그대로 콘텐츠로 만든다. 어떻게 쓰는지 보여주는 게 가장 빠른 학습이기 때문이다.AI사냥꾼 · Claude Code 자동화 채널

### Claude Code 실전 활용, 영상으로 보고 싶다면

이 책에서 배운 내용을 실제로 구현하는 과정을 영상으로 보여준다. 봇 만들기, 자동화 파이프라인, 실패담까지 — 글로 읽는 것보다 보는 게 훨씬 빠를 때가 있다.
Claude Code 실전자동화 파이프라인봇 구축 과정실패담 포함매주 업로드[AI사냥꾼 채널 보러 가기 →](https://www.youtube.com/channel/UCCqi9m0XPHLPxvReWfJhJig)Level 4 · 실전 — 10강

## 수료 & 다음 단계이제 뭘 하면 되는가

이 책을 완주한 당신. 이제 아는 것과 해본 것의 간격을 좁힐 차례다. 첫 프로젝트부터 시작해보자.
실전 시작 가이드레벨별 프로젝트 추천
이 책을 읽었다면 이미 준비는 됐다. 이제 실제로 해보는 것만 남았다. 아는 것과 해본 것 사이의 간격을 채우는 데는 첫 번째 프로젝트가 제일 빠르다.

## 지금 당장 시작할 3가지 프로젝트

책 읽는 것과 실제로 써보는 건 완전히 다르다. 읽을 때는 다 이해된 것 같다. 막상 터미널 열면 멍해진다. 그 간격을 메우는 데는 작은 프로젝트 하나가 제일 빠르다. 아래 순서대로 하나씩 해봐라.

> [!TIP]
> **🚀 레벨별 첫 프로젝트 추천**
> **Lv.1 (입문):** CLAUDE.md를 내 현재 프로젝트에 추가하고, Claude Code로 버그 1개 고치기 **Lv.2 (중급):** GitHub MCP 연결 → 매일 아침 자동으로 이슈 목록 정리하는 스크립트 만들기 **Lv.3 (고급):** Hooks 설정 → 파일 수정 후 자동 테스트 실행 + 텔레그램 알림까지 연결

## Claude Code 생태계 — 앞으로

> [!IMPORTANT]
> **🔮 2026~2027 트렌드 전망**
> • **MCP 표준화:** GitHub, Slack, Notion 등 주요 서비스들이 공식 MCP 서버 제공 예정• **자율 에이전트 확산:** SWE-bench 90% 이상 달성 모델 등장 예고• **AI 숙련도 = 취업 핵심 역량:** Claude Code 경험자 채용 수요 급증 중• **1인 팀의 시대:** Claude Code + 적절한 인프라 = 5인 팀 생산성

---

저자가 Claude Code로 직접 만든 서비스
🤖AITF — AI 에이전트 구축 & 교육
AI 에이전트 도입이 필요한 기업을 위한 구축·운영·교육 서비스. 이 책에서 소개한 시스템들이 실제로 돌아가고 있는 곳이다.
[aitf-landing.onrender.com →](https://aitf-landing.onrender.com/)📅정글부킹 — AI 통합예약 시스템
스터디카페·필라테스·코워킹 등 버티컬 업종을 위한 예약 자동화. 예약부터 마케팅까지.
[ai-jungle.kr →](https://www.ai-jungle.kr)⚡

### Claude Code 마스터 완성

10강을 완주한 당신은 국내에서 Claude Code를 제대로 이해하는 소수에 속한다.다음 단계는 하나다 — 오늘 밤 터미널 열고 첫 번째 프로젝트를 시작하는 것.
 **10강** 완독 완료 **CLAUDE.md** 내 프로젝트에 적용 **첫 봇** 실제로 돌리기 **AI사냥꾼** 실전 영상 보기[AI사냥꾼 채널 보러 가기 →](https://www.youtube.com/channel/UCCqi9m0XPHLPxvReWfJhJig)🏆 최종 확인 퀴즈Claude Code를 제대로 쓰는 순서로 맞는 것은?A. 바로 코딩 → 테스트 → 커밋B. 탐색(Explore) → 계획(Plan) → 코딩(Code) → 커밋(Commit)C. CLAUDE.md 작성 → 바로 커밋 → 탐색D. MCP 설치 → Hooks → 바로 코딩
Claude Code 바이블 2026 — 저자 김화현 · 공동저자 로드AI사냥꾼 채널 · dev@stayjanda.com협업 및 제안 ·[ceo@stayjanda.com](mailto:ceo@stayjanda.com)
보너스 1 · 실전 도구

## 프롬프트 치트시트복붙해서 바로 쓰는 30개 패턴

[괄호] 안만 바꿔라. 나머지는 그대로 써도 된다. 상황별로 검증된 프롬프트들이다.
즉시 활용30개 패턴실전 검증

> [!TIP]
> **💡 사용법**
> [대괄호] 안만 내 상황에 맞게 바꿔라. 나머지 문장은 Claude가 더 잘 이해하도록 최적화된 표현이다. **Shift+Enter** 로 줄바꿈, **Enter** 로 전송.

## 🐛 버그 수정 패턴

패턴 1 — 에러 메시지 그대로 던지기

```python
아래 에러가 나. 원인 찾아서 고쳐줘.
코드 건드리기 전에 원인 먼저 설명해.

[에러 메시지 전체 붙여넣기]

파일: [파일명]
```

에러 메시지는 절대 요약하지 마라. "뭔가 안 된다"가 아니라 빨간 글씨 전체를 복사해서 붙여넣어야 한다. Claude는 스택 트레이스 한 줄 한 줄을 다 읽는다.패턴 2 — 특정 함수 버그

```python
[함수명] 함수에서 [증상]이 발생해.
입력값: [예시 입력]
기대 결과: [기대하는 출력]
실제 결과: [실제 나오는 출력]

관련 코드 읽고 원인 찾아줘. 수정 전에 가설 말해줘.
```

패턴 3 — 간헐적 버그 (재현 어려운 것)

```python
[기능명]이 가끔 안 된다. 매번은 아니고 [빈도/조건].
로그 보면 이렇게 나와:
[로그 내용]

race condition이나 타이밍 문제인지 확인해줘.
관련 코드 전체 읽어보고 의심 포인트 찾아줘.
```

## 🔨 새 기능 추가 패턴

패턴 4 — 신규 기능 (탐색 먼저)

```python
현재 [모듈명] 코드 읽어봐.
[기능 설명]을 추가하려는데
기존 구조에서 어디에 어떻게 붙이면 자연스러울지 말해줘.
계획만 먼저. 코드 수정은 내가 OK 하면 시작해.
```

패턴 5 — API 엔드포인트 추가

```python
FastAPI에 [엔드포인트 경로] 엔드포인트 추가해줘.
- 메서드: [GET/POST/PUT]
- 입력: [파라미터 설명]
- 출력: [반환값 설명]
- 인증: [있음/없음]

기존 라우터 파일 [파일명] 읽고 같은 스타일로 만들어줘.
```

패턴 6 — DB 쿼리 추가

```python
[테이블명] 테이블에서 [조건] 데이터를 가져오는 쿼리 짜줘.
현재 DB 접속 방식은 [파일명] 참고해.
기존 쿼리 함수들이랑 스타일 맞춰줘.
```

## ♻️ 리팩터링 패턴

패턴 7 — 함수 분리

```python
[파일명]의 [함수명] 함수가 너무 길어.
읽어보고 어떻게 나누면 좋을지 제안해줘.
나누기 전후로 기존 기능 동일하게 유지해야 해.
```

패턴 8 — 중복 코드 제거

```python
[파일명A]랑 [파일명B]에 비슷한 코드가 있어.
둘 다 읽어보고 공통 함수로 뽑아낼 수 있는 부분 찾아줘.
변경 최소화로.
```

패턴 9 — 가독성 개선 (수술적)

```python
[파일명] 읽어봐. 기능은 바꾸지 말고
변수명, 함수명만 더 명확하게 바꿔줘.
바꿀 이름들 목록 먼저 보여주고 내가 확인하면 적용해줘.
```

## ✅ 테스트 작성 패턴

패턴 10 — 유닛 테스트 작성

```python
[파일명]의 [함수명] 함수에 대한 pytest 테스트 작성해줘.
- 정상 케이스 3개
- 엣지 케이스 2개 (None 입력, 빈 값 등)
- 예외 케이스 1개

기존 테스트 파일 [tests/파일명] 읽고 같은 스타일로.
```

패턴 11 — 기존 코드 테스트 없을 때

```python
[파일명] 전체 읽어봐.
이 파일에서 가장 중요한 함수 3개 골라서
각각 최소 테스트 케이스 2개씩 작성해줘.
테스트 먼저 작성하고, 통과되는지 실행해봐.
```

## 🔍 코드 이해 패턴

패턴 12 — 전체 구조 파악

```python
이 프로젝트의 [기능명] 부분이 어떻게 동작하는지 모르겠어.
[관련 폴더/파일명] 읽어보고
데이터 흐름을 순서대로 설명해줘. 코드는 건드리지 마.
```

패턴 13 — 특정 코드 설명

```python
[파일명] [라인번호]~[라인번호] 이 부분이 뭐 하는 건지 모르겠어.
왜 이렇게 짰는지 이유까지 설명해줘.
비개발자도 이해할 수 있게.
```

패턴 14 — 의존성 파악

```python
[파일명/함수명]을 수정하면 어디에 영향 가?
이 파일을 import하거나 호출하는 파일들 찾아줘.
영향 범위 파악 후에 수정 들어갈게.
```

## 🚀 성능 최적화 패턴

패턴 15 — 느린 쿼리 최적화

```python
[파일명]의 [함수명]이 느려. 평균 [시간]ms 걸림.
코드 읽어보고 병목 원인 찾아줘.
인덱스, N+1 쿼리, 불필요한 루프 위주로 봐줘.
```

패턴 16 — 병렬 처리 도입

```python
[파일명]의 [함수명]이 순차 처리라 느려.
비동기/병렬로 바꿀 수 있는지 봐줘.
현재 코드 읽고 asyncio 또는 ThreadPoolExecutor로 개선안 제시해줘.
```

## 📝 문서화 패턴

패턴 17 — README 작성

```python
이 프로젝트 전체 읽어봐.
GitHub README.md 작성해줘.
- 프로젝트 설명 (1~2줄)
- 설치 방법
- 사용법 (예시 포함)
- 환경변수 목록
개발자가 아닌 사람도 읽을 수 있게.
```

패턴 18 — 함수 docstring 일괄 추가

```python
[파일명] 읽어봐.
docstring 없는 public 함수들 찾아서
Args/Returns/Raises 형식으로 docstring 추가해줘.
함수 로직은 건드리지 마.
```

## 🔐 보안 패턴

패턴 19 — 보안 취약점 점검

```python
[파일명] 읽어봐.
SQL injection, XSS, 인증 우회, 민감정보 노출
이 4가지 관점에서 취약점 있는지 점검해줘.
발견하면 심각도(상/중/하)랑 수정 방법 같이 알려줘.
```

패턴 20 — .env 체크

```python
이 프로젝트에서 하드코딩된 API 키나 비밀번호가 있는지 찾아줘.
os.getenv()로 대체 가능한 것들 목록 만들어줘.
실제 값은 출력하지 마.
```

## 🤝 협업 패턴

패턴 21 — PR 설명 작성

```python
git diff [브랜치명]..HEAD 결과야:
[diff 내용]

이 변경사항으로 GitHub PR 설명 작성해줘.
- Summary (무엇을 왜 바꿨나)
- 테스트 방법
- 주의사항
마크다운 형식으로.
```

패턴 22 — 커밋 메시지 정리

```python
git diff --staged 결과야:
[diff 내용]

Conventional Commits 형식으로 커밋 메시지 써줘.
feat/fix/refactor/docs 중 맞는 타입 골라서.
```

## 🐍 Python 특화 패턴

패턴 23 — 타입 힌트 추가

```python
[파일명] 읽어봐.
타입 힌트 없는 함수들에 Python typing 모듈로 타입 추가해줘.
함수 동작은 바꾸지 말고 타입만.
```

패턴 24 — 에러 핸들링 추가

```python
[파일명]의 [함수명]에 에러 핸들링이 부족해.
어떤 예외가 발생할 수 있는지 분석하고
try/except + 로깅 추가해줘. silent fail은 금지.
```

## ⚡ 자동화 패턴

패턴 25 — 반복 작업 스크립트화

```python
매일 [작업 설명]을 수동으로 하고 있어.
이걸 자동화하는 Python 스크립트 만들어줘.
- 입력: [데이터 소스]
- 처리: [로직]
- 출력: [결과물]
MASTER.env에서 키 읽는 방식으로.
```

패턴 26 — 크론잡 설정

```python
[스크립트 경로]를 매일 [시간]에 자동 실행하고 싶어.
Windows 작업 스케줄러 또는 Linux cron 설정 방법 알려줘.
실패 시 텔레그램 알림 오게 하려면 어떻게 해?
```

## 🔧 디버깅 패턴

패턴 27 — 로그 분석

```python
아래 로그야. 뭐가 문제인지 찾아줘.
[로그 내용]

타임스탬프 패턴, 에러 패턴, 이상한 값 위주로 봐줘.
```

패턴 28 — 환경 문제 진단

```python
[명령어]를 실행하면 이렇게 나와:
[실행 결과]

로컬에서는 되는데 서버에서 안 돼.
환경 차이 원인 찾아줘. OS, 파이썬 버전, 패키지 버전 차이 위주로.
```

## 📊 데이터 패턴

패턴 29 — JSON/CSV 처리

```python
이 JSON 구조야:
[JSON 샘플]

[원하는 데이터]만 뽑아서 [출력 형식]으로 변환하는 코드 짜줘.
```

패턴 30 — 데이터 검증

```python
[파일명]에서 받아오는 데이터가 가끔 이상해.
[예상 스키마]대로 오는지 검증하는 코드 추가해줘.
이상한 값 들어오면 로그 찍고 건너뛰도록.
```

---

## ⌨️ 슬래시 명령어 전체 목록

Claude Code 대화 중 언제든 입력할 수 있는 명령어들이다. 이 표 하나면 다 된다.
명령어언제 쓰나설명/help처음 쓸 때사용 가능한 명령어 전체 목록 보기/clear새 작업 시작 전대화 컨텍스트 완전 초기화 (비용·품질 리셋)/compact대화가 길어질 때대화를 요약본으로 압축. 흐름 유지하면서 토큰 절약/context컨텍스트 확인현재 남은 컨텍스트 윈도우 사용량 확인/model모델 바꿀 때Opus / Sonnet / Haiku 전환/config설정 확인현재 설정 상태 표시/cost비용 확인현재 세션 토큰 사용량 및 비용 확인/quit · /exit종료Claude Code 종료

> [!TIP]
> **💡 /compact vs /clear — 헷갈리면 이 기준만 기억해라**
> **/clear** — 작업이 바뀔 때. 이전 내용이 새 작업에 방해가 될 때. **/compact** — 같은 작업인데 대화가 너무 길어졌을 때. 흐름은 유지하고 싶을 때.

보너스 2 · 실전 도구

## 흔한 실수 TOP 10경험자만 아는 함정들

직접 저지른 실수들이다. 이걸 읽고 나면 똑같은 삽질을 피할 수 있다.
실패 경험 기반해결법 포함

> *"내가 저지른 실수를 당신이 반복할 필요 없다. 이미 충분히 비쌌다."*

## 실수 #1 — 탐색 없이 바로 "고쳐줘"

"auth.py 버그 고쳐줘"라고 했다. Claude가 고쳤다. 근데 관련 없는 파일까지 건드렸다. 멀쩡하던 기능이 망가졌다. 복구에 1시간 걸렸다.❌ 잘못된 방법"auth.py 로그인 버그 고쳐줘"

> [!TIP]
> **✅ 올바른 방법**
> "auth.py 읽어봐. 로그인 실패하는 원인 찾아줘. 코드는 건드리지 마, 원인 파악 먼저."→ 분석 확인 후 "이 부분만 수정해줘"

## 실수 #2 — /clear 안 하고 새 작업 시작

A 기능 개발하다가 B 기능으로 넘어갔다. /clear를 안 했다. Claude가 A 기능 컨텍스트를 들고 B를 작업했다. A 기능 스타일로 B를 만들었다. 코드가 뒤섞였다.

> [!IMPORTANT]
> **🔑 원칙**
> **새로운 독립 작업을 시작할 때는 반드시 /clear 먼저.** 같은 작업의 연속이면 /clear 불필요. 판단 기준: "이전 대화가 이번 작업에 도움이 되나?"→ No면 /clear

## 실수 #3 — 너무 큰 작업을 한 번에 던지기

"이 프로젝트를 FastAPI로 마이그레이션해줘"라고 했다. 파일 30개가 한꺼번에 바뀌었다. 뭐가 바뀐지 파악도 못 한 채 커밋했다. 나중에 버그 찾을 때 어디서 났는지 알 수가 없었다.

> [!TIP]
> **✅ 큰 작업은 쪼개라**
> X: "전체 마이그레이션해줘"O: "1단계: models.py만 먼저 마이그레이션해줘. 완료되면 테스트 확인 후 2단계 할게."한 번에 바뀌는 파일은 최대 3~5개. 그 이상이면 범위가 너무 크다.

## 실수 #4 — .env 파일 git에 커밋

⚠️ 이건 진짜 심각한 실수.env 파일이 GitHub에 올라가면 API 키가 노출된다. 봇들이 24시간 안에 키를 스캔해서 악용한다. AWS 키 노출 시 수백만 원 청구된 사례 실제로 있다..gitignore — 반드시 있어야 할 항목들

```python
.env
*.env
MASTER.env
.env.local
.env.production
secrets.json
*_credentials.json
token*.pickle
```

> [!TIP]
> **✅ Claude Code에게 시킬 것**
> "이 프로젝트 전체 읽어봐. 하드코딩된 API 키나 토큰 있는지 찾아줘. 실제 값은 출력하지 마."

## 실수 #5 — CLAUDE.md 없이 개발 시작

프로젝트 시작하고 나서 CLAUDE.md를 안 만들었다. 3주 후 새 세션에서 Claude가 "이 프로젝트가 뭔지"를 모르는 채 작업했다. 포트를 8766이 아닌 8000으로 설정했다. 기존 설정이랑 충돌났다.

> [!IMPORTANT]
> **🔑 원칙**
> 새 프로젝트 첫 날 CLAUDE.md 먼저 만들어라. 나중에 만드는 건 두 배 힘들다.최소 내용: 프로젝트 목적, 주요 포트/경로, 절대 건드리면 안 되는 것.

## 실수 #6 — 성공 기준 없이 "잘 만들어줘"

"이 API 잘 만들어줘"라고 했다. Claude가 자기 기준으로 만들었다. 내가 원한 건 빠른 응답이었는데, Claude는 기능을 더 추가했다. 서로 다른 걸 생각하고 있었다.

> [!TIP]
> **✅ 성공 기준을 명시하라**
> X: "이 함수 잘 만들어줘"O: "이 함수 만들어줘. 성공 기준: ① 응답 100ms 이하 ② 기존 테스트 전부 통과 ③ 변경 파일 2개 이하"

## 실수 #7 — 실패 기록 안 하기

한국어 경로 인코딩 문제를 고쳤다. 기록 안 했다. 3주 후 다른 스크립트에서 똑같은 문제가 났다. 또 1시간 디버깅했다. 기록했으면 30초면 됐을 일이다.

> [!IMPORTANT]
> **🔑 원칙**
> 버그를 고쳤으면 CLAUDE.md의 "과거 실수" 섹션에 한 줄 적어라.포맷: [날짜] 증상 → 원인 → 해결법Claude가 다음 세션에서 같은 실수를 안 한다.

## 실수 #8 — 검증 없이 바로 배포

⚠️ "일단 올려보자"의 결과Claude가 수정한 코드를 테스트 없이 Render에 배포했다. 10분 후 고객 에러 리포트 왔다. Claude가 함수 시그니처를 바꿨는데 호출부를 못 찾아서 미반영한 것이었다.배포 전 필수 체크리스트1변경된 파일 목록 확인git diff --stat로 뭐가 바뀌었는지 직접 눈으로 확인2테스트 실행pytest tests/ -v— 실패 0개 확인3로컬 서버 실행 테스트배포 전 로컬에서 핵심 기능 직접 실행 확인4보안 체크python git_security_check.py— .env 파일 미포함 확인

## 실수 #9 — 토큰 낭비

"뭔가 안 되는데 고쳐줘"라고 50번 대화하면서 고쳤다. 나중에 보니 컨텍스트가 100만 토큰 넘어있었다. 같은 작업을 /clear하고 새 세션으로 했으면 10번이면 됐다.

> [!TIP]
> **💰 토큰 절약 3원칙**
> **1. 컨텍스트가 길어지면 /clear하고 재시작** — 오래된 컨텍스트는 품질 떨어진다 **2. Haiku로 될 것에 Sonnet 쓰지 마라** — 스코어링·분류는 Haiku로 충분 **3. 탐색 프롬프트는 짧게** — "이 폴더 전체 읽어봐" 대신 "auth.py만 읽어봐"

## 실수 #11 — Claude가 루프에 빠졌을 때 방치하기

"이 버그 고쳐줘" → Claude가 고쳤다 → "아직도 안 돼" → 또 고쳤다 → "아직도 안 돼" → 10번 반복. 전부 시간과 토큰 낭비였다. 3번 이상 같은 패턴이 반복된다면 접근법이 잘못된 거다.

> [!TIP]
> **✅ 루프 탈출 3단계**
> **1단계 —** /clear로 컨텍스트 초기화. 오염된 대화 흐름 끊기. **2단계 —** 문제를 다시 정의. "뭐가 안 되는지" → "어떤 상태를 원하는지"로. **3단계 —** 단위를 쪼개라. "전체 고쳐줘" → "이 한 줄이 왜 이렇게 동작하는지 설명해줘"로.

⚠️ 루프 진입 신호 3가지① Claude가 같은 코드 수정을 계속 반복한다② 이미 시도한 방법을 다시 제안한다③ 대화가 30턴을 넘었는데 같은 문제가 계속된다

## 실수 #12 — 컨텍스트 창 고갈 모르고 계속하기

대화가 한참 이어졌다. Claude 답변이 점점 이상해졌다. 초반에 정한 규칙이랑 다르게 동작했다. 컨텍스트가 꽉 차서 초반 내용이 잘려 나간 것이었다. /clear 한 번으로 바로 해결됐다.

> [!TIP]
> **💡 컨텍스트 관리 원칙**
> **/context** — 현재 사용량 확인. 80% 넘으면 /compact 또는 /clear. **CLAUDE.md** — 핵심 규칙 적어두면 컨텍스트가 잘려도 다시 읽어서 복구됨. **긴 작업은 세션을 쪼개라** — "1단계 완료, 커밋" → 새 세션 시작이 오히려 품질이 더 높다.

## 실수 #10 — Claude 말을 100% 믿기

Claude가 "이 방법이 최적입니다"라고 해서 그대로 적용했다. 나중에 알고 보니 더 간단한 방법이 있었다. Claude도 틀린다. 특히 최신 라이브러리 버전, 특정 환경 설정에서는.

> [!IMPORTANT]
> **🔑 원칙**
> Claude는 **도구** 다. 판단은 내가 한다.의심스러우면 "다른 방법은 없어? 더 단순한 방법 있으면 알려줘"라고 물어라.중요한 결정은 공식 문서와 대조해라. Context7 MCP가 최신 문서 실시간으로 가져온다.

🧪 실수 방지 퀴즈새로운 독립적인 작업을 시작하기 전에 해야 할 것은?A. 이전 대화 내용을 전부 복사해둔다B. /clear로 컨텍스트를 초기화한다C. Claude를 재설치한다D. 아무것도 안 해도 된다보너스 3 · 실전 도구

## 비용 절약 · VS Code · Git실전 설정 완전 가이드

돈 아끼는 법, VS Code에서 더 편하게 쓰는 법, git과 Claude를 연결하는 법.
비용 최적화VS Code 통합Git 자동화

## 💰 Part A — 비용 절약 실전 가이드

Claude Code는 claude.ai Pro 플랜($20/월)으로 CLI를 쓰면 별도 API 비용이 없다. 하지만 API를 직접 호출하는 봇을 만들면 토큰 비용이 쌓인다. 이걸 관리하는 법이다.

### 모델별 비용 & 적합한 용도

모델상대 비용쓸 때쓰지 말 때Haiku 4.5★☆☆ 저렴스코어링, 분류, 짧은 응답, 반복 루프긴 코드 생성, 복잡한 추론Sonnet 4.6★★☆ 중간일반 개발, 분석, 코드 생성 *(기본값)* 단순 분류, 짧은 요약Opus 4.7★★★ 비쌈전략 판단, 아키텍처 설계일상적인 코딩 작업정글부킹 리드 수집기에서 업체 스코어링을 Sonnet으로 했더니 300건에 1만원 넘게 나왔다. Haiku로 바꿨다. 품질 차이 거의 없는데 비용은 1/5로 줄었다. "짧고 반복적인 판단"은 항상 Haiku가 답이다.

### 컨텍스트 관리로 비용 줄이기

> [!TIP]
> **💡 컨텍스트 비용 절약 3가지**
> **① /clear 적극 사용** — 작업 완료마다 초기화. 불필요한 이전 대화가 토큰 낭비. **② system 프롬프트 간결하게** — API 직접 사용 시 system 프롬프트가 매 호출마다 포함됨. 핵심만 남겨라. **③ max_tokens 적절히 제한** — 짧은 응답이면 max_tokens=256으로도 충분. 4096 기본값 그대로 두지 마라.

Python — 비용 효율적인 API 호출 패턴

```python
import anthropic

client = anthropic.Anthropic()

# ✅ 스코어링: Haiku + max_tokens 제한
def score_lead(item: dict) -> int:
 resp = client.messages.create(
 model="claude-haiku-4-5-20251001", # 저렴한 모델
 max_tokens=50, # 숫자만 반환하면 됨
 system="숫자만 반환. 0~100.",
 messages=[{"role": "user", "content": f"이 업체 구독 가능성: {item}"}]
 )
 return int(resp.content[0].text.strip())

# ✅ 코드 생성: Sonnet + 적절한 토큰
def generate_code(spec: str) -> str:
 resp = client.messages.create(
 model="claude-sonnet-4-6",
 max_tokens=2048, # 코드 생성은 넉넉하게
 messages=[{"role": "user", "content": spec}]
 )
 return resp.content[0].text
```

---

## 🖥️ Part B — VS Code 통합 완전 가이드

터미널에서만 쓰는 것보다 VS Code에서 함께 쓰면 훨씬 빠르다.

### 설치 & 실행

VS Code에서 Claude Code 시작하기1VS Code Extensions에서 Claude Code 설치Cmd/Ctrl+Shift+X → "Claude Code" 검색 → Install2내장 터미널 열기Ctrl+` (백틱) → 터미널 패널 →claude입력3파일 열고 @mention으로 컨텍스트 추가에디터에서 파일 열기 → Claude 창에@파일명입력하면 해당 파일 컨텍스트 추가

### VS Code에서만 되는 것들

> [!TIP]
> **⚡ VS Code 통합 특화 기능**
> **선택 영역 @mention** — 코드 일부 드래그 → Claude에게 "이 부분만" 설명 또는 수정 요청 **에러 바로 질문** — 빨간 밑줄 → 우클릭 → "Claude에게 질문" (확장 설치 시) **분할 뷰** — 에디터 좌측 + Claude 우측으로 동시에 보며 작업 **diff 바로 확인** — Claude가 파일 수정하면 VS Code가 diff 뷰로 변경사항 표시

### 추천 VS Code 설정

settings.json에 추가 권장

```json
{
 "editor.formatOnSave": true,
 "terminal.integrated.defaultProfile.windows": "PowerShell",
 "files.autoSave": "afterDelay",
 "files.autoSaveDelay": 1000,
 "git.autofetch": true,
 "editor.minimap.enabled": false // 화면 넓게 쓰기
}
```

---

## 🌿 Part C — Claude Code + Git 실전

### Claude가 직접 git 작업하게 하는 법

Claude Code 입력 — 브랜치 생성부터 PR까지

```python
새 기능 [기능명] 개발 시작할게.
git checkout -b feature/[기능명] 브랜치 만들어줘.
개발 완료 후에는 커밋 메시지 Conventional Commits 형식으로 작성해줘.
```

Claude Code 입력 — 변경사항 요약 커밋

```python
지금까지 바꾼 내용 git diff로 확인하고
의미 있는 단위로 나눠서 커밋해줘.
각 커밋 메시지는 feat/fix/refactor 중 맞는 걸로.
```

### 자동 보안 체크 → 커밋 연결

pre-commit hook으로 자동화 (.git/hooks/pre-commit)

```python
#!/bin/bash
# 커밋 전 .env 파일 포함 여부 자동 체크
if git diff --cached --name-only | grep -E "\.env$|MASTER\.env|secrets\."; then
 echo "❌ 보안 파일이 staged 되어 있습니다. git reset HEAD <파일> 로 제외하세요."
 exit 1
fi
echo "✅ 보안 체크 통과"
```

이 pre-commit hook을 CLAUDE.md에 적어두면 Claude Code가 커밋 전에 항상 확인한다. "git commit 전에 보안 체크 스크립트 실행해줘"라고 매번 말할 필요가 없다.

### GitHub Actions + Claude (고급)

.github/workflows/ai-review.yml

```python
name: AI Code Review
on: [pull_request]

jobs:
 review:
 runs-on: ubuntu-latest
 steps:
 - uses: actions/checkout@v3
 - name: Claude Code Review
 run: |
 # PR diff를 Claude API로 보내서 리뷰 코멘트 자동 생성
 # anthropic SDK + GitHub API 조합
 python scripts/ai_review.py
```

---

## 🔒 Part D — 보안 실전 가이드

Claude Code를 많이 쓸수록 보안 실수 확률도 올라간다. .env를 조심하는 건 기본이고, 이것들도 챙겨라.
⚠️ CLAUDE.md에 절대 쓰면 안 되는 것들CLAUDE.md는 git에 올라간다. 아래 항목은 절대 넣지 마라:❌ API 키 실제 값 (예: sk-ant-xxxxx)❌ 데이터베이스 비밀번호, OAuth 토큰❌ 내부 서버 IP, 도메인✅ 대신: "API 키는 MASTER.env에서 로드. 절대 하드코딩 금지."Claude Code에게 보안 스캔 시키기

```python
이 프로젝트 전체 스캔해줘.
하드코딩된 API 키, 비밀번호, 토큰 있는지 찾아줘.
실제 값은 출력하지 마, 파일명과 라인 번호만 알려줘.
```

> [!IMPORTANT]
> **🔑 Claude Code 보안 체크리스트**
> □ .gitignore에 .env, MASTER.env, *.pickle 포함 여부 확인□ git add 전 git status로 민감 파일 없는지 확인□ pre-commit hook으로 자동 차단 설정 (Part C 참고)□ CLAUDE.md에 실제 키 값이 없는지 확인

---

## 👥 Part E — 팀 협업 가이드

혼자 쓸 때랑 팀에서 쓸 때는 다르다. CLAUDE.md를 공유하면 팀 전체가 같은 컨텍스트로 작업할 수 있다.

> [!TIP]
> **📋 팀용 CLAUDE.md 필수 항목**
> **프로젝트 목적** — 새 팀원이 바로 이해할 수 있게 **코딩 컨벤션** — 변수명, 파일 구조, 임포트 순서 **금지 사항** — "이 파일 건드리지 마", "이 API 직접 호출 금지" **공통 패턴** — 팀이 자주 쓰는 스니펫, 설계 패턴

팀용 CLAUDE.md 예시

```python
# 팀 프로젝트 CLAUDE.md

## 코딩 원칙
- Python 함수는 snake_case
- API 응답은 항상 TypedDict로 타입 명시
- 에러는 반드시 로깅 후 raise

## 절대 건드리지 말 것
- db/migrations/ — DBA만 수정
- auth/jwt.py — 보안팀 승인 후 수정

## PR 규칙
커밋 메시지: feat/fix/refactor/docs 중 선택
PR 단위: 기능 1개, 파일 변경 5개 이하

## 환경변수
모든 키는 .env.example 참고. 실제 값은 팀 노션에서 발급.
```

PR 리뷰 때도 CLAUDE.md가 힘을 발휘한다. "이 코드가 우리 팀 컨벤션에 맞는지 CLAUDE.md 보고 확인해줘"라고 하면 Claude가 팀 기준으로 리뷰한다. 리뷰어 부담이 절반으로 줄어든다.

---

## 🪟 Part F — Windows 특화 팁

Claude Code 튜토리얼 대부분이 Mac/Linux 기준이다. Windows에서 쓰다 보면 예상치 못한 곳에서 막힌다. 국내 사용자라면 반드시 알아야 할 것들이다.
⚠️ Windows에서 자주 막히는 것들 **경로 구분자** — Windows는 \, Linux·Mac은 /. Python에서는 `Path()` 쓰면 자동 처리. **한글 인코딩** — 터미널이 CP949면 한글이 깨진다. PowerShell 실행 후: `$OutputEncoding = [Console]::OutputEncoding = [System.Text.Encoding]::UTF8` **줄바꿈 문자** — Windows는 CRLF, Linux는 LF. git diff에서 이상하게 보일 때 .gitattributes로 해결.Windows PowerShell — claude 실행 전 필수 설정

```bash
# 한글 깨짐 방지
$OutputEncoding = [Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Node.js 버전 확인 (v18 이상 필요)
node --version

# Claude Code 실행
claude
```

.gitattributes — 줄바꿈 통일 (팀 협업 시 필수)

```python
* text=auto
*.py text eol=lf
*.js text eol=lf
*.json text eol=lf
```

> [!TIP]
> **💡 Windows 사용자 추천 설정**
> **WSL2** — Windows 안에 Linux 환경 설치. Claude Code가 Linux 기준이라 WSL2에서 훨씬 안정적으로 돌아간다. **Windows Terminal** — 기본 PowerShell 대신 사용. 탭, 폰트, 색상 모두 개선됨. **Python 실행** — python이 안 되면 py 또는 python3 시도.

🧪 보너스 최종 퀴즈단순 분류·스코어링 작업에 가장 적합한 Claude 모델은?A. claude-haiku-4-5-20251001 (빠르고 저렴)B. claude-opus-4-7 (가장 똑똑하니까)C. claude-sonnet-4-6 (기본값이니까)D. 모델 상관없이 다 똑같다AI사냥꾼 시리즈 · 함께 읽으면 더 강해집니다[📗바이브코딩 실전 바이블비개발자가 96시간 만에 B2B 플랫폼을 세운 실화. 바이브코딩의 시작점.읽어보기 →](index.html)[🤖AI 에이전트 바이블에이전트 설계부터 멀티에이전트 오케스트라까지. 코드 없이 AI 팀을 만드는 법.읽어보기 →](agent-bible.html)🎁이 책이 도움이 됐다면,소중한 사람에게 선물하세요당신이 오늘 얻은 것을 — 누군가도 얻을 수 있습니다.링크 하나가, 그 사람의 5월을 완전히 바꿀 수 있습니다.🔗 링크 복사[𝕏 공유](#)그리고 — 지금 꼭자신에게도선물하세요바쁜 일상 속에서 나를 위한 시간은 늘 나중으로 밀립니다.하지만 **지금 이 책을 끝까지 읽은 것** ,그것이 이미 자신에게 준 가장 값진 선물입니다.내일은 오늘보다 조금 더 AI를 아는 사람이 되어 있을 것입니다.그 변화는 조용하지만 분명히 쌓이고,그것이 당신이 자신에게 줄 수 있는 **최고의 선물이 됩니다.**