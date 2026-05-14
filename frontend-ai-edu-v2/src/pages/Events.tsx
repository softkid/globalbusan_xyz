import { useState } from 'react';
import { Calendar, MapPin, Clock, Users, CheckCircle, ArrowRight } from 'lucide-react';

const events = [
  { id: 1, title: '부산 AI 실전 활용 설명회', date: '2026년 5월 24일 (토)', time: '14:00 ~ 16:00', location: '서면 멘토즈 스터디카페', spots: 20, filled: 14, type: '성인', desc: '개발 몰라도 가능한 AI 활용법. GPT, 바이브코딩, 자동화를 직접 체험합니다.' },
  { id: 2, title: 'AI 시대 우리 아이 경쟁력', date: '2026년 5월 31일 (토)', time: '10:00 ~ 12:00', location: '해운대 센텀 스터디센터', spots: 15, filled: 11, type: '학부모', desc: '코딩보다 중요한 AI 활용력. 미국형 AI 교육 트렌드와 우리 아이 미래 준비법.' },
  { id: 3, title: '사장님 AI 생산성 세미나', date: '2026년 6월 7일 (토)', time: '15:00 ~ 17:00', location: '사상구 상공회의소', spots: 30, filled: 8, type: '기업', desc: '중소기업·자영업자를 위한 AI 업무자동화 실전 사례와 도입 방법.' },
];

export default function Events() {
  const [submitted, setSubmitted] = useState<number | null>(null);

  return (
    <div className="page-content">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div className="section-title">
          <h1>🎯 무료 설명회</h1>
          <p>부산 각 지역에서 열리는 AI 실전 활용 무료 설명회</p>
        </div>

        <div className="grid grid-3">
          {events.map(ev => (
            <div className="card" key={ev.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <span className={`badge ${ev.type === '성인' ? 'badge-orange' : ev.type === '학부모' ? 'badge-primary' : 'badge-success'}`} style={{ alignSelf: 'flex-start', marginBottom: '0.75rem' }}>
                {ev.type}
              </span>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>{ev.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>{ev.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <span><Calendar size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />{ev.date}</span>
                <span><Clock size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />{ev.time}</span>
                <span><MapPin size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />{ev.location}</span>
                <span><Users size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />{ev.filled}/{ev.spots}명 (잔여 {ev.spots - ev.filled}석)</span>
              </div>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', height: 6, marginBottom: '1rem' }}>
                <div style={{ width: `${(ev.filled / ev.spots) * 100}%`, height: '100%', borderRadius: 'var(--radius-sm)', background: 'var(--gradient-cta)' }} />
              </div>
              {submitted === ev.id ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(16,185,129,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--color-success)', fontWeight: 600 }}>
                  <CheckCircle size={18} /> 예약 완료!
                </div>
              ) : (
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setSubmitted(ev.id)}>
                  예약하기 <ArrowRight size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
