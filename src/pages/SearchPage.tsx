import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import MediaCard from '@/components/MediaCard';
import SongListItem from '@/components/SongListItem';
import PlaybackControlBar from '@/components/PlaybackControlBar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Search, Home, Library, Music, Disc, UserCircle, ListMusic } from 'lucide-react';

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

const placeholderSongs: Song[] = [
  { songId: 's1', title: 'Future Echoes', artist: 'Cybernetic Bard', album: 'Digital Dreams', duration: '3:45', rawDuration: 225, imageUrl: 'https://source.unsplash.com/random/100x100?song,cyberpunk' },
  { songId: 's2', title: 'Neon Rider', artist: 'Grid Runner', album: 'Night Drive', duration: '4:12', rawDuration: 252, imageUrl: 'https://source.unsplash.com/random/100x100?song,neon' },
  { songId: 's3', title: 'Lost Signal', artist: 'Void Walker', duration: '2:58', rawDuration: 178, imageUrl: 'https://source.unsplash.com/random/100x100?song,abstract' },
];

const placeholderAlbums = [
  { id: 'a1', title: 'Robotic Rhythms', subtitle: 'Future Gadget Grooves', imageUrl: 'https://source.unsplash.com/random/400x400?album,robot', type: 'album' as const },
  { id: 'a2', title: 'Cosmic Journeys', subtitle: 'Stella Explorer', imageUrl: 'https://source.unsplash.com/random/400x400?album,space', type: 'album' as const },
];

const placeholderArtists = [
  { id: 'ar1', title: 'SynthWave Surfer', subtitle: 'Artist', imageUrl: 'https://source.unsplash.com/random/400x400?artist,synthwave', type: 'artist' as const },
];

const placeholderPlaylists = [
  { id: 'p1', title: 'Retro Vibes', subtitle: 'Curated by AI', imageUrl: 'https://source.unsplash.com/random/400x400?playlist,retro', type: 'playlist' as const },
];


const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState('songs');

  // Playback state
  const [currentTrack, setCurrentTrack] = useState<TrackInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [likedSongs, setLikedSongs] = useState<Set<string | number>>(new Set(['s2']));
  const [isLikedCurrentTrack, setIsLikedCurrentTrack] = useState(false);

  useEffect(() => {
    console.log('SearchPage loaded. Query:', query);
    // Fetch search results based on query here
  }, [query]);
  
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
      albumArtUrl: song.imageUrl || 'https://source.unsplash.com/random/100x100?music',
      duration: song.rawDuration,
    });
    setIsPlaying(true);
    setProgress(0);
    setIsLikedCurrentTrack(likedSongs.has(song.songId));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query });
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
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" legacyBehavior passHref><NavigationMenuLink className={navigationMenuTriggerStyle()}><Home className="mr-2 h-4 w-4" /> Home</NavigationMenuLink></Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/library" legacyBehavior passHref><NavigationMenuLink className={navigationMenuTriggerStyle()}><Library className="mr-2 h-4 w-4" /> Library</NavigationMenuLink></Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <form onSubmit={handleSearchSubmit} className="flex-grow max-w-xl mx-4 sm:mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <Input
              type="search"
              placeholder="What do you want to listen to?"
              className="w-full pl-10 bg-neutral-700 border-neutral-600 placeholder-neutral-400"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </form>
      </header>

      <ScrollArea className="flex-1 mt-[70px] mb-[90px]">
        <main className="p-4 md:p-8">
          {query ? (
            <h2 className="text-2xl font-semibold mb-6">Results for "{query}"</h2>
          ) : (
            <h2 className="text-2xl font-semibold mb-6">Search for your favorite music</h2>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6 bg-neutral-800">
              <TabsTrigger value="songs" className="data-[state=active]:bg-red-500 data-[state=active]:text-white"><Music className="mr-2 h-4 w-4" />Songs</TabsTrigger>
              <TabsTrigger value="albums" className="data-[state=active]:bg-red-500 data-[state=active]:text-white"><Disc className="mr-2 h-4 w-4" />Albums</TabsTrigger>
              <TabsTrigger value="artists" className="data-[state=active]:bg-red-500 data-[state=active]:text-white"><UserCircle className="mr-2 h-4 w-4" />Artists</TabsTrigger>
              <TabsTrigger value="playlists" className="data-[state=active]:bg-red-500 data-[state=active]:text-white"><ListMusic className="mr-2 h-4 w-4" />Playlists</TabsTrigger>
            </TabsList>
            <TabsContent value="songs">
              <div className="space-y-2">
                {placeholderSongs.map((song, index) => (
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
                {placeholderSongs.length === 0 && <p>No songs found matching your query.</p>}
              </div>
            </TabsContent>
            <TabsContent value="albums">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {placeholderAlbums.map(album => (
                  <MediaCard key={album.id} {...album} onClick={handleMediaCardClick} onPlay={() => handlePlaySong({songId: album.id, title: album.title, artist: album.subtitle || "Unknown", duration: "3:30", rawDuration: 210, imageUrl: album.imageUrl})} />
                ))}
                {placeholderAlbums.length === 0 && <p>No albums found matching your query.</p>}
              </div>
            </TabsContent>
            <TabsContent value="artists">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {placeholderArtists.map(artist => (
                  <MediaCard key={artist.id} {...artist} onClick={handleMediaCardClick} />
                ))}
                {placeholderArtists.length === 0 && <p>No artists found matching your query.</p>}
              </div>
            </TabsContent>
            <TabsContent value="playlists">
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {placeholderPlaylists.map(playlist => (
                  <MediaCard key={playlist.id} {...playlist} onClick={handleMediaCardClick} onPlay={() => handlePlaySong({songId: playlist.id, title: playlist.title, artist: playlist.subtitle || "Unknown", duration: "3:30", rawDuration: 210, imageUrl: playlist.imageUrl})} />
                ))}
                {placeholderPlaylists.length === 0 && <p>No playlists found matching your query.</p>}
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

export default SearchPage;