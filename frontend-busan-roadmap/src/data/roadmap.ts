export interface District {
  id: string;
  name: string;
  focus: string;
  coords: { x: number; y: number };
}

export interface KPI {
  label: string;
  value: string;
  unit: string;
  target: string;
}

export interface PolicyProject {
  title: string;
  desc: string;
  status: 'planning' | 'in-progress' | 'completed';
}

export interface RiskFactor {
  category: string;
  factor: string;
  mitigation: string;
  level: 'low' | 'medium' | 'high';
}

export interface RoadmapPhase {
  id: number;
  period: string;
  govStance: string;
  description: string;
  kpis: KPI[];
  projects: PolicyProject[];
  risks: RiskFactor[];
  districtProgress: Record<string, number>;
}

export const districts: District[] = [
  { id: 'gangseo', name: '강서구', focus: '스마트물류 · 공항 · 에코델타', coords: { x: 15, y: 55 } },
  { id: 'haeundae', name: '해운대구', focus: 'AI 콘텐츠 · 관광테크 · MICE', coords: { x: 80, y: 38 } },
  { id: 'yeongdo', name: '영도구', focus: '해양MRO · 자율선박 실증', coords: { x: 62, y: 82 } },
  { id: 'sasang', name: '사상구', focus: '제조 AI · 스마트팩토리 산단', coords: { x: 35, y: 50 } },
  { id: 'nam', name: '남구', focus: 'AI 바이오 · 국방해양 SW', coords: { x: 70, y: 62 } },
  { id: 'busanjin', name: '부산진구', focus: '스타트업 밸리 · 커머스 SaaS', coords: { x: 50, y: 52 } },
  { id: 'jung', name: '중구', focus: '핀테크 · 해양금융 · 무역 SaaS', coords: { x: 58, y: 72 } },
  { id: 'seo', name: '서구', focus: '의료데이터 특구 · 웰니스', coords: { x: 52, y: 68 } },
  { id: 'dong', name: '동구', focus: '북항 스마트재생 · 워터프론트', coords: { x: 55, y: 62 } },
  { id: 'suyeong', name: '수영구', focus: '야간관광 데이터 · 로컬크리에이터', coords: { x: 72, y: 48 } },
  { id: 'dongnae', name: '동래구', focus: '에듀테크 · 실버 헬스케어', coords: { x: 60, y: 35 } },
  { id: 'buk', name: '북구', focus: 'AI 경제자본 생태계 (구포)', coords: { x: 40, y: 32 } },
  { id: 'saha', name: '사하구', focus: '친환경 스마트산단 · 스마트제조', coords: { x: 40, y: 75 } },
  { id: 'yeonje', name: '연제구', focus: '부산시 통합 행정 데이터 센터', coords: { x: 62, y: 45 } },
  { id: 'geumjeong', name: '금정구', focus: '산학협력 R&D · AI 클러스터', coords: { x: 65, y: 22 } },
  { id: 'gijang', name: '기장군', focus: '원전해체기술 · 청정에너지 허브', coords: { x: 85, y: 15 } }
];

