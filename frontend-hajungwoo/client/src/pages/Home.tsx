import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Users, Globe, TrendingUp, Lightbulb, Heart, Facebook, Youtube, Instagram, MessageCircle, X, Share2, Truck, Store } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Streamdown } from "streamdown";

export default function Home() {
  const { user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    { role: "assistant", content: "안녕하세요! 하정우 후보의 AI·Food-Tech 정책에 대해 궁금한 점이 있으신가요? 편하게 질문해주세요." }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatMutation = useMutation({
    mutationFn: async ({ question }: { question: string }) => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    },
  });

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setInputValue("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatMutation.mutateAsync({ question: userMessage });
      setMessages(prev => [...prev, { role: "assistant", content: response.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "죄송합니다. 다시 시도해주세요." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-white to-background">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">하정우</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#vision" className="text-sm font-medium text-foreground hover:text-accent transition-colors">비전</a>
            <a href="#policies" className="text-sm font-medium text-foreground hover:text-accent transition-colors">정책</a>
            <a href="#strategy" className="text-sm font-medium text-foreground hover:text-accent transition-colors">전략</a>
            <a href="#action" className="text-sm font-medium text-foreground hover:text-accent transition-colors">참여</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-[#F8FAFC] to-white overflow-hidden">
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 text-left">
              <div className="inline-flex px-4 py-2 bg-blue-100/80 rounded-full">
                <span className="text-sm font-bold text-[#4A72F6]">AI 경제 수도 프로젝트</span>
              </div>
              <h1 className="text-5xl md:text-[3.5rem] font-extrabold text-[#111827] leading-[1.2] tracking-tight">
                대한민국 AI 경<br className="hidden md:block"/>제 수도, <span className="text-[#4A72F6]">북구</span>
              </h1>
              <p className="text-lg md:text-xl text-[#4B5563] leading-relaxed max-w-lg font-medium">
                기술이 정치를 바꿀 때, 북구의 가치가 바뀝니다. 김해의 신선함과 구포의 기술을 연결하여 세계로 수출하는 미래를 만들겠습니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a 
                  href="/manus-storage/대한민국_AI_경제_수도,_북구의_미래.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-14 px-8 rounded-xl bg-[#4A72F6] hover:bg-[#3A5CE0] text-white font-bold text-lg transition-colors shadow-lg shadow-blue-500/25"
                >
                  정책 자세히 보기 <ArrowRight className="ml-2 w-5 h-5" />
                </a>
                <Button size="lg" variant="outline" className="h-14 px-8 border-[#CBD5E1] text-[#4A72F6] hover:bg-blue-50 hover:border-[#4A72F6] rounded-xl text-lg font-bold bg-white transition-colors">
                  선거 전략 알아보기
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50">
              <img 
                src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80" 
                alt="AI Food-Tech Belt Bridge"
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B]/90 via-[#1E293B]/40 to-black/10"></div>
              
              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                <h2 className="text-7xl md:text-8xl font-black mb-4 tracking-tight drop-shadow-lg">AI</h2>
                <h3 className="text-2xl md:text-3xl font-bold mb-3 drop-shadow-md">Food-Tech 벨트</h3>
                <p className="text-lg md:text-xl font-medium text-white/90 drop-shadow-sm">K-푸드의 실리콘밸리</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="py-20 md:py-32 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              북구의 미래 비전
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              단순한 재개발을 넘어, AI 전문성과 지역의 강점을 결합한 국가대표급 미래 산업 전략
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Lightbulb,
                title: "상징성 결합",
                description: "하정우의 AI 전문성 + 북구의 지리적·경제적 현안을 결합한 미래 전략"
              },
              {
                icon: TrendingUp,
                title: "미래 도약",
                description: "북구를 대한민국 AI 경제 수도로 변모시키는 대담한 프로젝트"
              },
              {
                icon: Users,
                title: "체감형 공약",
                description: "주민의 삶과 직결된 실질적인 변화를 만드는 정책"
              }
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-xl bg-gradient-to-br from-background to-white border border-border hover:border-accent/50 transition-all">
                <item.icon className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policies Section */}
      <section id="policies" className="py-20 md:py-32 bg-gradient-to-b from-background to-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              3대 핵심 정책
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              AI 기술과 지역의 강점을 활용한 구체적인 실행 방안
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                num: "1",
                icon: Truck,
                title: "AI 기반 '지능형 통합 물류 시스템'",
                items: [
                  "김해 생산량과 부산 소비 데이터를 AI로 분석",
                  "재고 0%, 신선도 100%의 스마트 직거래 공급망 완성",
                  "덕천·구포 정체 구간에 AI 교통 관제 시스템 도입"
                ]
              },
              {
                num: "2",
                icon: Store,
                title: "구포시장 'AI 로컬 브랜드' 팩토리",
                items: [
                  "전 세계 미식 데이터를 분석한 독창적인 육가공품 개발",
                  "구포만의 소시지, 밀키트 등 글로벌 브랜드 상표화",
                  "AI 무인 상점을 통한 24시간 전국·전 세계 판매 체계"
                ]
              },
              {
                num: "3",
                icon: Heart,
                title: "'북구 실버-AI 케어' 모델의 산업화",
                items: [
                  "고령화 문제를 데이터 산업 기회로 전환",
                  "만덕·덕천 고령층 주거단지를 AI 헬스케어 리빙랩으로 지정",
                  "기업 유치를 통한 청년 일자리 창출 및 고품격 돌봄 서비스 제공"
                ]
              }
            ].map((policy, idx) => (
              <div key={idx} className="p-8 md:p-12 rounded-2xl border border-accent/20 bg-white hover:border-accent/40 shadow-sm transition-all">
                <div className="flex items-start gap-6 md:gap-8">
                  <div className="flex flex-col items-center gap-4 flex-shrink-0">
                    <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-[#4A72F6] text-white">
                      <span className="text-2xl font-bold">{policy.num}</span>
                    </div>
                    <policy.icon className="w-10 h-10 text-[#4A72F6]" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-2xl font-bold text-foreground mb-4">{policy.title}</h3>
                    <ul className="space-y-4">
                      {policy.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#4A72F6]" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategy Section */}
      <section id="strategy" className="py-20 md:py-32 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              선거 필승 전략
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              하정우만의 AI 리더십으로 유권자의 마음을 사로잡다
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-accent/10 to-transparent border border-accent/20">
                <h3 className="text-xl font-bold text-foreground mb-3">프레임의 전환</h3>
                <p className="text-muted-foreground">
                  "중앙의 예산보다 무서운 것은 기술과 미래입니다." 예산은 가져오는 것이 아니라, AI 산업을 유치하여 스스로 만들어내는 자생적 성장을 강조합니다.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-accent/10 to-transparent border border-accent/20">
                <h3 className="text-xl font-bold text-foreground mb-3">글로벌 기술 유치</h3>
                <p className="text-muted-foreground">
                  "하정우가 오면 구포시장에 구글과 네이버의 기술이 들어옵니다." 기술이 곧 지역의 경쟁력이 되는 시대를 선포합니다.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-accent/10 to-transparent border border-accent/20">
                <h3 className="text-xl font-bold text-foreground mb-3">실익 중심 메시지</h3>
                <p className="text-muted-foreground">
                  정치적 구호가 아닌, 데이터와 기술이 어떻게 주민의 소득과 집값을 바꾸는지 구체적인 실익을 제시합니다.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-accent/20 via-accent/5 to-transparent border-2 border-accent/30">
                <h3 className="text-2xl font-bold text-foreground mb-4">AI 북구 비전 선포식</h3>
                <p className="text-muted-foreground mb-4">
                  AI 가상 비서가 북구의 10년 후 모습을 생생하게 시연하는 혁신적인 유세를 진행합니다.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 지하화된 경부선 위로 펼쳐진 AI 공원</li>
                  <li>• 기술이 바꿀 북구의 미래 시각화</li>
                  <li>• "기술이 정치를 바꿀 때 북구의 집값이 바뀐다"</li>
                </ul>
              </div>

              <div className="p-8 rounded-2xl bg-gradient-to-br from-accent/20 via-accent/5 to-transparent border-2 border-accent/30">
                <h3 className="text-2xl font-bold text-foreground mb-4">디지털 전통시장 일일 튜터</h3>
                <p className="text-muted-foreground mb-4">
                  상인들에게 "내 가게 매출 올려주는 AI 사용법"을 직접 교육합니다.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 매출 증대 실전 간담회 연쇄 개최</li>
                  <li>• AI를 '효자 기술'로 인식 전환</li>
                  <li>• 현장 밀착형 바닥 민심 공략</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="action" className="py-20 md:py-32 bg-gradient-to-br from-accent via-accent/90 to-accent/80 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="container relative z-10">
          <div className="text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              데이터의 길로 뚫는 북구의 미래
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              김해의 신선함을 구포의 기술로 가공하여 세계로 수출하는 대한민국 AI 경제 수도, 북구를 만들겠습니다.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {[
                { icon: Globe, label: "글로벌 수출" },
                { icon: TrendingUp, label: "경제 성장" },
                { icon: Heart, label: "주민 행복" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-semibold">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="pt-8 flex justify-center gap-6">
              <a href="https://www.facebook.com/jungwoo.ha.921" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                <Facebook className="w-7 h-7 text-white" />
              </a>
              <a href="https://www.youtube.com/@HA_GPT_jungwoo" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                <Youtube className="w-7 h-7 text-white" />
              </a>
              <a href="https://www.instagram.com/hjw9096" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                <Instagram className="w-7 h-7 text-white" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="font-bold">하정우</span>
              </div>
              <p className="text-sm text-white/70">대한민국 AI 경제 수도, 북구</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">정책</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#policies" className="hover:text-white transition-colors">물류 시스템</a></li>
                <li><a href="#policies" className="hover:text-white transition-colors">로컬 브랜드</a></li>
                <li><a href="#policies" className="hover:text-white transition-colors">실버-AI 케어</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">전략</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#strategy" className="hover:text-white transition-colors">AI 리더십</a></li>
                <li><a href="#strategy" className="hover:text-white transition-colors">비전 선포식</a></li>
                <li><a href="#strategy" className="hover:text-white transition-colors">튜터 활동</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">팔로우</h4>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/jungwoo.ha.921" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.youtube.com/@HA_GPT_jungwoo" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/hjw9096" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-white/70">
            <p>&copy; 2026 하정우 캠프. 모든 권리 보유.</p>
          </div>
        </div>
      </footer>

      {/* Floating Chatbot */}
      <div className="fixed bottom-6 right-6 z-40">
        {isChatOpen ? (
          <div className="w-96 h-96 bg-white rounded-2xl shadow-2xl flex flex-col border border-border">
            {/* Chat Header */}
            <div className="bg-accent text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span className="font-semibold">AI 정책 상담</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-accent/80 p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === "user" 
                      ? "bg-accent text-white rounded-br-none" 
                      : "bg-muted text-foreground rounded-bl-none"
                  }`}>
                    <Streamdown>{msg.content}</Streamdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground px-4 py-2 rounded-lg rounded-bl-none">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border p-4 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="질문을 입력하세요..."
                className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 disabled:opacity-50"
              >
                전송
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsChatOpen(true)}
            className="w-14 h-14 bg-accent text-white rounded-full shadow-lg hover:bg-accent/90 flex items-center justify-center transition-all hover:scale-110"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* End of Main Content */}
    </div>
  );
}
