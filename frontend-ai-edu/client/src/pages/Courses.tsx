import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, User, Star } from "lucide-react";
import { Link } from "wouter";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

const categories = ["전체", "LLM", "Image AI", "ML", "Voice AI", "Advanced"];
const levels = {
  beginner: "초급",
  intermediate: "중급",
  advanced: "고급",
};

export default function Courses() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: api.courses.getAll,
  });

  const filteredCourses = courses.filter((course: any) => {
    const categoryMatch = selectedCategory === "전체" || course.category === selectedCategory;
    const levelMatch = !selectedLevel || course.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-muted/30 py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">AI 교육 허브</h1>
          <p className="text-lg text-muted-foreground">
            부산의 AI 전문가들이 직접 운영하는 실전 교육 프로그램
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-background py-8 sticky top-16 z-40">
        <div className="container">
          <div className="space-y-4">
            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-semibold mb-3">카테고리</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className={selectedCategory === cat ? "bg-accent text-accent-foreground" : ""}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Level Filter */}
            <div>
              <h3 className="text-sm font-semibold mb-3">난이도</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!selectedLevel ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel(null)}
                  className={!selectedLevel ? "bg-accent text-accent-foreground" : ""}
                >
                  전체
                </Button>
                {Object.entries(levels).map(([key, label]) => (
                  <Button
                    key={key}
                    variant={selectedLevel === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLevel(key)}
                    className={selectedLevel === key ? "bg-accent text-accent-foreground" : ""}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12">
        <div className="container">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredCourses.length}개의 강좌를 찾았습니다
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-muted/20">
              <p className="text-muted-foreground mb-4">해당 조건에 맞는 강좌가 없습니다.</p>
              <Button variant="outline" onClick={() => { setSelectedCategory("전체"); setSelectedLevel(null); }}>
                필터 초기화
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course: any) => (
                <Link key={course.id} href={`/courses/${course.id}`}>
                  <a className="group">
                    <Card className="h-full border-2 border-border hover:border-accent/50 transition-all hover:shadow-lg cursor-pointer overflow-hidden">
                      {/* Course Header */}
                      <div className="h-32 bg-gradient-to-br from-blue-500/20 to-orange-500/20 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-accent/50 group-hover:text-accent transition-colors" />
                      </div>

                      <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {course.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {levels[course.level as keyof typeof levels]}
                        </Badge>
                      </div>
                      <CardTitle className="line-clamp-2 group-hover:text-accent transition-colors">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-2">
                        {course.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Instructor */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{course.instructor}</span>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}시간</span>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">{course.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">({course.reviews})</span>
                      </div>

                      {/* Price */}
                      <div className="pt-4 border-t border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-accent">
                            ₩{course.price.toLocaleString()}
                          </span>
                          <Button size="sm" className="bg-accent hover:bg-accent/90">
                            수강신청
                          </Button>
                        </div>
                      </div>
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
