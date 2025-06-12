import { describe, it, expect, vi } from 'vitest';
import { LotteryStatistics } from './lotteryStatistics';
import { ethers } from 'ethers';

// Mock LotteryContract
const mockLotteryContract = {
  getLotteryRound: vi.fn(),
  getTotalRounds: vi.fn()
};

describe('LotteryStatistics', () => {
  const statistics = new LotteryStatistics(mockLotteryContract as any);

  describe('getRoundStatistics', () => {
    it('should fetch round statistics correctly', async () => {
      mockLotteryContract.getLotteryRound.mockResolvedValue({
        timestamp: { toNumber: () => 1625097600 },
        potSize: ethers.utils.parseEther('10'),
        participants: ['0x123', '0x456'],
        winner: '0x789'
      });

      const roundStats = await statistics.getRoundStatistics(1);
      
      expect(roundStats.roundId).toBe(1);
      expect(roundStats.timestamp).toEqual(new Date(1625097600 * 1000));
      expect(roundStats.potSize).toBe('10.0');
      expect(roundStats.participants).toBe(2);
      expect(roundStats.winner).toBe('0x789');
    });

    it('should handle error when fetching round statistics', async () => {
      mockLotteryContract.getLotteryRound.mockRejectedValue(new Error('Contract error'));

      await expect(statistics.getRoundStatistics(1)).rejects.toThrow('Unable to retrieve statistics for round 1');
    });
  });

  describe('getOverallStatistics', () => {
    it('should calculate overall statistics correctly', async () => {
      mockLotteryContract.getTotalRounds.mockResolvedValue(2);
      mockLotteryContract.getLotteryRound.mockImplementation((roundId) => {
        const rounds = {
          1: {
            timestamp: { toNumber: () => 1625097600 },
            potSize: ethers.utils.parseEther('10'),
            participants: ['0x123', '0x456'],
            winner: '0x789'
          },
          2: {
            timestamp: { toNumber: () => 1625184000 },
            potSize: ethers.utils.parseEther('15'),
            participants: ['0x456', '0x789'],
            winner: '0x789'
          }
        };
        return rounds[roundId];
      });

      const overallStats = await statistics.getOverallStatistics();
      
      expect(overallStats.totalRounds).toBe(2);
      expect(parseFloat(overallStats.totalPotValue)).toBeCloseTo(25);
      expect(parseFloat(overallStats.averagePotSize)).toBeCloseTo(12.5);
      expect(overallStats.mostFrequentWinners['0x789']).toBe(2);
    });

    it('should handle error when fetching overall statistics', async () => {
      mockLotteryContract.getTotalRounds.mockRejectedValue(new Error('Contract error'));

      await expect(statistics.getOverallStatistics()).rejects.toThrow('Unable to retrieve overall lottery statistics');
    });
  });
});