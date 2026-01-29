import React, { useState } from 'react'; // Added { useState }
import ClickerGame from './components/ClickerGame'; // import your game by using one of your own files
import DinoGame from './components/DinoGame'; // again you are using somthing from the components file you made
import SnakeGame from './components/SnakeGame'; // again you are using something from your "components" file to play a game you programmed
import FappyBird from './components/FlappyBird'; // again you are using something from your "components" file to play a game you programmed
import HeroGame from './components/HeroGame'; // again you are using something from your "components" file to play a game you programmed -- hero game


import './App.css';
import FlappyBird from './components/FlappyBird';

function App() {
  // This state tracks which game is active. "" means we are on the menu.
  const [activeGame, setActiveGame] = useState("");

  // Function to go back to the menu
  const goBack = () => setActiveGame("");

  // If a game is active, show the game screen instead of the menu
  if (activeGame === "Clicker") {
    return (
      <div className="App">
        <h1>Clicker Game</h1>
        {/* This button takes us back  to the home thingy */}
        <button className="game-card" onClick={goBack} style={{marginBottom: '20px'}}>
          Back to Menu
        </button>
        <div className="game-container">
           {/* THIS IS THE IMPORTANT PART: */}
           <ClickerGame /> 
        </div>
      </div>
    );
  }
  else if (activeGame === "Dino"){
    return (
      <div className = "App">
        <h1>Dinosaur Runner</h1>
        <button className = "game-card" onClick ={goBack} style = {{marginBottom: '20px'}}> Back to Menu </button>
        
        <div className = "game-container">
          <DinoGame />
          </div>
        </div>
    );
  }
// snake game else if statement
  else if (activeGame === "Snake"){
    return (
    <div className = 'App'>
      <h1>Classic Snake</h1>
      <button className = "game-card" onClick = {goBack} style = {{marginBottom: '20px'}}> Back to Menu </button>
      <div className = "game-container">
        <SnakeGame />
      </div>
    </div>
    );
  }
// flappy bird game else if statement
  else if (activeGame === "Flappy") {
    return (
      <div className="App" style={{ backgroundColor: '#1a1a1a', minHeight: '100vh', color: 'white' }}>
        <h1>Flappy Bird</h1>
        {/* Centering Wrapper */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <button className="game-card" onClick={goBack}>
            Back to Menu
          </button>
        </div>
        <div className="game-container">
           <FlappyBird /> 
        </div>
      </div>
    );
  }
// hero game else if statement
  else if (activeGame === "Hero"){
    return (
    <div className = 'App'>
      <h1>Hero Game</h1>
      <button className = "game-card" onClick = {goBack} style = {{marginBottom: '20px'}}> Back to Menu </button>
      <div className = "game-container">
        <HeroGame />
      </div>
    </div>
    );
  }

  // Otherwise, show the main menu
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the Mini-Arcade</h1>
        <p>Select a Game to Start Playing!</p>

        <div className="game-grid">
          {/* We add onClick to the buttons now */}
          <button className="game-card" onClick={() => setActiveGame("Snake")}>Snake</button>
          <button className="game-card" onClick={() => setActiveGame("Flappy")}>Flappy Bird</button>
          <button className="game-card" onClick={() => setActiveGame("Dino")}>Dino Game</button>
          <button className="game-card" onClick={() => setActiveGame("Hero")}>Hero Game</button>
          <button className="game-card" onClick={() => setActiveGame("Clicker")}>Clicker Game</button>
        </div>
      </header>
    </div>
  );
}

export default App;