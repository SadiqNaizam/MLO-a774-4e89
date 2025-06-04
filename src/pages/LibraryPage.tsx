import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MediaCard from '@/components/MediaCard';
import SongListItem from '@/components/SongListItem';
import PlaybackControlBar from '@/components/PlaybackControlBar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Home, Search, Library, Music, Disc, UserCircle, ListMusic, Heart } from 'lucide-react';

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

// Placeholder data for library items
const likedSongsData: Song[] = [
  { songId: 's2', title: 'Neon Rider', artist: 'Grid Runner', album: 'Night Drive', duration: '4:12', rawDuration: 252, imageUrl: 'https://source.unsplash.com/random/100x100?song,neon' },
  { songId: 's4', title: 'Starlight Melody', artist: 'Cosmic Dreamer', album: 'Celestial Harmonies', duration: '3:30', rawDuration: 210, imageUrl: 'https://source.unsplash.com/random/100x100?song,stars' },
];

const savedPlaylistsData = [
  { id: 'p1', title: 'Retro Vibes', subtitle: 'Curated by AI', imageUrl: 'https://source.unsplash.com/random/400x400?playlist,retro', type: 'playlist' as const },
  { id: 'p4', title: 'Deep Focus Ambient', subtitle: 'Productivity Mix', imageUrl: 'https://source.unsplash.com/random/400x400?playlist,ambient', type: 'playlist' as const },
];

const savedAlbumsData = [
  { id: 'a1', title: 'Robotic Rhythms', subtitle: 'Future Gadget Grooves', imageUrl: 'https://source.unsplash.com/random/400x400?album,robot', type: 'album' as const },
];

const followedArtistsData = [
  { id: 'ar1', title: 'SynthWave Surfer', subtitle: 'Artist', imageUrl: 'https://source.unsplash.com/random/400x400?artist,synthwave', type: 'artist' as const },
  { id: 'ar2', title: 'Acoustic Soul', subtitle: 'Artist', imageUrl: 'https://source.unsplash.com/random/400x400?artist,acoustic', type: 'artist' as const },
];

const LibraryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('playlists');

  // Playback state
  const [currentTrack, setCurrentTrack] = useState<TrackInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [likedSongs, setLikedSongs] = useState<Set<string | number>>(new Set(likedSongsData.map(s => s.songId)));
  const [isLikedCurrentTrack, setIsLikedCurrentTrack] = useState(false);

  useEffect(() => {
    console.log('LibraryPage loaded');
  }, []);

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
    console.log('Toggled like for track:', trackId)
  };

  const handlePlaySong = (song: Song) => {
    setCurrentTrack({
      id: song.songId,
      title: song.title,
      artist: song.artist,
      albumArtUrl: song.imageUrl || 'https://source.unsplash.com/random/100x100?music',
      duration: song.rawDuration,
    });
    setIsPlaying(true);
    setProgress(0);
    setIsLikedCurrentTrack(likedSongs.has(song.songId));
  };
  
  const handleMediaCardClick = (id: string | number, type: 'album' | 'song' | 'artist' | 'playlist') => {
    console.log(`Clicked ${type} with id ${id}`);
    if (type === 'album') navigate(`/album/${id}`);
    if (type === 'playlist') navigate(`/playlist/${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-900 text-white">
       <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-neutral-800/80 backdrop-blur-md shadow-lg h-[70px]">
        <Link to="/" className="text-2xl font-bold text-red-500">MusicApp</Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" legacyBehavior passHref><NavigationMenuLink className={navigationMenuTriggerStyle()}><Home className="mr-2 h-4 w-4" /> Home</NavigationMenuLink></Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/search" legacyBehavior passHref><NavigationMenuLink className={navigationMenuTriggerStyle()}><Search className="mr-2 h-4 w-4" /> Search</NavigationMenuLink></Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              {/* Current Page Link inactive */}
              <span className={`${navigationMenuTriggerStyle()} opacity-50 cursor-default`}><Library className="mr-2 h-4 w-4" /> Library</span>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="w-24"> {/* Spacer */} </div>
      </header>

      <ScrollArea className="flex-1 mt-[70px] mb-[90px]">
        <main className="p-4 md:p-8">
          <h1 className="text-3xl font-bold mb-8">Your Library</h1>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6 bg-neutral-800">
              <TabsTrigger value="playlists" className="data-[state=active]:bg-red-500 data-[state=active]:text-white"><ListMusic className="mr-2 h-4 w-4" />Playlists</TabsTrigger>
              <TabsTrigger value="liked" className="data-[state=active]:bg-red-500 data-[state=active]:text-white"><Heart className="mr-2 h-4 w-4" />Liked Songs</TabsTrigger>
              <TabsTrigger value="albums" className="data-[state=active]:bg-red-500 data-[state=active]:text-white"><Disc className="mr-2 h-4 w-4" />Albums</TabsTrigger>
              <TabsTrigger value="artists" className="data-[state=active]:bg-red-500 data-[state=active]:text-white"><UserCircle className="mr-2 h-4 w-4" />Artists</TabsTrigger>
            </TabsList>

            <TabsContent value="playlists">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {savedPlaylistsData.map(playlist => (
                  <MediaCard key={playlist.id} {...playlist} onClick={handleMediaCardClick} onPlay={() => handlePlaySong({songId: playlist.id, title: playlist.title, artist: playlist.subtitle || "Unknown", duration: "3:30", rawDuration: 210, imageUrl: playlist.imageUrl})} />
                ))}
                {savedPlaylistsData.length === 0 && <p className="col-span-full text-center text-neutral-400">You haven't saved any playlists yet.</p>}
              </div>
            </TabsContent>
            <TabsContent value="liked">
              <div className="space-y-2">
                {likedSongsData.filter(song => likedSongs.has(song.songId)).map((song, index) => (
                  <SongListItem
                    key={song.songId}
                    trackNumber={index + 1}
                    {...song}
                    isPlaying={currentTrack?.id === song.songId && isPlaying}
                    isActive={currentTrack?.id === song.songId}
                    isLiked={likedSongs.has(song.songId)}
                    onPlay={() => handlePlaySong(song)}
                    onPause={handlePlayPause}
                    onLikeToggle={() => handleLikeToggle(song.songId)}
                  />
                ))}
                {likedSongsData.filter(song => likedSongs.has(song.songId)).length === 0 && <p className="text-center text-neutral-400">Songs you like will appear here.</p>}
              </div>
            </TabsContent>
            <TabsContent value="albums">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {savedAlbumsData.map(album => (
                  <MediaCard key={album.id} {...album} onClick={handleMediaCardClick} onPlay={() => handlePlaySong({songId: album.id, title: album.title, artist: album.subtitle || "Unknown", duration: "3:30", rawDuration: 210, imageUrl: album.imageUrl})} />
                ))}
                {savedAlbumsData.length === 0 && <p className="col-span-full text-center text-neutral-400">You haven't saved any albums yet.</p>}
              </div>
            </TabsContent>
             <TabsContent value="artists">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {followedArtistsData.map(artist => (
                  <MediaCard key={artist.id} {...artist} onClick={handleMediaCardClick} />
                ))}
                {followedArtistsData.length === 0 && <p className="col-span-full text-center text-neutral-400">Artists you follow will appear here.</p>}
              </div>
            </TabsContent>
          </Tabs>
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

export default LibraryPage;