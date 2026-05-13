import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Plus, Newspaper, CalendarDays } from "lucide-react";
import { Link } from "wouter";

const mockNewsEvents = [
  {
    id: 1,
    title: "부산 AI 커뮤니티 첫 오프라인 밋업",
    description: "부산 AI 생태계 활성화를 위한 첫 오프라인 밋업 개최",
    type: "event",
    date: "2026-05-15",
    location: "부산 벡스코",
    image: "🎤",
  },
  {
    id: 2,
    title: "LLM 기술 동향 세미나",
    description: "최신 LLM 기술과 실무 활용 방법에 대한 전문가 세미나",
    type: "event",
    date: "2026-05-22",
    location: "부산 디지털혁신센터",
    image: "📊",
  },
  {
    id: 3,
    title: "AI-Hub Busan 플랫폼 런칭 소식",
    description: "부산 AI 생태계 통합 플랫폼 AI-Hub Busan이 공식 런칭되었습니다.",
    type: "news",
    date: "2026-05-07",
    location: null,
    image: "🚀",
  },
  {
    id: 4,
    title: "부산 AI 인재 양성 프로그램 모집",
    description: "부산시와 함께하는 AI 인재 양성 프로그램 참가자 모집 중",
    type: "news",
    date: "2026-05-10",
    location: null,
    image: "📚",
  },
  {
    id: 5,
    title: "AI 프로젝트 피칭 대회",
    description: "부산 AI 프로젝트 팀들의 아이디어를 공유하고 투자 기회를 얻는 행사",
    type: "event",
    date: "2026-06-05",
    location: "부산 스타트업 허브",
    image: "🎯",
  },
  {
    id: 6,
    title: "AI 윤리 및 규제 워크숍",
    description: "AI 개발 시 고려해야 할 윤리 및 규제 이슈 논의",
    type: "event",
    date: "2026-06-12",
    location: "부산 대학교",
    image: "⚖️",
  },
];

export default function News() {
  const [activeTab, setActiveTab] = useState<"all" | "news" | "events">("all");

  const filteredItems = activeTab === "all"
    ? mockNewsEvents
    : mockNewsEvents.filter((item) => item.type === (activeTab === "news" ? "news" : "event"));

  const upcomingEvents = mockNewsEvents.filter(
    (item) => item.type === "event" && new Date(item.date) > new Date()
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-muted/30 py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">뉴스 & 이벤트</h1>
          <p className="text-lg text-muted-foreground">
            부산 AI 생태계의 최신 뉴스, 이벤트, 세미나 정보를 한눈에 확인하세요
          </p>
        </div>
      </section>

      {/* Upcoming Events Widget */}
      {upcomingEvents.length > 0 && (
        <section className="border-b border-border bg-gradient-busan-warm py-8">
          <div className="container">
            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              예정된 이벤트
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {upcomingEvents.slice(0, 3).map((event) => (
                <Link key={event.id} href={`/news/${event.id}`}>
                  <a className="group">
                    <Card className="bg-white/95 border-0 hover:shadow-lg transition-all cursor-pointer">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base line-clamp-2 group-hover:text-accent transition-colors">
                          {event.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString("ko-KR")}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tabs and Actions */}
      <section className="border-b border-border bg-background py-6 sticky top-16 z-40">
        <div className="container">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={activeTab === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("all")}
                className={activeTab === "all" ? "bg-accent text-accent-foreground" : ""}
              >
                전체
              </Button>
              <Button
                variant={activeTab === "news" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("news")}
                className={activeTab === "news" ? "bg-accent text-accent-foreground" : ""}
              >
                <Newspaper className="w-4 h-4 mr-2" />
                뉴스
              </Button>
              <Button
                variant={activeTab === "events" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("events")}
                className={activeTab === "events" ? "bg-accent text-accent-foreground" : ""}
              >
                <Calendar className="w-4 h-4 mr-2" />
                이벤트
              </Button>
            </div>
            <Button className="bg-accent hover:bg-accent/90 gap-2 whitespace-nowrap">
              <Plus className="w-4 h-4" />
              뉴스/이벤트 등록
            </Button>
          </div>
        </div>
      </section>

      {/* News & Events List */}
      <section className="py-12">
        <div className="container">
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Link key={item.id} href={`/news/${item.id}`}>
                <a className="group">
                  <Card className="border-2 border-border hover:border-accent/50 transition-all hover:shadow-md cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{item.image}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant={item.type === "news" ? "default" : "secondary"}
                              className={item.type === "news" ? "bg-blue-500" : "bg-orange-500"}
                            >
                              {item.type === "news" ? "뉴스" : "이벤트"}
                            </Badge>
                          </div>
                          <CardTitle className="line-clamp-2 group-hover:text-accent transition-colors">
                            {item.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2 mt-2">
                            {item.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(item.date).toLocaleDateString("ko-KR")}
                        </div>
                        {item.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {item.location}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </Link>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">해당하는 항목이 없습니다.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
