import { vi, describe, it, expect } from 'vitest';
import { ethers } from 'ethers';
import { useLotteryHistory, fetchLotteryRounds } from './useLotteryHistory';

// Setup global mocks
const mockEthereumProvider = {
  request: vi.fn()
};
global.window = { ethereum: mockEthereumProvider } as any;

// Mock ethers
vi.mock('ethers', async () => {
  const actual = await vi.importActual('ethers');
  return {
    ...actual,
    ethers: {
      providers: {
        Web3Provider: vi.fn().mockImplementation(() => ({
          getSigner: vi.fn()
        }))
      },
      Contract: vi.fn().mockImplementation(() => ({
        getLotteryRounds: vi.fn()
      })),
      BigNumber: {
        from: vi.fn().mockImplementation((value) => ({
          toString: () => String(value)
        }))
      }
    }
  };
});

describe('useLotteryHistory', () => {
  const mockContractAddress = '0x1234567890123456789012345678901234567890';

  it('retrieves lottery rounds successfully', async () => {
    // Mock successful response
    const mockRounds = [
      {
        id: 1,
        timestamp: Date.now(),
        potSize: { toString: () => '1000' },
        participants: ['0x123', '0x456'],
        winner: '0x789',
        ticketPrice: { toString: () => '10' }
      }
    ];

    const mockContract = {
      getLotteryRounds: vi.fn().mockResolvedValue(mockRounds)
    };

    // Override the Contract constructor to return our mock
    (ethers.Contract as any).mockImplementation(() => mockContract);

    const rounds = await fetchLotteryRounds(
      mockContractAddress, 
      0, 
      10
    );

    expect(rounds.length).toBeGreaterThan(0);
    expect(rounds[0]).toHaveProperty('id');
    expect(rounds[0]).toHaveProperty('timestamp');
    expect(rounds[0]).toHaveProperty('potSize');
    expect(mockContract.getLotteryRounds).toHaveBeenCalledWith(0, 10);
  });

  it('handles error scenario', async () => {
    // Mock a contract call failure
    const mockError = new Error('Contract fetch failed');
    
    const mockContract = {
      getLotteryRounds: vi.fn().mockRejectedValue(mockError)
    };

    // Override the Contract constructor to return our mock
    (ethers.Contract as any).mockImplementation(() => mockContract);

    await expect(
      fetchLotteryRounds(mockContractAddress, 0, 10)
    ).rejects.toThrow('Contract fetch failed');

    expect(mockContract.getLotteryRounds).toHaveBeenCalledWith(0, 10);
  });
});