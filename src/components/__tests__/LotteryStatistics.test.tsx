import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LotteryStatistics } from '../LotteryStatistics';
import '@testing-library/jest-dom';

describe('LotteryStatistics Component', () => {
  const defaultProps = {
    totalPotSize: 10000,
    totalParticipants: 500
  };

  it('renders the component with basic statistics', () => {
    render(<LotteryStatistics {...defaultProps} />);
    
    const statisticsContainer = screen.getByTestId('lottery-statistics');
    expect(statisticsContainer).toBeInTheDocument();

    const totalPotSize = screen.getByTestId('total-pot-size');
    expect(totalPotSize).toHaveTextContent('$10,000.00');

    const totalParticipants = screen.getByTestId('total-participants');
    expect(totalParticipants).toHaveTextContent('500');
  });

  it('renders additional optional statistics', () => {
    render(
      <LotteryStatistics 
        {...defaultProps}
        averagePotSize={5000}
        totalRounds={10}
      />
    );

    const averagePotSize = screen.getByTestId('average-pot-size');
    expect(averagePotSize).toHaveTextContent('$5,000.00');

    const totalRounds = screen.getByTestId('total-rounds');
    expect(totalRounds).toHaveTextContent('10');
  });

  it('handles zero values gracefully', () => {
    render(
      <LotteryStatistics 
        totalPotSize={0}
        totalParticipants={0}
      />
    );

    const totalPotSize = screen.getByTestId('total-pot-size');
    expect(totalPotSize).toHaveTextContent('$0.00');

    const totalParticipants = screen.getByTestId('total-participants');
    expect(totalParticipants).toHaveTextContent('0');
  });
});