// Sui testnet smart contract metadata for the donation module.
// Lightweight replacement for legacy multi-chain helpers.

export const SUI_DONATION_PACKAGE = import.meta.env.VITE_SUI_DONATION_PACKAGE || '0x0';
export const SUI_DONATION_MODULE = 'donation_pool';
export const SUI_DONATION_FUNCTION = 'donate';

/**
 * Build a Move call payload for the donation module.
 * The caller (wallet/edge function) should sign and execute this payload.
 */
export function buildSuiDonationPayload(counterId, amount, donor) {
  return {
    kind: 'moveCall',
    data: {
      packageObjectId: SUI_DONATION_PACKAGE,
      module: SUI_DONATION_MODULE,
      function: SUI_DONATION_FUNCTION,
      typeArguments: [],
      arguments: [counterId, amount.toString(), donor],
      gasBudget: '2000000'
    }
  };
}

export default {
  SUI_DONATION_PACKAGE,
  SUI_DONATION_MODULE,
  SUI_DONATION_FUNCTION,
  buildSuiDonationPayload
};

