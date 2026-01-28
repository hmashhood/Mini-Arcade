//Dinosaur game similar to the one you find when you have no internet on google. 

import React, { useState, useEffect, useRef } from 'react';

function DinoGame (){
    const [isJumping, setIsJumping] = useState(false);
    const [points, setPoints] = useState(0)
    const cactusRef = useRef();
    const dinoRef = useRef();

    const jump = () => {
        if (!isJumping){
            setIsJumping(true);
            setTimeout(() => setIsJumping(false), 500);
        }
    };

useEffect(() => {
    const checkDead = setInterval(() => {
      let dinoTop = parseInt(window.getComputedStyle(dinoRef.current).getPropertyValue("top"));
      let cactusLeft = parseInt(window.getComputedStyle(cactusRef.current).getPropertyValue("left"));

      if (cactusLeft < 50 && cactusLeft > 0 && dinoTop >= 150) {
        alert("Game Over! Score: " + points);
        setPoints(0);
      } else {
        setPoints(s => s + 1);
      }
    }, 100);
    return () => clearInterval(checkDead);
  }, [points]);

  return (
    <div style={{ width: '500px', height: '200px', borderBottom: '2px solid white', position: 'relative', overflow: 'hidden', margin: 'auto' }} onClick={jump}>
      <div 
        ref={dinoRef} 
        style={{ width: '50px', height: '50px', backgroundColor: '#4CAF50', position: 'absolute', bottom: '0', left: '50px', top: isJumping ? '100px' : '150px', transition: 'top 0.2s' }} 
      />
      <div 
        ref={cactusRef} 
        style={{ width: '20px', height: '40px', backgroundColor: '#ff4757', position: 'absolute', bottom: '0', right: '-20px', animation: 'cactusMove 1.5s infinite linear' }} 
      />
      <h3 style={{ color: 'white' }}>Score: {points}</h3>
      <style>{`
        @keyframes cactusMove {
          0% { right: -20px; }
          100% { right: 500px; }
        }
      `}</style>
    </div>
  );
}

export default DinoGame;