import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wand2, ArrowRight, CheckCircle2, Building2 } from "lucide-react";
import { useLocation, Link } from "wouter";
import { toast } from "sonner";

export default function SmartRFP() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [generatedRFP, setGeneratedRFP] = useState("");

  const handleGenerate = () => {
    if (userInput.trim().length < 10) {
      toast.error("요구사항을 조금 더 자세히 적어주세요. (최소 10자)");
      return;
    }

    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      const mockRFP = `[스마트 RFP] AI 솔루션 구축 요구사항 정의서

1. 프로젝트 개요
- 목적: ${userInput.split('\n')[0] || "작성된 요구사항을 기반으로 한 AI 솔루션 도입"}
- 기대 효과: 업무 자동화, 고객 만족도 향상 및 비용 절감

2. 상세 요구사항
- 핵심 기능: 자연어 처리 및 사용자 맞춤형 응답 생성
- 데이터 연동: 사내 기존 데이터베이스(CRM, ERP 등)와의 API 연동 필요
- 사용자 환경: 웹 및 모바일 반응형 UI 지원

3. 비기능적 요구사항
- 성능: 동시 접속자 1,000명 이상 처리 가능할 것
- 보안: 개인정보 보호법 준수 및 데이터 암호화 필수
- 유지보수: 서비스 런칭 후 1년간 무상 하자 보수 지원

4. 예상 일정 및 예산
- 구축 기간: 약 3개월 내외
- 예산 범위: 협의 후 결정 (합리적인 시장가 제안 요망)

* 본 RFP는 GlobalBusan AI 플랫폼의 Smart RFP 기능을 통해 초안으로 자동 작성되었습니다. 전문가와의 상담을 통해 구체화하시기 바랍니다.`;
      
      setGeneratedRFP(mockRFP);
      setIsGenerating(false);
      setStep(2);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl">
        <div className="mb-8 text-center space-y-4">
          <Badge className="bg-busan-primary/10 text-busan-primary hover:bg-busan-primary/20">
            AI 비즈니스 고도화
          </Badge>
          <h1 className="text-4xl font-bold">Smart RFP 생성기</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            개발 용어를 몰라도 괜찮습니다. 원하시는 서비스를 편하게 적어주시면, AI가 전문가들이 이해할 수 있는 형태의 요구사항 정의서(RFP)로 번역해 드립니다.
          </p>
        </div>

        {step === 1 ? (
          <Card className="border-2 border-border shadow-md">
            <CardHeader className="bg-muted/30 border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-accent" />
                도입하고 싶은 AI 서비스를 설명해주세요
              </CardTitle>
              <CardDescription>
                현재 겪고 있는 문제점이나 아이디어를 생각나는 대로 자유롭게 작성해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="예: 우리 회사는 부산에서 신발을 제조하는 기업입니다. 고객들이 우리 웹사이트에서 발 사진을 올리면, 발 모양을 AI로 분석해서 딱 맞는 신발 사이즈와 디자인을 추천해주는 기능이 있으면 좋겠어요. 모바일에서도 잘 돌아가야 하고, 기존 우리 쇼핑몰에 붙이고 싶습니다."
                  className="min-h-[250px] text-base leading-relaxed resize-y p-4"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                />
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-700 dark:text-blue-400">
                  <span className="font-semibold block mb-1">💡 작성 팁:</span>
                  1. 어떤 비즈니스를 하고 계신가요? (산업군, 타겟 고객)<br/>
                  2. AI가 어떤 문제를 해결해 주길 원하시나요?<br/>
                  3. 기존에 사용 중인 시스템이 있다면 무엇인가요?
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border pt-6 flex justify-end">
              <Button 
                className="bg-accent hover:bg-accent/90 gap-2 px-8 py-6 text-lg w-full sm:w-auto"
                onClick={handleGenerate}
                disabled={isGenerating || userInput.trim().length === 0}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    AI가 RFP를 작성 중입니다...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Smart RFP 생성하기
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-2 border-accent shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-full -z-10" />
              <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    RFP 초안이 완성되었습니다
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                    다시 작성하기
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Textarea
                  value={generatedRFP}
                  onChange={(e) => setGeneratedRFP(e.target.value)}
                  className="min-h-[400px] font-mono text-sm leading-relaxed p-4 bg-muted/20"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  * 생성된 내용은 자유롭게 수정하실 수 있습니다.
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button variant="outline" className="py-6 px-8 text-lg" asChild>
                <Link href="/projects/new">
                  프로젝트로 팀원 모집하기
                </Link>
              </Button>
              <Button className="bg-accent hover:bg-accent/90 py-6 px-8 text-lg gap-2" asChild>
                <Link href="/marketplace">
                  완성된 RFP로 전문가 찾기 <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
