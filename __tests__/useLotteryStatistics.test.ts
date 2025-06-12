import { describe, it, expect, vi } from 'vitest';
import { useLotteryStatistics } from '../hooks/useLotteryStatistics';
import { ethers } from 'ethers';

// Mock the hook's internals
vi.mock('../utils/lotteryContract', () => ({
  getLotteryContract: vi.fn().mockResolvedValue({
    getTotalRounds: vi.fn().mockResolvedValue(10),
    getTotalPrizePool: vi.fn().mockResolvedValue(ethers.utils.parseEther('100')),
    getTotalParticipants: vi.fn().mockResolvedValue(500)
  })
}));

describe('useLotteryStatistics', () => {
  it('fetches and transforms lottery statistics correctly', async () => {
    // Use a function to simulate the hook
    const mockHook = () => {
      const { useState, useEffect } = require('react');
      const { useLotteryStatistics } = require('../hooks/useLotteryStatistics');
      return useLotteryStatistics();
    };

    // Create a result object
    const result = { current: null };

    // Mock the React hook
    await vi.dynamicImportSettled();
    const hookResult = mockHook();
    result.current = hookResult;

    // Wait for async operations
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