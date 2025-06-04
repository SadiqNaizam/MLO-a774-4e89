import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import SongListItem from '@/components/SongListItem';
import PlaybackControlBar from '@/components/PlaybackControlBar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Home, Search, Library, Play, PlusCircle, Edit3, Trash2 } from 'lucide-react';

interface TrackInfo {
  id: string;
  title: string;
  artist: string;
  albumArtUrl: string;
  duration: number;
}

interface Song {
  songId: string;
  title: string;
  artist: string;
  album?: string;
  duration: string;
  rawDuration: number;
  imageUrl?: string;
}

interface PlaylistDetails {
  id: string;
  name: string;
  description: string;
  coverImageUrl: string;
  creator: string;
  songs: Song[];
  isEditable?: boolean;
}

// Placeholder data
const placeholderPlaylist: PlaylistDetails = {
  id: 'p1',
  name: 'Retro Vibes',
  description: 'A curated collection of the best retro-futuristic tracks to get you in the zone. Perfect for late-night coding sessions or cruising through neon-lit cityscapes.',
  coverImageUrl: 'https://source.unsplash.com/random/600x600?playlist,retro',
  creator: 'DJ Synthwave',
  isEditable: true,
  songs: [
    { songId: 's1', title: 'Future Echoes', artist: 'Cybernetic Bard', album: 'Digital Dreams', duration: '3:45', rawDuration: 225, imageUrl: 'https://source.unsplash.com/random/100x100?song,cyberpunk' },
    { songId: 's2', title: 'Neon Rider', artist: 'Grid Runner', album: 'Night Drive', duration: '4:12', rawDuration: 252, imageUrl: 'https://source.unsplash.com/random/100x100?song,neon' },
    { songId: 's5', title: 'Sunset Drive', artist: 'Palm Highway', album: '80s Summer', duration: '5:02', rawDuration: 302, imageUrl: 'https://source.unsplash.com/random/100x100?song,sunset' },
    { songId: 's6', title: 'Midnight Cruise', artist: 'Night Owl', album: 'City Lights', duration: '3:50', rawDuration: 230, imageUrl: 'https://source.unsplash.com/random/100x100?song,night' },
  ]
};

