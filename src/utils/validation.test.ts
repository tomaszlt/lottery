import { describe, expect, it } from 'vitest';
import { 
  validateLotteryRounds, 
  safeFetchLotteryHistory, 
  LotteryRound 
} from './validation';
import { 
  NoHistoryFoundError, 
  DataValidationError 
} from '../types/errors';

describe('Lottery History Validation', () => {
  const validRounds: LotteryRound[] = [
    {
      roundId: 1,
      timestamp: Date.now(),
      participants: ['0x123', '0x456'],
      potSize: 100
    }
  ];

  it('should validate correct lottery rounds', () => {
    const result = validateLotteryRounds(validRounds);
    expect(result).toEqual(validRounds);
  });

  it('should throw NoHistoryFoundError for empty rounds', () => {
    expect(() => validateLotteryRounds([])).toThrow(NoHistoryFoundError);
    expect(() => validateLotteryRounds([])).toThrow('No lottery history records found');
  });

  it('should throw DataValidationError for invalid roundId', () => {
    const invalidRounds = [{ ...validRounds[0], roundId: -1 }];
    expect(() => validateLotteryRounds(invalidRounds)).toThrow(DataValidationError);
  });

  it('should throw DataValidationError for invalid timestamp', () => {
    const invalidRounds = [{ ...validRounds[0], timestamp: -1 }];
    expect(() => validateLotteryRounds(invalidRounds)).toThrow(DataValidationError);
  });

  it('should throw DataValidationError for invalid participants', () => {
    const invalidRounds = [{ ...validRounds[0], participants: null as any }];
    expect(() => validateLotteryRounds(invalidRounds)).toThrow(DataValidationError);
  });

  it('should throw DataValidationError for invalid pot size', () => {
    const invalidRounds = [{ ...validRounds[0], potSize: -1 }];
    expect(() => validateLotteryRounds(invalidRounds)).toThrow(DataValidationError);
  });

  it('should handle safe fetch with valid data', async () => {
    const mockFetch = async () => validRounds;
    const result = await safeFetchLotteryHistory(mockFetch);
    expect(result).toEqual(validRounds);
  });

  it('should handle safe fetch with error', async () => {
    const mockFetch = async () => { throw new Error('Fetch failed'); };
    await expect(safeFetchLotteryHistory(mockFetch)).rejects.toThrow('Fetch failed');
  });
});