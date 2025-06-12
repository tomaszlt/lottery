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
    const { result } = renderHook(() => useLotteryStatistics());

    // Wait for the hook to resolve
    await vi.runAllTicks();

    // Validate loaded statistics
    expect(result.current.isLoading).toBe(false);
    expect(result.current.statistics).not.toBeNull();
    expect(result.current.statistics?.totalRounds).toBe(10);
    expect(result.current.statistics?.totalParticipants).toBe(500);
    expect(result.current.statistics?.totalPrizePool).toEqual(ethers.utils.parseEther('100'));
    expect(result.current.error).toBe(null);
  });
});

// Mock renderHook for Vitest
function renderHook(hook) {
  const result = { current: null };

  const wrapper = () => {
    result.current = hook();
    return null;
  };

  wrapper();

  return { result };
}