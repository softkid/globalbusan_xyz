-- Global BUSAN 프로젝트 데이터베이스 스키마

-- 프로젝트 테이블 생성
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('infrastructure', 'defi', 'nft', 'gaming')),
  status VARCHAR(50) NOT NULL CHECK (status IN ('planning', 'development', 'testing', 'launched', 'completed')),
  budget DECIMAL(15,2) NOT NULL,
  raised DECIMAL(15,2) DEFAULT 0,
  expected_return DECIMAL(5,2) NOT NULL,
  timeline VARCHAR(100) NOT NULL,
  crypto_type VARCHAR(10) NOT NULL CHECK (crypto_type IN ('ETH', 'SOL', 'BTC')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  team_size INTEGER NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_crypto_type ON projects(crypto_type);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- 업데이트 시간 자동 갱신을 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 프로젝트 테이블에 업데이트 트리거 추가
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 활성화
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 프로젝트를 읽을 수 있도록 정책 생성
CREATE POLICY "프로젝트 읽기 허용" ON projects
    FOR SELECT USING (true);

-- 인증된 사용자만 프로젝트를 생성/수정/삭제할 수 있도록 정책 생성
CREATE POLICY "프로젝트 관리 허용" ON projects
    FOR ALL USING (auth.role() = 'authenticated');

-- 샘플 데이터 삽입
INSERT INTO projects (title, description, category, status, budget, raised, expected_return, timeline, crypto_type, progress, team_size, technologies) VALUES
('부산 글로벌 비즈니스 허브 플랫폼', '국제 기업과 한국 기업을 연결하는 블록체인 기반 B2B 플랫폼', 'infrastructure', 'development', 500000.00, 125000.00, 15.50, '12개월', 'ETH', 35, 8, ARRAY['React', 'Node.js', 'Ethereum', 'IPFS']),
('부산 NFT 마켓플레이스', '부산의 문화와 관광을 테마로 한 NFT 거래 플랫폼', 'nft', 'planning', 200000.00, 45000.00, 22.30, '8개월', 'SOL', 15, 5, ARRAY['Next.js', 'Solana', 'Metaplex', 'Web3']),
('부산 DeFi 프로토콜', '부산 특화 금융 서비스를 제공하는 탈중앙화 금융 프로토콜', 'defi', 'testing', 800000.00, 320000.00, 18.70, '18개월', 'ETH', 75, 12, ARRAY['Solidity', 'Web3.js', 'React', 'Hardhat']),
('부산 메타버스 게임', '부산을 배경으로 한 메타버스 게임 플랫폼', 'gaming', 'launched', 300000.00, 300000.00, 25.00, '10개월', 'SOL', 100, 15, ARRAY['Unity', 'Solana', 'Web3', 'Unreal Engine']);

-- 뷰 생성: 프로젝트 통계
CREATE OR REPLACE VIEW project_stats AS
SELECT 
    COUNT(*) as total_projects,
    SUM(budget) as total_budget,
    SUM(raised) as total_raised,
    AVG(expected_return) as avg_expected_return,
    SUM(team_size) as total_team_members,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_projects,
    COUNT(CASE WHEN status = 'development' THEN 1 END) as development_projects,
    COUNT(CASE WHEN status = 'planning' THEN 1 END) as planning_projects
FROM projects;
