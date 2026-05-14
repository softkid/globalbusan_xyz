import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>BUSAN AI</h3>
            <p>부산의 AI 시대를 함께 만듭니다.<br/>교육 · 커뮤니티 · 프로젝트 · 수익화</p>
          </div>
          <div className="footer-col">
            <h4>교육</h4>
            <Link href="/courses">성인 AI 실전반</Link>
            <Link href="/courses">키즈 AI Creative</Link>
            <Link href="/courses">기업 AI 교육</Link>
            <Link href="/courses">시니어 AI 생활</Link>
          </div>
          <div className="footer-col">
            <h4>플랫폼</h4>
            <Link href="/community">커뮤니티</Link>
            <Link href="/projects">프로젝트</Link>
            <Link href="/market">AI 구축 마켓</Link>
            <Link href="/tools">SaaS 도구</Link>
          </div>
          <div className="footer-col">
            <h4>연결</h4>
            <a href="https://open.kakao.com" target="_blank" rel="noopener">카카오톡 오픈채팅</a>
            <a href="https://instagram.com" target="_blank" rel="noopener">인스타그램</a>
            <a href="https://threads.net" target="_blank" rel="noopener">Threads</a>
            <Link href="/events">무료 설명회</Link>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 BUSAN AI — 부산 AI 경제 생태계 플랫폼. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
