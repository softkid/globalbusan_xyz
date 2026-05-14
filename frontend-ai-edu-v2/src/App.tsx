import { Route, Switch } from 'wouter';
import GlobalNav from './components/GlobalNav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Community from './pages/Community';
import Events from './pages/Events';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <GlobalNav />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/courses" component={Courses} />
        <Route path="/community" component={Community} />
        <Route path="/events" component={Events} />
        <Route path="/projects" component={() => <PlaceholderPage title="🏗️ 프로젝트 빌더" desc="AI 프로젝트 팀빌딩과 협업 공간 — Phase 2에서 런칭 예정" />} />
        <Route path="/experts" component={() => <PlaceholderPage title="👥 전문가 네트워크" desc="부산 AI 전문가 프로필과 매칭 — Phase 2에서 런칭 예정" />} />
        <Route path="/market" component={() => <PlaceholderPage title="🛒 AI 구축 마켓" desc="부산 자영업자 ↔ AI 실무자 매칭 플랫폼 — Phase 2에서 런칭 예정" />} />
        <Route path="/tools" component={() => <PlaceholderPage title="🔧 SaaS 도구" desc="프롬프트 라이브러리, AI 워크플로우 템플릿 — Phase 3에서 런칭 예정" />} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </>
  );
}

function PlaceholderPage({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <div>
        <h1 style={{ marginBottom: '0.75rem' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: 500 }}>{desc}</p>
        <a href="/" className="btn btn-secondary">홈으로 돌아가기</a>
      </div>
    </div>
  );
}

export default App;