export const roadmapPhases: RoadmapPhase[] = [
  {
    id: 0,
    period: "2026년 3분기 (임기시작)",
    govStance: "통합추진단 구성 및 세부계획 수립 단계. 해양수도 및 디지털허브 공감대 형성 초기.",
    description: "해수부 이전 완료와 함께 중앙정부-부산시 협력 체계 가동. 3,450억 규모의 초기 예산 재조정 및 국비 공모 착수.",
    kpis: [
      { label: "누적 예산", value: "0.16", unit: "조", target: "3.45조" },
      { label: "항만 자동화율", value: "2", unit: "%", target: "25%" },
      { label: "디지털 일자리", value: "1,200", unit: "명", target: "80,000명" },
      { label: "디지털 전환 기업", value: "100", unit: "개", target: "4,500개" }
    ],
    projects: [
      { title: "스마트물류·AI 환적 허브 시범", desc: "강서/영도 중심 AI 자동 분류 시스템 도입", status: 'in-progress' },
      { title: "부산 Urban OS 기본 설계", desc: "통합 데이터 플랫폼 아키텍처 수립", status: 'planning' }
    ],
    risks: [
      { category: "재정", factor: "국비 확보 지연", mitigation: "유사사업 통폐합 및 예비비 우선 활용", level: 'medium' },
      { category: "협치", factor: "부처간 칸막이 행정", mitigation: "시장 직속 통합추진단(TF) 일원화", level: 'high' }
    ],
    districtProgress: { gangseo: 15, haeundae: 10, yeongdo: 12, sasang: 8, nam: 10, busanjin: 12, jung: 10, seo: 8, dong: 10, suyeong: 8, dongnae: 5, buk: 8, saha: 10, yeonje: 15, geumjeong: 5, gijang: 5 }
  },
  {
    id: 12,
    period: "2027년 (인프라 확장)",
    govStance: "디지털 뉴딜 2.0 예산 연계로 추진력 확보. 핵심 인프라 확장 본격화 단계.",
    description: "AI 컨테이너 시스템 1차 완성 및 도시 데이터 플랫폼 연계 개시. 해운기업 본사 이전 가속화.",
    kpis: [
      { label: "누적 예산", value: "1.10", unit: "조", target: "3.45조" },
      { label: "항만 자동화율", value: "10", unit: "%", target: "25%" },
      { label: "디지털 일자리", value: "15,000", unit: "명", target: "80,000명" },
      { label: "디지털 전환 기업", value: "800", unit: "개", target: "4,500개" }
    ],
    projects: [
      { title: "해양산업 디지털 전환 지원", desc: "조선/수산 분야 스마트제조 실증 가동", status: 'in-progress' },
      { title: "디지털 관광 플랫폼 런칭", desc: "AR/VR 연계 맞춤형 관광 서비스", status: 'completed' }
    ],
    risks: [
      { category: "기술", factor: "AI 실증 데이터 부족", mitigation: "해외 선진 기술 제휴 및 산학연 컨소시엄", level: 'medium' },
      { category: "사회", factor: "전통 산업군 반발", mitigation: "디지털 전환 재교육 및 상생 기금 운영", level: 'medium' }
    ],
    districtProgress: { gangseo: 35, haeundae: 40, yeongdo: 30, sasang: 25, nam: 30, busanjin: 35, jung: 30, seo: 25, dong: 28, suyeong: 32, dongnae: 20, buk: 25, saha: 28, yeonje: 45, geumjeong: 22, gijang: 20 }
  },
  {
    id: 24,
    period: "2028년 (성과 가시화)",
    govStance: "글로벌 투자 유치 극대화 및 시제품 사업화 단계. 민간 투자/FDI 유치 쾌조.",
    description: "북극항로 실증 운항 성공 및 해사법원 개원 준비. 스마트항만 전면 가동 및 청정항만 마이크로그리드 구축.",
    kpis: [
      { label: "누적 예산", value: "2.20", unit: "조", target: "3.45조" },
      { label: "항만 자동화율", value: "18", unit: "%", target: "25%" },
      { label: "디지털 일자리", value: "38,000", unit: "명", target: "80,000명" },
      { label: "디지털 전환 기업", value: "2,100", unit: "개", target: "4,500개" }
    ],
    projects: [
      { title: "스마트항만 전면 가동", desc: "자동화 터미널 운영 및 물류 효율화", status: 'completed' },
      { title: "자율주행 스마트 교통망", desc: "항만-산단-도심 연계 자율차 우선 차로", status: 'in-progress' }
    ],
    risks: [
      { category: "대외", factor: "글로벌 경기 침체", mitigation: "신흥국 물류 루트 다변화 및 내수 IT 강화", level: 'high' }
    ],
    districtProgress: { gangseo: 65, haeundae: 70, yeongdo: 60, sasang: 55, nam: 60, busanjin: 65, jung: 60, seo: 55, dong: 58, suyeong: 62, dongnae: 50, buk: 55, saha: 58, yeonje: 75, geumjeong: 52, gijang: 50 }
  },
  {
    id: 36,
    period: "2029년 (고도화 단계)",
    govStance: "성과 고착화 및 글로벌 스탠다드 확립 단계. 차기 시정 연계 전략 수립.",
    description: "통합 Urban OS 완성 및 시민 체감 서비스 전면 제공. 해양디지털융합 생태계 정착 및 전문인력 배출.",
    kpis: [
      { label: "누적 예산", value: "3.10", unit: "조", target: "3.45조" },
      { label: "항만 자동화율", value: "23", unit: "%", target: "25%" },
      { label: "디지털 일자리", value: "61,000", unit: "명", target: "80,000명" },
      { label: "디지털 전환 기업", value: "3,500", unit: "개", target: "4,500개" }
    ],
    projects: [
      { title: "통합 Urban OS 고도화", desc: "AI 기반 시정 예측 행정 시스템 정착", status: 'completed' },
      { title: "해양금융 리서치 센터 안착", desc: "국제 선박금융 데이터 허브 가동", status: 'completed' }
    ],
    risks: [
      { category: "운영", factor: "플랫폼 유지보수 비용 증가", mitigation: "데이터 API 유료화 및 수익 모델 확보", level: 'low' }
    ],
    districtProgress: { gangseo: 85, haeundae: 90, yeongdo: 80, sasang: 75, nam: 80, busanjin: 85, jung: 80, seo: 75, dong: 78, suyeong: 82, dongnae: 70, buk: 75, saha: 78, yeonje: 90, geumjeong: 72, gijang: 70 }
  },
  {
    id: 48,
    period: "2030년 (완성 및 도약)",
    govStance: "동북아 해양 수도 완성 선포. 부울경 메가시티 데이터 산업 통합.",
    description: "세계 최고 수준의 스마트 환적 허브 및 디지털 물류 도시 완성. AI 기반 도시 운영 시스템 완전 정착.",
    kpis: [
      { label: "누적 예산", value: "3.45", unit: "조", target: "3.45조" },
      { label: "항만 자동화율", value: "25", unit: "%", target: "25%" },
      { label: "디지털 일자리", value: "80,000", unit: "명", target: "80,000명" },
      { label: "디지털 전환 기업", value: "4,500", unit: "개", target: "4,500개" }
    ],
    projects: [
      { title: "글로벌 물류 허브 완성", desc: "전 세계 연결성 극대화 및 투자 유치 완결", status: 'completed' },
      { title: "AI 도시 마스터플랜 완성", desc: "완전한 디지털 행정 및 산업 생태계 구축", status: 'completed' }
    ],
    risks: [],
    districtProgress: { gangseo: 100, haeundae: 100, yeongdo: 100, sasang: 100, nam: 100, busanjin: 100, jung: 100, seo: 100, dong: 100, suyeong: 100, dongnae: 100, buk: 100, saha: 100, yeonje: 100, geumjeong: 100, gijang: 100 }
  }
];
