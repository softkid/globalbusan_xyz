import { useState } from "react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Star, ShoppingCart, User, MessageSquare, ShieldCheck, CreditCard } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

const mockService = {
  id: 1,
  title: "LLM 파인튜닝 서비스",
  description: "기업 데이터를 활용한 맞춤형 LLM 파인튜닝 서비스\n\n### 제공 서비스 내역\n1. 데이터 전처리 및 정제\n2. 모델 파인튜닝 (Llama, Mistral 등 선택 가능)\n3. 평가 및 테스트\n4. API 형태로 배포\n\n### 작업 기간\n계약 체결 후 약 3~4주\n\n### 참고 사항\n데이터셋의 양과 퀄리티에 따라 기간 및 비용이 변동될 수 있습니다.",
  category: "LLM",
  price: 5000000,
  rating: 4.9,
  reviews: 23,
  creator: "김AI전문가",
  comments: [
    { id: 1, author: "A기업 담당자", content: "정말 만족스러운 결과물이 나왔습니다. 사내 규정 봇으로 잘 활용하고 있습니다.", date: "1주일 전", rating: 5 },
    { id: 2, author: "B스타트업", content: "친절한 설명과 빠른 대처 감사합니다.", date: "2주일 전", rating: 5 }
  ]
};

export default function MarketplaceDetail() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  
  const [reviewInput, setReviewInput] = useState("");
  const [ratingInput, setRatingInput] = useState(5);
  const [service, setService] = useState(mockService);

  const [isEscrowOpen, setIsEscrowOpen] = useState(false);

  const handlePurchase = () => {
    if (!isAuthenticated) {
      toast.error("로그인이 필요합니다.", {
        action: { label: "로그인", onClick: () => window.location.href = getLoginUrl() }
      });
      return;
    }
    setIsEscrowOpen(true);
  };

  const handleConfirmPayment = () => {
    toast.success("안전 결제가 완료되었습니다!", {
      description: "에스크로 계좌에 금액이 안전하게 보관되었습니다. 작업 완료 승인 후 전문가에게 대금이 지급됩니다."
    });
    setIsEscrowOpen(false);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    if (!reviewInput.trim()) return;

    const newReview = {
      id: Date.now(),
      author: user?.name || "사용자",
      content: reviewInput,
      date: "방금 전",
      rating: ratingInput
    };

    setService(prev => ({
      ...prev,
      comments: [newReview, ...prev.comments],
      reviews: prev.reviews + 1
    }));
    setReviewInput("");
    setRatingInput(5);
    toast.success("리뷰가 등록되었습니다.");
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-5xl space-y-6">
        <Button 
          variant="ghost" 
          className="gap-2 text-muted-foreground hover:text-foreground pl-0"
          asChild
        >
          <Link href="/marketplace">
            <ArrowLeft className="w-4 h-4" />
            마켓플레이스로 돌아가기
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-sm border-t-4 border-t-accent rounded-t-xl">
              <CardHeader className="pb-4 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-accent text-accent-foreground">{service.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{service.rating}</span>
                    <span className="text-muted-foreground text-sm">({service.reviews})</span>
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold leading-tight">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                  {service.description}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="border-0 shadow-sm mt-8">
              <CardHeader className="bg-muted/30 border-b border-border/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-accent" />
                  서비스 리뷰 <span className="text-accent">{service.reviews}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Review Form */}
                <form onSubmit={handleAddReview} className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium">평점:</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button 
                          key={star} 
                          type="button" 
                          onClick={() => setRatingInput(star)}
                        >
                          <Star className={`w-5 h-5 ${star <= ratingInput ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1 space-y-2">
                      <Textarea 
                        placeholder={isAuthenticated ? "서비스 이용 후기를 남겨주세요." : "리뷰를 작성하려면 로그인이 필요합니다."}
                        value={reviewInput}
                        onChange={(e) => setReviewInput(e.target.value)}
                        className="min-h-[80px] resize-y"
                        disabled={!isAuthenticated}
                      />
                      <div className="flex justify-end">
                        <Button type="submit" size="sm" className="bg-accent hover:bg-accent/90 px-6">
                          리뷰 등록
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="border-t border-border pt-6 space-y-6">
                  {service.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0 flex items-center justify-center text-muted-foreground font-bold font-sm">
                        {comment.author.charAt(0)}
                      </div>
                      <div className="flex-1 bg-muted/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm">{comment.author}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-2">
                            <span className="flex items-center">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                              {comment.rating}
                            </span>
                            {comment.date}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border border-border/50 shadow-sm sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">전문가</p>
                    <p className="font-bold text-lg">{service.creator}</p>
                  </div>
                </div>
                
                <div className="py-4 border-t border-b border-border mb-6">
                  <p className="text-sm text-muted-foreground mb-1">기본 단가</p>
                  <p className="text-3xl font-bold text-accent">
                    ₩{service.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">* 요구사항에 따라 변동될 수 있습니다.</p>
                </div>

                <Button className="w-full bg-accent hover:bg-accent/90 py-6 text-lg gap-2" onClick={handlePurchase}>
                  <ShieldCheck className="w-5 h-5" />
                  안전 결제하기
                </Button>

                <Dialog open={isEscrowOpen} onOpenChange={setIsEscrowOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-2xl">
                        <ShieldCheck className="w-6 h-6 text-green-500" />
                        에스크로 안전 결제
                      </DialogTitle>
                      <DialogDescription>
                        GlobalBusan AI 생태계는 에스크로 서비스를 통해 회원님의 결제 대금을 안전하게 보호합니다.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="bg-muted/30 p-4 rounded-lg my-4 space-y-3 border border-border">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">서비스명</span>
                        <span className="font-semibold">{service.title}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">전문가</span>
                        <span>{service.creator}</span>
                      </div>
                      <div className="border-t border-border pt-3 mt-3 flex justify-between items-center">
                        <span className="font-bold">최종 결제 금액</span>
                        <span className="text-xl font-bold text-accent">₩{service.price.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="bg-green-500/10 text-green-700 dark:text-green-400 p-3 rounded-lg text-sm flex gap-2 items-start">
                      <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                      <p>
                        결제하신 금액은 <strong>플랫폼 에스크로 계좌</strong>에 안전하게 보관되며, 
                        작업물이 성공적으로 납품되고 회원님이 '구매 확정'을 한 후에만 전문가에게 대금이 지급됩니다.
                      </p>
                    </div>

                    <DialogFooter className="mt-6 flex gap-2 sm:justify-end">
                      <Button variant="outline" onClick={() => setIsEscrowOpen(false)}>
                        취소
                      </Button>
                      <Button className="bg-accent hover:bg-accent/90 gap-2" onClick={handleConfirmPayment}>
                        <CreditCard className="w-4 h-4" />
                        결제 진행하기
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
