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
import Projects from './pages/Projects';
import Auth from './pages/Auth';
import MyPage from './pages/MyPage';
import Payment from './pages/Payment';
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
        <Route path="/projects" component={Projects} />
        <Route path="/auth" component={Auth} />
        <Route path="/mypage" component={MyPage} />
        <Route path="/payment/:id" component={Payment} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </>
  );
}

export default App;
