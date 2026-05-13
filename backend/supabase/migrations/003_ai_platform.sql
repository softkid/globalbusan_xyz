-- AI Platform Schema Definition

-- 1. AI Courses
CREATE TABLE IF NOT EXISTS ai_courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  instructor TEXT NOT NULL,
  rating FLOAT,
  students INT DEFAULT 0,
  level TEXT,
  duration TEXT,
  category TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. AI Services
CREATE TABLE IF NOT EXISTS ai_services (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price INT,
  rating FLOAT,
  reviews INT DEFAULT 0,
  creator TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. AI Projects
CREATE TABLE IF NOT EXISTS ai_projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'recruiting',
  creator TEXT,
  current_team INT DEFAULT 1,
  target_team INT,
  skills TEXT[],
  start_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. AI News
CREATE TABLE IF NOT EXISTS ai_news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT,
  date DATE,
  location TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. AI Prompts
CREATE TABLE IF NOT EXISTS ai_prompts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  tags TEXT[],
  author TEXT,
  likes INT DEFAULT 0,
  usage_count INT DEFAULT 0,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. AI Community Posts
CREATE TABLE IF NOT EXISTS ai_community_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  author TEXT,
  author_role TEXT,
  author_avatar TEXT,
  category TEXT,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Initial Mock Data (Optional, but useful for testing)
INSERT INTO ai_courses (title, instructor, rating, students, level, duration, category, image) VALUES 
('ChatGPT API를 활용한 AI 챗봇 개발', '김민수', 4.8, 1240, '초급', '8시간', 'LLM', 'https://images.unsplash.com/photo-1677442136019-21780ecad995'),
('Stable Diffusion 마스터 클래스', '이서연', 4.9, 850, '중급', '12시간', 'Image AI', 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba')
ON CONFLICT DO NOTHING;

INSERT INTO ai_services (title, description, category, price, rating, reviews, creator) VALUES
('LLM 파인튜닝 서비스', '기업 데이터를 활용한 맞춤형 LLM 파인튜닝 서비스', 'LLM', 5000000, 4.9, 23, '김AI전문가'),
('이미지 생성 API 통합', 'Stable Diffusion 기반 이미지 생성 API 통합 및 최적화', 'Image AI', 3000000, 4.7, 15, '이이미지전문가')
ON CONFLICT DO NOTHING;

INSERT INTO ai_projects (title, description, category, status, creator, current_team, target_team, skills, start_date) VALUES
('부산 관광 AI 챗봇', '부산 관광정보를 제공하는 LLM 기반 챗봇 개발', 'LLM', 'recruiting', '김프로젝트', 2, 5, ARRAY['Python', 'LLM', 'API', 'React', 'Next.js'], '2026-05-15'),
('이미지 생성 플랫폼', 'Stable Diffusion을 활용한 지역 특화 이미지 생성', 'Image AI', 'in_progress', '이디자인', 4, 4, ARRAY['Stable Diffusion', 'Vue.js', 'Node.js'], '2026-04-01')
ON CONFLICT DO NOTHING;

INSERT INTO ai_news (title, description, type, date, location, image) VALUES
('부산 AI 커뮤니티 첫 오프라인 밋업', '부산 AI 생태계 활성화를 위한 첫 오프라인 밋업 개최', 'event', '2026-05-15', '부산 벡스코', '🎤'),
('LLM 기술 동향 세미나', '최신 LLM 기술과 실무 활용 방법에 대한 전문가 세미나', 'event', '2026-05-22', '부산 디지털혁신센터', '📊'),
('AI-Hub Busan 플랫폼 런칭 소식', '부산 AI 생태계 통합 플랫폼 AI-Hub Busan이 공식 런칭되었습니다.', 'news', '2026-05-07', NULL, '🚀')
ON CONFLICT DO NOTHING;

INSERT INTO ai_prompts (title, description, category, tags, author, likes, usage_count, content) VALUES
('부산 관광 명소 소개 프롬프트', '관광객의 선호도와 여행 스타일에 맞춘 맞춤형 코스', '관광/여행', ARRAY['부산', '관광', '일정추천'], '부산트래블', 124, 850, '당신은 부산의 베테랑 로컬 가이드입니다...'),
('RFP 초안 작성 도우미', '비전문가를 위한 요구사항 정의서 자동 생성기', '비즈니스', ARRAY['RFP', '기획', '요구사항'], '기획마스터', 89, 420, '사용자가 제시하는 아이디어를 바탕으로...')
ON CONFLICT DO NOTHING;

INSERT INTO ai_community_posts (title, content, author, author_role, author_avatar, category, likes, comments, tags) VALUES
('최신 LLM 모델 성능 비교해봤습니다', 'Llama 3와 Mistral 8x7B를 로컬에서 돌려본 후기입니다...', 'AI탐험가', 'AI Researcher', 'A', '기술 공유', 45, 12, ARRAY['LLM', 'Llama3', 'Mistral']),
('RAG 시스템 구축 시 팁 공유', 'Chunk size와 Overlap 설정에 따른 검색 품질 차이...', '데이터장인', 'Data Engineer', 'D', '질문/답변', 32, 8, ARRAY['RAG', 'VectorDB'])
ON CONFLICT DO NOTHING;
