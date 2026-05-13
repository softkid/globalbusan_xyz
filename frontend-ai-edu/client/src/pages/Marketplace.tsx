import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Plus, Filter } from "lucide-react";
import { Link } from "wouter";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

const categories = ["전체", "LLM", "Image AI", "ML", "Voice AI", "Advanced"];

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: api.services.getAll,
  });

  const filteredServices = selectedCategory === "전체"
    ? services
    : services.filter((s: any) => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-muted/30 py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">AI 마켓플레이스</h1>
          <p className="text-lg text-muted-foreground mb-8">
            AI 기반 서비스와 솔루션을 판매하고 구매하는 생태계
          </p>

          <Card className="bg-gradient-to-r from-blue-500/10 to-orange-500/10 border-accent/20">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-1">원하는 AI 솔루션을 찾지 못하셨나요?</h3>
                <p className="text-muted-foreground">개발 용어를 몰라도 괜찮습니다. AI가 요구사항 정의서(RFP) 작성을 도와드립니다.</p>
              </div>
              <Button asChild className="bg-accent hover:bg-accent/90 shrink-0">
                <Link href="/smart-rfp">Smart RFP 생성하기</Link>
              </Button>
            </CardContent>
          </Card>
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
            <Button asChild className="bg-accent hover:bg-accent/90 gap-2 whitespace-nowrap">
              <Link href="/marketplace/new">
                <a className="flex items-center gap-2"><Plus className="w-4 h-4" />서비스 등록</a>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12">
        <div className="container">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-muted/20">
              <p className="text-muted-foreground mb-4">해당 카테고리의 서비스가 없습니다.</p>
              <Button variant="outline" onClick={() => setSelectedCategory("전체")}>
                필터 초기화
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service: any) => (
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
          )}
        </div>
      </section>
    </div>
  );
}
