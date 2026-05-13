import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MessageSquare, Heart, Eye, Search, Plus } from "lucide-react";
import { Link } from "wouter";

const mockPosts = [
  {
    id: 1,
    title: "LLM 파인튜닝 경험 공유",
    excerpt: "최근에 GPT-3.5를 우리 도메인 데이터로 파인튜닝했습니다. 결과가 정말 좋네요!",
    author: "김AI개발자",
    tags: ["LLM", "파인튜닝", "경험공유"],
    views: 342,
    comments: 18,
    likes: 45,
    date: "2시간 전",
  },
  {
    id: 2,
    title: "부산 AI 커뮤니티 첫 오프라인 밋업 후기",
    excerpt: "정말 좋은 사람들을 만났습니다. 다음 밋업도 기대됩니다!",
    author: "이네트워킹",
    tags: ["커뮤니티", "밋업", "부산"],
    views: 521,
    comments: 32,
    likes: 89,
    date: "1일 전",
  },
  {
    id: 3,
    title: "이미지 생성 AI 프로젝트 팀원 모집",
    excerpt: "Stable Diffusion을 활용한 상용 서비스를 만들고 있습니다. 백엔드 개발자를 찾고 있어요.",
    author: "박프로젝트",
    tags: ["프로젝트", "모집", "이미지AI"],
    views: 287,
    comments: 12,
    likes: 34,
    date: "3일 전",
  },
  {
    id: 4,
    title: "RAG 시스템 구축 팁과 주의사항",
    excerpt: "실무에서 배운 RAG 시스템 구축의 노하우를 공유합니다. 특히 청킹 전략이 중요합니다.",
    author: "최데이터",
    tags: ["RAG", "LLM", "팁"],
    views: 612,
    comments: 28,
    likes: 76,
    date: "5일 전",
  },
];

const mockMembers = [
  {
    id: 1,
    name: "김AI개발자",
    expertise: ["LLM", "파인튜닝"],
    bio: "AI 엔지니어, 부산에서 활동 중",
  },
  {
    id: 2,
    name: "이네트워킹",
    expertise: ["커뮤니티", "비즈니스"],
    bio: "AI 스타트업 창업자",
  },
  {
    id: 3,
    name: "박프로젝트",
    expertise: ["이미지AI", "프로젝트관리"],
    bio: "AI 프로젝트 리더",
  },
  {
    id: 4,
    name: "최데이터",
    expertise: ["RAG", "데이터엔지니어링"],
    bio: "데이터 전문가, 부산 AI 생태계 활동가",
  },
];

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"posts" | "members">("posts");

  const filteredPosts = mockPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-muted/30 py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">네트워킹 커뮤니티</h1>
          <p className="text-lg text-muted-foreground">
            부산 AI 전문가들과 연결되고, 지식을 공유하며 함께 성장하세요
          </p>
        </div>
      </section>

      {/* Search and Actions */}
      <section className="border-b border-border bg-background py-6 sticky top-16 z-40">
        <div className="container">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="게시물 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="bg-accent hover:bg-accent/90 gap-2">
              <Plus className="w-4 h-4" />
              새 게시물
            </Button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-border bg-background">
        <div className="container">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("posts")}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === "posts"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              게시물
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === "members"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              회원 프로필
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container">
          {activeTab === "posts" && (
            <div className="space-y-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <Link key={post.id} href={`/community/posts/${post.id}`}>
                    <a className="group">
                      <Card className="border-2 border-border hover:border-accent/50 transition-all hover:shadow-md cursor-pointer">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <CardTitle className="line-clamp-2 group-hover:text-accent transition-colors">
                                {post.title}
                              </CardTitle>
                              <CardDescription className="line-clamp-2 mt-2">
                                {post.excerpt}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <span>{post.author}</span>
                              <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                <span>{post.views}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                <span>{post.comments}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                <span>{post.likes}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">검색 결과가 없습니다.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "members" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockMembers.map((member) => (
                <Link key={member.id} href={`/community/members/${member.id}`}>
                  <a className="group">
                    <Card className="h-full border-2 border-border hover:border-accent/50 transition-all hover:shadow-md cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white font-bold">
                            {member.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="group-hover:text-accent transition-colors">
                              {member.name}
                            </CardTitle>
                            <CardDescription className="text-xs mt-1">
                              {member.bio}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {member.expertise.map((exp) => (
                            <Badge key={exp} variant="secondary" className="text-xs">
                              {exp}
                            </Badge>
                          ))}
                        </div>
                        <Button className="w-full mt-4 bg-accent hover:bg-accent/90" size="sm">
                          프로필 보기
                        </Button>
                      </CardContent>
                    </Card>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
