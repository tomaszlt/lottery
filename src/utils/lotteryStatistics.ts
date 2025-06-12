import { ethers } from 'ethers';
import { LotteryContract } from './lotteryContract';

export interface LotteryRoundStatistics {
  roundId: number;
  timestamp: Date;
  potSize: string;
  participants: number;
  winner: string | null;
}

export interface LotteryOverallStatistics {
  totalRounds: number;
  totalPotValue: string;
  averagePotSize: string;
  mostFrequentWinners: { [address: string]: number };
}

export class LotteryStatistics {
  private contract: LotteryContract;

  constructor(contract: LotteryContract) {
    this.contract = contract;
  }

  /**
   * Fetch statistics for a specific lottery round
   * @param roundId The ID of the lottery round
   * @returns Detailed statistics for the specified round
   */
  async getRoundStatistics(roundId: number): Promise<LotteryRoundStatistics> {
    try {
      const round = await this.contract.getLotteryRound(roundId);
      
      return {
        roundId,
        timestamp: new Date(round.timestamp.toNumber() * 1000),
        potSize: ethers.utils.formatEther(round.potSize),
        participants: round.participants.length,
        winner: round.winner !== ethers.constants.AddressZero ? round.winner : null
      };
    } catch (error) {
      console.error(`Error fetching round statistics for round ${roundId}:`, error);
      throw new Error(`Unable to retrieve statistics for round ${roundId}`);
    }
  }

  /**
   * Fetch overall lottery statistics
   * @returns Comprehensive lottery statistics
   */
  async getOverallStatistics(): Promise<LotteryOverallStatistics> {
    try {
      const totalRounds = await this.contract.getTotalRounds();
      const rounds = await Promise.all(
        Array.from({ length: totalRounds }, (_, i) => this.getRoundStatistics(i + 1))
      );

      const totalPotValue = rounds.reduce((sum, round) => 
        sum + parseFloat(round.potSize), 0
      );

      const winnerCounts: { [address: string]: number } = {};
      rounds.forEach(round => {
        if (round.winner) {
          winnerCounts[round.winner] = (winnerCounts[round.winner] || 0) + 1;
        }
      });

      return {
        totalRounds,
        totalPotValue: totalPotValue.toString(),
        averagePotSize: (totalPotValue / totalRounds).toFixed(4),
        mostFrequentWinners: winnerCounts
      };
    } catch (error) {
      console.error('Error fetching overall lottery statistics:', error);
      throw new Error('Unable to retrieve overall lottery statistics');
    }
  }
}

export default LotteryStatistics;