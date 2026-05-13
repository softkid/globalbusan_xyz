import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function MarketplaceCreate() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
        <p className="text-muted-foreground mb-6">서비스를 등록하려면 먼저 로그인해주세요.</p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate("/marketplace")}>돌아가기</Button>
          <Button asChild className="bg-accent hover:bg-accent/90">
            <a href={getLoginUrl()}>로그인하기</a>
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !category.trim() || !price) {
      toast.error("모든 필수 항목을 입력해주세요.");
      return;
    }
    
    toast.success("서비스가 등록되었습니다!", {
      description: "마켓플레이스에 정상적으로 노출됩니다."
    });
    navigate("/marketplace");
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-3xl">
        <Button 
          variant="ghost" 
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground pl-0"
          onClick={() => navigate("/marketplace")}
        >
          <ArrowLeft className="w-4 h-4" />
          마켓플레이스로 돌아가기
        </Button>

        <Card className="border-2 border-border shadow-sm">
          <CardHeader className="bg-muted/30 border-b border-border/50 pb-6">
            <CardTitle className="text-2xl">서비스 등록</CardTitle>
            <CardDescription>
              본인의 AI 솔루션이나 서비스를 등록하여 수요자와 연결되세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">서비스 명 *</label>
                <Input 
                  placeholder="예: 기업 맞춤형 문서 기반 Q&A 챗봇 구축" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">카테고리 *</label>
                  <Input 
                    placeholder="예: LLM, ML, 컨설팅" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
                
                {/* Price */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">예상 단가 (원) *</label>
                  <Input 
                    type="number"
                    min="0"
                    step="10000"
                    placeholder="예: 500000" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">서비스 상세 설명 *</label>
                <Textarea 
                  placeholder="제공하는 서비스의 범위, 결과물, 기간 등을 상세히 적어주세요." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[250px] resize-y"
                />
              </div>

              {/* Submit */}
              <div className="pt-4 flex justify-end gap-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => navigate("/marketplace")}>
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
