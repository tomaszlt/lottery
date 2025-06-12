import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getLotteryContract } from '../utils/lotteryContract';

export interface LotteryStatistics {
  totalRounds: number;
  totalPrizePool: ethers.BigNumber;
  averagePrizePool: ethers.BigNumber;
  totalParticipants: number;
}

export interface LotteryStatisticsResult {
  statistics: LotteryStatistics | null;
  isLoading: boolean;
  error: Error | null;
}

export const useLotteryStatistics = (getContractFn = getLotteryContract): LotteryStatisticsResult => {
  const [statistics, setStatistics] = useState<LotteryStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchStatistics = async () => {
      try {
        const contract = await getContractFn();

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

        if (isMounted) {
          setStatistics(stats);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setIsLoading(false);
        }
      }
    };

    fetchStatistics();

    return () => {
      isMounted = false;
    };
  }, [getContractFn]);

  return { statistics, isLoading, error };
};