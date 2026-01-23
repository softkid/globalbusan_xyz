/**
 * Google OAuth Login Helper
 * Provides utility functions for Google OAuth login with redirect flow
 */

import { userService } from '../lib/supabase'

/**
 * Initiates Google OAuth login flow with redirect
 * @param {string} returnTo - The page to return to after login (optional)
 */
export const initiateGoogleLogin = (returnTo = null) => {
  // Store return URL in session storage
  if (returnTo) {
    sessionStorage.setItem('authReturnTo', returnTo)
  } else {
    sessionStorage.setItem('authReturnTo', window.location.pathname)
  }

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '299500936836-elk8daqqn64np59q473u66lt9ud0u7cj.apps.googleusercontent.com'
  const redirectUri = `${window.location.origin}/auth/callback`
  
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'openid email profile')
  authUrl.searchParams.set('access_type', 'online')
  authUrl.searchParams.set('prompt', 'select_account')

  // Redirect to Google OAuth
  window.location.href = authUrl.toString()
}

/**
 * Gets the currently logged in user from Supabase session
 * @returns {Object|null} User object or null if not logged in
 */
export const getCurrentUser = async () => {
  try {
    const sessionToken = localStorage.getItem('sessionToken')
    if (!sessionToken) {
      // Fallback to localStorage user data
      const userJson = localStorage.getItem('googleUser')
      return userJson ? JSON.parse(userJson) : null
    }
    
    // Get user from Supabase session
    const user = await userService.getUserBySession(sessionToken)
    return user
  } catch (error) {
    console.error('Errasync () => {
  try {
    const sessionToken = localStorage.getItem('sessionToken')
    if (sessionToken) {
      await userService.deleteSession(sessionToken)
    }
  } catch (error) {
    console.error('Error during logout:', error)
  }
  
  localStorage.removeItem('googleUser')
  localStorage.removeItem('sessionToken
  }
}

/**
 * Logs out the current user
 */async () => {
  const user = await getCurrentUser()
  return user=> {
  localStorage.removeItem('googleUser')
  sessionStorage.removeItem('authReturnTo')
}

/**
 * Checks if user is currently logged in
 * @returns {boolean}
 */
export const isLoggedIn = () => {
  return getCurrentUser() !== null
}
