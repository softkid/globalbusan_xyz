import { useState, useEffect } from 'react';
import { getPrompts } from '../lib/api';
import { Copy, ThumbsUp, Eye, Search, Sparkles } from 'lucide-react';

const fallbackPrompts = [
  { id: 1, title: '부산 관광 명소 소개', description: '관광객 맞춤형 부산 여행 코스 추천', category: '관광/여행', tags: ['부산', '관광', '일정추천'], author: '부산트래블', likes: 124, usage_count: 850, content: '당신은 부산의 베테랑 로컬 가이드입니다. 사용자의 선호도(자연/문화/음식/활동)와 여행 일수를 파악한 후...' },
  { id: 2, title: 'RFP 초안 작성 도우미', description: '비전문가를 위한 요구사항 정의서 자동 생성', category: '비즈니스', tags: ['RFP', '기획', '요구사항'], author: '기획마스터', likes: 89, usage_count: 420, content: '사용자가 제시하는 아이디어를 바탕으로 체계적인 요구사항 정의서(RFP)를 작성합니다...' },
  { id: 3, title: '인스타 릴스 대본 생성기', description: 'AI가 바이럴 가능한 릴스 대본을 자동 생성', category: '마케팅', tags: ['인스타', '릴스', '콘텐츠'], author: '콘텐츠킹', likes: 156, usage_count: 1200, content: '당신은 인스타그램 릴스 전문 크리에이터입니다. 주어진 주제로 30초~60초 분량의 대본을...' },
  { id: 4, title: '카페 메뉴 설명 자동 생성', description: 'SNS/메뉴판용 맛있는 메뉴 설명 작성', category: '자영업', tags: ['카페', '메뉴', 'SNS'], author: '카페사장님', likes: 78, usage_count: 560, content: '당신은 카페 메뉴 카피라이터입니다. 메뉴명과 재료를 입력하면 감성적인 설명을...' },
  { id: 5, title: '학원 상담 답변 도우미', description: '학부모 문의에 전문적으로 답변하는 템플릿', category: '교육', tags: ['학원', '상담', '학부모'], author: '원장님AI', likes: 65, usage_count: 340, content: '당신은 20년 경력의 교육 전문 상담사입니다. 학부모의 질문에 공감하면서도 전문적인...' },
];

export default function Tools() {
  const [prompts, setPrompts] = useState(fallbackPrompts);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    getPrompts().then(res => {
      if (res.success && res.data?.length) setPrompts(res.data);
    });
  }, []);

  const filtered = prompts.filter(p =>
    p.title.includes(search) || p.description.includes(search) || p.tags?.some((t: string) => t.includes(search))
  );

  const copyPrompt = (id: number, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="page-content">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div className="section-title">
          <h1>🔧 프롬프트 라이브러리</h1>
          <p>부산 AI 실무에 바로 쓸 수 있는 프롬프트 모음</p>
        </div>

        <div style={{ maxWidth: 500, margin: '0 auto 2rem', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input type="text" placeholder="프롬프트 검색 (카페, 학원, 마케팅...)" value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.95rem' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(p => (
            <div className="card" key={p.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Sparkles size={16} color="var(--color-sunrise)" />
                    <h3 style={{ fontSize: '1.05rem' }}>{p.title}</h3>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{p.description}</p>
                </div>
                <span className="badge badge-primary">{p.category}</span>
              </div>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', margin: '0.75rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxHeight: 80, overflow: 'hidden', position: 'relative' }}>
                {p.content}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 30, background: 'linear-gradient(transparent, var(--bg-secondary))' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {p.tags?.map((t: string) => <span key={t} className="badge" style={{ background: 'var(--bg-secondary)', fontSize: '0.75rem' }}>#{t}</span>)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}><ThumbsUp size={13} style={{ marginRight: 3 }} />{p.likes}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}><Eye size={13} style={{ marginRight: 3 }} />{p.usage_count}</span>
                  <button className="btn btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                    onClick={() => copyPrompt(p.id, p.content || '')}>
                    {copiedId === p.id ? <><Copy size={13} /> 복사됨!</> : <><Copy size={13} /> 복사</>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
