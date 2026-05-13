import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MessageSquare, Heart, Eye, Search, Plus } from "lucide-react";
import { Link } from "wouter";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

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
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['communityPosts'],
    queryFn: api.community.getPosts,
  });

  const filteredPosts = posts.filter(
    (post: any) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.content || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allTags = Array.from(new Set(mockMembers.flatMap(m => m.expertise)));

  const filteredMembers = mockMembers.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || member.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? member.expertise.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

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
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={activeTab === "posts" ? "게시물 제목 또는 내용 검색..." : "회원 이름 또는 소개 검색..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {activeTab === "posts" && (
              <Button asChild className="bg-accent hover:bg-accent/90 gap-2">
                <Link href="/community/posts/new">
                  <a className="flex items-center gap-2"><Plus className="w-4 h-4" />새 게시물</a>
                </Link>
              </Button>
            )}
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
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              ) : error ? (
                <div className="text-center py-20 text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((post: any) => (
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
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={selectedTag === null ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setSelectedTag(null)}
                  className={selectedTag === null ? "bg-accent text-accent-foreground" : ""}
                >
                  전체보기
                </Button>
                {allTags.map(tag => (
                  <Button 
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setSelectedTag(tag)}
                    className={selectedTag === tag ? "bg-accent text-accent-foreground" : ""}
                  >
                    {tag}
                  </Button>
                ))}
              </div>

              {filteredMembers.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMembers.map((member) => (
                    <Link key={member.id} href={`/community/members/${member.id}`}>
                      <a className="group">
                        <Card className="h-full border-2 border-border hover:border-accent/50 transition-all hover:shadow-md cursor-pointer">
                          <CardHeader>
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-sm">
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
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">검색 결과가 없습니다.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
