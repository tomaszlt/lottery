import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getLotteryContract } from '../utils/lotteryContract';

export interface LotteryStatistics {
  totalRounds: number;
  totalPrizePool: ethers.BigNumber;
  averagePrizePool: ethers.BigNumber;
  totalParticipants: number;
}

export const useLotteryStatistics = () => {
  const [statistics, setStatistics] = useState<LotteryStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        const contract = await getLotteryContract();

        // Fetch total rounds (assuming the contract has a method for this)
        const totalRounds = await contract.getTotalRounds();
        
        // Fetch total prize pool (sum of all round prizes)
        const totalPrizePool = await contract.getTotalPrizePool();
        
        // Calculate average prize pool
        const averagePrizePool = totalRounds > 0 
          ? totalPrizePool.div(ethers.BigNumber.from(totalRounds)) 
          : ethers.BigNumber.from(0);

        // Fetch total participants
        const totalParticipants = await contract.getTotalParticipants();

        setStatistics({
          totalRounds,
          totalPrizePool,
          averagePrizePool,
          totalParticipants
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return { statistics, isLoading, error };
};