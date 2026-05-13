import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2, MessageCircle } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string; // Stored as a simple string or template ID
  timestamp: string; // ISO string for easy JSON serialization
}

const suggestedPrompts = [
  "부산 AI 생태계에 대해 알려줘",
  "LLM 파인튜닝 강좌 추천해줘",
  "AI 프로젝트 팀원 찾는 방법",
  "마켓플레이스에서 인기 있는 서비스는?",
];

const STORAGE_KEY = "globalbusan_chat_history";

export default function Chat() {
  const { isAuthenticated } = useAuth();
  
  // Load from local storage or use default
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load chat history", e);
    }
    return [
      {
        id: "1",
        role: "assistant",
        content: "RES_GREETING",
        timestamp: new Date().toISOString(),
      },
    ];
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const clearHistory = () => {
    const defaultMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: "RES_GREETING",
      timestamp: new Date().toISOString(),
    };
    setMessages([defaultMessage]);
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      let responseKey = "RES_FALLBACK";

      if (messageText.includes("부산 AI 생태계")) {
        responseKey = "RES_ECOSYSTEM";
      } else if (messageText.includes("LLM 파인튜닝") || messageText.includes("강좌")) {
        responseKey = "RES_COURSE";
      } else if (messageText.includes("팀원") || messageText.includes("프로젝트")) {
        responseKey = "RES_PROJECT";
      } else if (messageText.includes("마켓플레이스") || messageText.includes("서비스")) {
        responseKey = "RES_MARKETPLACE";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseKey,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  // Render content based on string key
  const renderMessageContent = (content: string) => {
    switch (content) {
      case "RES_GREETING":
        return <p>안녕하세요! 저는 AI-Hub Busan의 AI 도우미입니다. 부산 AI 생태계에 대한 정보, 강좌 추천, 프로젝트 매칭 등 다양한 도움을 드릴 수 있습니다. 무엇을 도와드릴까요?</p>;
      case "RES_ECOSYSTEM":
        return (
          <div>
            <p>부산 AI 생태계는 AI-Hub Busan을 중심으로 성장하고 있습니다. 교육, 네트워킹, 프로젝트, 마켓플레이스 등 다양한 모듈을 통해 AI 인재들이 함께 성장하고 있습니다.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><Link href="/courses" className="text-blue-500 hover:underline">교육 허브 살펴보기</Link></li>
              <li><Link href="/community" className="text-blue-500 hover:underline">네트워킹 커뮤니티</Link></li>
              <li><Link href="/projects" className="text-blue-500 hover:underline">프로젝트 빌딩</Link></li>
              <li><Link href="/marketplace" className="text-blue-500 hover:underline">AI 마켓플레이스</Link></li>
            </ul>
          </div>
        );
      case "RES_COURSE":
        return (
          <div>
            <p>LLM 파인튜닝 강좌를 찾으시는군요! AI 교육 허브에 관련된 강좌가 준비되어 있습니다.</p>
            <div className="mt-3 p-3 border border-border rounded-lg bg-background text-foreground">
              <p className="font-semibold text-accent">ChatGPT API를 활용한 AI 챗봇 개발</p>
              <p className="text-sm text-muted-foreground mb-2">프롬프트 엔지니어링부터 파인튜닝 기초까지</p>
              <Link href="/courses/1" className="text-sm text-blue-500 hover:underline">👉 강좌 상세 보기</Link>
            </div>
          </div>
        );
      case "RES_PROJECT":
        return (
          <div>
            <p>현재 모집 중인 흥미로운 AI 프로젝트들이 있습니다.</p>
            <div className="mt-3 space-y-2 text-foreground">
              <div className="p-3 border border-border rounded-lg bg-background">
                <p className="font-semibold">부산 관광 AI 챗봇</p>
                <p className="text-sm text-muted-foreground">LLM 기반, 5명 모집 중</p>
                <Link href="/projects/1" className="text-sm text-blue-500 hover:underline">👉 프로젝트 지원하기</Link>
              </div>
              <div className="p-3 border border-border rounded-lg bg-background">
                <p className="font-semibold">AI 이미지 편집 도구</p>
                <p className="text-sm text-muted-foreground">Stable Diffusion, 4명 모집 중</p>
                <Link href="/projects/2" className="text-sm text-blue-500 hover:underline">👉 프로젝트 지원하기</Link>
              </div>
            </div>
          </div>
        );
      case "RES_MARKETPLACE":
        return (
          <div>
            <p>AI 마켓플레이스에서는 전문가들의 다양한 AI 솔루션을 구매할 수 있습니다.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><Link href="/marketplace/1" className="text-blue-500 hover:underline">LLM 파인튜닝 서비스</Link> (평점 4.9)</li>
              <li><Link href="/marketplace/2" className="text-blue-500 hover:underline">이미지 생성 API 통합</Link> (평점 4.7)</li>
              <li><Link href="/smart-rfp" className="text-orange-500 hover:underline font-medium">원하는 서비스가 없다면? Smart RFP 생성하기</Link></li>
            </ul>
          </div>
        );
      case "RES_FALLBACK":
        return <p>죄송합니다. 더 구체적인 질문을 해주시면 더 잘 도와드릴 수 있습니다. 다음 주제들에 대해 물어보실 수 있습니다: 부산 AI 생태계, LLM 파인튜닝 강좌 추천, 프로젝트 팀원 찾기, 마켓플레이스 인기 서비스</p>;
      default:
        // For user messages or raw text
        return <p>{content}</p>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md border-2 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-accent" />
              AI 챗봇
            </CardTitle>
            <CardDescription>
              AI 도우미와 대화하려면 로그인이 필요합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-accent hover:bg-accent/90">
              <a href={getLoginUrl()}>로그인하기</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <section className="border-b border-border bg-muted/30 py-6">
        <div className="container flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <MessageCircle className="w-8 h-8 text-accent" />
              AI 챗봇
            </h1>
            <p className="text-muted-foreground">
              부산 AI 생태계에 대해 물어보세요. LLM 기반 도우미가 도움을 드립니다.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={clearHistory}>
            대화 내역 지우기
          </Button>
        </div>
      </section>

      {/* Chat Area */}
      <div className="flex-1 container py-8 flex flex-col max-w-4xl">
        <div className="flex-1 space-y-6 mb-6 overflow-y-auto max-h-[calc(100vh-300px)] px-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] lg:max-w-2xl px-5 py-4 rounded-xl shadow-sm ${
                  message.role === "user"
                    ? "bg-accent text-accent-foreground rounded-br-none"
                    : "bg-muted/50 border border-border text-foreground rounded-bl-none"
                }`}
              >
                <div className="text-[15px] space-y-2 leading-relaxed">
                  {renderMessageContent(message.content)}
                </div>
                <p className={`text-[11px] mt-3 ${message.role === "user" ? "opacity-70 text-right" : "text-muted-foreground"}`}>
                  {new Date(message.timestamp).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted/50 border border-border text-foreground px-5 py-4 rounded-xl rounded-bl-none flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                <span className="text-sm font-medium">답변을 생성 중입니다...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length <= 1 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center text-accent text-[10px]">💡</span>
              이런 질문은 어떠세요?
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  className="rounded-full bg-background hover:bg-accent/5 border-border/50 transition-all text-sm h-auto py-2 px-4"
                  onClick={() => handleSendMessage(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex gap-3 bg-background p-2 rounded-2xl border-2 border-border shadow-sm focus-within:border-accent/50 transition-colors">
          <Input
            placeholder="AI 생태계, 강좌, 프로젝트에 대해 자유롭게 물어보세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !isLoading) {
                handleSendMessage();
              }
            }}
            disabled={isLoading}
            className="flex-1 border-0 shadow-none focus-visible:ring-0 text-base py-6"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
            className="bg-accent hover:bg-accent/90 gap-2 h-auto px-6 rounded-xl"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline font-semibold">전송</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
