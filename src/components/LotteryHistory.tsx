import React, { useState, useEffect } from 'react';

// Define the structure of a lottery round
interface LotteryRound {
  id: number;
  date: string;
  potSize: number;
  winner?: string;
}

export const LotteryHistory: React.FC = () => {
  const [history, setHistory] = useState<LotteryRound[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLotteryHistory = async () => {
      try {
        // TODO: Replace with actual data fetching logic
        const mockHistory: LotteryRound[] = [
          { id: 1, date: '2023-06-01', potSize: 1000 },
          { id: 2, date: '2023-06-08', potSize: 1500 },
        ];
        
        setHistory(mockHistory);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch lottery history');
        setIsLoading(false);
      }
    };

    fetchLotteryHistory();
  }, []);

  if (isLoading) return <div>Loading history...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="lottery-history">
      <h2>Lottery History</h2>
      {history.length === 0 ? (
        <p>No lottery history available</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Round</th>
              <th>Date</th>
              <th>Pot Size</th>
            </tr>
          </thead>
          <tbody>
            {history.map((round) => (
              <tr key={round.id}>
                <td>{round.id}</td>
                <td>{round.date}</td>
                <td>${round.potSize}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LotteryHistory;