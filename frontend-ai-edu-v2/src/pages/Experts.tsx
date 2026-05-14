import { useState, useEffect } from 'react';
import { getExperts } from '../lib/api';
import { Star, MapPin, CheckCircle, Briefcase } from 'lucide-react';

const fallbackExperts = [
  { id: 1, name: '김민수', role: 'AI 개발자', bio: '부산 AI 실전 프로젝트 5년 경력. GPT 자동화 전문가.', skills: ['GPT', '자동화', 'Python', 'React'], avatar: '🧑‍💻', rating: 4.9, projects_count: 12, region: '서면', verified: true },
  { id: 2, name: '박지영', role: 'AI 크리에이터', bio: 'AI 콘텐츠 제작 및 키즈 AI 교육 전문.', skills: ['Midjourney', '영상제작', 'GPT', '교육'], avatar: '👩‍🎨', rating: 4.8, projects_count: 8, region: '해운대', verified: true },
  { id: 3, name: '이정호', role: 'AI 컨설턴트', bio: '제조업 AI 자동화 도입 컨설팅. 부산 중소기업 전문.', skills: ['자동화', 'n8n', 'ChatGPT', '문서자동화'], avatar: '👨‍💼', rating: 4.7, projects_count: 15, region: '사상', verified: true },
  { id: 4, name: '최수진', role: 'AI 마케터', bio: '인스타/당근 마케팅 자동화. 로컬 비즈니스 전문.', skills: ['마케팅', 'GPT', '콘텐츠', '분석'], avatar: '👩‍💻', rating: 4.6, projects_count: 10, region: '수영', verified: false },
];

export default function Experts() {
  const [experts, setExperts] = useState(fallbackExperts);
  const [regionFilter, setRegionFilter] = useState('');

  useEffect(() => {
    getExperts(regionFilter || undefined).then(res => {
      if (res.success && res.data?.length) setExperts(res.data);
    });
  }, [regionFilter]);

  const regions = ['', '서면', '해운대', '사상', '수영'];

  return (
    <div className="page-content">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div className="section-title">
          <h1>👥 전문가 네트워크</h1>
          <p>부산 AI 전문가를 찾아 프로젝트를 함께하세요</p>
        </div>

        <div className="region-tabs" style={{ marginBottom: '2rem' }}>
          {regions.map(r => (
            <button key={r} className={`region-tab ${regionFilter === r ? 'active' : ''}`} onClick={() => setRegionFilter(r)}>
              {r || '전체'}
            </button>
          ))}
        </div>

        <div className="grid grid-2">
          {experts.map(exp => (
            <div className="card" key={exp.id} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '2.5rem', flexShrink: 0 }}>{exp.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: '1.1rem' }}>{exp.name}</h3>
                  {exp.verified && <CheckCircle size={16} color="var(--color-success)" />}
                </div>
                <p style={{ color: 'var(--color-ocean)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{exp.role}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{exp.bio}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.75rem' }}>
                  {exp.skills?.map((s: string) => <span key={s} className="badge badge-primary">{s}</span>)}
                </div>
                <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                  <span><Star size={13} style={{ marginRight: 3, verticalAlign: 'middle', color: 'var(--color-warning)' }} />{exp.rating}</span>
                  <span><Briefcase size={13} style={{ marginRight: 3, verticalAlign: 'middle' }} />{exp.projects_count}건</span>
                  <span><MapPin size={13} style={{ marginRight: 3, verticalAlign: 'middle' }} />{exp.region}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
