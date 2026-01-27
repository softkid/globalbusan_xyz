import { useState, useEffect } from 'react'
import { FaWifi, FaTimes, FaExclamationTriangle, FaCheckCircle, FaWallet, FaLink } from 'react-icons/fa'
import { connectionStatus, checkSupabaseConnection } from '../lib/supabase'
import { useSuiWallet } from '../hooks/useSuiWallet'

const ConnectionStatus = () => {
  const [status, setStatus] = useState(connectionStatus)
  const [isVisible, setIsVisible] = useState(false)
  const { connected: suiConnected, address, error: suiError } = useSuiWallet()

  useEffect(() => {
    // 연결 상태 업데이트를 위한 주기적 체크
    const interval = setInterval(() => {
      setStatus(connectionStatus)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleRetry = async () => {
    const newStatus = await checkSupabaseConnection()
    setStatus({ ...newStatus, lastChecked: new Date() })
  }

  const getStatusIcon = () => {
    if (status.connected) {
      return <FaCheckCircle className="text-green-500" />
    } else if (status.error) {
      return <FaExclamationTriangle className="text-yellow-500" />
    } else {
      return <FaTimes className="text-red-500" />
    }
  }

  const getStatusText = () => {
    if (status.connected) {
      return '데이터베이스 연결됨'
    } else if (status.error) {
      return '연결 문제 발생'
    } else {
      return '연결 중...'
    }
  }

  const getStatusColor = () => {
    if (status.connected) {
      return 'bg-green-100 border-green-300 text-green-800'
    } else if (status.error) {
      return 'bg-yellow-100 border-yellow-300 text-yellow-800'
    } else {
      return 'bg-red-100 border-red-300 text-red-800'
    }
  }

  // 연결이 안 되었을 때만 표시
  if (status.connected && !suiError && !isVisible) {
    return null
  }

  return (
    <div className={`fixed top-20 right-4 z-50 space-y-2 transition-all duration-300`}>
      {/* Supabase Connection Status */}
      <div className={`max-w-sm p-4 rounded-lg border shadow-lg transition-all ${
        status.connected ? 'opacity-30' : 'opacity-100'
      } ${getStatusColor()}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <p className="font-semibold text-sm">{getStatusText()}</p>
              {status.error && (
                <p className="text-xs opacity-75 mt-1">
                  {status.error.includes('Failed to fetch') 
                    ? '네트워크 연결을 확인해주세요' 
                    : status.error}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleRetry}
            className="px-2 py-1 text-xs bg-white bg-opacity-50 rounded hover:bg-opacity-75 transition-colors"
          >
            새로고침
          </button>
        </div>
      </div>

      {/* Sui Wallet Status */}
      <div className={`max-w-sm p-4 rounded-lg border shadow-lg ${
        suiConnected 
          ? 'bg-green-100 border-green-300 text-green-800' 
          : suiError 
          ? 'bg-yellow-100 border-yellow-300 text-yellow-800'
          : 'bg-blue-100 border-blue-300 text-blue-800'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {suiConnected ? (
              <FaCheckCircle className="text-green-600" />
            ) : suiError ? (
              <FaExclamationTriangle className="text-yellow-600" />
            ) : (
              <FaLink className="text-blue-600" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <FaWallet className="text-sm" />
                <p className="font-semibold text-sm">
                  {suiConnected ? 'Sui 지갑 연결됨' : 'Sui 지갑 미연결'}
                </p>
              </div>
              {suiConnected && address && (
                <p className="text-xs opacity-75 mt-1">
                  {address.substring(0, 6)}...{address.substring(-4)}
                </p>
              )}
              {suiError && (
                <p className="text-xs opacity-75 mt-1">{suiError}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConnectionStatus
