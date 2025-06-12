import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react-hooks';
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
    const { result, waitForNextUpdate } = renderHook(() => 
      useLotteryStatistics(mockGetContract)
    );

    // Initially should be loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.statistics).toBe(null);
    expect(result.current.error).toBe(null);

    // Wait for statistics to load
    await waitForNextUpdate();

    // Validate loaded statistics
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    
    const stats: LotteryStatistics | null = result.current.statistics;
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

    const { result, waitForNextUpdate } = renderHook(() => 
      useLotteryStatistics(mockGetContract)
    );

    // Initially should be loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.statistics).toBe(null);
    expect(result.current.error).toBe(null);

    // Wait for error to be set
    await waitForNextUpdate();

    // Validate error state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.statistics).toBe(null);
    expect(result.current.error).toEqual(new Error('Contract fetch failed'));
  });
});