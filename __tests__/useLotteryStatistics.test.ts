import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getLotteryContract } from '../utils/lotteryContract';
import { ethers } from 'ethers';

// Mock the contract
vi.mock('../utils/lotteryContract', () => ({
  getLotteryContract: vi.fn()
}));

describe('Lottery Statistics', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

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

    // Call the hook and extract initial state
    const initialResult = useLotteryStatistics();

    // Advance timers to trigger async resolution
    await vi.runAllTicks();

    // Validate statistics
    expect(initialResult.isLoading).toBe(true);
    expect(initialResult.statistics).toBe(null);
    expect(initialResult.error).toBe(null);

    // Note: In a real React environment, this would trigger re-render
    // Here we're simulating the state update
    const { statistics, isLoading, error } = initialResult;

    expect(isLoading).toBe(false);
    expect(error).toBe(null);
    expect(statistics?.totalRounds).toBe(10);
    expect(statistics?.totalParticipants).toBe(500);
    expect(statistics?.totalPrizePool).toEqual(ethers.utils.parseEther('100'));
    expect(statistics?.averagePrizePool).toEqual(ethers.utils.parseEther('10'));
  });
});