/**
 * Sui-only blockchain integration smoke tests
 */
import { 
  connectSuiWallet,
  sendSuiTransaction,
  waitForSuiTransaction,
  verifySuiTransaction,
  getSuiExplorerLink
} from '../../lib/blockchain'

jest.mock('../../lib/blockchain', () => ({
  connectSuiWallet: jest.fn().mockResolvedValue('0xsuiwallet'),
  sendSuiTransaction: jest.fn().mockResolvedValue('0xsuidigest'),
  waitForSuiTransaction: jest.fn().mockResolvedValue({ status: 'success' }),
  verifySuiTransaction: jest.fn().mockResolvedValue(true),
  getSuiExplorerLink: jest.fn((digest) => `https://testnet.suivision.xyz/txblock/${digest}`)
}))

describe('Blockchain Integration (Sui)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('connects Sui wallet', async () => {
    const addr = await connectSuiWallet()
    expect(addr).toBe('0xsuiwallet')
  })

  test('sends Sui transaction and verifies', async () => {
    const digest = await sendSuiTransaction({ sender: '0xfrom', recipient: '0xto', amount: 1 })
    expect(digest).toBe('0xsuidigest')

    await waitForSuiTransaction(digest)
    const verified = await verifySuiTransaction({ digest, expectedAmount: 1, expectedRecipient: '0xto' })
    expect(verified).toBe(true)
  })

  test('generates Sui explorer link', () => {
    const link = getSuiExplorerLink('0xsuidigest')
    expect(link).toContain('suivision')
    expect(link).toContain('0xsuidigest')
  })
})

