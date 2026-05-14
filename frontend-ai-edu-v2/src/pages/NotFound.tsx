import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <div>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
        <h1 style={{ marginBottom: '0.5rem' }}>페이지를 찾을 수 없습니다</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
        <Link href="/" className="btn btn-primary">홈으로 돌아가기</Link>
      </div>
    </div>
  );
}
