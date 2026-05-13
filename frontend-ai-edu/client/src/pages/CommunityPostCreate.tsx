import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function CommunityPostCreate() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
        <p className="text-muted-foreground mb-6">게시물을 작성하려면 먼저 로그인해주세요.</p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate("/community")}>돌아가기</Button>
          <Button asChild className="bg-accent hover:bg-accent/90">
            <a href={getLoginUrl()}>로그인하기</a>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      if (!tags.includes(tagInput.trim()) && tags.length < 5) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("제목과 내용을 모두 입력해주세요.");
      return;
    }
    
    toast.success("게시물이 등록되었습니다!");
    navigate("/community");
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-3xl">
        <Button 
          variant="ghost" 
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/community")}
        >
          <ArrowLeft className="w-4 h-4" />
          커뮤니티로 돌아가기
        </Button>

        <Card className="border-2 border-border shadow-sm">
          <CardHeader className="bg-muted/30 border-b border-border/50 pb-6">
            <CardTitle className="text-2xl">새 게시물 작성</CardTitle>
            <CardDescription>
              부산 AI 전문가들과 지식과 경험을 공유해보세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">제목</label>
                <Input 
                  placeholder="게시물 제목을 입력하세요" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg py-6"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-sm font-medium">태그 (최대 5개)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-1">
                      {tag}
                      <button 
                        type="button" 
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input 
                  placeholder="태그 입력 후 Enter (예: LLM, 프로젝트모집)" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  disabled={tags.length >= 5}
                />
                <p className="text-xs text-muted-foreground">태그는 Enter 키를 눌러 추가할 수 있습니다.</p>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label className="text-sm font-medium">내용</label>
                <Textarea 
                  placeholder="내용을 자세히 작성해주세요..." 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[300px] resize-y"
                />
              </div>

              {/* Submit */}
              <div className="pt-4 flex justify-end gap-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => navigate("/community")}>
                  취소
                </Button>
                <Button type="submit" className="bg-accent hover:bg-accent/90 px-8">
                  등록하기
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
