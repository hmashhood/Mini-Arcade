import React, { useState, useEffect, useCallback, useRef } from 'react';

function HeroGame() {
  // ---------------------------------------------------------
  // 1. STATE MANAGEMENT
  // ---------------------------------------------------------
  const [gameState, setGameState] = useState('menu'); // Tracks: 'menu', 'playing', 'gameOver'
  const [heroColor, setHeroColor] = useState('#f1c40f'); // Stores player's chosen color
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(localStorage.getItem('heroHighScore') || 0);
  const [health, setHealth] = useState(3);
  const [isAttacking, setIsAttacking] = useState(false);
  const [facing, setFacing] = useState('down'); // Tracks aim direction for sword arcs

  // ---------------------------------------------------------
  // 2. REFS (For high-performance physics/logic)
  // ---------------------------------------------------------
  const heroPos = useRef({ x: 200, y: 200 });
  const enemyPos = useRef({ x: 50, y: 50 });
  const treasurePos = useRef({ x: 300, y: 300 });
  const keysPressed = useRef({}); // Tracks held keys to allow smooth response
  const isEnemyDead = useRef(false);
  const [, setTick] = useState(0); // Forces React to re-render the screen each frame

  // ---------------------------------------------------------
  // 3. GAME CONSTANTS
  // ---------------------------------------------------------
  const MAP_SIZE = 400;
  const HERO_SIZE = 30;
  const STEP = 4;           // Player move speed
  const ENEMY_SPEED = 0.8;  // Slower than player for fairness
  const SWORD_REACH = 45;   // Extended hitbox for sensitive combat

  // ---------------------------------------------------------
  // 4. ACTION FUNCTIONS
  // ---------------------------------------------------------
  
  // Triggers the sword swing state
  const attack = useCallback(() => {
    if (gameState !== 'playing' || isAttacking) return;
    setIsAttacking(true);
    // Sword stays active for 250ms (matches CSS animation timing)
    setTimeout(() => setIsAttacking(false), 250);
  }, [gameState, isAttacking]);

  // Initializes game variables when a color is picked
  const startGame = (color) => {
    setHeroColor(color);
    setGameState('playing');
    setHealth(3);
    setScore(0);
    heroPos.current = { x: 200, y: 200 };
    enemyPos.current = { x: 50, y: 50 };
    isEnemyDead.current = false;
  };

  // ---------------------------------------------------------
  // 5. KEYBOARD LISTENERS
  // ---------------------------------------------------------
  useEffect(() => {
    const handleDown = (e) => {
      keysPressed.current[e.code] = true;
      if (e.code === "Space") { e.preventDefault(); attack(); }
    };
    const handleUp = (e) => delete keysPressed.current[e.code];
    
    window.addEventListener("keydown", handleDown);
    window.addEventListener("keyup", handleUp);
    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keyup", handleUp);
    };
  }, [attack]);

  // Sync High Score to LocalStorage whenever score changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('heroHighScore', score);
    }
  }, [score, highScore]);

  // ---------------------------------------------------------
  // 6. MAIN GAME LOOP (Physics & Collision)
  // ---------------------------------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState !== 'playing') return; // Pause physics if in menu or game over

      // A. Player Movement Logic (Axis-Locked/Non-Diagonal)
      if (keysPressed.current["ArrowUp"]) { heroPos.current.y -= STEP; setFacing('up'); }
      else if (keysPressed.current["ArrowDown"]) { heroPos.current.y += STEP; setFacing('down'); }
      else if (keysPressed.current["ArrowLeft"]) { heroPos.current.x -= STEP; setFacing('left'); }
      else if (keysPressed.current["ArrowRight"]) { heroPos.current.x += STEP; setFacing('right'); }

      // B. Map Boundaries (Collision with walls)
      heroPos.current.x = Math.max(0, Math.min(MAP_SIZE - HERO_SIZE, heroPos.current.x));
      heroPos.current.y = Math.max(0, Math.min(MAP_SIZE - HERO_SIZE, heroPos.current.y));

      const h = heroPos.current;
      const t = treasurePos.current;

      // C. Treasure Collision (1 point)
      if (h.x < t.x + 20 && h.x + HERO_SIZE > t.x && h.y < t.y + 20 && h.y + HERO_SIZE > t.y) {
        setScore(s => s + 1);
        treasurePos.current = { x: Math.random() * 350, y: Math.random() * 350 };
      }

      // D. Enemy AI & Combat Logic
      if (!isEnemyDead.current) {
        const dx = h.x - enemyPos.current.x;
        const dy = h.y - enemyPos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Simple chase logic
        if (distance > 1) {
          enemyPos.current.x += (dx / distance) * ENEMY_SPEED;
          enemyPos.current.y += (dy / distance) * ENEMY_SPEED;
        }

        const e = enemyPos.current;
        let swordHit = false;

        // E. Sword Hitbox Calculation (Directional sensitivity)
        if (isAttacking) {
          const sBox = { l: h.x, r: h.x + HERO_SIZE, t: h.y, b: h.y + HERO_SIZE };
          if (facing === 'up') sBox.t -= SWORD_REACH;
          if (facing === 'down') sBox.b += SWORD_REACH;
          if (facing === 'left') sBox.l -= SWORD_REACH;
          if (facing === 'right') sBox.r += SWORD_REACH;

          // Check if Sword Hitbox overlaps Enemy
          if (sBox.l < e.x + 30 && sBox.r > e.x && sBox.t < e.y + 30 && sBox.b > e.y) {
            swordHit = true;
          }
        }

        if (swordHit) {
          isEnemyDead.current = true;
          enemyPos.current = { x: -500, y: -500 }; // Despawn enemy
          setScore(s => s + 100); // 100 Points for kill
          setTimeout(() => {
            enemyPos.current = { x: Math.random() * 350, y: Math.random() * 350 };
            isEnemyDead.current = false;
          }, 3000); // 3 second respawn
        } else if (h.x < e.x + 30 && h.x + HERO_SIZE > e.x && h.y < e.y + 30 && h.y + HERO_SIZE > e.y) {
          // F. Player Damage Collision
          setHealth(prev => {
            if (prev <= 1) setGameState('gameOver');
            return prev - 1;
          });
          heroPos.current = { x: 200, y: 200 }; // Reset position on hit
        }
      }
      setTick(tick => tick + 1); // Trigger render
    }, 16);

    return () => clearInterval(interval);
  }, [gameState, isAttacking, facing]);

  // ---------------------------------------------------------
  // 7. DYNAMIC STYLING (The "Angled" Sword Logic)
  // ---------------------------------------------------------
  const getSwordStyle = () => {
    const base = { position: 'absolute', background: 'silver', border: '1px solid #333', zIndex: 11 };
    
    // transformOrigin makes the sword rotate from the hero's hand (the pivot)
    if (facing === 'up') return { ...base, width: '8px', height: '45px', bottom: '25px', left: '11px', transformOrigin: 'bottom center', animationName: 'sword-swing-up' };
    if (facing === 'down') return { ...base, width: '8px', height: '45px', top: '25px', left: '11px', transformOrigin: 'top center', animationName: 'sword-swing-down' };
    if (facing === 'left') return { ...base, width: '45px', height: '8px', right: '25px', top: '11px', transformOrigin: 'right center', animationName: 'sword-swing-left' };
    if (facing === 'right') return { ...base, width: '45px', height: '8px', left: '25px', top: '11px', transformOrigin: 'left center', animationName: 'sword-swing-right' };
    return base;
  };

  // ---------------------------------------------------------
  // 8. RENDER: START MENU
  // ---------------------------------------------------------
  if (gameState === 'menu') {
    return (
      <div style={{ textAlign: 'center', color: 'white', padding: '20px' }}>
        <h2 style={{ letterSpacing: '2px' }}>SELECT YOUR HERO</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
          {/* Centered text in 100px Squares using Flexbox */}
          <button onClick={() => startGame('#ff4757')} style={{ background: '#ff4757', width: '100px', height: '100px', borderRadius: '8px', border: '3px solid white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>RED</button>
          <button onClick={() => startGame('#1e90ff')} style={{ background: '#1e90ff', width: '100px', height: '100px', borderRadius: '8px', border: '3px solid white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>BLUE</button>
          <button onClick={() => startGame('#f1c40f')} style={{ background: '#f1c40f', width: '100px', height: '100px', borderRadius: '8px', border: '3px solid white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 'bold' }}>YELLOW</button>
        </div>
        
        {/* Opponent Preview */}
        <div style={{ marginTop: '40px', borderTop: '1px solid #555', paddingTop: '20px' }}>
          <p style={{ opacity: 0.8 }}>VERSUS</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
             <div style={{ background: '#8e44ad', width: '60px', height: '60px', borderRadius: '4px', border: '2px solid #4b0082', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>FOE</div>
             <p style={{ color: '#8e44ad', fontWeight: 'bold' }}>The Purple Guard</p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // 9. RENDER: GAMEPLAY SCREEN
  // ---------------------------------------------------------
  return (
    <div style={{ textAlign: 'center', color: 'white' }}>
      <div style={{ marginBottom: '10px' }}>
        <div style={{ fontSize: '1.5rem' }}>{Array(health).fill("❤️").join(" ")}</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Score: {score} | Best: {highScore}</div>
      </div>
      
      {/* Game Stage */}
      <div style={{ position: 'relative', width: '400px', height: '400px', background: '#2d5a27', margin: 'auto', border: '6px solid #1a3c18', borderRadius: '4px' }}>
        
        {/* Player Character */}
        <div style={{ position: 'absolute', left: heroPos.current.x, top: heroPos.current.y, width: '30px', height: '30px', background: heroColor, border: '2px solid white', zIndex: 10 }}>
          {/* Sword Element (only renders when attacking) */}
          {isAttacking && <div className="sword-swing" style={getSwordStyle()} />}
        </div>

        {/* Purple Enemy */}
        {!isEnemyDead.current && (
          <div style={{ position: 'absolute', left: enemyPos.current.x, top: enemyPos.current.y, width: '30px', height: '30px', background: '#8e44ad', borderRadius: '4px', border: '2px solid #4b0082' }} />
        )}

        {/* Treasure Coin */}
        <div style={{ position: 'absolute', left: treasurePos.current.x, top: treasurePos.current.y, width: '20px', height: '20px', background: 'gold', borderRadius: '50%', border: '2px solid #b7950b' }} />

        {/* Game Over Overlay */}
        {gameState === 'gameOver' && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 20 }}>
            <h2>GAME OVER</h2>
            <p>Score: {score}</p>
            <button className="game-card" onClick={() => setGameState('menu')}>RETRY</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HeroGame;