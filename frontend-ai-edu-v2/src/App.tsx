import { Route, Switch } from 'wouter';
import GlobalNav from './components/GlobalNav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Community from './pages/Community';
import Events from './pages/Events';
import Experts from './pages/Experts';
import Marketplace from './pages/Marketplace';
import Tools from './pages/Tools';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <GlobalNav />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/courses" component={Courses} />
        <Route path="/courses/:id" component={CourseDetail} />
        <Route path="/community" component={Community} />
        <Route path="/events" component={Events} />
        <Route path="/experts" component={Experts} />
        <Route path="/market" component={Marketplace} />
        <Route path="/tools" component={Tools} />
        <Route path="/projects" component={() => <PlaceholderPage title="🏗️ 프로젝트 빌더" desc="AI 프로젝트 팀빌딩과 협업 공간 — Phase 2 고도화 진행 중" />} />
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
