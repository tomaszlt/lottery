import { describe, it, expect, vi } from 'vitest';
import { useLotteryStatistics } from '../hooks/useLotteryStatistics';
import { ethers } from 'ethers';

// Mock the getLotteryContract utility
vi.mock('../utils/lotteryContract', () => ({
  getLotteryContract: vi.fn().mockResolvedValue({
    getTotalRounds: vi.fn().mockResolvedValue(10),
    getTotalPrizePool: vi.fn().mockResolvedValue(ethers.utils.parseEther('100')),
    getTotalParticipants: vi.fn().mockResolvedValue(500)
  })
}));

describe('useLotteryStatistics', () => {
  it('fetches and transforms lottery statistics correctly', async () => {
    const { statistics, isLoading, error } = await useLotteryStatistics();

    // Validate loaded statistics
    expect(isLoading).toBe(false);
    expect(statistics).not.toBeNull();
    expect(statistics?.totalRounds).toBe(10);
    expect(statistics?.totalParticipants).toBe(500);
    expect(statistics?.totalPrizePool).toEqual(ethers.utils.parseEther('100'));
    expect(error).toBe(null);
  });
});