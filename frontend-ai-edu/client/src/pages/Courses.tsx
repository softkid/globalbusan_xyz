import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, User, Star } from "lucide-react";
import { Link } from "wouter";

const mockCourses = [
  {
    id: 1,
    title: "ChatGPT API를 활용한 AI 챗봇 개발",
    description: "OpenAI API를 사용하여 실무 수준의 AI 챗봇을 만드는 방법을 배웁니다.",
    category: "LLM",
    level: "beginner",
    instructor: "김AI 전문가",
    duration: 12,
    price: 49900,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    title: "이미지 생성 AI: Stable Diffusion 마스터",
    description: "Stable Diffusion을 활용한 고급 이미지 생성 기법과 실무 활용법.",
    category: "Image AI",
    level: "intermediate",
    instructor: "이이미지 전문가",
    duration: 16,
    price: 59900,
    rating: 4.6,
    reviews: 89,
  },
  {
    id: 3,
    title: "RAG 시스템 구축: 데이터 기반 AI 만들기",
    description: "Retrieval-Augmented Generation으로 기업 데이터를 활용한 AI 시스템 구축.",
    category: "Advanced",
    level: "advanced",
    instructor: "박데이터 전문가",
    duration: 20,
    price: 79900,
    rating: 4.9,
    reviews: 156,
  },
  {
    id: 4,
    title: "Python으로 시작하는 머신러닝",
    description: "머신러닝의 기초부터 실제 프로젝트까지, 파이썬으로 배우는 완벽 가이드.",
    category: "ML",
    level: "beginner",
    instructor: "최ML 전문가",
    duration: 24,
    price: 69900,
    rating: 4.7,
    reviews: 203,
  },
  {
    id: 5,
    title: "LangChain으로 AI 에이전트 만들기",
    description: "LangChain 프레임워크를 사용하여 자율적으로 작동하는 AI 에이전트 개발.",
    category: "LLM",
    level: "intermediate",
    instructor: "정에이전트 전문가",
    duration: 14,
    price: 54900,
    rating: 4.5,
    reviews: 78,
  },
  {
    id: 6,
    title: "음성 AI: 음성 인식 및 생성",
    description: "Whisper와 TTS 기술을 활용한 음성 기반 AI 애플리케이션 개발.",
    category: "Voice AI",
    level: "intermediate",
    instructor: "오음성 전문가",
    duration: 18,
    price: 64900,
    rating: 4.4,
    reviews: 65,
  },
];

const categories = ["전체", "LLM", "Image AI", "ML", "Voice AI", "Advanced"];
const levels = {
  beginner: "초급",
  intermediate: "중급",
  advanced: "고급",
};

export default function Courses() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const filteredCourses = mockCourses.filter((course) => {
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
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

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">해당하는 강좌가 없습니다.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
