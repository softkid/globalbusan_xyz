import { useState } from 'react';
import { Link } from 'wouter';
import { GraduationCap, Users, FolderKanban, UserCheck, Store, Wrench, Globe, ArrowRight, Sparkles, Clock, ChevronRight, MapPin } from 'lucide-react';

const modules = [
  { icon: GraduationCap, title: 'AI 교육 OS', desc: '실전 기반 AI 교육. 입문부터 수익화까지.', color: '#0F3A7D', path: '/courses' },
  { icon: Users, title: '커뮤니티 허브', desc: '부산 AI Builder 네트워크. 챌린지와 프로젝트.', color: '#4A9FE5', path: '/community' },
  { icon: FolderKanban, title: '프로젝트 빌더', desc: 'AI 프로젝트 팀빌딩과 데모데이.', color: '#10B981', path: '/projects' },
  { icon: UserCheck, title: '전문가 네트워크', desc: '강사, 개발자, 디자이너 연결.', color: '#8B5CF6', path: '/experts' },
  { icon: Store, title: 'AI 구축 마켓', desc: '부산 자영업자 ↔ AI 실무자 매칭.', color: '#FF6B35', path: '/market' },
  { icon: Wrench, title: 'SaaS 도구', desc: '프롬프트 라이브러리, 워크플로우 템플릿.', color: '#F59E0B', path: '/tools' },
  { icon: Globe, title: 'AI 생활 포털', desc: '부산 AI 종합 정보 허브.', color: '#EF4444', path: '/' },
];

const courses = [
  { emoji: '🚀', title: 'AI 실전 프로젝트', target: '성인 · 직장인 · 자영업자', price: '39만원', duration: '4주', tag: '인기', region: '서면' },
  { emoji: '🎨', title: 'AI Creative Lab', target: '초등 4학년 ~ 중등 3학년', price: '50만원', duration: '8주', tag: '프리미엄', region: '해운대' },
  { emoji: '💼', title: 'AI 업무자동화', target: '기업 · 중소사업자', price: '120만원', duration: '커스텀', tag: '기업', region: '사상' },
];

const cases = [
  { before: '카페 메뉴 설명 작성에 매번 1시간 이상 소요', after: 'GPT로 10분 만에 메뉴 설명 + 인스타 문구 자동 생성', who: '해운대 카페 사장님', emoji: '☕' },
  { before: '리뷰 답변, 예약 관리에 하루 2시간 소모', after: 'AI 자동화로 90% 업무 감소, 매출 집중', who: '부산진구 미용실 원장님', emoji: '💇' },
  { before: '학원 상담 전화 놓침, 학부모 불만 증가', after: 'GPT 챗봇으로 24시간 자동 상담, 등록률 40% 향상', who: '동래 영어학원', emoji: '📚' },
];

const regions = [
  { name: '해운대', emoji: '🏖️', desc: 'AI 영재교육 · 프리미엄 키즈', message: '"AI 시대 아이의 경쟁력"', color: '#4A9FE5' },
  { name: '서면', emoji: '🏙️', desc: 'AI 부업 · 업무자동화 · 바이브코딩', message: '"개발 몰라도 AI로 월수익"', color: '#FF6B35' },
  { name: '사상', emoji: '🏭', desc: 'AI 자동화 구축 · 제조업 혁신', message: '"사장님 AI 생산성 혁신"', color: '#10B981' },
  { name: '수영', emoji: '🌊', desc: '소수정예 AI 크리에이터 클래스', message: '"프리미엄 미래교육"', color: '#8B5CF6' },
];

