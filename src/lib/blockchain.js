import { ethers } from 'ethers'

/**
 * 이더리움 트랜잭션 검증
 */
export const verifyEthereumTransaction = async (txHash, expectedAmount, expectedTo) => {
  try {
    // 이더리움 메인넷 또는 테스트넷 RPC URL
    const rpcUrl = import.meta.env.VITE_ETHEREUM_RPC_URL || 'https://eth.llamarpc.com'
    const provider = new ethers.JsonRpcProvider(rpcUrl)

    // 트랜잭션 정보 가져오기
    const tx = await provider.getTransaction(txHash)
    if (!tx) {
      return {
        verified: false,
        error: 'Transaction not found'
      }
    }

    // 트랜잭션 영수증 가져오기 (확인 여부)
    const receipt = await provider.getTransactionReceipt(txHash)
    if (!receipt || receipt.status !== 1) {
      return {
        verified: false,
        error: 'Transaction failed or not confirmed'
      }
    }

    // 금액 검증
    const txAmount = ethers.formatEther(tx.value)
    const expectedAmountEth = ethers.formatEther(expectedAmount || '0')
    
    // 수신 주소 검증
    const toAddress = tx.to?.toLowerCase()
    const expectedToAddress = expectedTo?.toLowerCase()

    const verified = 
      (!expectedAmount || Math.abs(parseFloat(txAmount) - parseFloat(expectedAmountEth)) < 0.001) &&
      (!expectedTo || toAddress === expectedToAddress)

    return {
      verified,
      transaction: {
        hash: txHash,
        from: tx.from,
        to: tx.to,
        amount: txAmount,
        blockNumber: receipt.blockNumber,
        confirmations: receipt.confirmations,
        timestamp: new Date().toISOString()
      },
      receipt: {
        status: receipt.status,
        gasUsed: receipt.gasUsed.toString(),
        blockNumber: receipt.blockNumber
      }
    }
  } catch (error) {
    console.error('Ethereum transaction verification error:', error)
    return {
      verified: false,
      error: error.message || 'Verification failed'
    }
  }
}

/**
 * Solana 트랜잭션 검증
 */
export const verifySolanaTransaction = async (signature, expectedAmount, expectedTo) => {
  try {
    // Solana RPC URL
    const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
    
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTransaction',
        params: [
          signature,
          {
            encoding: 'jsonParsed',
            maxSupportedTransactionVersion: 0
          }
        ]
      })
    })

    const data = await response.json()
    
    if (data.error || !data.result) {
      return {
        verified: false,
        error: data.error?.message || 'Transaction not found'
      }
    }

    const transaction = data.result
    const meta = transaction.meta

    if (meta.err) {
      return {
        verified: false,
        error: 'Transaction failed'
      }
    }

    // 트랜잭션 정보 추출
    const accountKeys = transaction.transaction.message.accountKeys
    const preBalances = meta.preBalances
    const postBalances = meta.postBalances

    // 송금 금액 계산 (간단한 방법)
    let amount = 0
    if (expectedTo) {
      const toIndex = accountKeys.findIndex(
        key => key.pubkey?.toLowerCase() === expectedTo.toLowerCase()
      )
      if (toIndex >= 0) {
        amount = (postBalances[toIndex] - preBalances[toIndex]) / 1e9 // SOL 단위로 변환
      }
    }

    const verified = 
      (!expectedAmount || Math.abs(amount - expectedAmount) < 0.001) &&
      (!expectedTo || accountKeys.some(key => key.pubkey?.toLowerCase() === expectedTo.toLowerCase()))

    return {
      verified,
      transaction: {
        signature,
        amount: amount.toString(),
        slot: transaction.slot,
        blockTime: transaction.blockTime,
        timestamp: transaction.blockTime ? new Date(transaction.blockTime * 1000).toISOString() : null
      }
    }
  } catch (error) {
    console.error('Solana transaction verification error:', error)
    return {
      verified: false,
      error: error.message || 'Verification failed'
    }
  }
}

/**
 * 트랜잭션 해시로 블록체인 링크 생성
 */
export const getBlockchainExplorerLink = (txHash, network = 'ethereum') => {
  const explorers = {
    ethereum: `https://etherscan.io/tx/${txHash}`,
    polygon: `https://polygonscan.com/tx/${txHash}`,
    solana: `https://solscan.io/tx/${txHash}`,
    bsc: `https://bscscan.com/tx/${txHash}`
  }

  return explorers[network.toLowerCase()] || explorers.ethereum
}

/**
 * 트랜잭션 검증 (자동 네트워크 감지)
 */
export const verifyTransaction = async (txHash, network, expectedAmount, expectedTo) => {
  if (network === 'solana' || network === 'SOL') {
    return await verifySolanaTransaction(txHash, expectedAmount, expectedTo)
  } else {
    return await verifyEthereumTransaction(txHash, expectedAmount, expectedTo)
  }
}

