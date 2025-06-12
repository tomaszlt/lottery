import { renderHook, act } from '@testing-library/react-hooks';
import { ethers } from 'ethers';
import { useLotteryHistory } from './useLotteryHistory';
import { describe, it, expect, vi } from 'vitest';

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
          potSize: ethers.BigNumber.from(1000),
          participants: ['0x123', '0x456'],
          winner: '0x789',
          ticketPrice: ethers.BigNumber.from(10)
        }
      ])
    }))
  }
}));

describe('useLotteryHistory hook', () => {
  const mockContractAddress = '0x1234567890123456789012345678901234567890';

  it('fetches initial rounds on mount', async () => {
    const { result, waitForNextUpdate } = renderHook(() => 
      useLotteryHistory({ 
        contractAddress: mockContractAddress 
      })
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.rounds.length).toBe(0);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.rounds.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
  });

  it('handles error state', async () => {
    // Mock a contract call failure
    const mockError = new Error('Contract fetch failed');
    vi.spyOn(ethers.Contract.prototype, 'getLotteryRounds').mockRejectedValue(mockError);

    const { result, waitForNextUpdate } = renderHook(() => 
      useLotteryHistory({ 
        contractAddress: mockContractAddress 
      })
    );

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).not.toBeNull();
    expect(result.current.rounds.length).toBe(0);
  });

  it('can fetch more rounds', async () => {
    const { result, waitForNextUpdate } = renderHook(() => 
      useLotteryHistory({ 
        contractAddress: mockContractAddress 
      })
    );

    await waitForNextUpdate();

    const initialRoundsCount = result.current.rounds.length;

    await act(async () => {
      await result.current.fetchMoreRounds();
    });

    expect(result.current.rounds.length).toBeGreaterThan(initialRoundsCount);
  });
});