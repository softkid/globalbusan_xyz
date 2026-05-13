import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function NewsCreate() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"news" | "event">("news");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
        <p className="text-muted-foreground mb-6">뉴스/이벤트를 등록하려면 먼저 로그인해주세요.</p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate("/news")}>돌아가기</Button>
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
    if (!title.trim() || !description.trim() || !date) {
      toast.error("필수 항목을 모두 입력해주세요.");
      return;
    }
    
    toast.success("성공적으로 등록되었습니다!");
    navigate("/news");
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-3xl">
        <Button 
          variant="ghost" 
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground pl-0"
          onClick={() => navigate("/news")}
        >
          <ArrowLeft className="w-4 h-4" />
          뉴스/이벤트 목록으로
        </Button>

        <Card className="border-2 border-border shadow-sm">
          <CardHeader className="bg-muted/30 border-b border-border/50 pb-6">
            <CardTitle className="text-2xl">새 소식 등록</CardTitle>
            <CardDescription>
              부산 AI 생태계에 유용한 정보나 행사를 공유해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">유형 *</label>
                <Select value={type} onValueChange={(val: "news" | "event") => setType(val)}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">뉴스 (소식/발표)</SelectItem>
                    <SelectItem value="event">이벤트 (행사/세미나)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">제목 *</label>
                <Input 
                  placeholder="예: 부산 AI 컨퍼런스 2026 개최" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{type === "event" ? "행사 일자 *" : "발표 일자 *"}</label>
                  <Input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                
                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">장소 {type === "news" ? "(선택)" : "*"}</label>
                  <Input 
                    placeholder="예: 벡스코 제1전시장 (온라인인 경우 '온라인')" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
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
                  placeholder="태그 입력 후 Enter (예: AI, 컨퍼런스)" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  disabled={tags.length >= 5}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">상세 내용 *</label>
                <Textarea 
                  placeholder="행사 개요, 대상, 참여 방법 등을 자세히 적어주세요." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[250px] resize-y"
                />
              </div>

              {/* Submit */}
              <div className="pt-4 flex justify-end gap-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => navigate("/news")}>
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
