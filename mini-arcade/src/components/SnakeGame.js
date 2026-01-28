// this is the snake gmae that people played on their old brick phones and the one you played in class but without all the extra attributes and changes.
import React, { useState, useEffect, useCallback } from 'react';

const SnakeGame = () => {
  // The snake is an array of coordinates. [0] is the head.
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 0, y: -1 }); // Moving UP by default
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Logic to move the snake
  const moveSnake = useCallback(() => {
    if (gameOver) return;

    const newSnake = [...snake];
    const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

    // 1. Check if hit wall
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
      setGameOver(true);
      return;
    }

    // 2. Check if hit self
    for (let segment of newSnake) {
      if (head.x === segment.x && head.y === segment.y) {
        setGameOver(true);
        return;
      }
    }

    newSnake.unshift(head); // Add new head

    // 3. Check if ate food
    if (head.x === food.x && head.y === food.y) {
      setScore(s => s + 10);
      setFood({
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20)
      });
    } else {
      newSnake.pop(); // Remove tail if no food eaten
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver]);

  // Handle Keyboard Arrow Keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp": if (direction.y !== 1) setDirection({ x: 0, y: -1 }); break;
        case "ArrowDown": if (direction.y !== -1) setDirection({ x: 0, y: 1 }); break;
        case "ArrowLeft": if (direction.x !== 1) setDirection({ x: -1, y: 0 }); break;
        case "ArrowRight": if (direction.x !== -1) setDirection({ x: 1, y: 0 }); break;
        default: break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    const gameLoop = setInterval(moveSnake, 150); // Speed of the snake
    
    return () => {
      clearInterval(gameLoop);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [moveSnake, direction]);

  return (
    <div style={{ textAlign: 'center', color: 'white' }}>
      <h3>Score: {score}</h3>
      {gameOver && <h2 style={{ color: '#ff4757' }}>GAME OVER!</h2>}
      
      <div style={{ 
        position: 'relative', 
        width: '400px', 
        height: '400px', 
        background: '#1a1a1a', 
        border: '2px solid #4CAF50', 
        margin: '20px auto' 
      }}>
        {/* Render Snake */}
        {snake.map((segment, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${segment.x * 20}px`,
            top: `${segment.y * 20}px`,
            width: '18px',
            height: '18px',
            background: i === 0 ? '#4CAF50' : '#45a049', // Head is brighter
            borderRadius: '2px'
          }} />
        ))}

        {/* Render Food */}
        <div style={{
          position: 'absolute',
          left: `${food.x * 20}px`,
          top: `${food.y * 20}px`,
          width: '18px',
          height: '18px',
          background: '#ff4757',
          borderRadius: '50%'
        }} />
      </div>
      <p>Use Arrow Keys to Move</p>
    </div>
  );
};

export default SnakeGame;