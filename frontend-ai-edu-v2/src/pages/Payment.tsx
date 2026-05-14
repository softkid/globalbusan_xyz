import { useState } from 'react';
import { useParams, Link } from 'wouter';
import { Shield, CheckCircle, ArrowRight, Lock } from 'lucide-react';

const courseInfo: Record<string, { title: string; price: number; priceText: string }> = {
  '1': { title: 'AI 실전 프로젝트', price: 390000, priceText: '390,000원' },
  '2': { title: 'AI Creative Lab', price: 500000, priceText: '500,000원' },
  '3': { title: 'AI 업무자동화', price: 1200000, priceText: '1,200,000원' },
  '4': { title: 'AI 입문반', price: 150000, priceText: '150,000원' },
  '5': { title: 'AI 공부법 + 입시', price: 350000, priceText: '350,000원' },
  '6': { title: '시니어 AI 생활', price: 50000, priceText: '50,000원' },
};

export default function Payment() {
  const params = useParams<{ id: string }>();
  const [method, setMethod] = useState<'kakao' | 'toss' | 'card'>('kakao');
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const course = courseInfo[params.id || '1'] || courseInfo['1'];

  const handlePayment = () => {
    setProcessing(true);
    // 토스페이먼츠/카카오페이 연동 포인트
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
    }, 1500);
  };

  if (done) {
    return (
      <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="card" style={{ maxWidth: 480, textAlign: 'center', padding: '3rem' }}>
          <CheckCircle size={64} color="var(--color-success)" style={{ margin: '0 auto 1rem' }} />
          <h2>결제가 완료되었습니다!</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '0.75rem 0 0.5rem' }}>{course.title}</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-sunrise)', marginBottom: '1.5rem' }}>{course.priceText}</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            등록하신 이메일로 수강 안내가 발송됩니다.<br/>카카오톡 오픈채팅에서 동기를 만나보세요!
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link href="/mypage" className="btn btn-primary">마이페이지 <ArrowRight size={16} /></Link>
            <Link href="/courses" className="btn btn-secondary">다른 강좌 보기</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: 600 }}>
        <h1 style={{ marginBottom: '0.5rem' }}>💳 결제하기</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>안전한 결제로 AI 교육을 시작하세요</p>

        {/* Order Summary */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>📋 주문 내역</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
            <span>{course.title}</span>
            <strong>{course.priceText}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span>부가세 (포함)</span><span>—</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderTop: '2px solid var(--border)' }}>
            <strong style={{ fontSize: '1.1rem' }}>총 결제 금액</strong>
            <strong style={{ fontSize: '1.3rem', color: 'var(--color-sunrise)' }}>{course.priceText}</strong>
          </div>
        </div>

        {/* Payment Method */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>💰 결제 수단</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { key: 'kakao' as const, label: '카카오페이', icon: '💬', color: '#FEE500', textColor: '#3C1E1E' },
              { key: 'toss' as const, label: '토스페이', icon: '💙', color: '#0064FF', textColor: '#fff' },
              { key: 'card' as const, label: '신용/체크카드', icon: '💳', color: 'var(--bg-secondary)', textColor: 'var(--text-primary)' },
            ].map(m => (
              <button key={m.key} onClick={() => setMethod(m.key)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: 'var(--radius-md)',
                  border: method === m.key ? '2px solid var(--color-ocean)' : '1px solid var(--border)',
                  background: method === m.key ? `${m.color}20` : 'var(--bg-card)', cursor: 'pointer', width: '100%', textAlign: 'left',
                  color: 'var(--text-primary)', fontWeight: method === m.key ? 600 : 400, transition: 'all var(--transition)' }}>
                <span style={{ fontSize: '1.3rem' }}>{m.icon}</span>
                <span style={{ flex: 1 }}>{m.label}</span>
                {method === m.key && <CheckCircle size={18} color="var(--color-ocean)" />}
              </button>
            ))}
          </div>
        </div>

        {/* Agreement & Pay */}
        <div className="card">
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', marginBottom: '1.25rem' }}>
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
              style={{ marginTop: 3, accentColor: 'var(--color-ocean)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              결제 진행에 동의합니다. 수강 취소 및 환불은 수강 시작 전까지 전액 환불 가능하며, 시작 후에는 잔여 기간에 따라 부분 환불됩니다.
            </span>
          </label>
          <button className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={!agreed || processing} onClick={handlePayment}>
            {processing ? (
              '결제 처리 중...'
            ) : (
              <><Lock size={18} /> {course.priceText} 결제하기</>
            )}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
            <Shield size={14} /> SSL 암호화 · 안전결제
          </div>
        </div>
      </div>
    </div>
  );
}
