import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import GlobalNav from "./components/GlobalNav";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Community from "./pages/Community";
import Projects from "./pages/Projects";
import Marketplace from "./pages/Marketplace";
import News from "./pages/News";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import CourseDetail from "./pages/CourseDetail";
import CommunityPostCreate from "./pages/CommunityPostCreate";
import CommunityPostDetail from "./pages/CommunityPostDetail";
import UserProfile from "./pages/UserProfile";
import ProjectCreate from "./pages/ProjectCreate";
import ProjectDetail from "./pages/ProjectDetail";
import MarketplaceCreate from "./pages/MarketplaceCreate";
import MarketplaceDetail from "./pages/MarketplaceDetail";
import NewsCreate from "./pages/NewsCreate";
import NewsDetail from "./pages/NewsDetail";
import SmartRFP from "./pages/SmartRFP";
import Prompts from "./pages/Prompts";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/courses" component={Courses} />
      <Route path="/courses/:id" component={CourseDetail} />
      <Route path="/community" component={Community} />
      <Route path="/community/posts/new" component={CommunityPostCreate} />
      <Route path="/community/posts/:id" component={CommunityPostDetail} />
      <Route path="/community/members/:id" component={UserProfile} />
      <Route path="/projects" component={Projects} />
      <Route path="/projects/new" component={ProjectCreate} />
      <Route path="/projects/:id" component={ProjectDetail} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/marketplace/new" component={MarketplaceCreate} />
      <Route path="/marketplace/:id" component={MarketplaceDetail} />
      <Route path="/smart-rfp" component={SmartRFP} />
      <Route path="/prompts" component={Prompts} />
      <Route path="/news" component={News} />
      <Route path="/news/new" component={NewsCreate} />
      <Route path="/news/:id" component={NewsDetail} />
      <Route path="/profile" component={Profile} />
      <Route path="/chat" component={Chat} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider
          defaultTheme="light"
          // switchable
        >
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
