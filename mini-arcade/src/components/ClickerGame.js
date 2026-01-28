import React, { useState } from 'react';

function ClickerGame() {
  const [score, setScore] = useState(0);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Score: {score}</h2>
      <button 
        className="game-card" 
        style={{ backgroundColor: '#ff4757', fontSize: '2rem', padding: '50px' }}
        onClick={() => setScore(score + 1)}
      >
        CLICK ME!
      </button>
      <p>How fast can you click?</p>
    </div>
  );
}

export default ClickerGame;