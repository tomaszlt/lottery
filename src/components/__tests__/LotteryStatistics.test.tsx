import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LotteryStatistics } from '../LotteryStatistics';

// Polyfill for jsdom
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!doctype html><html><body></body></html>');
(global as any).document = dom.window.document;
(global as any).window = dom.window as unknown as Window & typeof globalThis;

describe('LotteryStatistics Component', () => {
  const defaultProps = {
    totalPotSize: 10000,
    totalParticipants: 500
  };

  it('renders the component with basic statistics', () => {
    render(<LotteryStatistics {...defaultProps} />);
    
    const statisticsContainer = screen.getByTestId('lottery-statistics');
    expect(statisticsContainer).toBeTruthy();

    const totalPotSize = screen.getByTestId('total-pot-size');
    expect(totalPotSize.textContent).toContain('$10,000.00');

    const totalParticipants = screen.getByTestId('total-participants');
    expect(totalParticipants.textContent).toBe('500');
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
    expect(averagePotSize.textContent).toContain('$5,000.00');

    const totalRounds = screen.getByTestId('total-rounds');
    expect(totalRounds.textContent).toBe('10');
  });

  it('handles zero values gracefully', () => {
    render(
      <LotteryStatistics 
        totalPotSize={0}
        totalParticipants={0}
      />
    );

    const totalPotSize = screen.getByTestId('total-pot-size');
    expect(totalPotSize.textContent).toBe('$0.00');

    const totalParticipants = screen.getByTestId('total-participants');
    expect(totalParticipants.textContent).toBe('0');
  });
});