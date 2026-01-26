/**
 * 환불 처리 유틸리티 (Sui 전용)
 * 온체인 전송은 되돌릴 수 없으므로 UI 차원에서 환불을 막습니다.
 */

export const processSuiRefund = async () => {
  throw new Error('On-chain SUI transfers are irreversible and cannot be refunded automatically.')
}

export const canRefund = () => ({
  canRefund: false,
  reason: 'On-chain SUI transfers are irreversible.'
})

export const calculateRefundAmount = (originalAmount) => originalAmount

