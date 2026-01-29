// this is the snake gmae that people played on their old brick phones and the one you played in class but without all the extra attributes and changes.
import React, { useState, useEffect, useCallback, useRef } from 'react';

function SnakeGame() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 0, y: -1 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(localStorage.getItem('snakeHighScore') || 0);
  
  // Use a Ref for the next direction to prevent "Input Delay"
  const nextDirection = useRef({ x: 0, y: -1 });

  const GRID_SIZE = 20;

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
    setFood({ x: 5, y: 5 });
    setDirection({ x: 0, y: -1 });
    nextDirection.current = { x: 0, y: -1 };
    setScore(0);
    setIsGameOver(false);
  };

  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case "ArrowUp": if (direction.y === 0) nextDirection.current = { x: 0, y: -1 }; break;
      case "ArrowDown": if (direction.y === 0) nextDirection.current = { x: 0, y: 1 }; break;
      case "ArrowLeft": if (direction.x === 0) nextDirection.current = { x: -1, y: 0 }; break;
      case "ArrowRight": if (direction.x === 0) nextDirection.current = { x: 1, y: 0 }; break;
      case " ": if (isGameOver) resetGame(); break;
      default: break;
    }
  }, [direction, isGameOver]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const moveSnake = () => {
      if (isGameOver) return;

      setSnake((prev) => {
        const head = { x: prev[0].x + nextDirection.current.x, y: prev[0].y + nextDirection.current.y };
        setDirection(nextDirection.current);

        // Wall Collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setIsGameOver(true);
          return prev;
        }

        // Self Collision
        if (prev.some(segment => segment.x === head.x && segment.y === head.y)) {
          setIsGameOver(true);
          return prev;
        }

        const newSnake = [head, ...prev];

        // Food Collision
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 1);
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, 100); // Constant speed
    return () => clearInterval(gameLoop);
  }, [food, isGameOver]);

  useEffect(() => {
    if (isGameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score);
    }
  }, [isGameOver, score, highScore]);

  return (
    <div style={{ textAlign: 'center', color: 'white', fontFamily: 'Arial' }}>
      <div style={{ marginBottom: '10px', fontSize: '1.2rem' }}>
        Score: {score} | Best: {highScore}
      </div>
      
      <div style={{ 
        position: 'relative', width: '400px', height: '400px', 
        background: '#0e1111', border: '4px solid #333', margin: 'auto' 
      }}>
        {/* Snake Rendering */}
        {snake.map((segment, i) => {
          const isHead = i === 0;
          return (
            <div key={i} style={{
              position: 'absolute',
              left: `${segment.x * 20}px`,
              top: `${segment.y * 20}px`,
              width: '18px',
              height: '18px',
              background: isHead ? '#2ecc71' : '#27ae60', // Head is brighter green
              borderRadius: isHead ? '4px' : '2px', // Rounder head
              zIndex: isHead ? 2 : 1,
              border: '1px solid #0e1111' // Creates the "segment" look
            }}>
              {/* Eyes for the head to show direction */}
              {isHead && (
                <div style={{
                  position: 'absolute',
                  width: '4px', height: '4px', background: 'white',
                  top: '4px', left: direction.x === 1 ? '12px' : '2px',
                  borderRadius: '50%'
                }} />
              )}
            </div>
          );
        })}

        {/* Food Rendering */}
        <div style={{
          position: 'absolute',
          left: `${food.x * 20}px`, top: `${food.y * 20}px`,
          width: '18px', height: '18px', background: '#e74c3c',
          borderRadius: '50%', boxShadow: '0 0 10px #e74c3c'
        }} />

        {isGameOver && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center'
          }}>
            <h2 style={{ color: '#e74c3c' }}>CRASHED!</h2>
            <p>Press Space or click Back to Menu</p>
            <button onClick={resetGame} className="game-card" style={{ padding: '10px 20px' }}>Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SnakeGame;