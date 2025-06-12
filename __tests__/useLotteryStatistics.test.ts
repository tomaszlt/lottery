import { describe, it, expect, vi } from 'vitest';
import { useLotteryStatistics } from '../hooks/useLotteryStatistics';
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
    // Mock global React hooks to simulate component-like behavior
    const originalUseState = React.useState;
    const originalUseEffect = React.useEffect;

    try {
      // Mock the hooks to control state and capture calls
      React.useState = vi.fn(originalUseState);
      React.useEffect = vi.fn(originalUseEffect);

      // Call the hook with mock contract getter
      const hookResult = useLotteryStatistics(mockGetContract);

      // Run all pending async tasks
      await vi.runAllTicks();

      // Verify final state
      expect(hookResult.isLoading).toBe(false);
      expect(hookResult.error).toBe(null);
      
      expect(hookResult.statistics).toEqual({
        totalRounds: 10,
        totalPrizePool: ethers.utils.parseEther('100'),
        averagePrizePool: ethers.utils.parseEther('10'),
        totalParticipants: 500
      });

      // Verify contract methods were called
      expect(mockContract.getTotalRounds).toHaveBeenCalled();
      expect(mockContract.getTotalPrizePool).toHaveBeenCalled();
      expect(mockContract.getTotalParticipants).toHaveBeenCalled();
    } finally {
      // Restore original hooks
      React.useState = originalUseState;
      React.useEffect = originalUseEffect;
    }
  });

  it('handles contract fetch errors correctly', async () => {
    // Simulate an error
    mockGetContract.mockRejectedValue(new Error('Contract fetch failed'));

    // Mock global React hooks to simulate component-like behavior
    const originalUseState = React.useState;
    const originalUseEffect = React.useEffect;

    try {
      // Mock the hooks to control state and capture calls
      React.useState = vi.fn(originalUseState);
      React.useEffect = vi.fn(originalUseEffect);

      // Call the hook with error-throwing contract getter
      const hookResult = useLotteryStatistics(mockGetContract);

      // Run all pending async tasks
      await vi.runAllTicks();

      // Verify error state
      expect(hookResult.isLoading).toBe(false);
      expect(hookResult.statistics).toBe(null);
      expect(hookResult.error).toEqual(new Error('Contract fetch failed'));
    } finally {
      // Restore original hooks
      React.useState = originalUseState;
      React.useEffect = originalUseEffect;
    }
  });
});