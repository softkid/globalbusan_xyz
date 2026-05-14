import { useState } from 'react';
import { submitMarketplaceRequest } from '../lib/api';
import { ArrowRight, CheckCircle, Bot, BarChart3, Megaphone, Settings } from 'lucide-react';

const bizTypes = [
  { key: 'cafe', label: '카페/음식점', emoji: '☕' },
  { key: 'salon', label: '미용실/뷰티', emoji: '💇' },
  { key: 'academy', label: '학원/교육', emoji: '📚' },
  { key: 'realestate', label: '부동산', emoji: '🏠' },
  { key: 'manufacturing', label: '제조/생산', emoji: '🏭' },
  { key: 'other', label: '기타', emoji: '🏢' },
];

const needTypes = [
  { key: 'chatbot', label: 'AI 챗봇', icon: Bot, desc: 'GPT 기반 자동 상담' },
  { key: 'automation', label: '업무 자동화', icon: Settings, desc: '문서/예약/리뷰 자동화' },
  { key: 'marketing', label: 'AI 마케팅', icon: Megaphone, desc: 'SNS/광고/콘텐츠 자동화' },
  { key: 'analytics', label: '데이터 분석', icon: BarChart3, desc: '매출/고객 분석 대시보드' },
];

const budgets = ['50만원 이하', '50~150만원', '150~300만원', '300~500만원', '500만원 이상', '미정'];

export default function Marketplace() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ business_type: '', need_type: '', description: '', budget_range: '', deadline: '', contact_name: '', contact_phone: '', contact_email: '', region: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    await submitMarketplaceRequest(form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: 500, padding: '3rem' }}>
          <CheckCircle size={56} color="var(--color-success)" style={{ margin: '0 auto 1rem' }} />
          <h2>의뢰가 접수되었습니다!</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem' }}>전문가 매칭 후 24시간 내에 연락드리겠습니다.</p>
          <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => { setSubmitted(false); setStep(1); setForm({ business_type: '', need_type: '', description: '', budget_range: '', deadline: '', contact_name: '', contact_phone: '', contact_email: '', region: '' }); }}>
            새 의뢰하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: 700 }}>
        <div className="section-title">
          <h1>🛒 AI 구축 마켓</h1>
          <p>부산 자영업자를 위한 AI 자동화 구축 매칭 플랫폼</p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{ width: 40, height: 4, borderRadius: 2, background: step >= s ? 'var(--color-ocean)' : 'var(--border)' }} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>업종을 선택하세요</h3>
            <div className="grid grid-3">
              {bizTypes.map(b => (
                <button key={b.key} className="card" onClick={() => { setForm({ ...form, business_type: b.key }); setStep(2); }}
                  style={{ cursor: 'pointer', textAlign: 'center', border: form.business_type === b.key ? '2px solid var(--color-ocean)' : undefined }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{b.emoji}</div>
                  <div style={{ fontWeight: 600 }}>{b.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>필요한 AI 솔루션을 선택하세요</h3>
            <div className="grid grid-2">
              {needTypes.map(n => {
                const Icon = n.icon;
                return (
                  <button key={n.key} className="card" onClick={() => { setForm({ ...form, need_type: n.key }); setStep(3); }}
                    style={{ cursor: 'pointer', textAlign: 'center', border: form.need_type === n.key ? '2px solid var(--color-ocean)' : undefined }}>
                    <Icon size={28} color="var(--color-ocean)" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{n.label}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{n.desc}</div>
                  </button>
                );
              })}
            </div>
            <button className="btn btn-ghost" onClick={() => setStep(1)} style={{ marginTop: '1rem' }}>← 이전</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>예산과 기간을 알려주세요</h3>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>예산 범위</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {budgets.map(b => (
                    <button key={b} className={`region-tab ${form.budget_range === b ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, budget_range: b })}>{b}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>상세 설명 (선택)</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="어떤 AI 솔루션이 필요하신지 자유롭게 적어주세요..."
                  style={{ width: '100%', minHeight: 100, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', resize: 'vertical', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-ghost" onClick={() => setStep(2)}>← 이전</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setStep(4)} disabled={!form.budget_range}>
                  다음 → 연락처 입력
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>연락처를 입력하세요</h3>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="이름 / 상호명" value={form.contact_name}
                onChange={e => setForm({ ...form, contact_name: e.target.value })}
                style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.95rem' }} />
              <input type="tel" placeholder="연락처 (010-0000-0000)" value={form.contact_phone}
                onChange={e => setForm({ ...form, contact_phone: e.target.value })}
                style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.95rem' }} />
              <input type="email" placeholder="이메일 (선택)" value={form.contact_email}
                onChange={e => setForm({ ...form, contact_email: e.target.value })}
                style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.95rem' }} />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-ghost" onClick={() => setStep(3)}>← 이전</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit} disabled={!form.contact_name || !form.contact_phone}>
                  의뢰 접수하기 <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
