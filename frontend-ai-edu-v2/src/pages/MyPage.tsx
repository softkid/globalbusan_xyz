import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { BookOpen, CreditCard, Settings, LogOut, Award, Clock } from 'lucide-react';

const mockEnrollments = [
  { id: 1, title: 'AI 실전 프로젝트', status: '수강중', progress: 50, price: '39만원', date: '2026-05-10' },
  { id: 2, title: 'AI 입문반', status: '완료', progress: 100, price: '15만원', date: '2026-04-01' },
];

const mockPayments = [
  { id: 'PAY-2026051001', title: 'AI 실전 프로젝트 수강료', amount: '390,000원', method: '카카오페이', date: '2026-05-10', status: '완료' },
  { id: 'PAY-2026040101', title: 'AI 입문반 수강료', amount: '150,000원', method: '토스페이', date: '2026-04-01', status: '완료' },
];

export default function MyPage() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<'courses' | 'payments' | 'settings'>('courses');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('busan_ai_user');
    if (stored) setUser(JSON.parse(stored));
    else navigate('/auth');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('busan_ai_user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="page-content">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        {/* Profile Header */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--gradient-ocean)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#fff', flexShrink: 0 }}>
            {user.name?.charAt(0) || '👤'}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ marginBottom: '0.25rem' }}>{user.name || '사용자'}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user.email}</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <span className="badge badge-primary"><Award size={12} style={{ marginRight: 4 }} />AI Beginner</span>
              <span className="badge badge-success">활성 멤버</span>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={handleLogout} style={{ color: 'var(--color-error)' }}>
            <LogOut size={16} /> 로그아웃
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${tab === 'courses' ? 'active' : ''}`} onClick={() => setTab('courses')}>
            <BookOpen size={16} style={{ marginRight: 4 }} /> 수강 내역
          </button>
          <button className={`tab ${tab === 'payments' ? 'active' : ''}`} onClick={() => setTab('payments')}>
            <CreditCard size={16} style={{ marginRight: 4 }} /> 결제 내역
          </button>
          <button className={`tab ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}>
            <Settings size={16} style={{ marginRight: 4 }} /> 설정
          </button>
        </div>

        {tab === 'courses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mockEnrollments.map(e => (
              <div className="card" key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{e.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}><Clock size={13} style={{ marginRight: 4 }} />{e.date} 등록</p>
                </div>
                <div style={{ width: 120 }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>진도율 {e.progress}%</div>
                  <div style={{ height: 6, background: 'var(--bg-secondary)', borderRadius: 3 }}>
                    <div style={{ width: `${e.progress}%`, height: '100%', borderRadius: 3, background: e.progress >= 100 ? 'var(--color-success)' : 'var(--gradient-cta)' }} />
                  </div>
                </div>
                <span className={`badge ${e.status === '완료' ? 'badge-success' : 'badge-orange'}`}>{e.status}</span>
              </div>
            ))}
            {mockEnrollments.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
                <p>수강 내역이 없습니다.</p>
                <Link href="/courses" className="btn btn-primary" style={{ marginTop: '1rem' }}>강좌 둘러보기</Link>
              </div>
            )}
          </div>
        )}

        {tab === 'payments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {mockPayments.map(p => (
              <div className="card" key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{p.id} · {p.date} · {p.method}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.amount}</div>
                  <span className="badge badge-success">{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'settings' && (
          <div className="card" style={{ maxWidth: 500 }}>
            <h3 style={{ marginBottom: '1rem' }}>⚙️ 프로필 설정</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.375rem' }}>이름</label>
                <input type="text" defaultValue={user.name}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.95rem' }} />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.375rem' }}>이메일</label>
                <input type="email" defaultValue={user.email} disabled
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-tertiary)', fontSize: '0.95rem' }} />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.375rem' }}>관심 지역</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['해운대', '서면', '사상', '수영', '동래'].map(r => (
                    <button key={r} className="region-tab">{r}</button>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>저장</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
