import { 
  NoHistoryFoundError, 
  DataValidationError 
} from '../types/errors';

export interface LotteryRound {
  roundId: number;
  timestamp: number;
  participants: string[];
  potSize: number;
}

export function validateLotteryRounds(rounds: LotteryRound[]): LotteryRound[] {
  if (!rounds || rounds.length === 0) {
    throw new NoHistoryFoundError();
  }

  return rounds.map(round => {
    // Validate roundId
    if (typeof round.roundId !== 'number' || round.roundId < 0) {
      throw new DataValidationError(`Invalid roundId: ${round.roundId}`);
    }

    // Validate timestamp
    if (typeof round.timestamp !== 'number' || round.timestamp <= 0) {
      throw new DataValidationError(`Invalid timestamp: ${round.timestamp}`);
    }

    // Validate participants
    if (!Array.isArray(round.participants)) {
      throw new DataValidationError('Participants must be an array');
    }

    // Validate pot size
    if (typeof round.potSize !== 'number' || round.potSize < 0) {
      throw new DataValidationError(`Invalid pot size: ${round.potSize}`);
    }

    return round;
  });
}

export function safeFetchLotteryHistory(fetchFn: () => Promise<LotteryRound[]>): Promise<LotteryRound[]> {
  return fetchFn()
    .then(validateLotteryRounds)
    .catch(error => {
      console.error('Lottery history fetch error:', error);
      throw error;
    });
}