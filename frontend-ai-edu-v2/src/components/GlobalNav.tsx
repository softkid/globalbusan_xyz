import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Sun, Moon, GraduationCap, Users, FolderKanban, UserCheck, Store, Wrench } from 'lucide-react';

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
            <button className="nav-mobile-btn" onClick={toggleTheme} aria-label="테마 변경">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href="/events" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              무료 설명회
            </Link>
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
          <button onClick={(e) => { e.stopPropagation(); toggleTheme(); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'none', color: 'var(--text-secondary)' }}>
            {dark ? <Sun size={20} /> : <Moon size={20} />} {dark ? '라이트 모드' : '다크 모드'}
          </button>
        </div>
      )}
    </>
  );
}
