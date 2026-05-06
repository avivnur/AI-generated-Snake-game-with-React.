import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc } from 'lucide-react';
import { TRACKS } from '../constants';

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            if (e.name === 'AbortError') {
              // Expected if pause() is called before play() finishes
              console.log("Audio play aborted (likely by user action or track change).");
            } else {
              console.error("Audio play failed:", e);
              setIsPlaying(false);
            }
          });
        }
      } else {
        audio.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? TRACKS.length - 1 : prev - 1));
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTime = (Number(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = seekTime;
      setProgress(Number(e.target.value));
    }
  };

  return (
    <div className="w-full bg-black border-4 border-[#ff00ff] shadow-[-8px_8px_0px_#00ffff] p-4 flex flex-col gap-4">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
        preload="auto"
      />

      {/* Header Info */}
      <div className="flex w-full justify-between items-center border-b-[3px] border-[#00ffff] pb-2">
        <div className="text-xl text-[#00ffff] animate-pulse">{'>> AUDIO_SYS.WAV'}</div>
        <div className={`text-[#ff00ff] ${isPlaying ? 'screen-tear' : ''}`}>
           {isPlaying ? '[PLAYING]' : '[PAUSED]'}
        </div>
      </div>

      {/* Track Info */}
      <div className="flex flex-col gap-2">
        <div className="text-2xl text-[#ff00ff] truncate font-bold uppercase drop-shadow-[2px_0px_0px_#00ffff]">
          {currentTrack.title}
        </div>
        <div className="text-lg text-[#00ffff] tracking-widest bg-[#ff00ff]/20 px-2 uppercase shadow-[2px_2px_0_#ff00ff] w-fit">
          INDEX: {String(currentTrackIndex).padStart(2, '0')}
        </div>
      </div>

      {/* Progress */}
      <div className="relative w-full h-8 border-2 border-[#ff00ff] bg-[#ff00ff]/10 group">
        <div 
          className="absolute top-0 left-0 h-full bg-[#00ffff] transition-all duration-100 mix-blend-screen"
          style={{ width: `${progress}%` }}
        />
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={progress || 0}
          onChange={handleSeek}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="absolute inset-0 flex items-center justify-between px-2 text-[#ff00ff] text-xl font-bold mix-blend-difference pointer-events-none">
           <span>00:00</span>
           <span>{(progress || 0).toFixed(1)}%</span>
        </div>
      </div>
        
      {/* Controls */}
      <div className="flex items-center justify-between mt-2 gap-2 bg-[#00ffff]/10 p-2 border-2 border-[#00ffff] shadow-[4px_4px_0_#ff00ff]">
        <button onClick={handlePrev} className="p-2 text-[#00ffff] hover:text-black hover:bg-[#00ffff] border-2 border-transparent hover:border-black transition-colors cursor-pointer uppercase font-bold text-xl">
          {'< PREV'}
        </button>
        
        <button 
          onClick={togglePlay} 
          className="px-6 py-2 bg-[#ff00ff] text-black font-bold border-2 border-transparent shadow-[4px_4px_0_#00ffff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#00ffff] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all cursor-pointer text-2xl uppercase"
        >
          {isPlaying ? 'PAUSE' : 'PLAY >'}
        </button>
        
        <button onClick={handleNext} className="p-2 text-[#00ffff] hover:text-black hover:bg-[#00ffff] border-2 border-transparent hover:border-black transition-colors cursor-pointer uppercase font-bold text-xl">
          {'NEXT >'}
        </button>

        <button onClick={() => setIsMuted(!isMuted)} className="p-2 ml-1 text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-colors cursor-pointer border-2 border-transparent hover:border-black">
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>

    </div>
  );
}
