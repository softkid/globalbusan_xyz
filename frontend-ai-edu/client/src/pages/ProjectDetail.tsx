import { useState } from "react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Users, Calendar, Mail, FileText, Send, Wallet, Key, Copy, AlertCircle } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

const mockProject = {
  id: 1,
  title: "부산 관광 AI 챗봇",
  description: "부산 관광정보를 제공하는 LLM 기반 챗봇 개발\n\n### 기획 배경\n현재 부산 관광 정보는 파편화되어 있어 외국인 관광객들이 접근하기 어렵습니다.\n이를 해결하기 위해 다국어를 지원하는 LLM 챗봇을 기획했습니다.\n\n### 현재 진행 상황\n- 기획서 작성 완료\n- 부산시 오픈 API 연동 키 발급 완료\n- 초기 데모 웹사이트 구축 중\n\n### 필요한 역할\n- 프론트엔드 개발자 (React/Next.js 경험자)\n- 백엔드 개발자 (Python/FastAPI 경험자)\n\n매주 토요일 서면에서 오프라인 밋업을 진행합니다.",
  category: "LLM",
  status: "recruiting",
  creator: "김프로젝트",
  currentTeam: 2,
  targetTeam: 5,
  skills: ["Python", "LLM", "API", "React", "Next.js"],
  startDate: "2026-05-15",
  members: [
    { name: "김프로젝트", role: "Leader / PM", avatar: "김" },
    { name: "최디자인", role: "UI/UX Designer", avatar: "최" }
  ]
};

export default function ProjectDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  
  const [applyMessage, setApplyMessage] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("로그인이 필요합니다.", {
        action: { label: "로그인", onClick: () => window.location.href = getLoginUrl() }
      });
      return;
    }
    
    if (!applyMessage.trim()) {
      toast.error("지원 메시지를 작성해주세요.");
      return;
    }

    // Simulate API call
    toast.success("팀 지원이 완료되었습니다!", {
      description: "리더가 확인 후 연락을 드릴 예정입니다."
    });
    setHasApplied(true);
    setIsApplying(false);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-5xl space-y-6">
        <Button 
          variant="ghost" 
          className="gap-2 text-muted-foreground hover:text-foreground pl-0"
          asChild
        >
          <Link href="/projects">
            <ArrowLeft className="w-4 h-4" />
            프로젝트 목록으로
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-sm border-t-4 border-t-accent rounded-t-xl">
              <CardHeader className="pb-4 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-accent text-accent-foreground">{mockProject.category}</Badge>
                  <Badge variant="outline" className={mockProject.status === "recruiting" ? "border-orange-500 text-orange-500" : ""}>
                    {mockProject.status === "recruiting" ? "팀원 모집 중" : "진행 중"}
                  </Badge>
                </div>
                <CardTitle className="text-3xl font-bold">{mockProject.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                  {mockProject.description}
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-3">사용 기술 및 도구</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockProject.skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-sm">
              <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
                <CardTitle className="text-lg">현재 팀원 ({mockProject.currentTeam}/{mockProject.targetTeam})</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {mockProject.members.map((member, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white font-bold">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                  
                  {mockProject.targetTeam - mockProject.currentTeam > 0 && (
                    <div className="flex items-center gap-4 p-3 rounded-lg border border-dashed border-border text-muted-foreground bg-muted/20">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <p className="text-sm">빈 자리 ({mockProject.targetTeam - mockProject.currentTeam}명)</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border/50 shadow-sm">
              <CardHeader className="bg-muted/30 pb-4 border-b border-border/50 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-accent" />
                  팀 API 지갑 (Team API Wallet)
                </CardTitle>
                <Badge variant="secondary" className="font-normal text-xs">팀원 전용</Badge>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 p-3 rounded-lg text-sm flex gap-2 items-start mb-6">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>
                      프로젝트 팀원들이 공동으로 사용하는 API 키를 안전하게 관리하고 비용을 분담할 수 있는 가상 지갑입니다.
                    </p>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">지갑 잔액</p>
                      <p className="text-2xl font-bold text-accent">₩50,000</p>
                      <Button variant="link" className="p-0 h-auto text-xs mt-2">충전하기</Button>
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">이번 달 사용량 (OpenAI)</p>
                      <p className="text-2xl font-bold">₩12,450</p>
                      <Button variant="link" className="p-0 h-auto text-xs mt-2 text-muted-foreground">상세 내역 보기</Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">발급된 API 키</h4>
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20">
                      <div className="flex items-center gap-3">
                        <Key className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">OpenAI GPT-4 연동 키</p>
                          <p className="text-xs text-muted-foreground font-mono mt-1">sk-proj-gbusan-*****************</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => {
                        navigator.clipboard.writeText("sk-proj-gbusan-testkey123");
                        toast.success("API 키가 복사되었습니다.");
                      }}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button variant="outline" className="w-full text-sm border-dashed">
                      + 새 API 키 등록하기
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border border-border/50 shadow-sm sticky top-24">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-lg">프로젝트 정보</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">시작 예정일</p>
                      <p className="text-sm text-muted-foreground">{new Date(mockProject.startDate).toLocaleDateString("ko-KR")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">리더</p>
                      <p className="text-sm text-muted-foreground">{mockProject.creator}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  {hasApplied ? (
                    <div className="text-center p-4 bg-green-500/10 text-green-600 rounded-lg border border-green-500/20">
                      지원 완료되었습니다.<br/>결과를 기다려주세요.
                    </div>
                  ) : mockProject.status === "recruiting" ? (
                    isApplying ? (
                      <form onSubmit={handleApply} className="space-y-4">
                        <Textarea 
                          placeholder="본인의 역량과 지원 동기를 간단히 작성해주세요."
                          value={applyMessage}
                          onChange={(e) => setApplyMessage(e.target.value)}
                          className="min-h-[120px] resize-none"
                        />
                        <div className="flex gap-2">
                          <Button type="button" variant="outline" className="w-full" onClick={() => setIsApplying(false)}>
                            취소
                          </Button>
                          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 gap-2">
                            <Send className="w-4 h-4" />
                            지원하기
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <Button className="w-full bg-accent hover:bg-accent/90 py-6 text-lg" onClick={() => setIsApplying(true)}>
                        팀 합류 신청하기
                      </Button>
                    )
                  ) : (
                    <Button className="w-full" disabled variant="secondary">
                      모집이 마감되었습니다
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
