import { useState } from 'react';
import { Trophy, Target, MessageSquare, Users, ThumbsUp, Clock, Flame } from 'lucide-react';

const challenges = [
  { title: 'GPT로 쇼츠 3개 만들기', emoji: '🎬', points: 50, participants: 32, deadline: '5일 남음', difficulty: '입문' },
  { title: '바이브코딩 웹앱 제작', emoji: '💻', points: 100, participants: 18, deadline: '12일 남음', difficulty: '실전' },
  { title: 'AI 자동화 워크플로우 구축', emoji: '⚡', points: 150, participants: 8, deadline: '19일 남음', difficulty: '심화' },
];

const posts = [
  { id: 1, author: '김민수', avatar: '🧑‍💻', title: 'GPT로 카페 메뉴판 자동 생성한 후기', category: '사례공유', likes: 24, comments: 8, time: '2시간 전' },
  { id: 2, author: '박지영', avatar: '👩‍🎨', title: '초등 5학년 아들이 AI 그림책 완성했어요!', category: '프로젝트인증', likes: 45, comments: 12, time: '5시간 전' },
  { id: 3, author: '이정호', avatar: '👨‍💼', title: '부산 제조업 문서자동화 적용 사례', category: '사례공유', likes: 31, comments: 6, time: '1일 전' },
  { id: 4, author: '최수진', avatar: '👩‍💻', title: '바이브코딩으로 첫 앱 배포 성공!', category: '프로젝트인증', likes: 38, comments: 15, time: '1일 전' },
  { id: 5, author: '정다은', avatar: '👩‍🏫', title: '50대 직장인의 AI 활용 한달 후기', category: '자유', likes: 52, comments: 20, time: '2일 전' },
];

const leaderboard = [
  { rank: 1, name: '김민수', points: 1250, badge: '🥇' },
  { rank: 2, name: '박지영', points: 980, badge: '🥈' },
  { rank: 3, name: '이정호', points: 870, badge: '🥉' },
  { rank: 4, name: '최수진', points: 720, badge: '⭐' },
  { rank: 5, name: '정다은', points: 650, badge: '⭐' },
];

export default function Community() {
  const [tab, setTab] = useState<'feed' | 'challenge' | 'cases'>('feed');

  return (
    <div className="page-content">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div className="section-title">
          <h1>👥 커뮤니티 허브</h1>
          <p>부산 AI Builder 네트워크 — 함께 실험하고, 만들고, 성장합니다</p>
        </div>

        <div className="tabs" style={{ justifyContent: 'center' }}>
          <button className={`tab ${tab === 'feed' ? 'active' : ''}`} onClick={() => setTab('feed')}>
            <MessageSquare size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} /> 피드
          </button>
          <button className={`tab ${tab === 'challenge' ? 'active' : ''}`} onClick={() => setTab('challenge')}>
            <Target size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} /> 주간 챌린지
          </button>
          <button className={`tab ${tab === 'cases' ? 'active' : ''}`} onClick={() => setTab('cases')}>
            <Trophy size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} /> 랭킹
          </button>
        </div>

        {tab === 'feed' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {posts.map(post => (
                <div className="card" key={post.id} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{post.avatar}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{post.author}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{post.time}</div>
                    </div>
                    <span className="badge badge-primary" style={{ marginLeft: 'auto' }}>{post.category}</span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>{post.title}</h3>
                  <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                    <span><ThumbsUp size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />{post.likes}</span>
                    <span><MessageSquare size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />{post.comments}</span>
                  </div>
                </div>
              ))}
            </div>
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="card" style={{ background: 'var(--gradient-ocean)', color: '#fff' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#fff' }}>💬 오픈채팅 참여</h3>
                <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '1rem' }}>카카오톡 오픈채팅에서 실시간 교류하세요</p>
                <a href="https://open.kakao.com" className="btn" style={{ background: '#fff', color: 'var(--color-ocean)', width: '100%', fontSize: '0.85rem' }}>참여하기</a>
              </div>
              <div className="card">
                <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>🔥 인기 태그</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {['#GPT활용', '#바이브코딩', '#자동화', '#부산AI', '#챌린지', '#자영업AI'].map(tag => (
                    <span key={tag} className="badge" style={{ background: 'var(--bg-secondary)', cursor: 'pointer' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}

        {tab === 'challenge' && (
          <div className="grid grid-3">
            {challenges.map((ch, i) => (
              <div className="card" key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{ch.emoji}</div>
                <span className={`badge ${ch.difficulty === '입문' ? 'badge-success' : ch.difficulty === '실전' ? 'badge-primary' : 'badge-orange'}`} style={{ marginBottom: '0.5rem' }}>{ch.difficulty}</span>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>{ch.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  <span><Users size={14} style={{ marginRight: 2 }} />{ch.participants}명</span>
                  <span><Clock size={14} style={{ marginRight: 2 }} />{ch.deadline}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', color: 'var(--color-sunrise)', fontWeight: 700, marginBottom: '1rem' }}>
                  <Flame size={16} /> {ch.points} 포인트
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }}>챌린지 참여</button>
              </div>
            ))}
          </div>
        )}

        {tab === 'cases' && (
          <div style={{ maxWidth: 500, margin: '0 auto' }}>
            <div className="card">
              <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trophy size={20} color="var(--color-sunrise)" /> 이번 달 랭킹
              </h3>
              {leaderboard.map(user => (
                <div key={user.rank} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '1.2rem', width: 30, textAlign: 'center' }}>{user.badge}</span>
                  <span style={{ fontWeight: 600, flex: 1 }}>{user.name}</span>
                  <span style={{ color: 'var(--color-sunrise)', fontWeight: 700 }}>{user.points}pt</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
