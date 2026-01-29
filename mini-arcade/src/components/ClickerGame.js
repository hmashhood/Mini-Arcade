import React, { useState, useEffect } from 'react';

function ClickerGame() {
  // --- State ---
  const [clicks, setClicks] = useState(0); // This is your currency
  const [totalClicks, setTotalClicks] = useState(0); // Lifetime stats
  const [pointers, setPointers] = useState(0); // Auto-clicker count
  const [pointerCost, setPointerCost] = useState(10); // Price increases each buy

  // --- Auto-Clicker Logic ---
  useEffect(() => {
    // If we have pointers, start a timer
    const interval = setInterval(() => {
      if (pointers > 0) {
        setClicks(c => c + pointers);
        setTotalClicks(tc => tc + pointers);
      }
    }, 1000); // Clicks once per second

    return () => clearInterval(interval);
  }, [pointers]);

  // --- Actions ---
  const handleClick = () => {
    setClicks(clicks + 1);
    setTotalClicks(totalClicks + 1);
  };

  const buyPointer = () => {
    if (clicks >= pointerCost) {
      setClicks(clicks - pointerCost); // Spend the currency
      setPointers(pointers + 1);      // Add the auto-clicker
      setPointerCost(Math.floor(pointerCost * 1.2)); // Increase price (standard cookie math)
    } else {
      alert("Not enough clicks!");
    }
  };

  return (
    <div style={{ display: 'flex', color: 'white', fontFamily: 'sans-serif', height: '400px' }}>
      
      {/* LEFT SIDE: THE CLICKER */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '2px solid #444' }}>
        <h2>{clicks} Clicks</h2>
        <p style={{ opacity: 0.6 }}>Total Earned: {totalClicks}</p>
        
        {/* The Circle Button */}
        <button 
          onClick={handleClick}
          style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%', // Makes it a circle
            border: '8px solid #f1c40f',
            background: 'radial-gradient(circle, #f39c12, #e67e22)',
            cursor: 'pointer',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
            transition: 'transform 0.1s'
          }}
          onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
        >
          CLICK ME
        </button>
      </div>

      {/* RIGHT SIDE: THE SHOP */}
      <div style={{ width: '200px', padding: '20px', background: 'rgba(0,0,0,0.2)' }}>
        <h3 style={{ borderBottom: '1px solid #666' }}>SHOP</h3>
        
        <div style={{ marginTop: '20px' }}>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Cursor Pointer</p>
          <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: '#f1c40f' }}>Cost: {pointerCost}</p>
          
          <button 
            onClick={buyPointer}
            disabled={clicks < pointerCost}
            style={{
              width: '100%',
              padding: '10px',
              cursor: clicks >= pointerCost ? 'pointer' : 'not-allowed',
              background: clicks >= pointerCost ? '#2ecc71' : '#7f8c8d',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            BUY (+1/sec)
          </button>
        </div>

        <div style={{ marginTop: '30px', opacity: 0.8 }}>
          <p>Inventory:</p>
          <div style={{ fontSize: '1.2rem' }}>🖱️ x{pointers}</div>
        </div>
      </div>

    </div>
  );
}

export default ClickerGame;