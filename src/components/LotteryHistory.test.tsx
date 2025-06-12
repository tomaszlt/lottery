import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LotteryHistory from './LotteryHistory';

describe('LotteryHistory Component', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.resetAllMocks();
  });

  it('renders loading state initially', async () => {
    // Mock useState to return initial loading state
    vi.spyOn(React, 'useState').mockImplementation((initialState: any) => {
      if (initialState === true) return [true, vi.fn()];
      return [initialState, vi.fn()];
    });

    // Mock useEffect
    vi.spyOn(React, 'useEffect').mockImplementation(() => {});

    render(<LotteryHistory />);
    
    expect(screen.getByTestId('loading-state')).toHaveTextContent('Loading history...');
  });

  it('renders error state when fetch fails', async () => {
    // Prepare the mock states
    const mockSetError = vi.fn();
    const mockSetLoading = vi.fn();

    // Mock useState to return error state
    vi.spyOn(React, 'useState')
      .mockImplementationOnce(() => [[], vi.fn()])  // history
      .mockImplementationOnce(() => [false, mockSetLoading])  // isLoading
      .mockImplementationOnce(() => ['Failed to fetch lottery history', mockSetError]); // error

    // Mock useEffect to simulate error
    vi.spyOn(React, 'useEffect').mockImplementation((fn) => {
      fn();
    });

    render(<LotteryHistory />);
    
    await waitFor(() => {
      const errorElement = screen.getByText(/Failed to fetch lottery history/i);
      expect(errorElement).toBeInTheDocument();
    });
  });

  it('renders lottery history table when data is available', async () => {
    const mockHistory = [
      { id: 1, date: '2023-06-01', potSize: 1000 }
    ];

    // Mock useState to return data state
    vi.spyOn(React, 'useState')
      .mockImplementationOnce(() => [mockHistory, vi.fn()])  // history
      .mockImplementationOnce(() => [false, vi.fn()])  // isLoading
      .mockImplementationOnce(() => [null, vi.fn()]); // error

    // Mock useEffect 
    vi.spyOn(React, 'useEffect').mockImplementation((fn) => {
      fn();
    });

    render(<LotteryHistory />);
    
    await waitFor(() => {
      expect(screen.getByText('Lottery History')).toBeInTheDocument();
      expect(screen.getByText('$1000')).toBeInTheDocument();
    });
  });

  it('shows no history message when history is empty', async () => {
    // Mock useState to return empty history state
    vi.spyOn(React, 'useState')
      .mockImplementationOnce(() => [[], vi.fn()])  // history
      .mockImplementationOnce(() => [false, vi.fn()])  // isLoading
      .mockImplementationOnce(() => [null, vi.fn()]); // error

    // Mock useEffect 
    vi.spyOn(React, 'useEffect').mockImplementation((fn) => {
      fn();
    });

    render(<LotteryHistory />);
    
    await waitFor(() => {
      const noHistoryElement = screen.getByText('No lottery history available');
      expect(noHistoryElement).toBeInTheDocument();
    });
  });
});