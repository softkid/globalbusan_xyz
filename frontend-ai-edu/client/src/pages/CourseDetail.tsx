import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, User, Star, CheckCircle, MonitorPlay, PlayCircle } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

// We'll reuse the mock data for demonstration
const mockCourses = [
  {
    id: 1,
    title: "ChatGPT API를 활용한 AI 챗봇 개발",
    description: "OpenAI API를 사용하여 실무 수준의 AI 챗봇을 만드는 방법을 배웁니다.",
    fullDescription: "이 강의에서는 OpenAI의 강력한 언어 모델인 ChatGPT API를 활용하여 실제 비즈니스 환경에서 사용할 수 있는 대화형 AI 챗봇을 처음부터 끝까지 구축하는 방법을 배웁니다. 기본적인 API 연동부터 시작하여, 컨텍스트 유지, 프롬프트 엔지니어링, 에러 처리, 그리고 웹 서비스 형태로 배포하는 과정까지 실무 중심의 커리큘럼으로 구성되어 있습니다. 개발 경험이 있는 초급자부터 중급자까지 모두 수강할 수 있습니다.",
    category: "LLM",
    level: "beginner",
    instructor: "김AI 전문가",
    duration: 12,
    price: 49900,
    rating: 4.8,
    reviews: 124,
    curriculum: [
      "1. OpenAI API 기초 및 환경설정",
      "2. 텍스트 생성 API 기초 활용법",
      "3. 대화 컨텍스트 유지 및 관리 방법",
      "4. 프롬프트 엔지니어링 심화",
      "5. 실전: React 기반 챗봇 UI 구현",
      "6. 실전: 서버사이드 API 연동 및 배포"
    ],
    enrolled: false,
  },
  {
    id: 2,
    title: "이미지 생성 AI: Stable Diffusion 마스터",
    description: "Stable Diffusion을 활용한 고급 이미지 생성 기법과 실무 활용법.",
    fullDescription: "Stable Diffusion 모델을 로컬에 설치하고 고품질 이미지를 생성하는 모든 기법을 다룹니다.",
    category: "Image AI",
    level: "intermediate",
    instructor: "이이미지 전문가",
    duration: 16,
    price: 59900,
    rating: 4.6,
    reviews: 89,
    curriculum: ["1. Stable Diffusion 개요", "2. 프롬프트 작성법", "3. ControlNet 활용"],
    enrolled: false,
  },
  // We'll fallback to a generic display if id doesn't match 1 or 2
];

const levels = {
  beginner: "초급",
  intermediate: "중급",
  advanced: "고급",
};

export default function CourseDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  
  const courseId = id ? parseInt(id) : 1;
  const course = mockCourses.find(c => c.id === courseId) || {
    ...mockCourses[0],
    id: courseId,
    title: `가상의 AI 강좌 #${courseId}`,
  };

  const handleEnroll = () => {
    if (!isAuthenticated) {
      toast.error("로그인이 필요합니다.", {
        description: "수강신청을 위해 먼저 로그인해 주세요.",
        action: {
          label: "로그인",
          onClick: () => window.location.href = getLoginUrl(),
        },
      });
      return;
    }
    
    // Simulate enrollment
    toast.success("수강신청이 완료되었습니다!", {
      description: `${course.title} 강좌 등록 완료.`,
    });
  };

  if (!course) {
    return <div>강좌를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-busan-primary/90 to-blue-900 text-white py-16">
        <div className="container max-w-5xl">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3">
                <Badge className="bg-accent text-accent-foreground hover:bg-accent/90">{course.category}</Badge>
                <Badge variant="outline" className="border-white/30 text-white">
                  {levels[course.level as keyof typeof levels] || course.level}
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {course.title}
              </h1>
              
              <p className="text-lg md:text-xl text-blue-100 max-w-2xl leading-relaxed">
                {course.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-blue-100 pt-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>총 {course.duration}시간</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-white">{course.rating}</span>
                  <span>({course.reviews}개의 리뷰)</span>
                </div>
              </div>
            </div>
            
            {/* Enrollment Card (Desktop) */}
            <Card className="w-full md:w-80 shadow-xl border-0 hidden md:block">
              <div className="h-40 bg-gradient-to-br from-accent/20 to-orange-500/20 flex items-center justify-center rounded-t-xl">
                <PlayCircle className="w-16 h-16 text-accent/80" />
              </div>
              <CardContent className="p-6 space-y-6 bg-card text-card-foreground">
                <div className="text-3xl font-bold text-accent">
                  ₩{course.price.toLocaleString()}
                </div>
                <Button className="w-full bg-accent hover:bg-accent/90 text-lg py-6" onClick={handleEnroll}>
                  수강신청 하기
                </Button>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><MonitorPlay className="w-4 h-4 text-busan-primary" /> 평생 소장 및 무제한 수강</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-busan-primary" /> 수료증 발급</li>
                  <li className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-busan-primary" /> 실습 자료 및 소스코드 제공</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container max-w-5xl flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-12">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-6">강좌 소개</h2>
              <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                <p>{course.fullDescription}</p>
              </div>
            </div>

            {/* Curriculum */}
            <div>
              <h2 className="text-2xl font-bold mb-6">커리큘럼</h2>
              <div className="space-y-4">
                {course.curriculum.map((item, idx) => (
                  <Card key={idx} className="border border-border/50 shadow-sm hover:border-accent/30 transition-colors">
                    <CardHeader className="py-4 px-6">
                      <CardTitle className="text-base flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </div>
                        {item}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Instructor Info */}
            <div>
              <h2 className="text-2xl font-bold mb-6">강사 소개</h2>
              <Card className="border border-border/50">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{course.instructor}</h3>
                    <p className="text-sm text-muted-foreground mb-4">부산 AI 플랫폼 대표 강사</p>
                    <p className="text-sm">수많은 현업 AI 프로젝트를 수행한 경험을 바탕으로, 이론이 아닌 실무에서 바로 활용할 수 있는 핵심 노하우를 전달합니다.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Mobile Enrollment Sticky Bottom */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border z-40">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold">수강료</span>
              <span className="text-2xl font-bold text-accent">₩{course.price.toLocaleString()}</span>
            </div>
            <Button className="w-full bg-accent hover:bg-accent/90 py-6 text-lg" onClick={handleEnroll}>
              수강신청 하기
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
