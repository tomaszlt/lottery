import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LotteryHistory from './LotteryHistory';

describe('LotteryHistory Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.restoreAllMocks();
  });

  it('renders loading state initially', async () => {
    // Mock useState to return initial loading state
    vi.spyOn(React, 'useState').mockImplementationOnce(() => [[], vi.fn()])
      .mockImplementationOnce(() => [true, vi.fn()])
      .mockImplementationOnce(() => [null, vi.fn()]);

    // Mock useEffect to simulate async behavior
    vi.spyOn(React, 'useEffect').mockImplementation(() => {});

    render(<LotteryHistory />);
    
    expect(screen.getByTestId('loading-state')).toHaveTextContent('Loading history...');
  });

  it('renders error state when fetch fails', async () => {
    // Mock useState to return error state
    vi.spyOn(React, 'useState').mockImplementationOnce(() => [[], vi.fn()])
      .mockImplementationOnce(() => [false, vi.fn()])
      .mockImplementationOnce(() => ['Failed to fetch lottery history', vi.fn()]);

    // Mock useEffect to simulate async behavior
    vi.spyOn(React, 'useEffect').mockImplementation(() => {});

    render(<LotteryHistory />);
    
    expect(screen.getByText('Error: Failed to fetch lottery history')).toBeInTheDocument();
  });

  it('renders lottery history table when data is available', async () => {
    const mockHistory = [
      { id: 1, date: '2023-06-01', potSize: 1000 }
    ];

    // Mock useState to return history state
    vi.spyOn(React, 'useState').mockImplementationOnce(() => [mockHistory, vi.fn()])
      .mockImplementationOnce(() => [false, vi.fn()])
      .mockImplementationOnce(() => [null, vi.fn()]);

    // Mock useEffect to simulate async behavior
    vi.spyOn(React, 'useEffect').mockImplementation(() => {});

    render(<LotteryHistory />);
    
    expect(screen.getByText('Lottery History')).toBeInTheDocument();
    expect(screen.getByText('$1000')).toBeInTheDocument();
  });

  it('shows no history message when history is empty', async () => {
    // Mock useState to return empty history state
    vi.spyOn(React, 'useState').mockImplementationOnce(() => [[], vi.fn()])
      .mockImplementationOnce(() => [false, vi.fn()])
      .mockImplementationOnce(() => [null, vi.fn()]);

    // Mock useEffect to simulate async behavior
    vi.spyOn(React, 'useEffect').mockImplementation(() => {});

    render(<LotteryHistory />);
    
    expect(screen.getByText('No lottery history available')).toBeInTheDocument();
  });
});