import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

/**
 * Where a payout lands, and taking the money out.
 *
 * The account name comes back from Paystack rather than from the person typing it, so the saved name is
 * the bank's own record of who owns that number.
 */
export const payout_api = {
  banks: () => GATEWAY_ENDPOINT_WITH_AUTH.get('/payments/banks'),

  account: () => GATEWAY_ENDPOINT_WITH_AUTH.get('/wallets/payout-account'),

  saveAccount: (data: { accountNumber: string; bankCode: string; bankName?: string }) =>
    GATEWAY_ENDPOINT_WITH_AUTH.put('/wallets/payout-account', data),

  balance: () => GATEWAY_ENDPOINT_WITH_AUTH.get('/wallets/mine'),

  withdraw: (amount: number) =>
    GATEWAY_ENDPOINT_WITH_AUTH.post('/wallets/withdraw', { amount }),

  transactions: () => GATEWAY_ENDPOINT_WITH_AUTH.get('/wallets/transactions'),
};
