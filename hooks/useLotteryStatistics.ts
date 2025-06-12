import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getLotteryContract } from '../utils/lotteryContract';

export interface LotteryStatistics {
  totalRounds: number;
  totalPrizePool: ethers.BigNumber;
  averagePrizePool: ethers.BigNumber;
  totalParticipants: number;
}

export const useLotteryStatistics = async () => {
  const [statistics, setStatistics] = useState<LotteryStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  try {
    const contract = await getLotteryContract();

    // Fetch total rounds
    const totalRounds = await contract.getTotalRounds();
    
    // Fetch total prize pool
    const totalPrizePool = await contract.getTotalPrizePool();
    
    // Calculate average prize pool
    const averagePrizePool = totalRounds > 0 
      ? totalPrizePool.div(ethers.BigNumber.from(totalRounds)) 
      : ethers.BigNumber.from(0);

    // Fetch total participants
    const totalParticipants = await contract.getTotalParticipants();

    const stats: LotteryStatistics = {
      totalRounds,
      totalPrizePool,
      averagePrizePool,
      totalParticipants
    };

    return { 
      statistics: stats, 
      isLoading: false, 
      error: null 
    };
  } catch (err) {
    return { 
      statistics: null, 
      isLoading: false, 
      error: err instanceof Error ? err : new Error('Unknown error') 
    };
  }
};