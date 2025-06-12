import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { LotteryRound, LotteryHistoryHookResult, LotteryHistoryHookParams } from '../types/lottery';

export function useLotteryHistory({ 
  pageSize = 10, 
  contractAddress 
}: LotteryHistoryHookParams): LotteryHistoryHookResult {
  const [rounds, setRounds] = useState<LotteryRound[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const fetchRounds = useCallback(async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, [
        // Include a mock ABI with a getLotteryRounds method
        "function getLotteryRounds(uint256 offset, uint256 limit) view returns (tuple(uint256 id, uint256 timestamp, uint256 potSize, address[] participants, address winner, uint256 ticketPrice)[])"
      ], provider);

      const fetchedRounds: LotteryRound[] = await contract.getLotteryRounds(
        currentPage * pageSize, 
        pageSize
      );

      setRounds(prevRounds => [...prevRounds, ...fetchedRounds]);
      setCurrentPage(prevPage => prevPage + 1);
      setIsLoading(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch lottery rounds');
      setError(error);
      setIsLoading(false);
    }
  }, [contractAddress, currentPage, pageSize]);

  const fetchMoreRounds = useCallback(async () => {
    await fetchRounds();
  }, [fetchRounds]);

  useEffect(() => {
    // Initial fetch
    fetchRounds();
  }, [fetchRounds]);

  return {
    rounds,
    isLoading,
    error,
    fetchMoreRounds
  };
}