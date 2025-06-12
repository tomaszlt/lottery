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

    // Import hook dynamically to work with mock
    const { useLotteryStatistics } = await import('../hooks/useLotteryStatistics');

    const mockReact = { 
      useState: vi.fn((initialState) => [initialState, vi.fn()]),
      useEffect: vi.fn((fn) => fn())
    };

    vi.spyOn(global, 'useState').mockImplementation(mockReact.useState);
    vi.spyOn(global, 'useEffect').mockImplementation(mockReact.useEffect);

    // Call the hook
    const { statistics, isLoading, error } = useLotteryStatistics();

    // Run all pending tasks
    await vi.runAllTicks();

    // Verify results
    expect(isLoading).toBe(false);
    expect(error).toBe(null);
    expect(statistics).toEqual({
      totalRounds: 10,
      totalPrizePool: ethers.utils.parseEther('100'),
      averagePrizePool: ethers.utils.parseEther('10'),
      totalParticipants: 500
    });
  });
});