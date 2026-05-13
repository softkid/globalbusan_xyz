import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Plus, Filter } from "lucide-react";
import { Link } from "wouter";

const mockServices = [
  {
    id: 1,
    title: "LLM 파인튜닝 서비스",
    description: "기업 데이터를 활용한 맞춤형 LLM 파인튜닝 서비스",
    category: "LLM",
    price: 500000,
    rating: 4.9,
    reviews: 23,
    creator: "김AI전문가",
  },
  {
    id: 2,
    title: "이미지 생성 API 통합",
    description: "Stable Diffusion 기반 이미지 생성 API 통합 및 최적화",
    category: "Image AI",
    price: 300000,
    rating: 4.7,
    reviews: 15,
    creator: "이이미지전문가",
  },
  {
    id: 3,
    title: "RAG 시스템 구축 컨설팅",
    description: "기업 문서 기반 RAG 시스템 설계 및 구현 컨설팅",
    category: "Advanced",
    price: 800000,
    rating: 4.8,
    reviews: 18,
    creator: "박데이터전문가",
  },
  {
    id: 4,
    title: "음성 인식 AI 통합",
    description: "Whisper 기반 음성 인식 시스템 통합 및 최적화",
    category: "Voice AI",
    price: 400000,
    rating: 4.6,
    reviews: 12,
    creator: "최음성전문가",
  },
  {
    id: 5,
    title: "머신러닝 모델 개발",
    description: "맞춤형 머신러닝 모델 개발 및 배포",
    category: "ML",
    price: 600000,
    rating: 4.8,
    reviews: 20,
    creator: "정ML전문가",
  },
  {
    id: 6,
    title: "AI 챗봇 개발",
    description: "비즈니스 요구사항에 맞는 AI 챗봇 개발",
    category: "LLM",
    price: 1000000,
    rating: 4.9,
    reviews: 31,
    creator: "오챗봇전문가",
  },
];

const categories = ["전체", "LLM", "Image AI", "ML", "Voice AI", "Advanced"];

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const filteredServices = selectedCategory === "전체"
    ? mockServices
    : mockServices.filter((s) => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-muted/30 py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">AI 마켓플레이스</h1>
          <p className="text-lg text-muted-foreground">
            AI 기반 서비스와 솔루션을 판매하고 구매하는 생태계
          </p>
        </div>
      </section>

      {/* Filters and Actions */}
      <section className="border-b border-border bg-background py-6 sticky top-16 z-40">
        <div className="container">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className={selectedCategory === cat ? "bg-accent text-accent-foreground" : ""}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {cat}
                </Button>
              ))}
            </div>
            <Button className="bg-accent hover:bg-accent/90 gap-2 whitespace-nowrap">
              <Plus className="w-4 h-4" />
              서비스 등록
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Link key={service.id} href={`/marketplace/${service.id}`}>
                <a className="group">
                  <Card className="h-full border-2 border-border hover:border-accent/50 transition-all hover:shadow-lg cursor-pointer flex flex-col">
                    {/* Service Header */}
                    <div className="h-24 bg-gradient-to-br from-blue-500/20 to-orange-500/20 flex items-center justify-center">
                      <ShoppingCart className="w-8 h-8 text-accent/50 group-hover:text-accent transition-colors" />
                    </div>

                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <CardTitle className="line-clamp-2 group-hover:text-accent transition-colors">
                            {service.title}
                          </CardTitle>
                        </div>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {service.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                      {/* Category */}
                      <Badge variant="secondary" className="w-fit">
                        {service.category}
                      </Badge>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">{service.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">({service.reviews})</span>
                      </div>

                      {/* Creator */}
                      <div className="text-xs text-muted-foreground">
                        제공자: <span className="font-semibold">{service.creator}</span>
                      </div>

                      {/* Price and CTA */}
                      <div className="border-t border-border pt-4 mt-auto">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-accent">
                            ₩{(service.price / 10000).toFixed(0)}만
                          </span>
                          <Button size="sm" className="bg-accent hover:bg-accent/90">
                            상세보기
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </Link>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">해당하는 서비스가 없습니다.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
