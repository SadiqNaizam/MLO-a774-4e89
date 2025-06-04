import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Carousel from '@/components/Carousel';
import MediaCard from '@/components/MediaCard';
import PlaybackControlBar from '@/components/PlaybackControlBar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Search, Home, Library, Music, Podcast } from 'lucide-react';

// Local TrackInfo type for PlaybackControlBar state
interface TrackInfo {
  id: string;
  title: string;
  artist: string;
  albumArtUrl: string;
  duration: number; // in seconds
}

// Placeholder data for MediaCards
const newReleases = [
  { id: 'album1', title: 'Synth Dreams', subtitle: 'ElectroMaestro', imageUrl: 'https://source.unsplash.com/random/400x400?album,synth', type: 'album' as const },
  { id: 'album2', title: 'Acoustic Mornings', subtitle: 'Willow Creek', imageUrl: 'https://source.unsplash.com/random/400x400?album,acoustic', type: 'album' as const },
  { id: 'album3', title: 'Future Funk Vol. 3', subtitle: 'GrooveMaster', imageUrl: 'https://source.unsplash.com/random/400x400?album,funk', type: 'album' as const },
  { id: 'playlist1', title: 'Chill Vibes', subtitle: 'Curated Playlist', imageUrl: 'https://source.unsplash.com/random/400x400?playlist,chill', type: 'playlist' as const },
];

const popularPlaylists = [
  { id: 'playlist2', title: 'Workout Beats', subtitle: 'High Energy Mix', imageUrl: 'https://source.unsplash.com/random/400x400?playlist,workout', type: 'playlist' as const },
  { id: 'playlist3', title: 'Study Focus', subtitle: 'Instrumental Tracks', imageUrl: 'https://source.unsplash.com/random/400x400?playlist,study', type: 'playlist' as const },
  { id: 'artist1', title: 'Star Voyager', subtitle: 'Artist', imageUrl: 'https://source.unsplash.com/random/400x400?artist,electronic', type: 'artist' as const },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Playback state
  const [currentTrack, setCurrentTrack] = useState<TrackInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isLikedCurrentTrack, setIsLikedCurrentTrack] = useState(false);

  useEffect(() => {
    console.log('HomePage loaded');
    // Simulate loading a default track or saved state
    setCurrentTrack({
        id: 'track001',
        title: 'Welcome Tune',
        artist: 'Ascendion Player',
        albumArtUrl: 'https://source.unsplash.com/random/100x100?music',
        duration: 180
    });
  }, []);
  
  // Simulate progress for demo
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
  const handleLikeToggle = (trackId: string) => {
    if(currentTrack?.id === trackId) setIsLikedCurrentTrack(!isLikedCurrentTrack);
    console.log('Toggled like for track:', trackId)
  };

  const handleMediaCardClick = (id: string | number, type: 'album' | 'song' | 'artist' | 'playlist') => {
    console.log(`Clicked ${type} with id ${id}`);
    if (type === 'album') navigate(`/album/${id}`);
    if (type === 'playlist') navigate(`/playlist/${id}`);
    // Add navigation for artist/song if needed
  };

  const handleMediaCardPlay = (id: string | number, type: 'album' | 'song' | 'artist' | 'playlist', itemData?: any) => {
    console.log(`Play ${type} with id ${id}`);
    const playingItem = [...newReleases, ...popularPlaylists].find(item => item.id === id);
    if(playingItem) {
        setCurrentTrack({
            id: String(id),
            title: playingItem.title,
            artist: playingItem.subtitle || 'Various Artists',
            albumArtUrl: playingItem.imageUrl,
            duration: 240 // Placeholder duration
        });
        setIsPlaying(true);
        setProgress(0);
    }
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const mediaItemsForCarousel = (items: typeof newReleases) => items.map(item => (
    <MediaCard
      key={item.id}
      {...item}
      onClick={() => handleMediaCardClick(item.id, item.type)}
      onPlay={() => handleMediaCardPlay(item.id, item.type, item)}
    />
  ));

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
              <Link to="/search" legacyBehavior passHref><NavigationMenuLink className={navigationMenuTriggerStyle()}><Search className="mr-2 h-4 w-4" /> Search</NavigationMenuLink></Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/library" legacyBehavior passHref><NavigationMenuLink className={navigationMenuTriggerStyle()}><Library className="mr-2 h-4 w-4" /> Library</NavigationMenuLink></Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center gap-2">
          <Input 
            type="search" 
            placeholder="Search songs, artists, albums..." 
            className="w-64 bg-neutral-700 border-neutral-600 placeholder-neutral-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" variant="ghost" size="icon"><Search className="h-5 w-5" /></Button>
        </form>
      </header>

      <ScrollArea className="flex-1 mt-[70px] mb-[90px]">
        <main className="p-4 md:p-8">
          <section className="mb-12">
            <Carousel title="New Releases" items={mediaItemsForCarousel(newReleases)} />
          </section>
          <section className="mb-12">
            <Carousel title="Popular Playlists" items={mediaItemsForCarousel(popularPlaylists)} />
          </section>
           <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Browse All</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {/* Example browse categories */}
              {['Pop', 'Rock', 'Jazz', 'Electronic', 'Hip-Hop', 'Classical', 'Podcasts', 'Audiobooks'].map(genre => (
                <Button key={genre} variant="secondary" className="w-full h-24 text-lg bg-neutral-800 hover:bg-neutral-700" onClick={() => navigate(`/search?genre=${genre}`)}>
                  {genre}
                </Button>
              ))}
            </div>
          </section>
        </main>
      </ScrollArea>
      
      <PlaybackControlBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        progress={progress}
        volume={volume}
        isLiked={currentTrack ? isLikedCurrentTrack : false}
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

export default HomePage;