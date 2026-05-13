import { useState, useEffect, useCallback } from 'react'
import { FaWifi, FaTimes, FaExclamationTriangle, FaCheckCircle, FaWallet, FaLink } from 'react-icons/fa'
import { connectionStatus, checkSupabaseConnection } from '../lib/supabase'
import { useSuiWallet } from '../hooks/useSuiWallet'

const ConnectionStatus = () => {
  const [status, setStatus] = useState(connectionStatus)
  const [dismissed, setDismissed] = useState(false)
  const { connected: suiConnected, address, error: suiError } = useSuiWallet()

  useEffect(() => {
    // Check once on mount, then every 30s
    const interval = setInterval(() => {
      setStatus(connectionStatus)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleRetry = useCallback(async () => {
    const newStatus = await checkSupabaseConnection()
    setStatus({ ...newStatus, lastChecked: new Date() })
  }, [])

  // Hide if dismissed, or if both DB and wallet are fine
  if (dismissed || (status.connected && !suiError)) {
    return null
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 transition-all duration-300 max-w-xs">
      {/* Supabase Connection Status — only show if there's an issue */}
      {!status.connected && (
        <div className="p-3 rounded-lg border shadow-lg bg-yellow-50 border-yellow-200 text-yellow-800 animate-fadeIn">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FaExclamationTriangle className="text-yellow-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-xs">네트워크 연결 문제</p>
                <p className="text-[10px] opacity-75 mt-0.5 truncate">
                  {status.error?.includes('Failed to fetch') 
                    ? '서버에 연결할 수 없습니다' 
                    : '데이터 로드에 실패했습니다'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={handleRetry}
                className="px-2 py-1 text-[10px] bg-yellow-200 rounded hover:bg-yellow-300 transition-colors font-medium"
              >
                재시도
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="p-1 rounded hover:bg-yellow-200 transition-colors"
                aria-label="닫기"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sui Wallet Status — only show error */}
      {suiError && (
        <div className="p-3 rounded-lg border shadow-lg bg-blue-50 border-blue-200 text-blue-800">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FaWallet className="text-blue-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-xs">Sui 지갑 미연결</p>
                <p className="text-[10px] opacity-75 mt-0.5 truncate">{suiError}</p>
              </div>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded hover:bg-blue-200 transition-colors flex-shrink-0"
              aria-label="닫기"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConnectionStatus
