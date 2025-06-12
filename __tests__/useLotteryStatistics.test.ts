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
    // In Vitest, hooks need to be used in a component context
    const mockUseState = vi.fn((initialState) => {
      let state = initialState;
      const setState = vi.fn((newState) => {
        state = typeof newState === 'function' ? newState(state) : newState;
      });
      return [state, setState];
    });

    const mockUseEffect = vi.fn((fn) => {
      fn();
      return () => {};
    });

    // Mock React hooks globally
    vi.spyOn(React, 'useState').mockImplementation(mockUseState);
    vi.spyOn(React, 'useEffect').mockImplementation(mockUseEffect);

    // Call the hook with mock contract getter
    const result = useLotteryStatistics(mockGetContract);

    // Verify initial state
    expect(result.isLoading).toBe(true);
    expect(result.statistics).toBe(null);
    expect(result.error).toBe(null);

    // Simulate async resolution
    await vi.runAllTicks();

    // Verify final state
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe(null);
    
    expect(result.statistics).toEqual({
      totalRounds: 10,
      totalPrizePool: ethers.utils.parseEther('100'),
      averagePrizePool: ethers.utils.parseEther('10'),
      totalParticipants: 500
    });

    // Verify contract methods were called
    expect(mockContract.getTotalRounds).toHaveBeenCalled();
    expect(mockContract.getTotalPrizePool).toHaveBeenCalled();
    expect(mockContract.getTotalParticipants).toHaveBeenCalled();
  });

  it('handles contract fetch errors correctly', async () => {
    // Simulate an error
    mockGetContract.mockRejectedValue(new Error('Contract fetch failed'));

    // Mock React hooks globally
    const mockUseState = vi.fn((initialState) => {
      let state = initialState;
      const setState = vi.fn((newState) => {
        state = typeof newState === 'function' ? newState(state) : newState;
      });
      return [state, setState];
    });

    const mockUseEffect = vi.fn((fn) => {
      fn();
      return () => {};
    });

    vi.spyOn(React, 'useState').mockImplementation(mockUseState);
    vi.spyOn(React, 'useEffect').mockImplementation(mockUseEffect);

    // Call the hook with error-throwing contract getter
    const result = useLotteryStatistics(mockGetContract);

    // Verify initial state
    expect(result.isLoading).toBe(true);
    expect(result.statistics).toBe(null);
    expect(result.error).toBe(null);

    // Simulate async resolution
    await vi.runAllTicks();

    // Verify error state
    expect(result.isLoading).toBe(false);
    expect(result.statistics).toBe(null);
    expect(result.error).toEqual(new Error('Contract fetch failed'));
  });
});