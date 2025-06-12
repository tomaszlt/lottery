import React from 'react';

export interface LotteryStatisticsProps {
  totalPotSize: number;
  totalParticipants: number;
  averagePotSize?: number;
  totalRounds?: number;
}

export const LotteryStatistics: React.FC<LotteryStatisticsProps> = ({
  totalPotSize,
  totalParticipants,
  averagePotSize,
  totalRounds = 0
}) => {
  // Handle edge cases
  const formattedPotSize = totalPotSize.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  return (
    <div className="lottery-statistics" data-testid="lottery-statistics">
      <h2>Lottery Statistics</h2>
      <div className="statistics-grid">
        <div className="statistic-item">
          <span className="statistic-label">Total Pot Size</span>
          <span className="statistic-value" data-testid="total-pot-size">
            {formattedPotSize}
          </span>
        </div>
        <div className="statistic-item">
          <span className="statistic-label">Total Participants</span>
          <span className="statistic-value" data-testid="total-participants">
            {totalParticipants}
          </span>
        </div>
        {averagePotSize !== undefined && (
          <div className="statistic-item">
            <span className="statistic-label">Average Pot Size</span>
            <span className="statistic-value" data-testid="average-pot-size">
              {averagePotSize.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
              })}
            </span>
          </div>
        )}
        {totalRounds > 0 && (
          <div className="statistic-item">
            <span className="statistic-label">Total Rounds</span>
            <span className="statistic-value" data-testid="total-rounds">
              {totalRounds}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LotteryStatistics;