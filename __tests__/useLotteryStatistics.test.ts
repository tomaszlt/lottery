import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
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
    const { result, waitForNextUpdate } = renderHook(() => useLotteryStatistics());

    // Initially should be loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.statistics).toBe(null);
    expect(result.current.error).toBe(null);

    // Wait for statistics to load
    await waitForNextUpdate();

    // Validate loaded statistics
    expect(result.current.isLoading).toBe(false);
    expect(result.current.statistics).not.toBeNull();
    expect(result.current.statistics?.totalRounds).toBe(10);
    expect(result.current.statistics?.totalParticipants).toBe(500);
    expect(result.current.statistics?.totalPrizePool).toEqual(ethers.utils.parseEther('100'));
    expect(result.current.error).toBe(null);
  });
});