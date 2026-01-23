import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import axios from 'axios'
import { userService } from '../lib/supabase'

/**
 * Google OAuth Callback Handler
 * Handles the redirect from Google OAuth and exchanges the authorization code for user info
 */
function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('processing') // 'processing', 'success', 'error'
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get authorization code from URL
        const code = searchParams.get('code')
        const error = searchParams.get('error')

        // Check for OAuth errors
        if (error) {
          throw new Error(error === 'access_denied' ? '로그인이 취소되었습니다.' : `OAuth 오류: ${error}`)
        }

        if (!code) {
          throw new Error('인증 코드가 없습니다.')
        }

        // Exchange code for token and get user info
        // Note: This should ideally be done on the backend for security
        // For now, we'll use the code to get user info directly from Google
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            code: code,
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '299500936836-elk8daqqn64np59q473u66lt9ud0u7cj.apps.googleusercontent.com',
            client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '', // Should be in backend
            redirect_uri: `${window.location.origin}/auth/callback`,
            grant_type: 'authorization_code',
          }),
        })

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json()
          throw new Error(errorData.error_description || '토큰 교환 실패')
        }

        const tokenData = await tokenResponse.json()
        const { access_token } = tokenData

        // Get user info from Google
        const userInfoResponse = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${access_token}`
            }
          }
        )

        const userData = {
          name: userInfoResponse.data.name,
          email: userInfoResponse.data.email,
          picture: userInfoResponse.data.picture || '',
          sub: userInfoResponse.data.sub
        }

        // Save user to Supabase
        const dbUser = await userService.upsertUser(userData)
        
        // Create session token
        const sessionToken = crypto.randomUUID()
        await userService.createSession(dbUser.id, sessionToken)
        
        // Store session token in localStorage
        localStorage.setItem('sessionToken', sessionToken)
        localStorage.setItem('googleUser', JSON.stringify(userData))
        
        // Set success status
        setStatus('success')

        // Get the page user was trying to access before login
        const returnTo = sessionStorage.getItem('authReturnTo') || '/'
        sessionStorage.removeItem('authReturnTo')

        // Redirect to original page after 1.5 seconds
        setTimeout(() => {
          navigate(returnTo, { replace: true })
          // Reload to update auth state
          window.location.reload()
        }, 1500)

      } catch (err) {
        console.error('OAuth callback error:', err)
        setError(err.message || '로그인 처리 중 오류가 발생했습니다.')
        setStatus('error')

        // Redirect to home after 3 seconds on error
        setTimeout(() => {
          navigate('/', { replace: true })
        }, 3000)
      }
    }

    handleOAuthCallback()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
        {status === 'processing' && (
          <>
            <FaSpinner className="text-6xl text-blue-400 mx-auto mb-6 animate-spin" />
            <h1 className="text-2xl font-bold text-white mb-4">
              로그인 처리 중...
            </h1>
            <p className="text-blue-200">
              Google 계정 정보를 확인하고 있습니다.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <FaCheckCircle className="text-6xl text-green-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-4">
              로그인 성공!
            </h1>
            <p className="text-blue-200">
              잠시 후 페이지로 이동합니다...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <FaExclamationTriangle className="text-6xl text-red-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-4">
              로그인 실패
            </h1>
            <p className="text-red-200 mb-4">
              {error}
            </p>
            <p className="text-blue-200 text-sm">
              홈 페이지로 이동합니다...
            </p>
          </>
        )}

        <div className="mt-8">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse"
              style={{ width: status === 'success' ? '100%' : status === 'error' ? '100%' : '60%' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthCallback
