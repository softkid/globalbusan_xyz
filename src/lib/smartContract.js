/**
 * 스마트 컨트랙트 연동 유틸리티
 * 이더리움 및 Solana 스마트 컨트랙트와의 상호작용을 관리합니다.
 */

import { ethers } from 'ethers'
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js'

/**
 * 이더리움 스마트 컨트랙트와 상호작용
 */
export class EthereumContract {
  constructor(contractAddress, abi, provider) {
    this.contractAddress = contractAddress
    this.abi = abi
    this.provider = provider
    this.contract = null
  }

  /**
   * 컨트랙트 인스턴스 초기화
   */
  async init() {
    if (!this.provider) {
      if (window.ethereum) {
        this.provider = new ethers.BrowserProvider(window.ethereum)
      } else {
        throw new Error('Ethereum provider not found')
      }
    }

    const signer = await this.provider.getSigner()
    this.contract = new ethers.Contract(this.contractAddress, this.abi, signer)
    return this.contract
  }

  /**
   * 기부 함수 호출
   */
  async donate(amount, recipientAddress) {
    if (!this.contract) {
      await this.init()
    }

    try {
      const tx = await this.contract.donate(recipientAddress, {
        value: ethers.parseEther(amount.toString())
      })
      
      return {
        success: true,
        transactionHash: tx.hash,
        transaction: tx
      }
    } catch (error) {
      console.error('Donation failed:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * 기부 총액 조회
   */
  async getTotalDonations() {
    if (!this.contract) {
      await this.init()
    }

    try {
      const total = await this.contract.totalDonations()
      return ethers.formatEther(total)
    } catch (error) {
      console.error('Failed to get total donations:', error)
      return '0'
    }
  }

  /**
   * 특정 주소의 기부 금액 조회
   */
  async getDonationAmount(address) {
    if (!this.contract) {
      await this.init()
    }

    try {
      const amount = await this.contract.donations(address)
      return ethers.formatEther(amount)
    } catch (error) {
      console.error('Failed to get donation amount:', error)
      return '0'
    }
  }
}

/**
 * Solana 프로그램과 상호작용
 */
export class SolanaProgram {
  constructor(programId, connection) {
    this.programId = new PublicKey(programId)
    this.connection = connection || new Connection('https://api.mainnet-beta.solana.com', 'confirmed')
  }

  /**
   * 기부 트랜잭션 생성
   */
  async createDonationTransaction(fromPublicKey, toPublicKey, amount) {
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromPublicKey,
          toPubkey: toPublicKey,
          lamports: amount * 1e9 // SOL을 lamports로 변환
        })
      )

      const { blockhash } = await this.connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = fromPublicKey

      return {
        success: true,
        transaction
      }
    } catch (error) {
      console.error('Failed to create donation transaction:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * 프로그램 계정 데이터 조회
   */
  async getProgramAccountData(accountAddress) {
    try {
      const accountInfo = await this.connection.getAccountInfo(
        new PublicKey(accountAddress)
      )
      
      return {
        success: true,
        data: accountInfo?.data || null
      }
    } catch (error) {
      console.error('Failed to get program account:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

/**
 * Global Busan 기부 스마트 컨트랙트 ABI (예시)
 * 실제 배포된 컨트랙트 주소와 ABI로 교체해야 합니다.
 */
export const GLOBAL_BUSAN_DONATION_CONTRACT_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'recipient', type: 'address' }
    ],
    name: 'donate',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalDonations',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'donations',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
]

/**
 * Global Busan 기부 컨트랙트 주소 (테스트넷)
 * 실제 배포 후 메인넷 주소로 교체
 */
export const GLOBAL_BUSAN_DONATION_CONTRACT_ADDRESS = {
  ethereum: import.meta.env.VITE_ETH_DONATION_CONTRACT || '0x0000000000000000000000000000000000000000',
  polygon: import.meta.env.VITE_POLYGON_DONATION_CONTRACT || '0x0000000000000000000000000000000000000000',
  solana: import.meta.env.VITE_SOL_DONATION_PROGRAM || '11111111111111111111111111111111'
}

/**
 * 스마트 컨트랙트 인스턴스 생성 헬퍼
 */
export const createDonationContract = async (network = 'ethereum') => {
  if (network === 'solana' || network === 'SOL') {
    return new SolanaProgram(
      GLOBAL_BUSAN_DONATION_CONTRACT_ADDRESS.solana
    )
  } else {
    const contractAddress = network === 'polygon' 
      ? GLOBAL_BUSAN_DONATION_CONTRACT_ADDRESS.polygon
      : GLOBAL_BUSAN_DONATION_CONTRACT_ADDRESS.ethereum
    
    const contract = new EthereumContract(
      contractAddress,
      GLOBAL_BUSAN_DONATION_CONTRACT_ABI
    )
    
    await contract.init()
    return contract
  }
}

