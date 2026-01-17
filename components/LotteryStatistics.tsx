import React from 'react';
import { useLotteryStatistics } from '../hooks/useLotteryStatistics';
import { ethers } from 'ethers';

export const LotteryStatistics: React.FC = () => {
  const { statistics, isLoading, error } = useLotteryStatistics();

  const formatBigNumber = (bn: ethers.BigNumber) => {
    return ethers.utils.formatEther(bn);
  };

  if (isLoading) {
    return <div>Loading statistics...</div>;
  }

  if (error) {
    return <div>Error loading statistics: {error.message}</div>;
  }

  if (!statistics) {
    return <div>No statistics available</div>;
  }

  return (
    <div>
      <h2>Lottery Statistics</h2>
      <table>
        <tbody>
          <tr>
            <td>Total Rounds:</td>
            <td>{statistics.totalRounds}</td>
          </tr>
          <tr>
            <td>Total Prize Pool:</td>
            <td>{formatBigNumber(statistics.totalPrizePool)} ETH</td>
          </tr>
          <tr>
            <td>Average Prize Pool:</td>
            <td>{formatBigNumber(statistics.averagePrizePool)} ETH</td>
          </tr>
          <tr>
            <td>Total Participants:</td>
            <td>{statistics.totalParticipants}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};