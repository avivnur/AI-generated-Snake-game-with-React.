import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00ffff] font-mono relative flex flex-col items-center p-4 overflow-hidden selection:bg-[#ff00ff]/50 selection:text-white">
      
      {/* Glitch CRT Noise Filter */}
      <div className="static-noise mix-blend-screen mix-blend-lighten pointer-events-none" />
      
      {/* Background decorations */}
      <div className="absolute top-[10%] left-[5%] w-32 h-8 bg-[#ff00ff]/20 opacity-50 screen-tear pointer-events-none" />
      <div className="absolute top-[60%] right-[5%] w-48 h-12 bg-[#00ffff]/10 opacity-50 screen-tear pointer-events-none" />

      {/* Main Content wrapper */}
      <div className="relative z-10 w-full flex flex-col gap-6 max-w-4xl mx-auto mt-4 screen-tear">
        
        {/* Title / Hero section */}
        <div className="flex flex-col items-center gap-1 border-b-4 border-[#ff00ff] pb-6 bg-black z-10 relative shadow-[0_8px_0px_#00ffff]">
          <div className="text-xl uppercase tracking-widest text-black bg-[#ff00ff] mb-2 px-4 shadow-[4px_4px_0_#00ffff]">
            SYSTEM_PROTOCOL: ACTIVE
          </div>
          <h1 
            className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-[#00ffff] glitch-text drop-shadow-[2px_2px_0px_#ff00ff] text-center" 
            data-text="NEON_ARCADE.EXE"
          >
            NEON_ARCADE.EXE
          </h1>
          <p className="text-[#ff00ff] text-lg tracking-widest uppercase opacity-90 mt-2 bg-black px-2 mb-[-8px]">
            {'// AUDIO-VISUAL STIMULUS MATRIX ENABLED'}
          </p>
        </div>

        {/* Layout container */}
        <div className="flex flex-col md:flex-row gap-6 w-full items-start mt-4">
          {/* Game App */}
          <div className="w-full md:w-2/3">
            <SnakeGame />
          </div>

          {/* Music Player */}
          <div className="w-full md:w-1/3 border-l-4 border-[#00ffff] pl-0 md:pl-6 bg-black">
            <MusicPlayer />
          </div>
        </div>
      </div>
      
    </div>
  );
}

