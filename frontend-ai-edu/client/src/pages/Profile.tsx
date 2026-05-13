import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Briefcase, Edit2, LogOut } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Profile() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [isEditing, setIsEditing] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-muted/30 py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-2">내 프로필</h1>
          <p className="text-lg text-muted-foreground">
            부산 AI 생태계에서의 활동 현황을 확인하세요
          </p>
        </div>
      </section>

      {/* Profile Section */}
      <section className="py-12">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Profile Card */}
            <div className="lg:col-span-2">
              <Card className="border-2 border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-6">
                      {/* Avatar */}
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white text-4xl font-bold">
                        {user.name?.charAt(0) || "U"}
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
                        className="gap-2 text-orange-500 hover:text-orange-600"
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
                  <CardTitle className="text-lg">빠른 링크</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    내 강좌
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    내 프로젝트
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    내 게시물
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    팔로우 목록
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
