import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { useInterval } from '../hooks/useInterval';

type Point = { x: number; y: number };

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Check if food spawns on snake
    const onSnake = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
    if (!onSnake) break;
  }
  return newFood;
};

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(true); // Start paused
  const directionRef = useRef(direction);

  useEffect(() => {
    setFood(generateFood(INITIAL_SNAKE));
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;

    // Prevent default scrolling for arrow keys
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "w", "a", "s", "d"].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ' || e.key === 'Escape') {
      setIsPaused((p) => !p);
      return;
    }

    const { x: dx, y: dy } = directionRef.current;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (dy !== 1) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (dy !== -1) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (dx !== 1) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (dx !== -1) setDirection({ x: 1, y: 0 });
        break;
    }
  }, [gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const gameLoop = useCallback(() => {
    if (gameOver || isPaused) return;

    directionRef.current = direction;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { x: head.x + direction.x, y: head.y + direction.y };

      // Wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused]);

  // Use a slower speed as the game progresses
  const currentSpeed = Math.max(50, GAME_SPEED - Math.floor(score / 50) * 10);
  
  useInterval(gameLoop, gameOver || isPaused ? null : currentSpeed);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col w-full mx-auto border-4 border-[#00ffff] bg-black p-4 shadow-[8px_8px_0px_#ff00ff] relative">
      
      {/* Header */}
      <div className="flex w-full justify-between items-end mb-4 border-b-4 border-[#00ffff] pb-2">
        <h2 className="text-3xl font-bold uppercase tracking-widest text-[#00ffff] bg-[#ff00ff]/20 px-2 box-border border-2 border-[#00ffff] drop-shadow-[2px_2px_0_#ff00ff]">
          {'// SYS_SNAKE'}
        </h2>
        <div className="text-xl md:text-3xl font-bold text-[#ff00ff] drop-shadow-[2px_0_0_#00ffff]">
          SCORE: {score.toString().padStart(4, '0')}
        </div>
      </div>

      <div className="text-[#00ffff] text-xl uppercase animate-pulse mb-2 tracking-widest">
        STATUS: {gameOver ? 'FATAL_ERROR' : (isPaused ? 'IDLE' : 'EXECUTING...')}
      </div>

      {/* Game Board */}
      <div className="relative w-full aspect-square bg-black border-4 border-[#ff00ff] overflow-hidden">
        
        {/* The Grid itself for positioning with raw aesthetic */}
        <div 
          className="w-full h-full relative"
          style={{
            backgroundSize: `calc(100% / ${GRID_SIZE}) calc(100% / ${GRID_SIZE})`,
            backgroundImage: 'linear-gradient(to right, #00ffff22 1px, transparent 1px), linear-gradient(to bottom, #00ffff22 1px, transparent 1px)',
          }}
        >
          {/* Render Food (Magenta Glitch block) */}
          <div 
            className="absolute bg-[#ff00ff] shadow-[0_0_10px_#ff00ff] animate-pulse"
            style={{
              width: `calc(100% / ${GRID_SIZE})`,
              height: `calc(100% / ${GRID_SIZE})`,
              left: `${(food.x / GRID_SIZE) * 100}%`,
              top: `${(food.y / GRID_SIZE) * 100}%`,
            }}
          >
            <div className="w-full h-full border border-black bg-transparent mix-blend-color-burn" />
          </div>

          {/* Render Snake (Cyan blocks) */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className={`absolute ${
                  isHead 
                    ? 'bg-white z-10' 
                    : 'bg-[#00ffff] opacity-90'
                }`}
                style={{
                  width: `calc(100% / ${GRID_SIZE})`,
                  height: `calc(100% / ${GRID_SIZE})`,
                  left: `${(segment.x / GRID_SIZE) * 100}%`,
                  top: `${(segment.y / GRID_SIZE) * 100}%`,
                  boxShadow: isHead ? "0 0 10px #ffffff" : "inset 0 0 5px #000000"
                }}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {(gameOver || isPaused) && (
          <div className="absolute inset-0 bg-[#ff00ff]/20 backdrop-blur-[2px] flex flex-col items-center justify-center z-20 mix-blend-screen screen-tear p-4">
            <div className="bg-black border-4 border-[#00ffff] p-6 text-center shadow-[8px_8px_0_#ff00ff]">
              {gameOver ? (
                <>
                  <h3 className="text-4xl text-[#ff00ff] mb-4 font-bold glitch-text" data-text="GAME OVER">GAME OVER</h3>
                  <p className="text-[#00ffff] text-2xl mb-8 font-bold">ERR_SCORE: {score}</p>
                  <button 
                    onClick={resetGame}
                    className="px-6 py-2 bg-[#ff00ff] text-black font-bold uppercase border-4 border-black ring-2 ring-[#ff00ff] hover:bg-[#00ffff] hover:ring-[#00ffff] transition-colors cursor-pointer text-2xl"
                  >
                    REBOOT SYS
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-4xl text-[#00ffff] mb-8 font-bold glitch-text" data-text="AWAITING INPUT">AWAITING INPUT</h3>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="px-6 py-2 bg-[#00ffff] text-black font-bold uppercase border-4 border-black ring-2 ring-[#00ffff] hover:bg-[#ff00ff] hover:ring-[#ff00ff] transition-colors cursor-pointer text-2xl"
                  >
                    START_PROTOCOL (SPACE)
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls helper */}
      <div className="w-full mt-4 bg-[#00ffff]/10 border-2 border-[#00ffff] p-2 flex flex-col md:flex-row gap-4 justify-between items-center text-xl text-[#ff00ff] font-bold shadow-[4px_4px_0_#ff00ff] uppercase">
        <div className="flex gap-2 items-center">
          <span>INPUT MATRIX:</span>
          <span className="bg-black px-2 border-2 border-[#ff00ff] text-[#00ffff]">W</span>
          <span className="bg-black px-2 border-2 border-[#ff00ff] text-[#00ffff]">A</span>
          <span className="bg-black px-2 border-2 border-[#ff00ff] text-[#00ffff]">S</span>
          <span className="bg-black px-2 border-2 border-[#ff00ff] text-[#00ffff]">D</span>
        </div>
        <button 
          onClick={() => { if(!gameOver) setIsPaused(p => !p) }}
          className="bg-black border-2 border-[#00ffff] text-[#00ffff] px-4 hover:bg-[#ff00ff] hover:text-black hover:border-black transition-colors cursor-pointer"
        >
          {isPaused ? '> RESUME' : '|| PAUSE'} [SPACE]
        </button>
      </div>
    </div>
  );
}
