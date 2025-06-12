import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LotteryHistory from './LotteryHistory';

// Mock the useEffect and useState hooks
const mockSetState = vi.fn();
const mockUseState = (initialState: any) => [initialState, mockSetState];
const mockUseEffect = vi.fn();

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useState: vi.fn(mockUseState),
    useEffect: mockUseEffect
  };
});

describe('LotteryHistory Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
    mockUseEffect.mockImplementation((fn) => fn());
  });

  it('renders loading state initially', () => {
    vi.mocked(React.useState).mockReturnValueOnce([[], mockSetState])
      .mockReturnValueOnce([true, mockSetState])
      .mockReturnValueOnce([null, mockSetState]);

    render(<LotteryHistory />);
    expect(screen.getByTestId('loading-state')).toHaveTextContent('Loading history...');
  });

  it('renders error state when fetch fails', () => {
    vi.mocked(React.useState).mockReturnValueOnce([[], mockSetState])
      .mockReturnValueOnce([false, mockSetState])
      .mockReturnValueOnce(['Failed to fetch lottery history', mockSetState]);

    render(<LotteryHistory />);
    expect(screen.getByText('Error: Failed to fetch lottery history')).toBeInTheDocument();
  });

  it('renders lottery history table when data is available', () => {
    const mockHistory = [
      { id: 1, date: '2023-06-01', potSize: 1000 }
    ];

    vi.mocked(React.useState).mockReturnValueOnce([mockHistory, mockSetState])
      .mockReturnValueOnce([false, mockSetState])
      .mockReturnValueOnce([null, mockSetState]);

    render(<LotteryHistory />);
    
    expect(screen.getByText('Lottery History')).toBeInTheDocument();
    expect(screen.getByText('$1000')).toBeInTheDocument();
  });

  it('shows no history message when history is empty', () => {
    vi.mocked(React.useState).mockReturnValueOnce([[], mockSetState])
      .mockReturnValueOnce([false, mockSetState])
      .mockReturnValueOnce([null, mockSetState]);

    render(<LotteryHistory />);
    
    expect(screen.getByText('No lottery history available')).toBeInTheDocument();
  });
});