import { describe, it, expect, vi } from 'vitest';
import { getLotteryContract } from '../utils/lotteryContract';
import { ethers } from 'ethers';

// Mock the contract
vi.mock('../utils/lotteryContract', () => ({
  getLotteryContract: vi.fn()
}));

describe('Lottery Statistics', () => {
  it('retrieves lottery statistics correctly', async () => {
    // Setup mock contract methods
    const mockContract = {
      getTotalRounds: vi.fn().mockResolvedValue(10),
      getTotalPrizePool: vi.fn().mockResolvedValue(ethers.utils.parseEther('100')),
      getTotalParticipants: vi.fn().mockResolvedValue(500)
    };

    // Configure mock getLotteryContract to return mock contract
    vi.mocked(getLotteryContract).mockResolvedValue(mockContract);

    // Temporarily mock console to suppress any useEffect warnings
    const originalConsoleWarn = console.warn;
    console.warn = vi.fn();

    // Import hook dynamically to work with mock
    const { useLotteryStatistics } = await import('../hooks/useLotteryStatistics');

    // Restore console warn
    console.warn = originalConsoleWarn;

    // This is a simulated hook call to check initial state
    const initialState = { 
      statistics: null, 
      isLoading: true, 
      error: null 
    };

    // Wait a moment to simulate async behavior
    await vi.runAllTicks();

    // Verify results match expected
    const { statistics, isLoading, error } = useLotteryStatistics();

    expect(isLoading).toBe(false);
    expect(error).toBe(null);
    expect(statistics?.totalRounds).toBe(10);
    expect(statistics?.totalParticipants).toBe(500);
    expect(statistics?.totalPrizePool).toEqual(ethers.utils.parseEther('100'));
    expect(statistics?.averagePrizePool).toEqual(ethers.utils.parseEther('10'));
  });
});