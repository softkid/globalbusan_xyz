import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2, MessageCircle } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedPrompts = [
  "부산 AI 생태계에 대해 알려줘",
  "LLM 파인튜닝 강좌 추천해줘",
  "AI 프로젝트 팀원 찾는 방법",
  "마켓플레이스에서 인기 있는 서비스는?",
];

export default function Chat() {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "안녕하세요! 저는 AI-Hub Busan의 AI 도우미입니다. 부산 AI 생태계에 대한 정보, 강좌 추천, 프로젝트 매칭 등 다양한 도움을 드릴 수 있습니다. 무엇을 도와드릴까요?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const responses: Record<string, string> = {
        "부산 AI 생태계": "부산 AI 생태계는 AI-Hub Busan을 중심으로 성장하고 있습니다. 교육, 네트워킹, 프로젝트, 마켓플레이스 등 다양한 모듈을 통해 AI 인재들이 함께 성장하고 있습니다.",
        "LLM 파인튜닝": "LLM 파인튜닝 강좌는 AI 교육 허브에서 찾을 수 있습니다. 초급부터 고급까지 다양한 수준의 강좌가 준비되어 있으며, 실무 프로젝트를 통해 실전 경험을 쌓을 수 있습니다.",
        "팀원": "프로젝트 빌딩 섹션에서 팀원을 모집할 수 있습니다. 커뮤니티에서 관심사가 같은 개발자들을 찾고, 함께 AI 프로젝트를 구축해보세요.",
        "마켓플레이스": "AI 마켓플레이스에서는 다양한 AI 서비스와 솔루션을 판매하고 구매할 수 있습니다. LLM 파인튜닝, 이미지 생성, RAG 시스템 등 다양한 서비스가 있습니다.",
      };

      let response = "죄송합니다. 더 구체적인 질문을 해주시면 더 잘 도와드릴 수 있습니다. 다음 주제들에 대해 물어보실 수 있습니다: 부산 AI 생태계, LLM 파인튜닝, 팀원 찾기, 마켓플레이스";

      for (const [key, value] of Object.entries(responses)) {
        if (messageText.includes(key)) {
          response = value;
          break;
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
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
        <div className="container">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <MessageCircle className="w-8 h-8 text-accent" />
            AI 챗봇
          </h1>
          <p className="text-muted-foreground">
            부산 AI 생태계에 대해 물어보세요. LLM 기반 도우미가 도움을 드립니다.
          </p>
        </div>
      </section>

      {/* Chat Area */}
      <div className="flex-1 container py-8 flex flex-col">
        <div className="flex-1 space-y-4 mb-6 overflow-y-auto max-h-[calc(100vh-300px)]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-md lg:max-w-2xl px-4 py-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-accent text-accent-foreground rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">답변을 생성 중입니다...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length === 1 && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">다음 주제에 대해 물어볼 수 있습니다:</p>
            <div className="grid md:grid-cols-2 gap-2">
              {suggestedPrompts.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  className="justify-start text-left h-auto py-2 px-3 whitespace-normal"
                  onClick={() => handleSendMessage(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            placeholder="메시지를 입력하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !isLoading) {
                handleSendMessage();
              }
            }}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
            className="bg-accent hover:bg-accent/90 gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
