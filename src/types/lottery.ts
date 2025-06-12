import { BigNumber } from 'ethers';

export interface LotteryRound {
  id: number;
  timestamp: number;
  potSize: BigNumber;
  participants: string[];
  winner: string | null;
  ticketPrice: BigNumber;
}

export interface LotteryHistoryHookResult {
  rounds: LotteryRound[];
  isLoading: boolean;
  error: Error | null;
  fetchMoreRounds: () => Promise<void>;
}

export interface LotteryHistoryHookParams {
  pageSize?: number;
  contractAddress: string;
}