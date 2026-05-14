import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Sun, Moon, GraduationCap, Users, FolderKanban, UserCheck, Store, Wrench, User } from 'lucide-react';

const navItems = [
  { path: '/courses', label: '교육', icon: GraduationCap },
  { path: '/community', label: '커뮤니티', icon: Users },
  { path: '/projects', label: '프로젝트', icon: FolderKanban },
  { path: '/experts', label: '전문가', icon: UserCheck },
  { path: '/market', label: '마켓', icon: Store },
  { path: '/tools', label: '도구', icon: Wrench },
];

export default function GlobalNav() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const check = () => {
      const stored = localStorage.getItem('busan_ai_user');
      setUser(stored ? JSON.parse(stored) : null);
    };
    check();
    window.addEventListener('storage', check);
    const interval = setInterval(check, 2000);
    return () => { window.removeEventListener('storage', check); clearInterval(interval); };
  }, []);

  const toggleTheme = () => {
    setDark(!dark);
    document.documentElement.setAttribute('data-theme', dark ? '' : 'dark');
  };

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">BUSAN AI</Link>
          <div className="nav-links">
            {navItems.map(item => (
              <Link key={item.path} href={item.path}
                className={`nav-link ${location === item.path ? 'active' : ''}`}>
                {item.label}
              </Link>
            ))}
          </div>
          <div className="nav-actions">
            <button className="nav-mobile-btn" onClick={toggleTheme} aria-label="테마 변경" style={{ display: 'flex' }}>
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href="/events" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              무료 설명회
            </Link>
            {user ? (
              <Link href="/mypage" style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--gradient-ocean)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>
                {user.name?.charAt(0) || '👤'}
              </Link>
            ) : (
              <Link href="/auth" className="btn btn-ghost" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}>
                <User size={16} /> 로그인
              </Link>
            )}
            <button className="nav-mobile-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="메뉴">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="mobile-nav" onClick={() => setMobileOpen(false)}>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={20} /> {item.label}
              </Link>
            );
          })}
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.5rem 0' }} />
          <Link href="/events" style={{ color: 'var(--color-sunrise)', fontWeight: 600 }}>
            🎯 무료 설명회 예약
          </Link>
          {user ? (
            <Link href="/mypage" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
              <User size={20} /> 마이페이지
            </Link>
          ) : (
            <Link href="/auth" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
              <User size={20} /> 로그인 / 회원가입
            </Link>
          )}
          <button onClick={(e) => { e.stopPropagation(); toggleTheme(); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'none', color: 'var(--text-secondary)' }}>
            {dark ? <Sun size={20} /> : <Moon size={20} />} {dark ? '라이트 모드' : '다크 모드'}
          </button>
        </div>
      )}
    </>
  );
}
