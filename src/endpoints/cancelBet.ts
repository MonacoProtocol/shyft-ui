import { Program } from '@coral-xyz/anchor';
import { cancelOrder } from '@monaco-protocol/client';
import { PublicKey } from '@solana/web3.js';

export const cancelOrderByPk = async (program: Program, publicKey: string) => {
  const cancelResponse = await cancelOrder(program, new PublicKey(publicKey));
  return cancelResponse;
};

export default cancelOrderByPk;
