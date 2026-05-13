import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Plus, Filter } from "lucide-react";
import { Link } from "wouter";

const mockProjects = [
  {
    id: 1,
    title: "부산 관광 AI 챗봇",
    description: "부산 관광정보를 제공하는 LLM 기반 챗봇 개발",
    category: "LLM",
    status: "recruiting",
    creator: "김프로젝트",
    currentTeam: 2,
    targetTeam: 5,
    skills: ["Python", "LLM", "API"],
    startDate: "2026-05-15",
  },
  {
    id: 2,
    title: "AI 이미지 편집 도구",
    description: "Stable Diffusion을 활용한 웹 기반 이미지 편집 플랫폼",
    category: "Image AI",
    status: "in_progress",
    creator: "이디자인",
    currentTeam: 3,
    targetTeam: 4,
    skills: ["React", "Python", "Stable Diffusion"],
    startDate: "2026-04-01",
  },
  {
    id: 3,
    title: "부산 기업 데이터 분석 AI",
    description: "부산 중소기업 데이터를 분석하는 머신러닝 모델",
    category: "ML",
    status: "recruiting",
    creator: "박데이터",
    currentTeam: 1,
    targetTeam: 6,
    skills: ["Python", "ML", "데이터분석"],
    startDate: "2026-05-20",
  },
  {
    id: 4,
    title: "음성 기반 회의록 자동 생성",
    description: "Whisper를 활용한 회의 음성을 텍스트로 변환 및 요약",
    category: "Voice AI",
    status: "recruiting",
    creator: "최음성",
    currentTeam: 2,
    targetTeam: 4,
    skills: ["Whisper", "LLM", "Node.js"],
    startDate: "2026-06-01",
  },
];

const statusMap: Record<string, { label: string; color: string }> = {
  planning: { label: "계획 중", color: "bg-gray-500" },
  recruiting: { label: "팀원 모집 중", color: "bg-orange-500" },
  in_progress: { label: "진행 중", color: "bg-blue-500" },
  completed: { label: "완료", color: "bg-green-500" },
};

export default function Projects() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const filteredProjects = selectedStatus
    ? mockProjects.filter((p) => p.status === selectedStatus)
    : mockProjects;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-muted/30 py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">프로젝트 빌딩</h1>
          <p className="text-lg text-muted-foreground">
            AI 프로젝트를 함께 구축할 팀원을 찾고, 협업하며 실무 경험을 쌓으세요
          </p>
        </div>
      </section>

      {/* Actions */}
      <section className="border-b border-border bg-background py-6 sticky top-16 z-40">
        <div className="container">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={!selectedStatus ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(null)}
                className={!selectedStatus ? "bg-accent text-accent-foreground" : ""}
              >
                <Filter className="w-4 h-4 mr-2" />
                전체
              </Button>
              {Object.entries(statusMap).map(([key, { label }]) => (
                <Button
                  key={key}
                  variant={selectedStatus === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(key)}
                  className={selectedStatus === key ? "bg-accent text-accent-foreground" : ""}
                >
                  {label}
                </Button>
              ))}
            </div>
            <Button className="bg-accent hover:bg-accent/90 gap-2 whitespace-nowrap">
              <Plus className="w-4 h-4" />
              프로젝트 등록
            </Button>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => {
              const status = statusMap[project.status];
              return (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <a className="group">
                    <Card className="h-full border-2 border-border hover:border-accent/50 transition-all hover:shadow-lg cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <CardTitle className="line-clamp-2 group-hover:text-accent transition-colors">
                              {project.title}
                            </CardTitle>
                          </div>
                          <Badge className={`${status.color} text-white whitespace-nowrap`}>
                            {status.label}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Project Info */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">카테고리</span>
                            <Badge variant="secondary">{project.category}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">시작일</span>
                            <div className="flex items-center gap-1 text-foreground">
                              <Calendar className="w-4 h-4" />
                              {new Date(project.startDate).toLocaleDateString("ko-KR")}
                            </div>
                          </div>
                        </div>

                        {/* Team Info */}
                        <div className="border-t border-border pt-3">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4" />
                              <span>팀 구성</span>
                            </div>
                            <span className="font-semibold">
                              {project.currentTeam}/{project.targetTeam}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-accent h-2 rounded-full transition-all"
                              style={{
                                width: `${(project.currentTeam / project.targetTeam) * 100}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2">
                          {project.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        {/* Creator */}
                        <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                          프로젝트 리더: <span className="font-semibold">{project.creator}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </Link>
              );
            })}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">해당하는 프로젝트가 없습니다.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
