-- Global BUSAN 프로젝트 데이터베이스 스키마

-- 투자자 테이블 생성
CREATE TABLE IF NOT EXISTS investors (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  name VARCHAR(255),
  total_invested DECIMAL(15,2) DEFAULT 0,
  first_investment_date TIMESTAMP WITH TIME ZONE,
  last_investment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 프로젝트 테이블 생성
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('infrastructure', 'defi', 'nft', 'gaming', 'manufacturing', 'service', 'it', 'bio', 'finance', 'real_estate', 'tourism', 'logistics', 'energy', 'healthcare', 'education', 'agriculture', 'retail', 'construction', 'media', 'other')),
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

-- 투자 기록 테이블 생성
CREATE TABLE IF NOT EXISTS investments (
  id SERIAL PRIMARY KEY,
  investor_id INTEGER REFERENCES investors(id) ON DELETE CASCADE,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  crypto_type VARCHAR(10) NOT NULL CHECK (crypto_type IN ('ETH', 'SOL', 'BTC')),
  crypto_amount DECIMAL(20,8) NOT NULL,
  transaction_hash VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  investment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 프로젝트 지출 테이블 생성
CREATE TABLE IF NOT EXISTS project_expenses (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL CHECK (category IN ('development', 'marketing', 'infrastructure', 'legal', 'operations', 'other')),
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  expense_date DATE NOT NULL,
  receipt_url VARCHAR(500),
  approved_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_crypto_type ON projects(crypto_type);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

CREATE INDEX IF NOT EXISTS idx_investors_wallet_address ON investors(wallet_address);
CREATE INDEX IF NOT EXISTS idx_investors_total_invested ON investors(total_invested);

CREATE INDEX IF NOT EXISTS idx_investments_investor_id ON investments(investor_id);
CREATE INDEX IF NOT EXISTS idx_investments_project_id ON investments(project_id);
CREATE INDEX IF NOT EXISTS idx_investments_status ON investments(status);
CREATE INDEX IF NOT EXISTS idx_investments_investment_date ON investments(investment_date);

CREATE INDEX IF NOT EXISTS idx_expenses_project_id ON project_expenses(project_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON project_expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON project_expenses(expense_date);

-- 업데이트 시간 자동 갱신을 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 모든 테이블에 업데이트 트리거 추가
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investors_updated_at 
    BEFORE UPDATE ON investors 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at 
    BEFORE UPDATE ON project_expenses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 활성화
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_expenses ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 프로젝트를 읽을 수 있도록 정책 생성
CREATE POLICY "프로젝트 읽기 허용" ON projects
    FOR SELECT USING (true);

-- 인증된 사용자만 프로젝트를 생성/수정/삭제할 수 있도록 정책 생성
CREATE POLICY "프로젝트 관리 허용" ON projects
    FOR ALL USING (auth.role() = 'authenticated');

-- 투자자 정책
CREATE POLICY "투자자 읽기 허용" ON investors
    FOR SELECT USING (true);

CREATE POLICY "투자자 관리 허용" ON investors
    FOR ALL USING (auth.role() = 'authenticated');

-- 투자 기록 정책
CREATE POLICY "투자 기록 읽기 허용" ON investments
    FOR SELECT USING (true);

CREATE POLICY "투자 기록 관리 허용" ON investments
    FOR ALL USING (auth.role() = 'authenticated');

-- 지출 정책
CREATE POLICY "지출 읽기 허용" ON project_expenses
    FOR SELECT USING (true);

CREATE POLICY "지출 관리 허용" ON project_expenses
    FOR ALL USING (auth.role() = 'authenticated');

-- 샘플 데이터 삽입

-- 프로젝트 데이터
INSERT INTO projects (title, description, category, status, budget, raised, expected_return, timeline, crypto_type, progress, team_size, technologies) VALUES
('부산 글로벌 비즈니스 허브 플랫폼', '국제 기업과 한국 기업을 연결하는 블록체인 기반 B2B 플랫폼', 'infrastructure', 'development', 500000.00, 125000.00, 15.50, '12개월', 'ETH', 35, 8, ARRAY['React', 'Node.js', 'Ethereum', 'IPFS']),
('부산 NFT 마켓플레이스', '부산의 문화와 관광을 테마로 한 NFT 거래 플랫폼', 'nft', 'planning', 200000.00, 45000.00, 22.30, '8개월', 'SOL', 15, 5, ARRAY['Next.js', 'Solana', 'Metaplex', 'Web3']),
('부산 DeFi 프로토콜', '부산 특화 금융 서비스를 제공하는 탈중앙화 금융 프로토콜', 'defi', 'testing', 800000.00, 320000.00, 18.70, '18개월', 'ETH', 75, 12, ARRAY['Solidity', 'Web3.js', 'React', 'Hardhat']),
('부산 메타버스 게임', '부산을 배경으로 한 메타버스 게임 플랫폼', 'gaming', 'launched', 300000.00, 300000.00, 25.00, '10개월', 'SOL', 100, 15, ARRAY['Unity', 'Solana', 'Web3', 'Unreal Engine']),
('부산 스마트시티 IoT 플랫폼', '부산시와 연계한 스마트시티 IoT 인프라 구축', 'infrastructure', 'development', 1200000.00, 180000.00, 12.80, '24개월', 'ETH', 20, 20, ARRAY['IoT', 'Blockchain', 'AI', 'Big Data']),
('부산 관광 NFT 컬렉션', '부산의 명소와 문화를 NFT로 구현한 관광 프로젝트', 'nft', 'planning', 150000.00, 25000.00, 28.50, '6개월', 'SOL', 10, 6, ARRAY['NFT', 'Tourism', 'AR', 'Metaverse']);

-- 투자자 데이터
INSERT INTO investors (wallet_address, email, name, total_invested, first_investment_date, last_investment_date) VALUES
('0x1234567890abcdef1234567890abcdef12345678', 'investor1@example.com', '김투자', 50000.00, '2024-01-15 10:30:00', '2024-03-20 14:22:00'),
('0x2345678901bcdef1234567890abcdef1234567890', 'investor2@example.com', '이벤처', 75000.00, '2024-02-01 09:15:00', '2024-03-25 16:45:00'),
('0x3456789012cdef1234567890abcdef12345678901', 'investor3@example.com', '박크립토', 120000.00, '2024-01-20 11:20:00', '2024-03-28 13:30:00'),
('0x4567890123def1234567890abcdef123456789012', 'investor4@example.com', '최블록체인', 30000.00, '2024-02-15 15:10:00', '2024-03-15 12:00:00'),
('0x5678901234ef1234567890abcdef1234567890123', 'investor5@example.com', '정디파이', 85000.00, '2024-01-25 08:45:00', '2024-03-30 17:20:00'),
('0x6789012345f1234567890abcdef12345678901234', 'investor6@example.com', '한메타버스', 95000.00, '2024-02-10 14:30:00', '2024-03-22 10:15:00'),
('0x78901234561234567890abcdef123456789012345', 'investor7@example.com', '강인프라', 110000.00, '2024-01-30 16:00:00', '2024-03-26 11:40:00'),
('0x8901234567234567890abcdef1234567890123456', 'investor8@example.com', '윤게임', 65000.00, '2024-02-05 12:25:00', '2024-03-18 15:55:00');

-- 투자 기록 데이터
INSERT INTO investments (investor_id, project_id, amount, crypto_type, crypto_amount, transaction_hash, status, investment_date) VALUES
(1, 1, 25000.00, 'ETH', 10.5, '0xabc123def456...', 'confirmed', '2024-01-15 10:30:00'),
(1, 2, 15000.00, 'SOL', 150.0, '0xdef456ghi789...', 'confirmed', '2024-02-10 14:22:00'),
(1, 3, 10000.00, 'ETH', 4.2, '0xghi789jkl012...', 'confirmed', '2024-03-20 14:22:00'),
(2, 1, 30000.00, 'ETH', 12.6, '0xjkl012mno345...', 'confirmed', '2024-02-01 09:15:00'),
(2, 3, 25000.00, 'ETH', 10.5, '0xmno345pqr678...', 'confirmed', '2024-02-15 11:30:00'),
(2, 4, 20000.00, 'SOL', 200.0, '0xpqr678stu901...', 'confirmed', '2024-03-25 16:45:00'),
(3, 1, 50000.00, 'ETH', 21.0, '0xstu901vwx234...', 'confirmed', '2024-01-20 11:20:00'),
(3, 3, 40000.00, 'ETH', 16.8, '0xvwx234yza567...', 'confirmed', '2024-02-20 13:45:00'),
(3, 5, 30000.00, 'ETH', 12.6, '0xyza567bcd890...', 'confirmed', '2024-03-28 13:30:00'),
(4, 2, 20000.00, 'SOL', 200.0, '0xbcd890efg123...', 'confirmed', '2024-02-15 15:10:00'),
(4, 6, 10000.00, 'SOL', 100.0, '0xefg123hij456...', 'confirmed', '2024-03-15 12:00:00'),
(5, 1, 35000.00, 'ETH', 14.7, '0xhij456klm789...', 'confirmed', '2024-01-25 08:45:00'),
(5, 4, 30000.00, 'SOL', 300.0, '0xklm789nop012...', 'confirmed', '2024-02-25 10:20:00'),
(5, 5, 20000.00, 'ETH', 8.4, '0xnop012qrs345...', 'confirmed', '2024-03-30 17:20:00'),
(6, 2, 25000.00, 'SOL', 250.0, '0xqrs345tuv678...', 'confirmed', '2024-02-10 14:30:00'),
(6, 4, 40000.00, 'SOL', 400.0, '0xtuv678wxy901...', 'confirmed', '2024-03-10 16:15:00'),
(6, 6, 30000.00, 'SOL', 300.0, '0xwxy901zab234...', 'confirmed', '2024-03-22 10:15:00'),
(7, 1, 40000.00, 'ETH', 16.8, '0xzab234cde567...', 'confirmed', '2024-01-30 16:00:00'),
(7, 3, 35000.00, 'ETH', 14.7, '0xcde567fgh890...', 'confirmed', '2024-02-28 14:30:00'),
(7, 5, 35000.00, 'ETH', 14.7, '0xfgh890ijk123...', 'confirmed', '2024-03-26 11:40:00'),
(8, 2, 15000.00, 'SOL', 150.0, '0xijk123lmn456...', 'confirmed', '2024-02-05 12:25:00'),
(8, 4, 30000.00, 'SOL', 300.0, '0xlmn456opq789...', 'confirmed', '2024-03-05 15:30:00'),
(8, 6, 20000.00, 'SOL', 200.0, '0xopq789rst012...', 'confirmed', '2024-03-18 15:55:00');

-- 프로젝트 지출 데이터
INSERT INTO project_expenses (project_id, category, description, amount, expense_date, approved_by) VALUES
-- 프로젝트 1 지출
(1, 'development', '프론트엔드 개발자 3명 월급', 15000.00, '2024-01-31', 'admin'),
(1, 'development', '백엔드 개발자 2명 월급', 12000.00, '2024-01-31', 'admin'),
(1, 'infrastructure', 'AWS 클라우드 서버 비용', 2500.00, '2024-01-31', 'admin'),
(1, 'development', '블록체인 개발자 2명 월급', 18000.00, '2024-02-29', 'admin'),
(1, 'infrastructure', '데이터베이스 서버 비용', 1500.00, '2024-02-29', 'admin'),
(1, 'marketing', '마케팅 캠페인 비용', 5000.00, '2024-02-29', 'admin'),
(1, 'development', 'UI/UX 디자이너 월급', 8000.00, '2024-03-31', 'admin'),
(1, 'legal', '법무 자문비', 3000.00, '2024-03-31', 'admin'),

-- 프로젝트 2 지출
(2, 'development', 'NFT 개발자 2명 월급', 10000.00, '2024-02-29', 'admin'),
(2, 'development', '프론트엔드 개발자 월급', 6000.00, '2024-02-29', 'admin'),
(2, 'infrastructure', 'IPFS 스토리지 비용', 800.00, '2024-02-29', 'admin'),
(2, 'marketing', 'NFT 마케팅 비용', 3000.00, '2024-03-31', 'admin'),

-- 프로젝트 3 지출
(3, 'development', 'Solidity 개발자 4명 월급', 24000.00, '2024-01-31', 'admin'),
(3, 'development', '보안 전문가 월급', 12000.00, '2024-01-31', 'admin'),
(3, 'infrastructure', '이더리움 노드 운영비', 2000.00, '2024-01-31', 'admin'),
(3, 'development', '프론트엔드 개발자 3명 월급', 15000.00, '2024-02-29', 'admin'),
(3, 'testing', '보안 감사 비용', 15000.00, '2024-02-29', 'admin'),
(3, 'infrastructure', '스마트 컨트랙트 배포 비용', 500.00, '2024-02-29', 'admin'),
(3, 'development', '백엔드 개발자 2명 월급', 12000.00, '2024-03-31', 'admin'),
(3, 'legal', '규제 준수 자문비', 5000.00, '2024-03-31', 'admin'),

-- 프로젝트 4 지출
(4, 'development', '게임 개발자 5명 월급', 25000.00, '2024-01-31', 'admin'),
(4, 'development', '3D 아티스트 3명 월급', 15000.00, '2024-01-31', 'admin'),
(4, 'infrastructure', '게임 서버 운영비', 3000.00, '2024-01-31', 'admin'),
(4, 'development', 'Unity 개발자 4명 월급', 20000.00, '2024-02-29', 'admin'),
(4, 'marketing', '게임 마케팅 비용', 10000.00, '2024-02-29', 'admin'),
(4, 'development', '사운드 디자이너 월급', 8000.00, '2024-03-31', 'admin'),
(4, 'operations', '고객지원팀 월급', 5000.00, '2024-03-31', 'admin'),

-- 프로젝트 5 지출
(5, 'development', 'IoT 개발자 6명 월급', 30000.00, '2024-02-29', 'admin'),
(5, 'development', 'AI 엔지니어 4명 월급', 24000.00, '2024-02-29', 'admin'),
(5, 'infrastructure', 'IoT 센서 구매비', 15000.00, '2024-02-29', 'admin'),
(5, 'infrastructure', '클라우드 서버 비용', 5000.00, '2024-03-31', 'admin'),
(5, 'legal', '정부 협의 비용', 8000.00, '2024-03-31', 'admin'),

-- 프로젝트 6 지출
(6, 'development', 'NFT 아티스트 3명 월급', 12000.00, '2024-03-31', 'admin'),
(6, 'development', 'AR 개발자 2명 월급', 10000.00, '2024-03-31', 'admin'),
(6, 'marketing', '관광청 협력 마케팅', 5000.00, '2024-03-31', 'admin');

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

-- 뷰 생성: 투자자 통계
CREATE OR REPLACE VIEW investor_stats AS
SELECT 
    COUNT(*) as total_investors,
    SUM(total_invested) as total_invested_amount,
    AVG(total_invested) as avg_investment_per_investor,
    MAX(total_invested) as max_investment,
    MIN(total_invested) as min_investment,
    COUNT(CASE WHEN first_investment_date >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_investors_30_days
FROM investors;

-- 뷰 생성: 투자 기록 통계
CREATE OR REPLACE VIEW investment_stats AS
SELECT 
    COUNT(*) as total_investments,
    SUM(amount) as total_investment_amount,
    AVG(amount) as avg_investment_amount,
    COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_investments,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_investments,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_investments,
    COUNT(CASE WHEN investment_date >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as investments_30_days,
    SUM(CASE WHEN investment_date >= CURRENT_DATE - INTERVAL '30 days' THEN amount ELSE 0 END) as investment_amount_30_days
FROM investments;

-- 뷰 생성: 프로젝트별 지출 통계
CREATE OR REPLACE VIEW project_expense_stats AS
SELECT 
    p.id as project_id,
    p.title as project_title,
    p.budget as project_budget,
    p.raised as project_raised,
    COALESCE(SUM(pe.amount), 0) as total_expenses,
    COALESCE(SUM(pe.amount), 0) / p.budget * 100 as expense_percentage,
    COUNT(pe.id) as expense_count,
    COALESCE(SUM(CASE WHEN pe.category = 'development' THEN pe.amount ELSE 0 END), 0) as development_expenses,
    COALESCE(SUM(CASE WHEN pe.category = 'marketing' THEN pe.amount ELSE 0 END), 0) as marketing_expenses,
    COALESCE(SUM(CASE WHEN pe.category = 'infrastructure' THEN pe.amount ELSE 0 END), 0) as infrastructure_expenses,
    COALESCE(SUM(CASE WHEN pe.category = 'legal' THEN pe.amount ELSE 0 END), 0) as legal_expenses,
    COALESCE(SUM(CASE WHEN pe.category = 'operations' THEN pe.amount ELSE 0 END), 0) as operations_expenses
FROM projects p
LEFT JOIN project_expenses pe ON p.id = pe.project_id
GROUP BY p.id, p.title, p.budget, p.raised;

-- 뷰 생성: 월별 투자 통계
CREATE OR REPLACE VIEW monthly_investment_stats AS
SELECT 
    DATE_TRUNC('month', investment_date) as month,
    COUNT(*) as investment_count,
    SUM(amount) as total_amount,
    AVG(amount) as avg_amount,
    COUNT(DISTINCT investor_id) as unique_investors,
    COUNT(CASE WHEN crypto_type = 'ETH' THEN 1 END) as eth_investments,
    COUNT(CASE WHEN crypto_type = 'SOL' THEN 1 END) as sol_investments,
    COUNT(CASE WHEN crypto_type = 'BTC' THEN 1 END) as btc_investments
FROM investments
WHERE status = 'confirmed'
GROUP BY DATE_TRUNC('month', investment_date)
ORDER BY month DESC;

-- 뷰 생성: 월별 지출 통계
CREATE OR REPLACE VIEW monthly_expense_stats AS
SELECT 
    DATE_TRUNC('month', expense_date) as month,
    COUNT(*) as expense_count,
    SUM(amount) as total_amount,
    AVG(amount) as avg_amount,
    SUM(CASE WHEN category = 'development' THEN amount ELSE 0 END) as development_amount,
    SUM(CASE WHEN category = 'marketing' THEN amount ELSE 0 END) as marketing_amount,
    SUM(CASE WHEN category = 'infrastructure' THEN amount ELSE 0 END) as infrastructure_amount,
    SUM(CASE WHEN category = 'legal' THEN amount ELSE 0 END) as legal_amount,
    SUM(CASE WHEN category = 'operations' THEN amount ELSE 0 END) as operations_amount
FROM project_expenses
GROUP BY DATE_TRUNC('month', expense_date)
ORDER BY month DESC;

-- 함수 생성: 투자자별 투자 내역 조회
CREATE OR REPLACE FUNCTION get_investor_investments(investor_wallet_address VARCHAR)
RETURNS TABLE (
    investment_id INTEGER,
    project_title VARCHAR,
    amount DECIMAL,
    crypto_type VARCHAR,
    crypto_amount DECIMAL,
    investment_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        p.title,
        i.amount,
        i.crypto_type,
        i.crypto_amount,
        i.investment_date,
        i.status
    FROM investments i
    JOIN projects p ON i.project_id = p.id
    JOIN investors inv ON i.investor_id = inv.id
    WHERE inv.wallet_address = investor_wallet_address
    ORDER BY i.investment_date DESC;
END;
$$ LANGUAGE plpgsql;

-- 함수 생성: 프로젝트별 투자자 목록 조회
CREATE OR REPLACE FUNCTION get_project_investors(project_id_param INTEGER)
RETURNS TABLE (
    investor_name VARCHAR,
    wallet_address VARCHAR,
    total_invested DECIMAL,
    investment_count BIGINT,
    first_investment_date TIMESTAMP WITH TIME ZONE,
    last_investment_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        inv.name,
        inv.wallet_address,
        inv.total_invested,
        COUNT(i.id) as investment_count,
        MIN(i.investment_date) as first_investment_date,
        MAX(i.investment_date) as last_investment_date
    FROM investors inv
    JOIN investments i ON inv.id = i.investor_id
    WHERE i.project_id = project_id_param AND i.status = 'confirmed'
    GROUP BY inv.id, inv.name, inv.wallet_address, inv.total_invested
    ORDER BY inv.total_invested DESC;
END;
$$ LANGUAGE plpgsql;
