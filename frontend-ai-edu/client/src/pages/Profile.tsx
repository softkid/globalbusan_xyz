import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, MapPin, Briefcase, Edit2, LogOut, BookOpen, Clock, PlayCircle, Camera } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "wouter";
import { toast } from "sonner";

export default function Profile() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        toast.success("프로필 이미지가 임시로 적용되었습니다.");
      };
      reader.readAsDataURL(file);
    }
  };

  // Read tab from query params if available
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">프로필을 불러올 수 없습니다.</p>
          <Button onClick={() => navigate("/")}>
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const userStats = [
    { label: "수강한 강좌", value: "3", icon: "📚" },
    { label: "참여 프로젝트", value: "2", icon: "🚀" },
    { label: "커뮤니티 게시물", value: "12", icon: "💬" },
    { label: "팔로워", value: "45", icon: "👥" },
  ];

  const interests = ["LLM", "이미지 생성 AI", "RAG", "데이터 분석"];
  const skills = ["Python", "React", "Node.js", "머신러닝"];

  const enrolledCourses = [
    {
      id: 1,
      title: "ChatGPT API를 활용한 AI 챗봇 개발",
      progress: 65,
      lastAccessed: "2024-05-12",
    },
    {
      id: 2,
      title: "이미지 생성 AI: Stable Diffusion 마스터",
      progress: 100,
      lastAccessed: "2024-05-01",
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-muted/30 py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-2">내 공간</h1>
          <p className="text-lg text-muted-foreground">
            프로필 관리 및 학습 대시보드
          </p>
        </div>
      </section>

      {/* Profile Section */}
      <section className="py-8">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex justify-between items-end">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="profile">내 프로필</TabsTrigger>
                <TabsTrigger value="courses">학습 대시보드</TabsTrigger>
                <TabsTrigger value="projects" disabled>프로젝트/외주 (예정)</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="profile">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Profile Card */}
                <div className="lg:col-span-2">
                  <Card className="border-2 border-border">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-6">
                          {/* Avatar */}
                          <div className="relative group">
                            <div 
                              className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg overflow-hidden cursor-pointer"
                              onClick={() => isEditing && fileInputRef.current?.click()}
                            >
                              {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                              ) : (
                                user.name?.charAt(0) || "U"
                              )}
                              
                              {isEditing && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Camera className="w-6 h-6 text-white" />
                                </div>
                              )}
                            </div>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              ref={fileInputRef}
                              onChange={handleImageUpload}
                            />
                          </div>
                          <div>
                            <CardTitle className="text-3xl mb-2">{user.name}</CardTitle>
                            <CardDescription className="text-base">
                              {user.email || "이메일 없음"}
                            </CardDescription>
                            <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>부산, 대한민국</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(!isEditing)}
                            className="gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            편집
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                            className="gap-2 text-destructive hover:text-destructive"
                          >
                            <LogOut className="w-4 h-4" />
                            로그아웃
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Bio */}
                      <div>
                        <h3 className="font-semibold mb-2">소개</h3>
                        <p className="text-muted-foreground">
                          부산 AI 생태계에서 활동하는 AI 개발자입니다. LLM과 이미지 생성 AI에 관심이 있습니다.
                        </p>
                      </div>

                      {/* Contact Info */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-accent" />
                          <div>
                            <p className="text-sm text-muted-foreground">이메일</p>
                            <p className="font-medium">{user.email || "등록되지 않음"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-5 h-5 text-accent" />
                          <div>
                            <p className="text-sm text-muted-foreground">직업</p>
                            <p className="font-medium">AI 개발자</p>
                          </div>
                        </div>
                      </div>

                      {/* Interests */}
                      <div>
                        <h3 className="font-semibold mb-3">관심 분야</h3>
                        <div className="flex flex-wrap gap-2">
                          {interests.map((interest) => (
                            <Badge key={interest} variant="secondary">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Skills */}
                      <div>
                        <h3 className="font-semibold mb-3">기술 스택</h3>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Stats Sidebar */}
                <div className="space-y-4">
                  <Card className="border-2 border-border">
                    <CardHeader>
                      <CardTitle className="text-lg">활동 통계</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {userStats.map((stat) => (
                        <div key={stat.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className="text-2xl font-bold text-accent">{stat.value}</p>
                          </div>
                          <span className="text-3xl">{stat.icon}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Quick Links */}
                  <Card className="border-2 border-border">
                    <CardHeader>
                      <CardTitle className="text-lg">빠른 이동</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => setActiveTab('courses')}>
                        내 강좌 보기
                      </Button>
                      <Button variant="outline" className="w-full justify-start" size="sm" asChild>
                        <Link href="/projects">프로젝트 찾기</Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" size="sm" asChild>
                        <Link href="/community">게시판 가기</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="courses">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">수강 중인 강좌</h2>
                  <p className="text-muted-foreground">현재 학습 중인 내용을 확인하고 이어서 학습하세요.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {enrolledCourses.map((course) => (
                    <Card key={course.id} className="border-2 border-border hover:border-accent/50 transition-colors">
                      <CardHeader className="pb-3">
                        <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">진도율</span>
                            <span className="font-bold text-accent">{course.progress}%</span>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div className="bg-accent h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>최근 학습: {course.lastAccessed}</span>
                            </div>
                            <Button size="sm" className="gap-2 bg-busan-primary hover:bg-busan-primary/90" asChild>
                              <Link href={`/courses/${course.id}`}>
                                {course.progress === 100 ? "다시 보기" : "이어서 학습"} <PlayCircle className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
