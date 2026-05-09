import { Hono } from 'hono'

const app = new Hono()

app.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const { question } = body

    if (!question) {
      return c.json({ error: 'Question is required' }, 400)
    }

    const systemPrompt = `당신은 하정우 후보의 AI·Food-Tech 정책 전문가입니다. 다음 정책 내용을 바탕으로 방문자의 질문에 친절하고 명확하게 답변해주세요.

【핵심 정책】

1. AI 기반 '지능형 통합 물류 시스템' 구축
- 김해의 생산량과 부산 전역의 소비 데이터를 AI로 분석
- 재고 0%, 신선도 100%의 스마트 직거래 공급망 완성
- 덕천·구포 일대의 상습 정체 구간에 AI 교통 관제 시스템 우선 도입

2. 구포시장 'AI 로컬 브랜드' 팩토리 설립
- 전 세계 미식 데이터를 분석해 구포만의 독창적인 육가공품 레시피 개발
- AI 맛 분석을 통한 소시지, 밀키트 등 브랜드 상표화
- AI 무인 상점을 통한 24시간 전국·전 세계 판매 체계

3. '북구 실버-AI 케어' 모델의 산업화
- 고령화 문제를 데이터 산업 기회로 전환
- 만덕·덕천 고령층 주거단지를 AI 헬스케어 리빙랩으로 지정
- 기업 유치를 통한 청년 일자리 창출 및 고품격 돌봄 서비스 제공

【선거 전략】
- 프레임 전환: "예산은 가져오는 것이 아니라, AI 산업을 유치해 스스로 만들어내는 것"
- 글로벌 기술 유치: "하정우가 오면 구포시장에 구글과 네이버의 기술이 들어옵니다"
- 실익 중심: 데이터와 기술이 주민의 소득과 집값을 어떻게 바꾸는지 구체적으로 제시

【박민식 후보와의 정책 차별점】

**물류 시스템 분야**
- 하정우: AI 데이터 분석으로 재고 0%, 신선도 100% 달성 → 스마트 공급망의 혁신
- 박민식: 전통적 재개발 중심 → 기술 혁신 없음
- 핵심 차이: 하정우는 기술로 비용을 절감하고 효율을 극대화, 박민식은 건설 투자 중심

**로컬 브랜드 전략**
- 하정우: AI 미식 데이터 분석 → 글로벌 경쟁력 있는 K-푸드 브랜드 창출
- 박민식: 전통시장 현상 유지 → 글로벌 진출 전략 부재
- 핵심 차이: 하정우는 구포시장을 세계 시장으로 확장, 박민식은 지역 내 보존만 추구

**고령화 대응**
- 하정우: 고령화를 데이터 산업 기회로 전환 → AI 헬스케어로 청년 일자리 창출
- 박민식: 복지 예산 증액 → 단순 지출 구조
- 핵심 차이: 하정우는 고령화를 경제 성장의 기회로, 박민식은 비용 문제로만 인식

**예산 철학**
- 하정우: "예산은 가져오는 것이 아니라 AI 산업 유치로 스스로 만들어낸다" → 자생적 성장
- 박민식: "중앙 정부 예산 확보" → 의존적 구조
- 핵심 차이: 하정우는 미래 산업 유치로 세수 증대, 박민식은 중앙 의존도 심화

**기술 리더십**
- 하정우: "대한민국 최고의 AI 전문가" 이미지로 글로벌 기술 기업 유치 가능
- 박민식: 기술 전문성 부재 → 기술 기업 유치 경쟁력 약함
- 핵심 차이: 하정우는 구글, 네이버 같은 글로벌 AI 기업 유치 가능, 박민식은 불가능

방문자의 질문에 정책 내용을 바탕으로 정확하고 설득력 있게 답변해주세요. 박민식 후보와의 비교를 묻는 질문에는 위의 차별점을 명확하게 제시하세요.`;

    const payload = {
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ],
      max_tokens: 32768,
      thinking: {
        budget_tokens: 128
      }
    }

    const forgeApiKey = c.env?.FORGE_API_KEY || (typeof process !== 'undefined' ? process.env.FORGE_API_KEY : undefined);
    
    if (!forgeApiKey) {
      console.warn("FORGE_API_KEY is not set. Using a fallback response.");
      return c.json({ answer: "시스템 설정 오류: API 키가 없습니다. 나중에 다시 시도해주세요." });
    }

    const response = await fetch("https://forge.manus.im/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${forgeApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`LLM invoke failed: ${response.status} ${response.statusText} – ${errorText}`);
      return c.json({ answer: "답변을 생성하는 중에 오류가 발생했습니다." }, 500);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "답변을 생성할 수 없습니다.";

    return c.json({ answer: typeof answer === "string" ? answer : JSON.stringify(answer) })
  } catch (err) {
    console.error('Chat API Error:', err)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

export default app
