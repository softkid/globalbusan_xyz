import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Copy, Star, Sparkles, MessageSquare } from "lucide-react";
import { toast } from "sonner";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

const categories = ["전체", "개발", "비즈니스", "생산성", "관광/여행", "마케팅"];

export default function Prompts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("전체");

  const { data: prompts = [], isLoading, error } = useQuery({
    queryKey: ['prompts'],
    queryFn: api.prompts.getAll,
  });

  const filteredPrompts = prompts.filter((prompt: any) => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prompt.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === "전체" || prompt.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("프롬프트가 클립보드에 복사되었습니다!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-muted/30 py-12">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-accent" />
            <h1 className="text-4xl font-bold">프롬프트 라이브러리</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            부산 AI 생태계 구성원들이 공유하는 고품질 AI 프롬프트 템플릿입니다. 바로 복사해서 업무와 프로젝트에 활용해보세요.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Sidebar / Filters */}
            <div className="w-full lg:w-64 space-y-6 shrink-0 sticky top-24">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">카테고리</h3>
                <div className="flex flex-col gap-1">
                  {categories.map(category => (
                    <Button 
                      key={category}
                      variant={activeCategory === category ? "default" : "ghost"}
                      className={`justify-start ${activeCategory === category ? "bg-accent text-accent-foreground" : ""}`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Card className="border-2 border-border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">나의 프롬프트</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-sm">
                    내가 저장한 템플릿
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    내가 작성한 템플릿
                  </Button>
                  <Button className="w-full bg-accent hover:bg-accent/90 mt-2 text-sm">
                    새 프롬프트 등록
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Prompt List */}
            <div className="flex-1 space-y-6 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="프롬프트 제목이나 태그를 검색하세요..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>

              <div className="grid gap-6">
                {isLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                  </div>
                ) : error ? (
                  <div className="text-center py-20 text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>
                ) : filteredPrompts.length === 0 ? (
                  <div className="text-center py-16 bg-muted/20 rounded-lg border-2 border-dashed border-border">
                    <p className="text-muted-foreground mb-4">검색 결과가 없습니다.</p>
                    <Button variant="outline" onClick={() => {setSearchQuery(""); setActiveCategory("전체")}}>
                      초기화
                    </Button>
                  </div>
                ) : (
                  filteredPrompts.map((prompt: any) => (
                    <Card key={prompt.id} className="border-2 border-border overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-busan-primary/10 text-busan-primary hover:bg-busan-primary/20">
                              {prompt.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">by {prompt.author}</span>
                          </div>
                          <CardTitle className="text-xl mb-1">{prompt.title}</CardTitle>
                          <CardDescription className="text-base">{prompt.description}</CardDescription>
                        </div>
                        <Button 
                          variant="outline" 
                          className="shrink-0 gap-2 font-semibold"
                          onClick={() => handleCopy(prompt.content)}
                        >
                          <Copy className="w-4 h-4" />
                          복사하기
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="bg-muted/40 p-4 rounded-lg font-mono text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 border border-border/50">
                        {prompt.content}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {prompt.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/10 border-t border-border/50 py-3 flex justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span>{prompt.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>사용 {prompt.usageCount}회</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
                        자세히 보기
                      </Button>
                    </CardFooter>
                  </Card>
                )))}
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}
