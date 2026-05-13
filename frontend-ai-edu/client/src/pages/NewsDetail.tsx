import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, Share2, ExternalLink } from "lucide-react";

const mockNewsEvent = {
  id: 1,
  title: "부산 AI 커뮤니티 첫 오프라인 밋업",
  description: "부산 AI 생태계 활성화를 위한 첫 오프라인 밋업 개최\n\n### 행사 소개\n부산에서 활동하는 AI 개발자, 기획자, 디자이너, 학생 등 누구나 참여 가능한 첫 오프라인 네트워킹 행사입니다. 현업 전문가들의 미니 세미나와 자유로운 네트워킹 시간이 준비되어 있습니다.\n\n### 세부 일정\n- 14:00 - 14:30 : 참가자 등록 및 아이스브레이킹\n- 14:30 - 15:30 : 키노트 세션 (부산 AI 산업의 미래)\n- 15:30 - 17:00 : 네트워킹 및 조별 토론\n\n많은 참여 부탁드립니다!",
  type: "event",
  date: "2026-05-15",
  location: "부산 벡스코 제2전시장 121호",
  image: "🎤",
  tags: ["오프라인", "네트워킹", "밋업"]
};

export default function NewsDetail() {
  const { id } = useParams();
  const item = mockNewsEvent;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl space-y-6">
        <Button 
          variant="ghost" 
          className="gap-2 text-muted-foreground hover:text-foreground pl-0"
          asChild
        >
          <Link href="/news">
            <ArrowLeft className="w-4 h-4" />
            목록으로 돌아가기
          </Link>
        </Button>

        <Card className="border-0 shadow-sm border-t-4 border-t-accent rounded-t-xl overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-blue-500/10 to-orange-500/10 flex items-center justify-center">
            <span className="text-6xl">{item.image}</span>
          </div>
          
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge
                variant={item.type === "news" ? "default" : "secondary"}
                className={item.type === "news" ? "bg-blue-500 hover:bg-blue-600" : "bg-orange-500 hover:bg-orange-600 text-white"}
              >
                {item.type === "news" ? "뉴스" : "이벤트"}
              </Badge>
              {item.tags?.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
            <CardTitle className="text-3xl font-bold leading-tight mb-4">{item.title}</CardTitle>
            
            <div className="flex flex-wrap items-center gap-6 border-b border-border pb-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                <span className="font-medium">{new Date(item.date).toLocaleDateString("ko-KR", { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</span>
              </div>
              {item.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="font-medium">{item.location}</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-base min-h-[200px]">
              {item.description}
            </div>
            
            <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
              <Button variant="outline" className="gap-2 rounded-full px-6">
                <Share2 className="w-4 h-4" />
                공유하기
              </Button>
              
              {item.type === "event" && (
                <Button className="bg-accent hover:bg-accent/90 gap-2 px-8">
                  행사 신청하기 <ExternalLink className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
