import { useState, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { getCourse } from '../lib/api';
import { Clock, MapPin, Users, Star, ArrowRight, BookOpen } from 'lucide-react';

const fallbackCourses: Record<string, any> = {
  '1': { id: 1, emoji: '🚀', title: 'AI 실전 프로젝트', description: 'GPT + 바이브코딩으로 실제 서비스를 만드는 4주 실전반. 개발 경험 없이도 나만의 AI 서비스를 배포까지 완성합니다.', instructor: '부산AI랩', rating: 4.9, students: 120, level: '실전', duration: '4주 (주1회 2시간)', category: 'adult', price: '39만원', region: '서면', target: '직장인·자영업자·프리랜서', tag: '인기', gradient: 'linear-gradient(135deg, #FF6B35, #FF8F5E)' },
  '2': { id: 2, emoji: '🎨', title: 'AI Creative Lab', description: 'AI로 캐릭터, 그림책, 영상을 만드는 프리미엄 창작 교육. 아이들이 AI를 도구로 활용해 창작물을 완성합니다.', instructor: '부산AI랩', rating: 4.8, students: 45, level: '입문', duration: '8주 (주1회 2시간)', category: 'kids', price: '50만원', region: '해운대', target: '초4~중3', tag: '프리미엄', gradient: 'linear-gradient(135deg, #0F3A7D, #4A9FE5)' },
  '3': { id: 3, emoji: '💼', title: 'AI 업무자동화', description: 'ChatGPT 실무, 문서 자동화, AI 마케팅. 기업/사업체 맞춤 커스텀 교육 프로그램.', instructor: '부산AI랩', rating: 4.7, students: 30, level: '심화', duration: '커스텀', category: 'biz', price: '120만원', region: '사상', target: '기업·중소사업자', tag: '기업', gradient: 'linear-gradient(135deg, #10B981, #059669)' },
};

const curriculum = [
  { week: '1주차', title: '입문 — AI 기초와 프롬프트', items: ['ChatGPT 사용법', '프롬프트 엔지니어링 기초', '실습: 나만의 프롬프트 만들기'] },
  { week: '2주차', title: '실전 — AI 자동화 도구', items: ['GPT API 활용법', 'n8n/Make 자동화', '실습: 업무 자동화 워크플로우'] },
  { week: '3주차', title: '프로젝트 — 바이브코딩', items: ['바이브코딩 개념과 실습', 'Cursor/Replit으로 앱 만들기', '실습: 나만의 웹앱 개발'] },
  { week: '4주차', title: '수익화 — 배포와 런칭', items: ['배포 및 공개', '포트폴리오 정리', '수익화 전략 및 네트워킹'] },
];

export default function CourseDetail() {
  const params = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    const id = params.id || '1';
    getCourse(id).then(res => {
      if (res.success && res.data) setCourse(res.data);
      else setCourse(fallbackCourses[id] || fallbackCourses['1']);
    });
  }, [params.id]);

  if (!course) return <div className="page-content" style={{ padding: '4rem', textAlign: 'center' }}>로딩 중...</div>;

  return (
    <div className="page-content">
      {/* Hero */}
      <div style={{ background: course.gradient || 'var(--gradient-ocean)', padding: '3rem 0', color: '#fff' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>{course.tag}</span>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}><MapPin size={12} style={{ marginRight: 2 }} />{course.region}</span>
          </div>
          <h1 style={{ color: '#fff', marginBottom: '0.75rem' }}>{course.emoji} {course.title}</h1>
          <p style={{ opacity: 0.9, fontSize: '1.1rem', maxWidth: 600 }}>{course.description}</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
          {/* Main */}
          <div>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}><Clock size={16} />{course.duration}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}><Users size={16} />{course.target}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-warning)' }}><Star size={16} />{course.rating}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}><BookOpen size={16} />{course.level}</div>
            </div>

            <h2 style={{ marginBottom: '1.5rem' }}>📋 커리큘럼</h2>
            {curriculum.map((week, i) => (
              <div key={i} className="card" style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary">{week.week}</span>
                  <h3 style={{ fontSize: '1rem' }}>{week.title}</h3>
                </div>
                <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {week.items.map((item, j) => <li key={j} style={{ marginBottom: '0.25rem' }}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div>
            <div className="card" style={{ position: 'sticky', top: 80 }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-sunrise)', marginBottom: '0.5rem' }}>{course.price}</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>부가세 포함 · 교재 제공</p>
              <Link href="/events" className="btn btn-primary" style={{ width: '100%', marginBottom: '0.75rem' }}>
                수강 신청하기 <ArrowRight size={16} />
              </Link>
              <Link href="/events" className="btn btn-secondary" style={{ width: '100%' }}>
                무료 설명회 먼저 참가
              </Link>
              <hr style={{ margin: '1.25rem 0', border: 'none', borderTop: '1px solid var(--border)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>수강생</span><strong style={{ color: 'var(--text-primary)' }}>{course.students}명+</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>강사</span><strong style={{ color: 'var(--text-primary)' }}>{course.instructor}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>지역</span><strong style={{ color: 'var(--text-primary)' }}>{course.region}</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
