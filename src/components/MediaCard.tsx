import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { PlayCircle } from 'lucide-react';

interface MediaCardProps {
  id: string | number;
  title: string;
  subtitle?: string; // e.g., Artist Name, Playlist Author
  imageUrl: string;
  type: 'album' | 'song' | 'artist' | 'playlist'; // To slightly vary display or actions
  onClick?: (id: string | number, type: MediaCardProps['type']) => void;
  onPlay?: (id: string | number, type: MediaCardProps['type']) => void; // Specific play action
}

const MediaCard: React.FC<MediaCardProps> = ({
  id,
  title,
  subtitle,
  imageUrl,
  type,
  onClick,
  onPlay,
}) => {
  console.log("Rendering MediaCard:", title, type);

  const handleCardClick = () => {
    if (onClick) {
      onClick(id, type);
    }
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click if play button is separate
    if (onPlay) {
      onPlay(id, type);
    } else if (onClick) {
      // Fallback to onClick if onPlay is not defined but represents a playable item
      onClick(id, type);
    }
    console.log("Play clicked on MediaCard:", title);
  };

  return (
    <Card
      className="w-full overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 group bg-neutral-800 border-neutral-700 text-white cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="p-0 relative">
        <AspectRatio ratio={1 / 1} className="bg-neutral-700">
          <img
            src={imageUrl || '/placeholder.svg'} // Use a generic placeholder
            alt={title}
            className="object-cover w-full h-full rounded-t-lg transition-transform duration-300 group-hover:scale-105"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </AspectRatio>
        {/* Play button overlay - visible on hover, could be Doraemon-themed red */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
          // Doraemon Red: className could use a custom theme color e.g., bg-doraemon-red
          onClick={handlePlayClick}
          aria-label={`Play ${title}`}
        >
          <PlayCircle size={28} />
        </Button>
      </CardHeader>
      <CardContent className="p-3">
        <CardTitle className="text-base font-semibold truncate text-white">{title}</CardTitle>
        {subtitle && (
          <CardDescription className="text-xs text-neutral-400 truncate">
            {subtitle}
          </CardDescription>
        )}
      </CardContent>
    </Card>
  );
};
export default MediaCard;