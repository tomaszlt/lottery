import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLotteryStatistics, LotteryStatistics } from '../hooks/useLotteryStatistics';
import { ethers } from 'ethers';

describe('Lottery Statistics', () => {
  const mockContract = {
    getTotalRounds: vi.fn(),
    getTotalPrizePool: vi.fn(),
    getTotalParticipants: vi.fn()
  };

  const mockGetContract = vi.fn().mockResolvedValue(mockContract);

  beforeEach(() => {
    // Reset mock functions
    mockContract.getTotalRounds.mockResolvedValue(10);
    mockContract.getTotalPrizePool.mockResolvedValue(ethers.utils.parseEther('100'));
    mockContract.getTotalParticipants.mockResolvedValue(500);
    mockGetContract.mockClear();
  });

  it('retrieves lottery statistics correctly', async () => {
    // Use a wrapper to simulate the hook in a test environment
    const wrapper = () => {
      return useLotteryStatistics(mockGetContract);
    };

    // Call the hook
    const hookResult = wrapper();

    // Wait for async operations
    await vi.runAllTicks();

    // Validate loaded statistics
    expect(hookResult.isLoading).toBe(false);
    expect(hookResult.error).toBe(null);
    
    const stats: LotteryStatistics | null = hookResult.statistics;
    expect(stats).not.toBeNull();
    
    if (stats) {
      expect(stats.totalRounds).toBe(10);
      expect(stats.totalParticipants).toBe(500);
      expect(stats.totalPrizePool).toEqual(ethers.utils.parseEther('100'));
      expect(stats.averagePrizePool).toEqual(ethers.utils.parseEther('10'));
    }

    // Verify contract methods were called
    expect(mockContract.getTotalRounds).toHaveBeenCalled();
    expect(mockContract.getTotalPrizePool).toHaveBeenCalled();
    expect(mockContract.getTotalParticipants).toHaveBeenCalled();
  });

  it('handles contract fetch errors correctly', async () => {
    // Simulate an error
    mockGetContract.mockRejectedValue(new Error('Contract fetch failed'));

    // Use a wrapper to simulate the hook in a test environment
    const wrapper = () => {
      return useLotteryStatistics(mockGetContract);
    };

    // Call the hook
    const hookResult = wrapper();

    // Wait for async operations
    await vi.runAllTicks();

    // Validate error state
    expect(hookResult.isLoading).toBe(false);
    expect(hookResult.statistics).toBe(null);
    expect(hookResult.error).toEqual(new Error('Contract fetch failed'));
  });
});