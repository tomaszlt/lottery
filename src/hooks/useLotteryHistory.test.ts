import { vi, describe, it, expect } from 'vitest';
import { ethers } from 'ethers';
import { useLotteryHistory } from './useLotteryHistory';

// Mock window.ethereum and global
global.window = {
  ethereum: {
    request: vi.fn()
  }
} as any;

// Mock ethers and window.ethereum
vi.mock('ethers', () => ({
  ethers: {
    providers: {
      Web3Provider: vi.fn().mockImplementation(() => ({
        getSigner: vi.fn()
      }))
    },
    Contract: vi.fn().mockImplementation(() => ({
      getLotteryRounds: vi.fn().mockResolvedValue([
        {
          id: 1,
          timestamp: Date.now(),
          potSize: { toString: () => '1000' },
          participants: ['0x123', '0x456'],
          winner: '0x789',
          ticketPrice: { toString: () => '10' }
        }
      ])
    })),
    BigNumber: {
      from: vi.fn().mockImplementation((value) => ({
        toString: () => String(value)
      }))
    }
  }
}));

describe('useLotteryHistory hook', () => {
  const mockContractAddress = '0x1234567890123456789012345678901234567890';

  it('fetches initial rounds on mount', async () => {
    // Create a minimal mock React hook environment
    const mockSetState = vi.fn();
    const mockUseState = vi.fn()
      .mockReturnValueOnce([[], mockSetState])  // rounds state
      .mockReturnValueOnce([true, vi.fn()])     // isLoading state
      .mockReturnValueOnce([null, vi.fn()]);    // error state

    const { useLotteryHistory } = await import('./useLotteryHistory');

    const result = useLotteryHistory({ 
      contractAddress: mockContractAddress 
    });

    await vi.runAllTicksAsync();

    expect(result.rounds.length).toBeGreaterThan(0);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBeNull();
  });

  it('handles error state', async () => {
    // Mock a contract call failure
    const mockError = new Error('Contract fetch failed');
    vi.spyOn(ethers.Contract.prototype, 'getLotteryRounds')
      .mockRejectedValue(mockError);

    const { useLotteryHistory } = await import('./useLotteryHistory');

    const result = useLotteryHistory({ 
      contractAddress: mockContractAddress 
    });

    await vi.runAllTicksAsync();

    expect(result.isLoading).toBe(false);
    expect(result.error).not.toBeNull();
    expect(result.rounds.length).toBe(0);
  });
});