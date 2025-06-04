import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, Heart, MoreHorizontal, Music2 } from 'lucide-react'; // Music2 as placeholder icon

interface SongListItemProps {
  trackNumber?: number | string;
  title: string;
  artist: string;
  album?: string;
  duration: string; // e.g., "3:45"
  imageUrl?: string; // Optional: small album art
  isPlaying?: boolean; // Is this the currently playing song?
  isActive?: boolean; // Is this song currently selected/active in a list (but not necessarily playing)?
  isLiked: boolean;
  onPlay: (songId: string | number) => void; // Pass a unique song ID
  onPause?: () => void;
  onLikeToggle: (songId: string | number) => void;
  //   onOptionsClick?: (songId: string | number) => void; // For context menu
  songId: string | number; // Unique identifier for the song
}

const SongListItem: React.FC<SongListItemProps> = ({
  trackNumber,
  title,
  artist,
  album,
  duration,
  imageUrl,
  isPlaying = false,
  isActive = false,
  isLiked,
  onPlay,
  onPause,
  onLikeToggle,
  songId,
}) => {
  console.log("Rendering SongListItem:", title, "Playing:", isPlaying);

  const handlePlayPauseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying && onPause) {
      onPause();
    } else {
      onPlay(songId);
    }
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLikeToggle(songId);
  };

  const itemBaseClasses = "flex items-center p-3 space-x-3 rounded-md hover:bg-neutral-700/50 transition-colors duration-150 group";
  const activeClasses = isActive ? "bg-neutral-700/70" : ""; // Doraemon blue/theme color for active
  const playingClasses = isPlaying ? "text-red-400" : "text-white"; // Doraemon red for playing title

  return (
    <div
      className={`${itemBaseClasses} ${activeClasses} ${isPlaying ? 'border-l-2 border-red-500 pl-[10px]' : ''}`}
      // onClick could also trigger play: () => onPlay(songId)
    >
      {/* Track number or Play/Pause button */}
      <div className="w-8 text-center flex items-center justify-center">
        {isPlaying ? (
          <Button variant="ghost" size="icon" onClick={handlePlayPauseClick} className="text-red-400 hover:text-red-300 h-8 w-8">
            <Pause size={18} fill="currentColor" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={handlePlayPauseClick} className="text-neutral-400 group-hover:text-white h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100">
             <Play size={18} fill="currentColor" />
          </Button>
        )}
         <span className={`text-sm text-neutral-400 group-hover:hidden ${isPlaying ? 'hidden': ''} ${isActive ? 'hidden' : ''}`}>
            {trackNumber || <Music2 size={16} />}
        </span>
      </div>

      {imageUrl && (
        <img src={imageUrl} alt={album || title} className="w-10 h-10 rounded object-cover" />
      )}

      {/* Title and Artist */}
      <div className="flex-grow_ flex flex-col min-w-0 flex-1">
        <p className={`text-sm font-medium truncate ${playingClasses}`}>{title}</p>
        <p className="text-xs text-neutral-400 truncate">{artist}</p>
      </div>

      {/* Album (optional) - hidden on smaller screens perhaps */}
      {album && <p className="text-xs text-neutral-400 truncate hidden md:block w-1/4">{album}</p>}

      {/* Like button */}
      <Button variant="ghost" size="icon" onClick={handleLikeClick} className="text-neutral-400 hover:text-red-500 h-8 w-8">
        {isLiked ? <Heart fill="currentColor" className="text-red-500" size={16} /> : <Heart size={16} />}
      </Button>

      {/* Duration */}
      <p className="text-xs text-neutral-400 w-12 text-right">{duration}</p>

      {/* Options button (MoreHorizontal)
      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); if(onOptionsClick) onOptionsClick(songId);}} className="text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100 focus:opacity-100 h-8 w-8">
        <MoreHorizontal size={18} />
      </Button> */}
    </div>
  );
};
export default SongListItem;