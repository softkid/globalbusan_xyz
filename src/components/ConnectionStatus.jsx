import { useState, useEffect } from 'react'
import { FaWifi, FaTimes, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'
import { connectionStatus, checkSupabaseConnection } from '../lib/supabase'

const ConnectionStatus = () => {
  const [status, setStatus] = useState(connectionStatus)
  const [isVisible, setIsVisible] = useState(false)

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
  if (status.connected && !isVisible) {
    return null
  }

  return (
    <div className={`fixed top-20 right-4 z-50 transition-all duration-300 ${
      status.connected ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      <div className={`max-w-sm p-4 rounded-lg border shadow-lg ${getStatusColor()}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <p className="font-semibold">{getStatusText()}</p>
              {status.error && (
                <p className="text-sm opacity-75 mt-1">
                  {status.error.includes('Failed to fetch') 
                    ? '네트워크 연결을 확인해주세요' 
                    : status.error}
                </p>
              )}
              {status.lastChecked && (
                <p className="text-xs opacity-60 mt-1">
                  마지막 확인: {status.lastChecked.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleRetry}
              className="px-3 py-1 text-xs bg-white bg-opacity-50 rounded hover:bg-opacity-75 transition-colors"
            >
              재시도
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="px-3 py-1 text-xs bg-white bg-opacity-50 rounded hover:bg-opacity-75 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConnectionStatus
