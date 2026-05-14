-- V2 AI Education Portal Schema Extension
-- 부산 AI 교육 포털 V2 — 설명회 예약, 챌린지, 전문가 프로필

-- 7. Event Reservations (무료 설명회 예약)
CREATE TABLE IF NOT EXISTS ai_event_reservations (
  id SERIAL PRIMARY KEY,
  event_title TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TEXT,
  event_location TEXT,
  event_type TEXT DEFAULT 'seminar',
  max_spots INT DEFAULT 20,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  interest TEXT,
  region TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Challenges (주간 챌린지 / 게이미피케이션)
CREATE TABLE IF NOT EXISTS ai_challenges (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  emoji TEXT DEFAULT '🎯',
  difficulty TEXT DEFAULT 'beginner',
  points INT DEFAULT 50,
  deadline DATE,
  participants INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Challenge Submissions (챌린지 인증)
CREATE TABLE IF NOT EXISTS ai_challenge_submissions (
  id SERIAL PRIMARY KEY,
  challenge_id INT REFERENCES ai_challenges(id),
  user_name TEXT NOT NULL,
  proof_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Expert Profiles (전문가 네트워크)
CREATE TABLE IF NOT EXISTS ai_experts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  skills TEXT[],
  avatar TEXT,
  rating FLOAT DEFAULT 0,
  projects_count INT DEFAULT 0,
  region TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Marketplace Requests (AI 구축 의뢰)
CREATE TABLE IF NOT EXISTS ai_marketplace_requests (
  id SERIAL PRIMARY KEY,
  business_type TEXT NOT NULL,
  need_type TEXT NOT NULL,
  description TEXT,
  budget_range TEXT,
  deadline TEXT,
  contact_name TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  status TEXT DEFAULT 'open',
  region TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update ai_courses for V2 fields
ALTER TABLE ai_courses ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE ai_courses ADD COLUMN IF NOT EXISTS price TEXT;
ALTER TABLE ai_courses ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE ai_courses ADD COLUMN IF NOT EXISTS target TEXT;
ALTER TABLE ai_courses ADD COLUMN IF NOT EXISTS tag TEXT;
ALTER TABLE ai_courses ADD COLUMN IF NOT EXISTS emoji TEXT DEFAULT '📚';
ALTER TABLE ai_courses ADD COLUMN IF NOT EXISTS gradient TEXT;

-- Seed V2 courses
INSERT INTO ai_courses (title, description, instructor, rating, students, level, duration, category, price, region, target, tag, emoji, gradient) VALUES
('AI 실전 프로젝트', 'GPT + 바이브코딩으로 실제 서비스를 만드는 4주 실전반', '부산AI랩', 4.9, 120, '실전', '4주', 'adult', '39만원', '서면', '직장인·자영업자·프리랜서', '인기', '🚀', 'linear-gradient(135deg, #FF6B35, #FF8F5E)'),
('AI Creative Lab', 'AI로 캐릭터, 그림책, 영상을 만드는 프리미엄 창작 교육', '부산AI랩', 4.8, 45, '입문', '8주', 'kids', '50만원', '해운대', '초4~중3', '프리미엄', '🎨', 'linear-gradient(135deg, #0F3A7D, #4A9FE5)'),
('AI 업무자동화', 'ChatGPT 실무, 문서 자동화, AI 마케팅 기업 맞춤 교육', '부산AI랩', 4.7, 30, '심화', '커스텀', 'biz', '120만원', '사상', '기업·중소사업자', '기업', '💼', 'linear-gradient(135deg, #10B981, #059669)'),
('AI 입문반', 'ChatGPT 기초, 프롬프트 작성법, AI 콘텐츠 제작 입문', '부산AI랩', 4.6, 200, '입문', '2주', 'adult', '15만원', '전체', '누구나', '입문', '📱', 'linear-gradient(135deg, #8B5CF6, #A78BFA)'),
('시니어 AI 생활', '스마트폰 AI, 음성비서, 사진복원, 손주 영상 만들기', '부산AI랩', 4.5, 80, '입문', '4주', 'senior', '무료~5만원', '북구', '60대 이상', '생활', '👴', 'linear-gradient(135deg, #EF4444, #F87171)')
ON CONFLICT DO NOTHING;

-- Seed events
INSERT INTO ai_event_reservations (event_title, event_date, event_time, event_location, event_type, max_spots) VALUES
('부산 AI 실전 활용 설명회', '2026-05-24', '14:00~16:00', '서면 멘토즈 스터디카페', '성인', 20),
('AI 시대 우리 아이 경쟁력', '2026-05-31', '10:00~12:00', '해운대 센텀 스터디센터', '학부모', 15),
('사장님 AI 생산성 세미나', '2026-06-07', '15:00~17:00', '사상구 상공회의소', '기업', 30)
ON CONFLICT DO NOTHING;

-- Seed challenges
INSERT INTO ai_challenges (title, description, emoji, difficulty, points, deadline, participants) VALUES
('GPT로 쇼츠 3개 만들기', '릴스/쇼츠 콘텐츠 3개를 GPT 활용해서 만들고 인증하세요', '🎬', 'beginner', 50, '2026-05-19', 32),
('바이브코딩 웹앱 제작', '바이브코딩으로 간단한 웹앱을 만들고 배포까지 완료하세요', '💻', 'intermediate', 100, '2026-05-26', 18),
('AI 자동화 워크플로우 구축', '실제 업무에 적용 가능한 AI 자동화 워크플로우를 만드세요', '⚡', 'advanced', 150, '2026-06-02', 8)
ON CONFLICT DO NOTHING;

-- Seed experts
INSERT INTO ai_experts (name, role, bio, skills, avatar, rating, projects_count, region, verified) VALUES
('김민수', 'AI 개발자', '부산 AI 실전 프로젝트 5년 경력. GPT 자동화 전문가.', ARRAY['GPT', '자동화', 'Python', 'React'], '🧑‍💻', 4.9, 12, '서면', true),
('박지영', 'AI 크리에이터', 'AI 콘텐츠 제작 및 키즈 AI 교육 전문.', ARRAY['Midjourney', '영상제작', 'GPT', '교육'], '👩‍🎨', 4.8, 8, '해운대', true),
('이정호', 'AI 컨설턴트', '제조업 AI 자동화 도입 컨설팅. 부산 중소기업 전문.', ARRAY['자동화', 'n8n', 'ChatGPT', '문서자동화'], '👨‍💼', 4.7, 15, '사상', true)
ON CONFLICT DO NOTHING;