const PlaylistDetailPage = () => {
  const { id: playlistId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState<PlaylistDetails | null>(null);
  const [description, setDescription] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  // Playback state
  const [currentTrack, setCurrentTrack] = useState<TrackInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [likedSongs, setLikedSongs] = useState<Set<string | number>>(new Set(['s2']));
  const [isLikedCurrentTrack, setIsLikedCurrentTrack] = useState(false);

  useEffect(() => {
    console.log('PlaylistDetailPage loaded for ID:', playlistId);
    // Fetch playlist details based on playlistId
    // For now, use placeholder
    if (playlistId === placeholderPlaylist.id) {
      setPlaylist(placeholderPlaylist);
      setDescription(placeholderPlaylist.description);
    } else {
      // Handle playlist not found, navigate to a 404 or back
      // navigate('/not-found');
      console.error("Playlist not found");
    }
  }, [playlistId, navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / currentTrack.duration);
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleNext = () => console.log('Next track');
  const handlePrev = () => console.log('Prev track');
  const handleSeek = (newProgress: number) => setProgress(newProgress);
  const handleVolumeChange = (newVolume: number) => setVolume(newVolume);
  const handleLikeToggle = (trackId: string | number) => {
     setLikedSongs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) newSet.delete(trackId);
      else newSet.add(trackId);
      if(currentTrack?.id === trackId) setIsLikedCurrentTrack(newSet.has(trackId));
      return newSet;
    });
    console.log('Toggled like for track:', trackId);
  };

  const handlePlaySong = (song: Song) => {
    setCurrentTrack({
      id: song.songId,
      title: song.title,
      artist: song.artist,
      albumArtUrl: song.imageUrl || playlist?.coverImageUrl || 'https://source.unsplash.com/random/100x100?music',
      duration: song.rawDuration,
    });
    setIsPlaying(true);
    setProgress(0);
    setIsLikedCurrentTrack(likedSongs.has(song.songId));
  };

  const handlePlayAll = () => {
    if (playlist && playlist.songs.length > 0) {
      handlePlaySong(playlist.songs[0]);
    }
  };
  
  const handleSaveDescription = () => {
    if(playlist) {
        setPlaylist({...playlist, description: description});
        setIsEditingDescription(false);
        console.log("Playlist description updated.");
    }
  };

  if (!playlist) {
    return <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-white">Loading playlist...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-900 text-white">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-neutral-800/80 backdrop-blur-md shadow-lg h-[70px]">
        <Link to="/" className="text-2xl font-bold text-red-500">MusicApp</Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem><Link to="/" legacyBehavior passHref><NavigationMenuLink className={navigationMenuTriggerStyle()}><Home className="mr-2 h-4 w-4" /> Home</NavigationMenuLink></Link></NavigationMenuItem>
            <NavigationMenuItem><Link to="/search" legacyBehavior passHref><NavigationMenuLink className={navigationMenuTriggerStyle()}><Search className="mr-2 h-4 w-4" /> Search</NavigationMenuLink></Link></NavigationMenuItem>
            <NavigationMenuItem><Link to="/library" legacyBehavior passHref><NavigationMenuLink className={navigationMenuTriggerStyle()}><Library className="mr-2 h-4 w-4" /> Library</NavigationMenuLink></Link></NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
         <div className="w-24"> {/* Spacer */} </div>
      </header>

      <ScrollArea className="flex-1 mt-[70px] mb-[90px]">
        <main className="p-4 md:p-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink asChild><Link to="/library">Library</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink asChild><Link to="/library?tab=playlists">Playlists</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>{playlist.name}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <header className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-end mb-8">
            <div className="w-48 h-48 md:w-60 md:h-60 flex-shrink-0 rounded-lg overflow-hidden shadow-xl">
                <AspectRatio ratio={1/1}>
                    <img src={playlist.coverImageUrl} alt={`${playlist.name} cover`} className="object-cover w-full h-full" />
                </AspectRatio>
            </div>
            <div className="flex-grow text-center md:text-left">
              <p className="text-xs uppercase text-neutral-400 mb-1">Playlist</p>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-2 break-words">{playlist.name}</h1>
              {isEditingDescription ? (
                <div className="mb-2">
                    <Textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-neutral-800 border-neutral-700 text-sm min-h-[80px]"
                        placeholder="Playlist description..."
                    />
                    <Button onClick={handleSaveDescription} size="sm" className="mt-2 bg-red-500 hover:bg-red-600">Save Description</Button>
                    <Button onClick={() => setIsEditingDescription(false)} size="sm" variant="ghost" className="mt-2 ml-2">Cancel</Button>
                </div>
              ) : (
                <p className="text-neutral-300 text-sm mb-3">{description || "No description."}</p>
              )}
              <p className="text-sm text-neutral-400">Created by {playlist.creator} &bull; {playlist.songs.length} songs</p>
              {playlist.isEditable && !isEditingDescription && (
                <Button variant="outline" size="sm" onClick={() => setIsEditingDescription(true)} className="mt-2 border-neutral-600 hover:bg-neutral-700 text-neutral-300">
                    <Edit3 className="mr-2 h-4 w-4" /> Edit Description
                </Button>
              )}
            </div>
          </header>

          <div className="flex items-center gap-4 mb-8">
            <Button size="lg" onClick={handlePlayAll} className="bg-red-500 hover:bg-red-600 rounded-full px-8 py-6 text-lg">
              <Play className="mr-2 h-5 w-5" fill="currentColor"/> Play All
            </Button>
            {playlist.isEditable && (
                <>
                <Button variant="outline" className="border-neutral-600 hover:bg-neutral-700 text-neutral-300">
                    <PlusCircle className="mr-2 h-5 w-5" /> Add Songs
                </Button>
                <Button variant="ghost" className="text-neutral-400 hover:text-red-500">
                    <Trash2 className="mr-2 h-5 w-5" /> Delete Playlist
                </Button>
                </>
            )}
          </div>

          <div className="space-y-1">
            {playlist.songs.map((song, index) => (
              <SongListItem
                key={song.songId}
                trackNumber={index + 1}
                {...song}
                album={undefined} // Album context is the playlist itself
                isPlaying={currentTrack?.id === song.songId && isPlaying}
                isActive={currentTrack?.id === song.songId}
                isLiked={likedSongs.has(song.songId)}
                onPlay={() => handlePlaySong(song)}
                onPause={handlePlayPause}
                onLikeToggle={() => handleLikeToggle(song.songId)}
              />
            ))}
          </div>
        </main>
      </ScrollArea>
      
      <PlaybackControlBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        progress={progress}
        volume={volume}
        isLiked={currentTrack ? likedSongs.has(currentTrack.id) : false}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrev={handlePrev}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onLikeToggle={currentTrack ? () => handleLikeToggle(currentTrack.id) : undefined}
      />
    </div>
  );
};

export default PlaylistDetailPage;