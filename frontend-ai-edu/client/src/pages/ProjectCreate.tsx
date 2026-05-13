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

export default function ProjectCreate() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [targetTeam, setTargetTeam] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
        <p className="text-muted-foreground mb-6">프로젝트를 등록하려면 먼저 로그인해주세요.</p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate("/projects")}>돌아가기</Button>
          <Button asChild className="bg-accent hover:bg-accent/90">
            <a href={getLoginUrl()}>로그인하기</a>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim() !== '') {
      e.preventDefault();
      if (!skills.includes(skillInput.trim()) && skills.length < 10) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !category.trim() || !targetTeam) {
      toast.error("모든 필수 항목을 입력해주세요.");
      return;
    }
    
    toast.success("프로젝트가 등록되었습니다!", {
      description: "이제 팀원을 모집할 수 있습니다."
    });
    navigate("/projects");
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-3xl">
        <Button 
          variant="ghost" 
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground pl-0"
          onClick={() => navigate("/projects")}
        >
          <ArrowLeft className="w-4 h-4" />
          프로젝트 목록으로
        </Button>

        <Card className="border-2 border-border shadow-sm">
          <CardHeader className="bg-muted/30 border-b border-border/50 pb-6">
            <CardTitle className="text-2xl">프로젝트 등록</CardTitle>
            <CardDescription>
              아이디어를 현실로 만들 팀원들을 찾아보세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">프로젝트 명 *</label>
                <Input 
                  placeholder="예: 부산 해양 데이터 기반 AI 분석 플랫폼" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">카테고리 *</label>
                  <Input 
                    placeholder="예: LLM, ML, 웹서비스" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
                
                {/* Target Team */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">모집 인원 (본인 포함) *</label>
                  <Input 
                    type="number"
                    min="2"
                    max="10"
                    placeholder="예: 4" 
                    value={targetTeam}
                    onChange={(e) => setTargetTeam(e.target.value)}
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <label className="text-sm font-medium">필요 기술 스택</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-1">
                      {skill}
                      <button 
                        type="button" 
                        onClick={() => removeSkill(skill)}
                        className="ml-1 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input 
                  placeholder="기술명 입력 후 Enter (예: React, Python)" 
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  disabled={skills.length >= 10}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">프로젝트 상세 설명 *</label>
                <Textarea 
                  placeholder="프로젝트의 목표, 현재 진행 상황, 팀원에게 기대하는 역할 등을 자세히 적어주세요." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[200px] resize-y"
                />
              </div>

              {/* Submit */}
              <div className="pt-4 flex justify-end gap-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => navigate("/projects")}>
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
