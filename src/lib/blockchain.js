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
 * Polygon 트랜잭션 검증
 */
export const verifyPolygonTransaction = async (txHash, expectedAmount, expectedTo) => {
  try {
    // Polygon 메인넷 RPC URL
    const rpcUrl = import.meta.env.VITE_POLYGON_RPC_URL || 'https://polygon.llamarpc.com'
    const provider = new ethers.JsonRpcProvider(rpcUrl)

    // 트랜잭션 정보 가져오기
    const tx = await provider.getTransaction(txHash)
    if (!tx) {
      return {
        verified: false,
        error: 'Transaction not found'
      }
    }

    // 트랜잭션 영수증 가져오기
    const receipt = await provider.getTransactionReceipt(txHash)
    if (!receipt || receipt.status !== 1) {
      return {
        verified: false,
        error: 'Transaction failed or not confirmed'
      }
    }

    // 금액 검증 (MATIC)
    const txAmount = ethers.formatEther(tx.value)
    const expectedAmountMatic = ethers.formatEther(expectedAmount || '0')
    
    // 수신 주소 검증
    const toAddress = tx.to?.toLowerCase()
    const expectedToAddress = expectedTo?.toLowerCase()

    const verified = 
      (!expectedAmount || Math.abs(parseFloat(txAmount) - parseFloat(expectedAmountMatic)) < 0.001) &&
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
    console.error('Polygon transaction verification error:', error)
    return {
      verified: false,
      error: error.message || 'Verification failed'
    }
  }
}

/**
 * 트랜잭션 검증 (자동 네트워크 감지)
 */
export const verifyTransaction = async (txHash, network, expectedAmount, expectedTo) => {
  if (network === 'solana' || network === 'SOL') {
    return await verifySolanaTransaction(txHash, expectedAmount, expectedTo)
  } else if (network === 'polygon' || network === 'MATIC') {
    return await verifyPolygonTransaction(txHash, expectedAmount, expectedTo)
  } else {
    return await verifyEthereumTransaction(txHash, expectedAmount, expectedTo)
  }
}

/**
 * Ethereum 트랜잭션 전송
 */
export const sendEthereumTransaction = async (toAddress, amount, fromAddress, provider) => {
  try {
    if (!provider) {
      // MetaMask 또는 다른 지갑에서 provider 가져오기
      if (window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum)
      } else {
        throw new Error('Ethereum provider not found. Please install MetaMask or connect a wallet.')
      }
    }

    // 서명자 가져오기
    const signer = await provider.getSigner(fromAddress)
    
    // 실제 주소 확인
    const actualFromAddress = await signer.getAddress()
    if (actualFromAddress.toLowerCase() !== fromAddress.toLowerCase()) {
      throw new Error('Connected wallet address does not match')
    }

    // 트랜잭션 생성
    const tx = {
      to: toAddress,
      value: ethers.parseEther(amount.toString()), // ETH를 Wei로 변환
    }

    // 가스 추정
    const gasEstimate = await signer.estimateGas(tx)
    tx.gasLimit = gasEstimate

    // 트랜잭션 전송
    const transactionResponse = await signer.sendTransaction(tx)
    
    // 트랜잭션 해시 반환
    return {
      success: true,
      transactionHash: transactionResponse.hash,
      from: actualFromAddress,
      to: toAddress,
      amount: amount.toString(),
      network: 'ethereum'
    }
  } catch (error) {
    console.error('Ethereum transaction error:', error)
    return {
      success: false,
      error: error.message || 'Transaction failed',
      code: error.code
    }
  }
}

/**
 * Solana 트랜잭션 전송
 */
export const sendSolanaTransaction = async (toAddress, amount, fromPublicKey) => {
  try {
    if (!window.solana || !window.solana.isPhantom) {
      throw new Error('Solana wallet not found. Please install Phantom wallet.')
    }

    // Phantom 지갑 연결 확인
    if (!window.solana.isConnected) {
      await window.solana.connect()
    }

    const provider = window.solana
    const publicKey = provider.publicKey

    if (!publicKey) {
      throw new Error('No Solana wallet connected')
    }

    // @solana/web3.js 사용
    const { Connection, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction } = await import('@solana/web3.js')

    // RPC 연결
    const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
    const connection = new Connection(rpcUrl, 'confirmed')

    // 수신 주소 검증
    const toPublicKey = new PublicKey(toAddress)
    const fromPublicKeyObj = new PublicKey(publicKey.toString())

    // 트랜잭션 생성
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromPublicKeyObj,
        toPubkey: toPublicKey,
        lamports: amount * 1e9 // SOL을 lamports로 변환
      })
    )

    // 최근 블록해시 가져오기
    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = fromPublicKeyObj

    // 트랜잭션 서명 및 전송
    const signedTransaction = await provider.signTransaction(transaction)
    const signature = await connection.sendRawTransaction(signedTransaction.serialize())

    // 트랜잭션 확인 대기
    await connection.confirmTransaction(signature, 'confirmed')

    return {
      success: true,
      transactionHash: signature,
      from: publicKey.toString(),
      to: toAddress,
      amount: amount.toString(),
      network: 'solana'
    }
  } catch (error) {
    console.error('Solana transaction error:', error)
    return {
      success: false,
      error: error.message || 'Transaction failed',
      code: error.code
    }
  }
}

/**
 * 트랜잭션 전송 (자동 네트워크 감지)
 */
export const sendTransaction = async (toAddress, amount, fromAddress, network = 'ethereum') => {
  if (network === 'solana' || network === 'SOL') {
    return await sendSolanaTransaction(toAddress, amount, fromAddress)
  } else {
    // Ethereum 계열 (ETH, Polygon 등)
    return await sendEthereumTransaction(toAddress, amount, fromAddress)
  }
}

/**
 * 트랜잭션 상태 확인 (Ethereum)
 */
export const waitForEthereumTransaction = async (txHash, confirmations = 1) => {
  try {
    const rpcUrl = import.meta.env.VITE_ETHEREUM_RPC_URL || 'https://eth.llamarpc.com'
    const provider = new ethers.JsonRpcProvider(rpcUrl)

    const receipt = await provider.waitForTransaction(txHash, confirmations)

    return {
      success: receipt.status === 1,
      receipt: {
        status: receipt.status,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        confirmations: receipt.confirmations
      }
    }
  } catch (error) {
    console.error('Wait for transaction error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 트랜잭션 상태 확인 (Solana)
 */
export const waitForSolanaTransaction = async (signature, maxWaitTime = 30000) => {
  try {
    const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
    
    const startTime = Date.now()
    while (Date.now() - startTime < maxWaitTime) {
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getSignatureStatuses',
          params: [[signature]]
        })
      })

      const data = await response.json()
      const status = data.result?.value?.[0]

      if (status) {
        if (status.err) {
          return {
            success: false,
            error: 'Transaction failed',
            status: status.err
          }
        }
        if (status.confirmationStatus === 'confirmed' || status.confirmationStatus === 'finalized') {
          return {
            success: true,
            status: status.confirmationStatus,
            slot: status.slot
          }
        }
      }

      // 1초 대기 후 재시도
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    return {
      success: false,
      error: 'Transaction confirmation timeout'
    }
  } catch (error) {
    console.error('Wait for Solana transaction error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

