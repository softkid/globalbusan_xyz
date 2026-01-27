import { getSuiExplorerLink, verifySuiTransaction, waitForSuiTransaction } from '../blockchain'

describe('Blockchain Utilities (Sui)', () => {
  test('should generate Sui explorer link', () => {
    const link = getSuiExplorerLink('0xsuidigest')
    expect(link).toBe('https://testnet.suivision.xyz/txblock/0xsuidigest')
  })

  test('should verify Sui transaction via waitForSuiTransaction', async () => {
    const mockTx = { balanceChanges: [{ owner: { AddressOwner: '0xto' }, amount: '1000000000' }] }
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ result: mockTx })
    })

    const result = await verifySuiTransaction({
      digest: '0xsuidigest',
      expectedAmount: 1,
      expectedRecipient: '0xto'
    })

    expect(global.fetch).toHaveBeenCalled()
    expect(result).toBe(true)
  })

  test('waitForSuiTransaction returns result', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ result: { effects: {} } })
    })

    const result = await waitForSuiTransaction('0xsuidigest')
    expect(result).toEqual({ effects: {} })
  })
})

