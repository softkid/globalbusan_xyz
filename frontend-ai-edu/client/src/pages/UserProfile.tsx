import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, MapPin, Briefcase, Users, MessageSquare, ExternalLink } from "lucide-react";

// Mock data matching the community list
const mockMembers = [
  {
    id: 1,
    name: "김AI개발자",
    expertise: ["LLM", "파인튜닝"],
    bio: "AI 엔지니어, 부산에서 활동 중",
    email: "kim.ai@example.com",
    role: "AI Researcher",
    location: "부산 해운대구",
    followers: 124,
    posts: 15,
    projects: 3,
  },
  {
    id: 2,
    name: "이네트워킹",
    expertise: ["커뮤니티", "비즈니스"],
    bio: "AI 스타트업 창업자",
    email: "lee.net@example.com",
    role: "CEO / Founder",
    location: "부산 남구",
    followers: 450,
    posts: 89,
    projects: 5,
  },
  {
    id: 3,
    name: "박프로젝트",
    expertise: ["이미지AI", "프로젝트관리"],
    bio: "AI 프로젝트 리더",
    email: "park.proj@example.com",
    role: "Project Manager",
    location: "부산 수영구",
    followers: 86,
    posts: 4,
    projects: 12,
  },
  {
    id: 4,
    name: "최데이터",
    expertise: ["RAG", "데이터엔지니어링"],
    bio: "데이터 전문가, 부산 AI 생태계 활동가",
    email: "choi.data@example.com",
    role: "Data Engineer",
    location: "부산 부산진구",
    followers: 210,
    posts: 34,
    projects: 7,
  },
];

export default function UserProfile() {
  const { id } = useParams();
  const userId = id ? parseInt(id) : 1;
  const member = mockMembers.find(m => m.id === userId) || mockMembers[0];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl space-y-6">
        <Button 
          variant="ghost" 
          className="gap-2 text-muted-foreground hover:text-foreground pl-0"
          asChild
        >
          <Link href="/community">
            <ArrowLeft className="w-4 h-4" />
            커뮤니티로 돌아가기
          </Link>
        </Button>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <Card className="border-2 border-border shadow-sm text-center">
              <CardContent className="pt-8 pb-6 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white text-5xl font-bold shadow-lg mb-4">
                  {member.name.charAt(0)}
                </div>
                <h2 className="text-2xl font-bold mb-1">{member.name}</h2>
                <p className="text-muted-foreground text-sm mb-4">{member.role}</p>
                
                <div className="flex gap-2 w-full px-4 mt-2">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-sm">
                    팔로우
                  </Button>
                  <Button variant="outline" size="icon">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-sm">
              <CardContent className="p-4 space-y-4 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{member.location}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Briefcase className="w-4 h-4" />
                  <span>{member.role}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <ExternalLink className="w-4 h-4" />
                  <a href="#" className="text-accent hover:underline">포트폴리오 보기</a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-xl">소개</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-foreground/90 leading-relaxed mb-6">
                  {member.bio}
                </p>
                
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground">전문 분야 (Expertise)</h3>
                <div className="flex flex-wrap gap-2">
                  {member.expertise.map(tag => (
                    <Badge key={tag} className="bg-busan-primary/10 text-busan-primary hover:bg-busan-primary/20 px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <Card className="border-0 shadow-sm bg-muted/10 text-center py-6">
                <div className="flex flex-col items-center">
                  <Users className="w-6 h-6 text-accent mb-2" />
                  <span className="text-2xl font-bold">{member.followers}</span>
                  <span className="text-xs text-muted-foreground mt-1">팔로워</span>
                </div>
              </Card>
              <Card className="border-0 shadow-sm bg-muted/10 text-center py-6">
                <div className="flex flex-col items-center">
                  <MessageSquare className="w-6 h-6 text-accent mb-2" />
                  <span className="text-2xl font-bold">{member.posts}</span>
                  <span className="text-xs text-muted-foreground mt-1">커뮤니티 게시물</span>
                </div>
              </Card>
              <Card className="border-0 shadow-sm bg-muted/10 text-center py-6">
                <div className="flex flex-col items-center">
                  <Briefcase className="w-6 h-6 text-accent mb-2" />
                  <span className="text-2xl font-bold">{member.projects}</span>
                  <span className="text-xs text-muted-foreground mt-1">참여 프로젝트</span>
                </div>
              </Card>
            </div>
            
            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-xl">최근 활동</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground text-sm">
                  최근 활동 내역이 없습니다.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
