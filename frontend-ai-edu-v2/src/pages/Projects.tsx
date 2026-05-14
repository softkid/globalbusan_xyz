import { useState, useEffect } from 'react';

import { getProjects } from '../lib/api';
import { Users, Calendar, Clock, ArrowRight, Plus, Target, CheckCircle } from 'lucide-react';

const fallbackProjects = [
  { id: 1, title: '부산 관광 AI 챗봇', description: '부산 관광정보를 제공하는 LLM 기반 챗봇 개발. 다국어 지원 및 실시간 추천 기능.', category: 'LLM', status: 'recruiting', creator: '김프로젝트', current_team: 2, target_team: 5, skills: ['Python', 'LLM', 'API', 'React'], start_date: '2026-05-15' },
  { id: 2, title: '자영업 리뷰 자동 분석기', description: '네이버/카카오 리뷰를 AI로 자동 분석하고 인사이트를 제공하는 대시보드.', category: '자동화', status: 'in_progress', creator: '이분석', current_team: 3, target_team: 4, skills: ['GPT', 'n8n', 'React', 'Supabase'], start_date: '2026-05-01' },
  { id: 3, title: 'AI 키즈 그림책 생성기', description: '아이들이 스토리를 입력하면 AI가 삽화를 그려 그림책을 완성하는 서비스.', category: 'Image AI', status: 'recruiting', creator: '박크리에이터', current_team: 1, target_team: 3, skills: ['Midjourney', 'GPT', 'React', 'Cloudflare'], start_date: '2026-06-01' },
  { id: 4, title: '부산 맛집 AI 추천 앱', description: '사용자 취향 기반 부산 맛집 추천. 위치/시간/인원/분위기 맞춤 필터링.', category: 'LLM', status: 'completed', creator: '최맛집', current_team: 4, target_team: 4, skills: ['GPT', 'React', 'Maps API'], start_date: '2026-03-15' },
  { id: 5, title: '제조업 문서 자동화 시스템', description: '사상구 제조업체의 품질보고서/작업지시서를 AI로 자동 생성하는 시스템.', category: '자동화', status: 'in_progress', creator: '정자동화', current_team: 2, target_team: 3, skills: ['GPT', 'n8n', '문서자동화', 'Python'], start_date: '2026-04-20' },
];

const statusMap: Record<string, { label: string; color: string; icon: any }> = {
  recruiting: { label: '모집중', color: 'var(--color-sunrise)', icon: Target },
  in_progress: { label: '진행중', color: 'var(--color-info)', icon: Clock },
  completed: { label: '완료', color: 'var(--color-success)', icon: CheckCircle },
};

export default function Projects() {
  const [projects, setProjects] = useState(fallbackProjects);
  const [filter, setFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', category: '', target_team: 4, skills: '' });

  useEffect(() => {
    getProjects().then(res => { if (res.success && res.data?.length) setProjects(res.data); });
  }, []);

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter);

  return (
    <div className="page-content">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>🏗️ 프로젝트 빌더</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>AI 프로젝트 팀빌딩과 협업 — 함께 만들고 함께 성장</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={18} /> 프로젝트 등록
          </button>
        </div>

        {/* Filters */}
        <div className="tabs" style={{ justifyContent: 'flex-start' }}>
          {[{ key: 'all', label: '전체' }, { key: 'recruiting', label: '🎯 모집중' }, { key: 'in_progress', label: '⚡ 진행중' }, { key: 'completed', label: '✅ 완료' }].map(f => (
            <button key={f.key} className={`tab ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>{f.label}</button>
          ))}
        </div>

        {/* Project List */}
        <div className="grid grid-2">
          {filtered.map(p => {
            const st = statusMap[p.status] || statusMap.recruiting;
            const StatusIcon = st.icon;
            const progress = (p.current_team / p.target_team) * 100;
            return (
              <div className="card" key={p.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge" style={{ background: `${st.color}15`, color: st.color }}><StatusIcon size={12} style={{ marginRight: 4 }} />{st.label}</span>
                  <span className="badge badge-primary">{p.category}</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{p.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.5 }}>{p.description}</p>

                {/* Skills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1rem' }}>
                  {p.skills?.map((s: string) => <span key={s} className="badge" style={{ background: 'var(--bg-secondary)', fontSize: '0.75rem' }}>{s}</span>)}
                </div>

                {/* Team Progress */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
                    <span><Users size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />팀원 {p.current_team}/{p.target_team}명</span>
                    <span><Calendar size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />{p.start_date}</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-secondary)', borderRadius: 3 }}>
                    <div style={{ width: `${progress}%`, height: '100%', borderRadius: 3, background: progress >= 100 ? 'var(--color-success)' : 'var(--gradient-cta)', transition: 'width 0.5s ease' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>by {p.creator}</span>
                  {p.status === 'recruiting' && (
                    <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>참여 신청 <ArrowRight size={14} /></button>
                  )}
                  {p.status === 'completed' && (
                    <span className="badge badge-success">🏆 데모 보기</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={() => setShowCreateModal(false)}>
            <div className="card" style={{ maxWidth: 500, width: '100%', maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
              <h2 style={{ marginBottom: '1.5rem' }}>🚀 새 프로젝트 등록</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.375rem' }}>프로젝트명</label>
                  <input type="text" placeholder="예: 부산 맛집 AI 추천 앱" value={newProject.title}
                    onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.95rem' }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.375rem' }}>설명</label>
                  <textarea placeholder="프로젝트 소개와 목표를 작성하세요" value={newProject.description}
                    onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                    style={{ width: '100%', minHeight: 80, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', resize: 'vertical', fontFamily: 'inherit' }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.375rem' }}>카테고리</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['LLM', '자동화', 'Image AI', '마케팅', '교육', '기타'].map(c => (
                      <button key={c} className={`region-tab ${newProject.category === c ? 'active' : ''}`}
                        onClick={() => setNewProject({ ...newProject, category: c })}>{c}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.375rem' }}>필요 스킬 (쉼표 구분)</label>
                  <input type="text" placeholder="예: GPT, React, Python" value={newProject.skills}
                    onChange={e => setNewProject({ ...newProject, skills: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.95rem' }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.375rem' }}>모집 인원</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[2, 3, 4, 5, 6].map(n => (
                      <button key={n} className={`region-tab ${newProject.target_team === n ? 'active' : ''}`}
                        onClick={() => setNewProject({ ...newProject, target_team: n })}>{n}명</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button className="btn btn-ghost" onClick={() => setShowCreateModal(false)} style={{ flex: 1 }}>취소</button>
                  <button className="btn btn-primary" style={{ flex: 2 }} disabled={!newProject.title || !newProject.category}
                    onClick={() => { setShowCreateModal(false); }}>
                    프로젝트 등록하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
