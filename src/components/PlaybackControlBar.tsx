import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Heart,
  Maximize2, // For expanding/queue view
} from 'lucide-react';

interface TrackInfo {
  id: string;
  title: string;
  artist: string;
  albumArtUrl: string;
  duration: number; // in seconds
}

interface PlaybackControlBarProps {
  currentTrack: TrackInfo | null;
  isPlaying: boolean;
  progress: number; // 0-100
  volume: number; // 0-100
  isLiked?: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (value: number) => void; // value 0-100
  onVolumeChange: (value: number) => void; // value 0-100
  onLikeToggle?: (trackId: string) => void;
  // onToggleQueue?: () => void; // For showing upcoming tracks
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const PlaybackControlBar: React.FC<PlaybackControlBarProps> = ({
  currentTrack,
  isPlaying,
  progress,
  volume,
  isLiked = false,
  onPlayPause,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onLikeToggle,
}) => {
  console.log("Rendering PlaybackControlBar. Current track:", currentTrack?.title, "Playing:", isPlaying);

  const [currentDisplayTime, setCurrentDisplayTime] = useState("0:00");
  const [totalDisplayTime, setTotalDisplayTime] = useState("0:00");

  useEffect(() => {
    if (currentTrack) {
      const currentTime = (progress / 100) * currentTrack.duration;
      setCurrentDisplayTime(formatTime(currentTime));
      setTotalDisplayTime(formatTime(currentTrack.duration));
    } else {
      setCurrentDisplayTime("0:00");
      setTotalDisplayTime("0:00");
    }
  }, [progress, currentTrack]);

  if (!currentTrack) {
    // Optionally render a minimal bar or nothing if no track is loaded
    return (
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-neutral-900 border-t border-neutral-800 flex items-center justify-center text-neutral-500">
            No track selected.
        </div>
    );
  }

  const handleSeek = (values: number[]) => {
    onSeek(values[0]);
  };

  const handleVolumeChange = (values: number[]) => {
    onVolumeChange(values[0]);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[90px] bg-neutral-900 text-white border-t border-neutral-800 p-3 flex items-center justify-between shadow-2xl">
      {/* Left: Track Info */}
      <div className="flex items-center gap-3 w-1/4 min-w-[200px]">
        <AspectRatio ratio={1/1} className="w-14 h-14 rounded overflow-hidden">
          <img
            src={currentTrack.albumArtUrl || '/placeholder.svg'}
            alt={currentTrack.title}
            className="object-cover w-full h-full"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </AspectRatio>
        <div>
          <p className="text-sm font-semibold truncate">{currentTrack.title}</p>
          <p className="text-xs text-neutral-400 truncate">{currentTrack.artist}</p>
        </div>
        {onLikeToggle && (
            <Button variant="ghost" size="icon" onClick={() => onLikeToggle(currentTrack.id)} className="ml-2 text-neutral-400 hover:text-red-500">
                 {isLiked ? <Heart fill="currentColor" className="text-red-500" size={18} /> : <Heart size={18} />}
            </Button>
        )}
      </div>

      {/* Center: Playback Controls & Progress */}
      <div className="flex flex-col items-center justify-center flex-grow max-w-xl">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onPrev} aria-label="Previous track" className="text-neutral-300 hover:text-white">
            <SkipBack size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onPlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="bg-white text-black hover:bg-neutral-200 rounded-full w-10 h-10" // Doraemon Red accent could be here for Play
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onNext} aria-label="Next track" className="text-neutral-300 hover:text-white">
            <SkipForward size={20} />
          </Button>
        </div>
        <div className="flex items-center gap-2 w-full mt-1">
          <span className="text-xs text-neutral-400 w-10 text-right">{currentDisplayTime}</span>
          <Slider
            defaultValue={[0]}
            value={[progress]}
            max={100}
            step={1}
            onValueChange={handleSeek}
            className="flex-grow [&>span:first-child]:h-1 [&>span:first-child_>span]:bg-red-500" // Doraemon red for progress
            aria-label="Track progress"
          />
          <span className="text-xs text-neutral-400 w-10">{totalDisplayTime}</span>
        </div>
      </div>

      {/* Right: Volume & Other Controls */}
      <div className="flex items-center gap-2 w-1/4 min-w-[150px] justify-end">
        {/* <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white" aria-label="Queue">
             <ListMusic size={18} /> // Example icon for queue
        </Button> */}
        <Button variant="ghost" size="icon" onClick={() => handleVolumeChange([volume > 0 ? 0 : 50])} className="text-neutral-400 hover:text-white" aria-label="Mute/Unmute">
            {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </Button>
        <Slider
          defaultValue={[50]}
          value={[volume]}
          max={100}
          step={1}
          onValueChange={handleVolumeChange}
          className="w-24 [&>span:first-child]:h-1 [&>span:first-child_>span]:bg-white"
          aria-label="Volume"
        />
        {/* <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white" aria-label="Full screen player">
            <Maximize2 size={18} />
        </Button> */}
      </div>
    </div>
  );
};
export default PlaybackControlBar;