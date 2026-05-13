import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { ArrowRight, BookOpen, Users, Briefcase, ShoppingBag, Newspaper, MessageCircle } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { isAuthenticated } = useAuth();

  const modules = [
    {
      icon: BookOpen,
      title: "AI 교육 허브",
      description: "부산의 AI 전문가들이 직접 운영하는 실전 교육 프로그램. 초급부터 고급까지 다양한 강좌를 제공합니다.",
      href: "/courses",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Users,
      title: "네트워킹 커뮤니티",
      description: "부산 AI 전문가들과 연결되고, 지식을 공유하며 함께 성장하는 커뮤니티입니다.",
      href: "/community",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Briefcase,
      title: "프로젝트 빌딩",
      description: "AI 프로젝트를 함께 구축할 팀원을 찾고, 협업하며 실무 경험을 쌓으세요.",
      href: "/projects",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: ShoppingBag,
      title: "AI 마켓플레이스",
      description: "AI 기반 서비스와 솔루션을 판매하고 구매하는 생태계입니다.",
      href: "/marketplace",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Newspaper,
      title: "뉴스/이벤트",
      description: "부산 AI 생태계의 최신 뉴스, 이벤트, 세미나 정보를 한눈에 확인하세요.",
      href: "/news",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: MessageCircle,
      title: "AI 챗봇",
      description: "LLM 기반 AI 도우미가 강좌 추천, 프로젝트 매칭, 생태계 정보를 제공합니다.",
      href: "/chat",
      color: "from-purple-500 to-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden gradient-busan pt-24 pb-32 md:pt-40 md:pb-52">
        {/* Background Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        
        {/* Decorative wave background */}
        <div className="absolute inset-0 opacity-20 z-1">
          <svg
            className="w-full h-full"
            viewBox="0 0 1200 600"
            preserveAspectRatio="xMidYMid slice"
          >
            <path
              d="M0,300 Q300,200 600,300 T1200,300 L1200,600 L0,600 Z"
              fill="currentColor"
              className="text-orange-400"
            />
          </svg>
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-8 leading-tight tracking-tighter drop-shadow-lg">
              부산 AI 생태계의 중심,
              <br />
              <span className="text-busan-light-orange underline decoration-orange-500/50 underline-offset-8">GlobalBusan</span>
            </h1>
            <p className="text-xl md:text-3xl text-white/90 mb-12 leading-relaxed tracking-wide max-w-4xl mx-auto drop-shadow-md break-keep">
              교육에서 수익화까지, 부산의 AI 인재들이 함께 성장하는 통합 플랫폼입니다. 기술과 사람, 시장을 연결하는 AI 경제권을 만들어가고 있습니다.
            </p>


            <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
              {isAuthenticated ? (
                <>
                  <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-blue-50 font-bold text-lg px-8 shadow-xl">
                    <Link href="/courses">강좌 둘러보기</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/20 font-bold text-lg px-8 backdrop-blur-sm">
                    <Link href="/community">커뮤니티 참여</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg" className="bg-busan-orange text-white hover:bg-busan-warm-orange font-bold text-lg px-10 shadow-xl border-none">
                    <a href={getLoginUrl()}>시작하기</a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/20 font-bold text-lg px-10 backdrop-blur-sm">
                    <Link href="#modules">5대 모듈 알아보기</Link>
                  </Button>
                </>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Platform Philosophy Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight text-blue-950 break-keep">학원을 넘어 플랫폼으로</h2>
            <p className="text-xl md:text-2xl text-slate-700 leading-relaxed tracking-wide font-medium break-keep">
              우리는 단순한 온라인 강의 플랫폼이 아닙니다. AI로 실제 가치를 만드는 부산의 인재들이 모여, 프로젝트를 함께 구축하고 수익을 창출하는 생태계입니다.
            </p>
          </div>



          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "인재 풀",
                description: "검증된 AI 역량을 가진 부산의 전문가 네트워크",
              },
              {
                title: "프로젝트",
                description: "실제 AI 구축 사례를 통한 실전 경험",
              },
              {
                title: "수익화",
                description: "마켓플레이스를 통한 구축 서비스 수익화",
              },
            ].map((item, idx) => (
              <Card key={idx} className="border-2 border-accent/20 hover:border-accent/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl text-busan-primary font-bold tracking-tight">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5 Modules Section */}
      <section id="modules" className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">5대 핵심 모듈</h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed tracking-wide">
              유입부터 정착까지, 유기적으로 연결된 5개의 모듈이 선순환 생태계를 구축합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, idx) => {
              const Icon = module.icon;
              return (
                <Link key={idx} href={module.href}>
                  <a className="group">
                    <Card className="h-full border-2 border-border hover:border-accent/50 transition-all hover:shadow-lg cursor-pointer">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${module.color} p-2.5 mb-3 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-full h-full text-white" />
                        </div>
                        <CardTitle className="text-xl md:text-2xl font-bold tracking-tight">{module.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg text-slate-600 mb-6 leading-relaxed">{module.description}</p>
                        <div className="flex items-center text-accent font-bold group-hover:gap-3 transition-all text-lg tracking-wide">
                          자세히 보기
                          <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>

                    </Card>
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-32 overflow-hidden gradient-busan-warm">
        <div className="absolute inset-0 bg-black/10 z-0"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tighter drop-shadow-lg break-keep">
              부산 AI 경제권의 일원이 되세요
            </h2>
            <p className="text-xl md:text-3xl text-white/95 mb-12 leading-relaxed tracking-wide drop-shadow-md break-keep">
              교육, 네트워킹, 프로젝트, 수익화까지 모든 것이 한 플랫폼에서 가능합니다.
            </p>
            {!isAuthenticated && (
              <Button asChild size="lg" className="bg-white text-blue-950 hover:bg-blue-50 font-extrabold text-xl px-12 py-8 shadow-2xl rounded-full transition-transform hover:scale-105">
                <a href={getLoginUrl()}>지금 시작하기</a>
              </Button>
            )}
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4 text-lg tracking-tight">GlobalBusan</h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                부산의 AI 생태계를 연결하는 통합 플랫폼
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-base tracking-tight">플랫폼</h4>
              <ul className="space-y-2 text-base">
                <li><Link href="/courses"><a className="text-muted-foreground hover:text-foreground">AI 교육</a></Link></li>
                <li><Link href="/community"><a className="text-muted-foreground hover:text-foreground">커뮤니티</a></Link></li>
                <li><Link href="/projects"><a className="text-muted-foreground hover:text-foreground">프로젝트</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-base tracking-tight">서비스</h4>
              <ul className="space-y-2 text-base">
                <li><Link href="/marketplace"><a className="text-muted-foreground hover:text-foreground">마켓플레이스</a></Link></li>
                <li><Link href="/news"><a className="text-muted-foreground hover:text-foreground">뉴스/이벤트</a></Link></li>
                <li><Link href="/chat"><a className="text-muted-foreground hover:text-foreground">AI 챗봇</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-base tracking-tight">정보</h4>
              <ul className="space-y-2 text-base">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">이용약관</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">개인정보처리방침</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">문의하기</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-base text-muted-foreground">
            <p>&copy; 2026 GlobalBusan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
