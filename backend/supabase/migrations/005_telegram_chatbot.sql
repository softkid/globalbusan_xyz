-- Migration 005: Telegram Chatbot Bidirectional Messaging
-- 이 마이그레이션은 웹 챗봇과 텔레그램 간의 양방향 메시지 연동을 위한 테이블을 생성합니다.

CREATE TABLE IF NOT EXISTS ai_chat_sessions (
  id TEXT PRIMARY KEY,
  telegram_message_id BIGINT UNIQUE,
  site TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_chat_messages (
  id SERIAL PRIMARY KEY,
  session_id TEXT REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
  sender TEXT NOT NULL, -- 'user', 'bot', 'admin'
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS(행 레벨 보안)를 비활성화하여 익명(anon) 접근을 허용합니다 (Cloudflare Worker에서 간편한 연동을 위해)
ALTER TABLE ai_chat_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_messages DISABLE ROW LEVEL SECURITY;
