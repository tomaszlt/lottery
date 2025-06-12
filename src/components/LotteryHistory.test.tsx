import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LotteryHistory from './LotteryHistory';

// Mock React's useState and useEffect
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useState: vi.fn(actual.useState),
    useEffect: vi.fn(actual.useEffect)
  };
});

describe('LotteryHistory Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
  });

  it('renders loading state initially', () => {
    vi.spyOn(React, 'useState')
      .mockImplementationOnce(() => [[], vi.fn()])
      .mockImplementationOnce(() => [true, vi.fn()])
      .mockImplementationOnce(() => [null, vi.fn()]);

    render(<LotteryHistory />);
    expect(screen.getByTestId('loading-state')).toHaveTextContent('Loading history...');
  });

  it('renders error state when fetch fails', () => {
    vi.spyOn(React, 'useState')
      .mockImplementationOnce(() => [[], vi.fn()])
      .mockImplementationOnce(() => [false, vi.fn()])
      .mockImplementationOnce(() => ['Failed to fetch lottery history', vi.fn()]);

    render(<LotteryHistory />);
    expect(screen.getByTestId('error-state')).toHaveTextContent('Error: Failed to fetch lottery history');
  });

  it('renders lottery history table when data is available', () => {
    const mockHistory = [
      { id: 1, date: '2023-06-01', potSize: 1000 }
    ];

    vi.spyOn(React, 'useState')
      .mockImplementationOnce(() => [mockHistory, vi.fn()])
      .mockImplementationOnce(() => [false, vi.fn()])
      .mockImplementationOnce(() => [null, vi.fn()]);

    render(<LotteryHistory />);
    
    expect(screen.getByText('Lottery History')).toBeInTheDocument();
    expect(screen.getByText('$1000')).toBeInTheDocument();
  });

  it('shows no history message when history is empty', () => {
    vi.spyOn(React, 'useState')
      .mockImplementationOnce(() => [[], vi.fn()])
      .mockImplementationOnce(() => [false, vi.fn()])
      .mockImplementationOnce(() => [null, vi.fn()]);

    render(<LotteryHistory />);
    
    expect(screen.getByTestId('no-history')).toHaveTextContent('No lottery history available');
  });
});