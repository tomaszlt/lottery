import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LotteryHistory from './LotteryHistory';

describe('LotteryHistory Component', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.resetAllMocks();
  });

  it('renders loading state initially', () => {
    // Use actual useState with mock initial values
    const useStateMock = vi.spyOn(React, 'useState');
    useStateMock.mockImplementationOnce(() => [[], vi.fn()])
      .mockImplementationOnce(() => [true, vi.fn()])
      .mockImplementationOnce(() => [null, vi.fn()]);

    render(<LotteryHistory />);
    
    // Find loading state with specific test id
    const loadingElement = screen.getByTestId('loading-state');
    expect(loadingElement).toHaveTextContent('Loading history...');

    // Restore original implementation
    useStateMock.mockRestore();
  });

  it('renders error state when fetch fails', () => {
    const useStateMock = vi.spyOn(React, 'useState');
    useStateMock.mockImplementationOnce(() => [[], vi.fn()])
      .mockImplementationOnce(() => [false, vi.fn()])
      .mockImplementationOnce(() => ['Failed to fetch lottery history', vi.fn()]);

    render(<LotteryHistory />);
    
    const errorElement = screen.getByText(/Failed to fetch lottery history/i);
    expect(errorElement).toBeInTheDocument();

    useStateMock.mockRestore();
  });

  it('renders lottery history table when data is available', () => {
    const mockHistory = [
      { id: 1, date: '2023-06-01', potSize: 1000 }
    ];

    const useStateMock = vi.spyOn(React, 'useState');
    useStateMock.mockImplementationOnce(() => [mockHistory, vi.fn()])
      .mockImplementationOnce(() => [false, vi.fn()])
      .mockImplementationOnce(() => [null, vi.fn()]);

    render(<LotteryHistory />);
    
    expect(screen.getByText('Lottery History')).toBeInTheDocument();
    expect(screen.getByText('$1000')).toBeInTheDocument();

    useStateMock.mockRestore();
  });

  it('shows no history message when history is empty', () => {
    const useStateMock = vi.spyOn(React, 'useState');
    useStateMock.mockImplementationOnce(() => [[], vi.fn()])
      .mockImplementationOnce(() => [false, vi.fn()])
      .mockImplementationOnce(() => [null, vi.fn()]);

    render(<LotteryHistory />);
    
    const noHistoryElement = screen.getByText('No lottery history available');
    expect(noHistoryElement).toBeInTheDocument();

    useStateMock.mockRestore();
  });
});