# Supabase Auth 통합 가이드

이 문서는 Global BUSAN 프로젝트의 Supabase Authentication 통합 방법을 안내합니다.

## 1. 현재 상태

### 1.1 구현된 기능
- ✅ Google OAuth 로그인 (클라이언트 측)
- ✅ 사용자 세션 관리 (localStorage)
- ✅ 기본 사용자 정보 표시

### 1.2 미구현 기능
- ❌ Supabase Auth 완전 통합
- ❌ 이메일/비밀번호 로그인
- ❌ 소셜 로그인 확장 (Facebook, Twitter 등)
- ❌ 사용자 프로필 페이지
- ❌ 비밀번호 재설정
- ❌ 이메일 인증

## 2. Supabase Auth 설정

### 2.1 Supabase 프로젝트 설정

1. **Supabase 대시보드 접속**: [https://app.supabase.com](https://app.supabase.com)
2. **Authentication > Providers** 이동
3. **Google OAuth 설정**:
   - Google OAuth 클라이언트 ID 입력
   - Google OAuth 클라이언트 시크릿 입력
   - 리디렉션 URL 설정: `https://your-project.supabase.co/auth/v1/callback`

4. **이메일 인증 설정**:
   - Authentication > Settings > Email Auth
   - "Enable email confirmations" 활성화 (선택사항)
   - 이메일 템플릿 커스터마이징

### 2.2 환경 변수 설정

`.env` 파일에 다음 변수 추가:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Google OAuth (Supabase Auth용)
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 3. 구현 방법

### 3.1 Supabase Auth 클라이언트 설정

`src/lib/supabase.js` 업데이트:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Auth 헬퍼 함수
export const authService = {
  // Google OAuth 로그인
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  },

  // 이메일/비밀번호 로그인
  async signInWithEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // 이메일/비밀번호 회원가입
  async signUpWithEmail(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  },

  // 로그아웃
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // 현재 세션 가져오기
  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    return { data, error }
  },

  // 현재 사용자 가져오기
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // 비밀번호 재설정 이메일 전송
  async resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    return { data, error }
  },

  // 비밀번호 업데이트
  async updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    return { data, error }
  },

  // 사용자 메타데이터 업데이트
  async updateUserMetadata(metadata) {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata
    })
    return { data, error }
  },

  // 세션 변경 리스너
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session)
    })
  }
}
```

### 3.2 Auth 콜백 페이지 생성

`src/pages/AuthCallback.jsx`:

```jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          navigate('/login?error=auth_failed')
          return
        }

        if (data.session) {
          // 로그인 성공
          navigate('/')
        } else {
          // 세션이 없음
          navigate('/login')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        navigate('/login?error=auth_failed')
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  )
}

export default AuthCallback
```

### 3.3 로그인 페이지 업데이트

`src/pages/Login.jsx` 예시:

```jsx
import { useState } from 'react'
import { authService } from '../lib/supabase'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await authService.signInWithEmail(email, password)
      
      if (error) {
        setError(error.message)
      } else {
        // 로그인 성공, 리디렉션은 onAuthStateChange에서 처리
        window.location.href = '/'
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const { error } = await authService.signInWithGoogle()
      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError('Google 로그인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">로그인</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Google로 로그인
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
```

### 3.4 Auth 상태 관리

`src/hooks/useAuth.js`:

```javascript
import { useState, useEffect } from 'react'
import { authService } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 초기 세션 확인
    authService.getSession().then(({ data, error }) => {
      if (data.session) {
        setSession(data.session)
        setUser(data.session.user)
      }
      setLoading(false)
    })

    // Auth 상태 변경 리스너
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    user,
    session,
    loading,
    signOut: authService.signOut
  }
}
```

## 4. 라우트 설정

`src/App.jsx`에 Auth 콜백 라우트 추가:

```jsx
import AuthCallback from './pages/AuthCallback'

// Routes에 추가
<Route path="/auth/callback" element={<AuthCallback />} />
```

## 5. 보안 고려사항

### 5.1 Row Level Security (RLS) 설정

Supabase 대시보드에서 RLS 정책 설정:

```sql
-- 투자자 테이블에 대한 RLS 정책 예시
CREATE POLICY "Users can view own investments"
ON investments
FOR SELECT
USING (auth.uid() = investor_id);

CREATE POLICY "Users can insert own investments"
ON investments
FOR INSERT
WITH CHECK (auth.uid() = investor_id);
```

### 5.2 환경 변수 보안

- `.env` 파일을 `.gitignore`에 추가
- 프로덕션 환경 변수는 배포 플랫폼에서 설정
- `VITE_SUPABASE_ANON_KEY`는 공개되어도 안전 (RLS로 보호)

## 6. 마이그레이션 가이드

### 6.1 기존 Google OAuth에서 Supabase Auth로 전환

1. **기존 localStorage 데이터 마이그레이션**:
```javascript
// 기존 Google OAuth 사용자 데이터를 Supabase로 마이그레이션
const existingUser = JSON.parse(localStorage.getItem('googleUser'))
if (existingUser) {
  // Supabase에 사용자 정보 동기화
  await authService.updateUserMetadata({
    name: existingUser.name,
    picture: existingUser.picture,
    email: existingUser.email
  })
  localStorage.removeItem('googleUser')
}
```

2. **점진적 전환**:
   - 기존 Google OAuth와 Supabase Auth 병행 사용
   - 새 사용자는 Supabase Auth 사용
   - 기존 사용자는 점진적으로 마이그레이션

## 7. 테스트

### 7.1 Auth 기능 테스트

```javascript
// Auth 서비스 테스트 예시
describe('authService', () => {
  it('should sign in with email', async () => {
    const { data, error } = await authService.signInWithEmail('test@example.com', 'password')
    expect(error).toBeNull()
    expect(data.session).toBeDefined()
  })

  it('should sign out', async () => {
    const { error } = await authService.signOut()
    expect(error).toBeNull()
  })
})
```

## 8. 참고 자료

- [Supabase Auth 문서](https://supabase.com/docs/guides/auth)
- [Supabase Auth 예제](https://supabase.com/docs/guides/auth/auth-helpers)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)

---

**마지막 업데이트**: 2025-12-13

