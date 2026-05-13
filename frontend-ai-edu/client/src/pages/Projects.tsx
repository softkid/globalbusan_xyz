import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Plus, Filter } from "lucide-react";
import { Link } from "wouter";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

const statusMap: Record<string, { label: string; color: string }> = {
  planning: { label: "계획 중", color: "bg-gray-500" },
  recruiting: { label: "팀원 모집 중", color: "bg-orange-500" },
  in_progress: { label: "진행 중", color: "bg-blue-500" },
  completed: { label: "완료", color: "bg-green-500" },
};

export default function Projects() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: api.projects.getAll,
  });

  const filteredProjects = selectedStatus
    ? projects.filter((p: any) => p.status === selectedStatus)
    : projects;

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
            <Button asChild className="bg-accent hover:bg-accent/90 gap-2 whitespace-nowrap">
              <Link href="/projects/new">
                <a className="flex items-center gap-2"><Plus className="w-4 h-4" />프로젝트 등록</a>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="container">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-muted/20">
              <p className="text-muted-foreground mb-4">해당 상태의 프로젝트가 없습니다.</p>
              <Button variant="outline" onClick={() => setSelectedStatus(null)}>
                필터 초기화
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredProjects.map((project: any) => {
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
          )}
        </div>
      </section>
    </div>
  );
}
