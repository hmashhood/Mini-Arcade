import React, { useState, useEffect, useCallback } from 'react';

function FlappyBird() {
  const [birdPosition, setBirdPosition] = useState(250);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState([{ x: 500, height: 200, passed: false }]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(localStorage.getItem('flappyHighScore') || 0);

  const GRAVITY = 0.6;
  const JUMP_STRENGTH = -8;
  const PIPE_SPEED = 4;
  const BIRD_LEFT = 50;
  const BIRD_SIZE = 30; // Slightly smaller hitbox for fairness
  const PIPE_WIDTH = 50;
  const GAP_HEIGHT = 160;

  const flap = useCallback(() => {
    if (!isGameOver) {
      setVelocity(JUMP_STRENGTH);
    } else {
      setBirdPosition(250);
      setVelocity(0);
      setPipes([{ x: 500, height: 200, passed: false }]);
      setScore(0);
      setIsGameOver(false);
    }
  }, [isGameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        flap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flap]);

  // Game Loop
  useEffect(() => {
    let animationFrame;
    const gameLoop = () => {
      if (!isGameOver) {
        setBirdPosition((pos) => pos + velocity);
        setVelocity((vel) => vel + GRAVITY);

        setPipes((prev) => {
          let newPipes = prev.map(p => ({ ...p, x: p.x - PIPE_SPEED }));

          // Score Logic: Check if bird passed the pipe
          newPipes = newPipes.map(p => {
            if (!p.passed && p.x + PIPE_WIDTH < BIRD_LEFT) {
              setScore(s => s + 1);
              return { ...p, passed: true };
            }
            return p;
          });

          // Spawn Logic
          if (newPipes.length > 0 && newPipes[newPipes.length - 1].x < 250) {
            newPipes.push({ 
              x: 500, 
              height: Math.random() * (400 - GAP_HEIGHT - 50) + 50, 
              passed: false 
            });
          }
          return newPipes.filter(p => p.x > -60);
        });

        animationFrame = requestAnimationFrame(gameLoop);
      }
    };
    animationFrame = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrame);
  }, [velocity, isGameOver]);

  // Tight Collision Detection
  useEffect(() => {
    if (birdPosition > 475 || birdPosition < 0) {
      setIsGameOver(true);
    }
    
    pipes.forEach(pipe => {
      // Check if bird is within the horizontal bounds of the pipe
      const birdRight = BIRD_LEFT + BIRD_SIZE;
      const pipeRight = pipe.x + PIPE_WIDTH;

      if (birdRight > pipe.x && BIRD_LEFT < pipeRight) {
        // Check if bird hit the top pipe OR bottom pipe
        if (birdPosition < pipe.height || birdPosition + BIRD_SIZE > pipe.height + GAP_HEIGHT) {
          setIsGameOver(true);
        }
      }
    });

    if (isGameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('flappyHighScore', score);
    }
  }, [birdPosition, pipes, isGameOver, score, highScore]);

  return (
    <div onClick={flap} style={{ 
      position: 'relative', width: '400px', height: '500px', 
      background: '#70c5ce', margin: 'auto', overflow: 'hidden', 
      border: '5px solid #333', cursor: 'pointer',
      backgroundColor: '#161718' 
    }}>
      <div style={{ position: 'absolute', top: 15, width: '100%', textAlign: 'center', color: 'white', zLong: 10 }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', textShadow: '2px 2px black' }}>{score}</div>
        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Best: {highScore}</div>
      </div>

      {/* Bird */}
      <div style={{ 
        position: 'absolute', top: birdPosition, left: `${BIRD_LEFT}px`, 
        width: `${BIRD_SIZE}px`, height: `${BIRD_SIZE}px`, background: '#f1c40f', 
        borderRadius: '50%', border: '2px solid #000',
        transform: `rotate(${velocity * 3}deg)`,
        transition: 'transform 0.1s',
        zIndex: 5
      }} />

      {pipes.map((pipe, i) => (
        <React.Fragment key={i}>
          {/* Top Pipe */}
          <div style={{ 
            position: 'absolute', top: 0, left: pipe.x, width: `${PIPE_WIDTH}px`, 
            height: pipe.height, background: '#2ecc71', borderBottom: '4px solid #27ae60',
            borderLeft: '2px solid black', borderRight: '2px solid black'
          }} />
          {/* Bottom Pipe */}
          <div style={{ 
            position: 'absolute', top: pipe.height + GAP_HEIGHT, left: pipe.x, 
            width: `${PIPE_WIDTH}px`, height: 500, background: '#2ecc71', 
            borderTop: '4px solid #27ae60', borderLeft: '2px solid black', 
            borderRight: '2px solid black'
          }} />
        </React.Fragment>
      ))}

      {isGameOver && (
        <div style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', zIndex: 15 
        }}>
          <h2 style={{ color: 'white', textShadow: '2px 2px black', fontSize: '2.5rem' }}>GAME OVER</h2>
          <p style={{ color: 'white' }}>Press Space to Restart</p>
        </div>
      )}
    </div>
  );
}

export default FlappyBird;