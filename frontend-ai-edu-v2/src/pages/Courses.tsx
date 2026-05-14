import { useState } from 'react';
import { Link } from 'wouter';
import { Clock, MapPin, Users, ChevronRight, BookOpen, Briefcase, Baby, Heart } from 'lucide-react';

const allCourses = [
  { id: 1, emoji: '🚀', title: 'AI 실전 프로젝트', desc: 'GPT + 바이브코딩으로 실제 서비스를 만드는 4주 실전반', target: '직장인 · 자영업자 · 프리랜서', price: '39만원', duration: '4주 (주1회 2시간)', region: '서면', category: 'adult', tag: '인기', gradient: 'linear-gradient(135deg, #FF6B35, #FF8F5E)' },
  { id: 2, emoji: '🎨', title: 'AI Creative Lab', desc: 'AI로 캐릭터, 그림책, 영상을 만드는 프리미엄 창작 교육', target: '초4 ~ 중3', price: '50만원', duration: '8주 (주1회 2시간)', region: '해운대', category: 'kids', tag: '프리미엄', gradient: 'linear-gradient(135deg, #0F3A7D, #4A9FE5)' },
  { id: 3, emoji: '💼', title: 'AI 업무자동화', desc: 'ChatGPT 실무, 문서 자동화, AI 마케팅 기업 맞춤 교육', target: '기업 · 중소사업자', price: '120만원', duration: '커스텀', region: '사상', category: 'biz', tag: '기업', gradient: 'linear-gradient(135deg, #10B981, #059669)' },
  { id: 4, emoji: '📱', title: 'AI 입문반', desc: 'ChatGPT 기초, 프롬프트 작성법, AI 콘텐츠 제작 입문', target: '누구나', price: '15만원', duration: '2주 (주1회 2시간)', region: '전체', category: 'adult', tag: '입문', gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' },
  { id: 5, emoji: '🧠', title: 'AI 공부법 + 입시', desc: 'GPT로 발표자료, 독서정리, 영어학습을 혁신하는 과정', target: '중등 · 고등', price: '35만원', duration: '4주', region: '동래', category: 'kids', tag: '입시', gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)' },
  { id: 6, emoji: '👴', title: '시니어 AI 생활', desc: '스마트폰 AI, 음성비서, 사진복원, 손주 영상 만들기', target: '60대 이상', price: '무료~5만원', duration: '4주', region: '북구', category: 'senior', tag: '생활', gradient: 'linear-gradient(135deg, #EF4444, #F87171)' },
];

const categories = [
  { key: 'all', label: '전체', icon: BookOpen },
  { key: 'adult', label: '성인', icon: Briefcase },
  { key: 'kids', label: '키즈', icon: Baby },
  { key: 'biz', label: '기업', icon: Users },
  { key: 'senior', label: '시니어', icon: Heart },
];

export default function Courses() {
  const [category, setCategory] = useState('all');
  const filtered = category === 'all' ? allCourses : allCourses.filter(c => c.category === category);

  return (
    <div className="page-content">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div className="section-title">
          <h1>📚 AI 교육 프로그램</h1>
          <p>부산 지역 AI 교육 수요에 최적화된 실전 커리큘럼</p>
        </div>

        {/* Journey Map */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {['입문', '실전', '프로젝트', '수익화'].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', background: i === 0 ? 'var(--color-ocean)' : 'var(--bg-secondary)', color: i === 0 ? '#fff' : 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>
                {step}
              </div>
              {i < 3 && <ChevronRight size={16} color="var(--text-tertiary)" />}
            </div>
          ))}
        </div>

        {/* Category Filter */}
        <div className="tabs" style={{ justifyContent: 'center', borderBottom: 'none', marginBottom: '2rem' }}>
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button key={cat.key} className={`tab ${category === cat.key ? 'active' : ''}`}
                onClick={() => setCategory(cat.key)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: category === cat.key ? '2px solid var(--color-ocean)' : '2px solid transparent' }}>
                <Icon size={16} /> {cat.label}
              </button>
            );
          })}
        </div>

        {/* Course Grid */}
        <div className="grid grid-3">
          {filtered.map(c => (
            <Link href={`/courses/${c.id}`} key={c.id}>
              <div className="course-card" style={{ cursor: 'pointer' }}>
                <div className="course-card-img" style={{ background: c.gradient }}>
                  <span>{c.emoji}</span>
                </div>
                <div className="course-card-body">
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span className="badge badge-orange">{c.tag}</span>
                    <span className="badge" style={{ background: 'var(--bg-secondary)' }}>
                      <MapPin size={12} style={{ marginRight: 2 }} />{c.region}
                    </span>
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: '0.75rem' }}>
                    <Users size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />{c.target}
                  </p>
                  <div className="course-card-meta">
                    <span className="course-card-price">{c.price}</span>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                      <Clock size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />{c.duration}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
