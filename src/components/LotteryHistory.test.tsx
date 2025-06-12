import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
  it('renders loading state initially', () => {
    render(<LotteryHistory />);
    expect(screen.getByText('Loading history...')).toBeTruthy();
  });

  it('renders error state when fetch fails', () => {
    vi.spyOn(React, 'useState').mockImplementationOnce(() => [
      [],
      vi.fn()
    ]).mockImplementationOnce(() => [true, vi.fn()])
    .mockImplementationOnce(() => ['Failed to fetch lottery history', vi.fn()]);

    render(<LotteryHistory />);
    expect(screen.getByText('Error: Failed to fetch lottery history')).toBeTruthy();
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
    
    expect(screen.getByText('Lottery History')).toBeTruthy();
    expect(screen.getByText('$1000')).toBeTruthy();
  });

  it('shows no history message when history is empty', () => {
    vi.spyOn(React, 'useState')
      .mockImplementationOnce(() => [[], vi.fn()])
      .mockImplementationOnce(() => [false, vi.fn()])
      .mockImplementationOnce(() => [null, vi.fn()]);

    render(<LotteryHistory />);
    
    expect(screen.getByText('No lottery history available')).toBeTruthy();
  });
});