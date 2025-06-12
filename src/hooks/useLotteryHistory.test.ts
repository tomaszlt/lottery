import { vi, describe, it, expect } from 'vitest';
import { ethers } from 'ethers';
import { useLotteryHistory } from './useLotteryHistory';

// Setup global mocks
const mockEthereumProvider = {
  request: vi.fn()
};
global.window = { ethereum: mockEthereumProvider } as any;

// Mock ethers
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
    const { rounds, isLoading, error } = useLotteryHistory({ 
      contractAddress: mockContractAddress 
    });

    // Wait for async operations
    await vi.runAllTicksAsync();

    expect(isLoading).toBe(false);
    expect(rounds.length).toBeGreaterThan(0);
    expect(error).toBeNull();
  });

  it('handles error state', async () => {
    // Mock a contract call failure
    const mockError = new Error('Contract fetch failed');
    vi.spyOn(ethers.Contract.prototype, 'getLotteryRounds')
      .mockRejectedValue(mockError);

    const { rounds, isLoading, error } = useLotteryHistory({ 
      contractAddress: mockContractAddress 
    });

    // Wait for async operations
    await vi.runAllTicksAsync();

    expect(isLoading).toBe(false);
    expect(error).not.toBeNull();
    expect(rounds.length).toBe(0);
  });
});