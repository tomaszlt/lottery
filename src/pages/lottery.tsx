import React from 'react';
import LotteryHistory from '../components/LotteryHistory';

const LotteryPage: React.FC = () => {
  return (
    <div className="lottery-page">
      {/* Existing lottery components */}
      <div className="lottery-main-content">
        {/* Placeholder for lottery entry/main functionality */}
        <h1>Lottery</h1>
      </div>
      
      {/* Integrated Lottery History Component */}
      <LotteryHistory />
    </div>
  );
};

export default LotteryPage;