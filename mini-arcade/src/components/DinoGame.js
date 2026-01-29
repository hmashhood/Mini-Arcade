import React, { useState, useEffect, useCallback } from 'react';

function DinoGame() {
  const [dinoY, setDinoY] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [cactusX, setCactusX] = useState(500);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScore, setHighScore] = useState(localStorage.getItem('dinoHighScore') || 0);

  const GRAVITY = 1.2;
  const JUMP_FORCE = -18;
  const GROUND_LEVEL = 0;

  const jump = useCallback(() => {
    if (!isJumping && !isGameOver) {
      setVelocity(JUMP_FORCE);
      setIsJumping(true);
    } else if (isGameOver) {
      // Reset Game
      setDinoY(0);
      setVelocity(0);
      setIsJumping(false);
      setCactusX(500);
      setScore(0);
      setIsGameOver(false);
    }
  }, [isJumping, isGameOver]);

  // Spacebar Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  // Game Loop
  useEffect(() => {
    let gameLoop;
    if (!isGameOver) {
      gameLoop = setInterval(() => {
        // 1. Apply Physics to Dino
        setDinoY((y) => {
          const nextY = y + velocity;
          if (nextY >= GROUND_LEVEL) {
            setIsJumping(false);
            return GROUND_LEVEL;
          }
          return nextY;
        });
        
        if (isJumping) {
          setVelocity((v) => v + GRAVITY);
        }

        // 2. Move Cactus
        setCactusX((x) => {
          if (x < -20) {
            setScore((s) => s + 1);
            return 500;
          }
          return x - 8; // Speed of cactus
        });

      }, 20);
    }
    return () => clearInterval(gameLoop);
  }, [isGameOver, isJumping, velocity]);

  // Collision Detection
  useEffect(() => {
    // Dino is roughly at X=50, width 40. Cactus is at CactusX, width 20.
    // We use a slightly smaller hitbox for the Dino (30px) to feel "fairer"
    const dinoHitbox = { bottom: dinoY, left: 50, right: 80 };
    
    if (cactusX < 80 && cactusX > 30 && dinoY > -30) {
      setIsGameOver(true);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('dinoHighScore', score);
      }
    }
  }, [dinoY, cactusX, isGameOver, score, highScore]);

  return (
    <div onClick={jump} style={{ 
      position: 'relative', width: '500px', height: '200px', 
      background: '#f7f7f7', margin: 'auto', overflow: 'hidden', 
      borderBottom: '2px solid #535353', cursor: 'pointer',
      backgroundColor: '#161718' 
    }}>
      <div style={{ position: 'absolute', top: 10, right: 20, color: 'white', fontSize: '1rem', textAlign: 'right' }}>
        <div>Score: {score}</div>
        <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>HI: {highScore}</div>
      </div>

      {/* Dino */}
      <div style={{ 
        position: 'absolute', bottom: `${-dinoY}px`, left: '50px', 
        width: '40px', height: '40px', background: '#535353',
        borderRadius: '4px', border: '2px solid white'
      }} />

      {/* Cactus */}
      <div style={{ 
        position: 'absolute', bottom: '0px', left: `${cactusX}px`, 
        width: '20px', height: '40px', background: '#ff4757',
        borderRadius: '2px'
      }} />

      {isGameOver && (
        <div style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', zIndex: 10
        }}>
          <h2 style={{ color: 'white' }}>GAME OVER</h2>
          <p style={{ color: 'white', fontSize: '0.9rem' }}>Press Space to Restart</p>
        </div>
      )}
    </div>
  );
}

export default DinoGame;