export default function Home() {
  const [activeRegion, setActiveRegion] = useState(0);

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content animate-fade-in-up">
            <div className="badge badge-orange" style={{ marginBottom: '1rem' }}>
              <Sparkles size={14} style={{ marginRight: 4 }} /> 부산 AI 생태계 플랫폼
            </div>
            <h1>부산의 AI 시대를<br/>함께 만듭니다</h1>
            <p>교육으로 시작하고, 커뮤니티로 성장하고,<br/>프로젝트와 수익화로 연결되는 부산 AI 경제 생태계</p>
            <div className="hero-actions">
              <Link href="/events" className="btn btn-lg animate-pulse-glow" style={{ background: '#fff', color: 'var(--color-ocean)', fontWeight: 700 }}>
                무료 설명회 예약하기 <ArrowRight size={18} />
              </Link>
              <Link href="/courses" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
                강좌 둘러보기
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><div className="hero-stat-number">320+</div><div className="hero-stat-label">누적 수강생</div></div>
              <div className="hero-stat"><div className="hero-stat-number">45+</div><div className="hero-stat-label">AI 프로젝트</div></div>
              <div className="hero-stat"><div className="hero-stat-number">80+</div><div className="hero-stat-label">변신 사례</div></div>
              <div className="hero-stat"><div className="hero-stat-number">15+</div><div className="hero-stat-label">파트너 기관</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* 7대 모듈 */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>🏗️ 7대 핵심 모듈</h2>
            <p>교육에서 수익화까지, 부산 AI 생태계의 모든 것</p>
          </div>
          <div className="grid grid-4" style={{ maxWidth: 1100, margin: '0 auto' }}>
            {modules.map((m, i) => {
              const Icon = m.icon;
              return (
                <Link href={m.path} key={i}>
                  <div className="card" style={{ textAlign: 'center', cursor: 'pointer', animationDelay: `${i * 0.08}s` }}>
                    <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: `${m.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                      <Icon size={24} color={m.color} />
                    </div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{m.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{m.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 인기 강좌 */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-title">
            <h2>📚 인기 강좌 TOP 3</h2>
            <p>부산 AI 교육 수요에 최적화된 실전 프로그램</p>
          </div>
          <div className="grid grid-3">
            {courses.map((c, i) => (
              <div className="course-card" key={i}>
                <div className="course-card-img" style={{ background: i === 0 ? 'var(--gradient-cta)' : i === 1 ? 'var(--gradient-ocean)' : 'linear-gradient(135deg, #10B981, #059669)' }}>
                  <span>{c.emoji}</span>
                </div>
                <div className="course-card-body">
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span className={`badge ${i === 0 ? 'badge-orange' : i === 1 ? 'badge-primary' : 'badge-success'}`}>{c.tag}</span>
                    <span className="badge" style={{ background: 'var(--bg-secondary)' }}>
                      <MapPin size={12} style={{ marginRight: 2 }} />{c.region}
                    </span>
                  </div>
                  <h3>{c.title}</h3>
                  <p><Users size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />{c.target}</p>
                  <div className="course-card-meta">
                    <span className="course-card-price">{c.price}</span>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}><Clock size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />{c.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/courses" className="btn btn-secondary">전체 강좌 보기 <ChevronRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* 부산 AI 변신 프로젝트 */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>✨ 부산 AI 변신 프로젝트</h2>
            <p>부산 시민들의 실제 AI 적용 Before → After 사례</p>
          </div>
          <div className="grid grid-3">
            {cases.map((c, i) => (
              <div className="card" key={i} style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.95rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>{c.emoji}</span> {c.who}
                </div>
                <div className="case-card" style={{ border: 'none', borderRadius: 0 }}>
                  <div className="case-card-before">
                    <div className="case-card-label">Before</div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{c.before}</p>
                  </div>
                  <div className="case-card-after">
                    <div className="case-card-label">After</div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{c.after}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 지역별 프로그램 */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-title">
            <h2>📍 지역별 맞춤 프로그램</h2>
            <p>부산 각 지역의 니즈에 최적화된 AI 교육</p>
          </div>
          <div className="region-tabs">
            {regions.map((r, i) => (
              <button key={i} className={`region-tab ${activeRegion === i ? 'active' : ''}`} onClick={() => setActiveRegion(i)}>
                {r.emoji} {r.name}
              </button>
            ))}
          </div>
          <div className="card" style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', padding: '2.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{regions[activeRegion].emoji}</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{regions[activeRegion].name} AI 프로그램</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{regions[activeRegion].desc}</p>
            <p style={{ color: regions[activeRegion].color, fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>{regions[activeRegion].message}</p>
            <Link href="/courses" className="btn btn-primary">프로그램 보기 <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* CTA 배너 */}
      <section style={{ background: 'var(--gradient-hero)', padding: '4rem 0', color: '#fff', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: '#fff', marginBottom: '1rem' }}>🎯 지금 무료 설명회에 참여하세요</h2>
          <p style={{ opacity: 0.9, marginBottom: '2rem', fontSize: '1.1rem' }}>개발 몰라도 가능한 AI 실전 활용, 부산에서 함께 시작합니다</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/events" className="btn btn-lg animate-pulse-glow" style={{ background: '#fff', color: 'var(--color-ocean)' }}>
              무료 설명회 예약 <ArrowRight size={18} />
            </Link>
            <a href="https://open.kakao.com" target="_blank" rel="noopener" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
              💬 오픈채팅 참여
            </a>
          </div>
        </div>
      </section>

      {/* Sticky CTA (mobile) */}
      <div className="sticky-cta">
        <Link href="/events" className="btn btn-primary" style={{ width: '100%' }}>
          🎯 무료 설명회 예약하기
        </Link>
      </div>
    </div>
  );
}
