# 🤖 양방향 텔레그램 챗봇 연연동 가이드 (Bidirectional Chatbot Widget)

챗봇 위젯에서 보낸 메시지가 텔레그램에 전달되고, **텔레그램에서 보낸 답변(답장)이 웹 챗봇 위젯에 실시간으로 다시 전달되도록** 구현을 완료했습니다! 또한, 텔레그램 채널에서 답변을 보낼 때 챗봇이 AI 자동 응답으로 혼자 스팸하는 문제도 깔끔하게 해결했습니다.

---

## 🛠️ 핵심 변경 및 개선 내용

1. **양방향 통신 (Bidirectional Messaging)**
   - 텔레그램 API의 `message_id`를 데이터베이스에 매핑하여, 운영자가 텔레그램에서 특정 문의글에 **'답장(Reply)'**을 보냈을 때 어떤 웹 사용자 세션에 답장이 가야 하는지 매칭합니다.
   - 데이터베이스 스토리지로 기존에 구축된 **Supabase**를 활용하도록 마이그레이션 및 쿼리 로직을 통합했습니다.

2. **세션 영속성 (Session Persistence)**
   - 웹 사용자가 페이지를 새로고침하거나 다른 페이지로 이동해도 대화 내역이 끊기지 않도록 `localStorage`에 고유 챗봇 세션 ID(`agentumi_chat_session_id`)를 보존합니다.
   - 사용자가 챗봇을 열면 이전 대화 기록(AI 및 운영자 답변 포함)을 즉시 복원합니다.

3. **실시간 폴링 (Real-time Polling)**
   - 사용자가 챗봇 창을 열고 있는 동안 **4초 간격**으로 백엔드에서 신규 운영자 답변을 폴링하여, 텔레그램 답변이 도착하면 화면에 실시간으로 추가됩니다.

4. **스마트 무한 루프 / 스팸 방지**
   - 텔레그램 웹훅에서 운영자가 문의 알림에 답장을 보낸 경우, **AI가 그 답장에 다시 반응하여 자동 응답을 전송하지 않도록 차단**했습니다.
   - 운영자 단독 채팅방(혹은 지정 채널)에서의 일반적인 잡담 및 수동 메시지에 AI가 과도하게 반응하는 현상을 배제했습니다.

5. **운영자 답변 디자인**
   - AI 답변과 사람이 직접 답변한 내용을 구분할 수 있도록 챗봇 UI에 **`👤 담당자 답변`** 딱지와 고급 오렌지 색상 디자인 테마를 추가했습니다.

---

## 📂 추가/수정된 파일 목록

- [005_telegram_chatbot.sql](file:///d:/_a_globalbusan_xyz_investment_page/backend/supabase/migrations/005_telegram_chatbot.sql): 챗봇 세션 및 메시지 저장용 테이블 생성 SQL 마이그레이션 파일.
- [telegram.js (Route)](file:///d:/_a_globalbusan_xyz_investment_page/backend/src/routes/telegram.js): 백엔드 Hono 라우터 (`/send`, `/webhook` 수정 및 `/messages` 신규 추가).
- [telegram-widget.js (Module)](file:///d:/_a_globalbusan_xyz_investment_page/backend/src/modules/telegram-widget.js): 챗봇 임베드용 동적 스크립트 (세션 보존, 폴링 로직, 스타일 업그레이드).

---

## 🚀 적용 및 배포 방법

### 1단계: Supabase 데이터베이스 테이블 생성 (필수)
아래 SQL 쿼리를 **Supabase Dashboard -> SQL Editor**에 붙여넣어 실행해 주세요. 
(이미 [005_telegram_chatbot.sql](file:///d:/_a_globalbusan_xyz_investment_page/backend/supabase/migrations/005_telegram_chatbot.sql)에 생성되어 있습니다.)

```sql
-- 1) 챗봇 세션 테이블
CREATE TABLE IF NOT EXISTS ai_chat_sessions (
  id TEXT PRIMARY KEY,
  telegram_message_id BIGINT UNIQUE,
  site TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2) 메시지 기록 테이블
CREATE TABLE IF NOT EXISTS ai_chat_messages (
  id SERIAL PRIMARY KEY,
  session_id TEXT REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
  sender TEXT NOT NULL, -- 'user' (사용자), 'bot' (AI), 'admin' (담당자)
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS(보안 정책) 해제하여 Cloudflare Workers 백엔드와 쉬운 통신
ALTER TABLE ai_chat_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_messages DISABLE ROW LEVEL SECURITY;
```

### 2단계: 백엔드 Cloudflare Workers 재배포
수정된 Hono 라우터는 빌드나 추가 인프라 관리 없이 즉시 다음 명령어로 Cloudflare Workers에 재배포할 수 있습니다:

```bash
cd backend
npm run deploy:prod
```

> [!NOTE]
> `widget.js`가 백엔드 서버에서 동적으로 빌드되어 서빙되므로, 백엔드만 배포하면 위젯 스크립트를 삽입한 모든 웹페이지(`edu.globalbusan.xyz`, `ai.globalbusan.xyz` 등)의 챗봇 기능이 자동으로 실시간 업데이트됩니다!
